const express = require('express')
const router = express.Router()
const Blog = require("../models/automationBlog.model")
const BlogSubscriber = require("../models/blogSubscriber.model")
const {
  sendSubscribeConfirmationEmail,
  sendUnsubscribeConfirmationEmail,
} = require("../services/blogAdmin.email.service")

/** Visible on Compare Bazaar /blog — only explicitly published posts */
const PUBLIC_STATUSES = ['published']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const SOURCE_LABELS = {
  homepage: 'Homepage',
  footer: 'Footer',
  'blog-index': 'Blog index',
}

function sortBlogPostsDesc(blogs) {
  const t = (b) =>
    new Date(b.publishedAt || b.approvedAt || b.updatedAt || b.createdAt || 0).getTime()
  return [...blogs].sort((a, b) => t(b) - t(a))
}

// @route   POST /api/v1/blog-admin/public/blogs/:slug/view — count a reader visit (no auth)
router.post('/:slug/view', async (req, res) => {
  try {
    const slug = String(req.params.slug || '').trim()
    if (!slug) return res.status(400).json({ success: false, message: 'Slug required' })

    const blog = await Blog.findOneAndUpdate(
      { slug, status: { $in: PUBLIC_STATUSES } },
      { $inc: { viewCount: 1 } },
      { returnDocument: 'after', select: 'viewCount slug' }
    ).lean()

    if (!blog) return res.status(404).json({ success: false, message: 'Not found' })

    res.json({ success: true, viewCount: blog.viewCount ?? 0 })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// @route   GET /api/v1/blog-admin/public/blogs — published posts for the live site (no auth)
router.get('/', async (req, res) => {
  try {
    const blogs = sortBlogPostsDesc(
      await Blog.find({
        status: { $in: PUBLIC_STATUSES },
        slug: { $exists: true, $ne: '' },
      })
        .select(
          'slug title excerpt status publishedAt approvedAt updatedAt metaTitle metaDescription tags topic readingTime keywords viewCount coverImageUrl'
        )
        .lean()
    )

    const data = blogs.map((b) => ({
      slug: b.slug,
      title: b.title,
      excerpt: b.excerpt || '',
      status: b.status,
      publishedAt: b.publishedAt || b.approvedAt || b.updatedAt,
      metaTitle: b.metaTitle,
      metaDescription: b.metaDescription,
      tags: b.tags || [],
      topic: b.topic,
      readingTime: b.readingTime,
      keywords: b.keywords || [],
      viewCount: typeof b.viewCount === 'number' ? b.viewCount : 0,
      coverImageUrl: b.coverImageUrl || '',
    }))

    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// @route   GET /api/v1/blog-admin/public/blogs/:slug — single post when published (full HTML body)
router.get('/:slug', async (req, res) => {
  try {
    const slug = String(req.params.slug || '').trim()
    if (!slug) return res.status(400).json({ success: false, message: 'Slug required' })

    const blog = await Blog.findOne({ slug, status: { $in: PUBLIC_STATUSES } }).lean()
    if (!blog) return res.status(404).json({ success: false, message: 'Not found' })

    res.json({ success: true, data: blog })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// @route   POST /api/v1/blog-admin/public/blogs/subscribe — subscribe to new blog notifications (no auth)
router.post('/subscribe', async (req, res) => {
  try {
    const emailRaw = String(req.body?.email || '').trim().toLowerCase()
    if (!emailRaw || !EMAIL_RE.test(emailRaw) || emailRaw.length > 320) {
      return res.status(400).json({ success: false, message: 'Valid email is required' })
    }

    const source = String(req.body?.sourceSlug || req.body?.source || '').trim().slice(0, 120)
    const sourceBlog = source
      ? await Blog.findOne({ slug: source }).select('_id slug title').lean()
      : null
    const sourceLabel = sourceBlog?.title || SOURCE_LABELS[source] || source || ''

    const existing = await BlogSubscriber.findOne({ email: emailRaw })
    let subscriber
    let isNew = false
    let wasInactive = false
    if (existing) {
      wasInactive = !existing.isActive
      existing.isActive = true
      existing.unsubscribedAt = null
      existing.unsubscribeReason = ''
      existing.unsubscribeSource = ''
      if (!existing.subscribedFrom) existing.subscribedFrom = source || ''
      if (!existing.sourceBlogSlug) existing.sourceBlogSlug = sourceBlog?.slug || source || ''
      if (!existing.sourceBlogTitle) existing.sourceBlogTitle = sourceLabel
      if (!existing.sourceBlogId) existing.sourceBlogId = sourceBlog?._id ? String(sourceBlog._id) : ''
      await existing.save()
      subscriber = existing
    } else {
      isNew = true
      subscriber = await BlogSubscriber.create({
        email: emailRaw,
        isActive: true,
        subscribedFrom: source || '',
        sourceBlogId: sourceBlog?._id ? String(sourceBlog._id) : '',
        sourceBlogSlug: sourceBlog?.slug || source || '',
        sourceBlogTitle: sourceLabel,
        totalNotifications: 0,
      })
    }

    // Welcome / confirmation email for new or re-activated subscribers (do not block API on email failure).
    if (isNew || wasInactive) {
      sendSubscribeConfirmationEmail(emailRaw).catch((err) => {
        console.error('[subscribe] confirmation email failed:', err?.message || err)
      })
    }

    res.json({
      success: true,
      message: isNew ? 'Subscribed successfully' : 'Subscription updated successfully',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// @route   POST /api/v1/blog-admin/public/blogs/unsubscribe — unsubscribe from new blog notifications (no auth)
router.post('/unsubscribe', async (req, res) => {
  try {
    const emailRaw = String(req.body?.email || '').trim().toLowerCase()
    if (!emailRaw || !EMAIL_RE.test(emailRaw) || emailRaw.length > 320) {
      return res.status(400).json({ success: false, message: 'Valid email is required' })
    }

    const reason = String(req.body?.reason || '').trim().slice(0, 500)
    const source = String(req.body?.source || 'footer-form').trim().slice(0, 80) || 'footer-form'

    const subscriber = await BlogSubscriber.findOne({ email: emailRaw })
    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Subscription not found for this email' })
    }

    if (!subscriber.isActive) {
      return res.json({ success: true, message: 'Already unsubscribed' })
    }

    subscriber.isActive = false
    subscriber.unsubscribedAt = new Date()
    if (reason) subscriber.unsubscribeReason = reason
    subscriber.unsubscribeSource = source
    await subscriber.save()

    sendUnsubscribeConfirmationEmail(emailRaw).catch((err) => {
      console.error('[unsubscribe] confirmation email failed:', err?.message || err)
    })

    res.json({ success: true, message: 'Unsubscribed successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
