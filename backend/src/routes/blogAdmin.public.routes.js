const express = require('express')
const router = express.Router()
const Blog = require("../models/automationBlog.model")
const BlogSubscriber = require("../models/blogSubscriber.model")

/** Visible on Compare Bazaar /blog — approved (editorial OK) or fully published */
const PUBLIC_STATUSES = ['approved', 'published']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
      { new: true, select: 'viewCount slug' }
    ).lean()

    if (!blog) return res.status(404).json({ success: false, message: 'Not found' })

    res.json({ success: true, viewCount: blog.viewCount ?? 0 })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// @route   GET /api/v1/blog-admin/public/blogs — approved + published for the live site (no auth)
router.get('/', async (req, res) => {
  try {
    const blogs = sortBlogPostsDesc(
      await Blog.find({
        status: { $in: PUBLIC_STATUSES },
        slug: { $exists: true, $ne: '' },
      })
        .select(
          'slug title excerpt status publishedAt approvedAt updatedAt metaTitle metaDescription tags topic readingTime keywords viewCount'
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
    }))

    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// @route   GET /api/v1/blog-admin/public/blogs/:slug — single post when approved or published (full HTML body)
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

    const subscriber = await BlogSubscriber.findOneAndUpdate(
      { email: emailRaw },
      {
        $set: {
          email: emailRaw,
          isActive: true,
          subscribedFrom: source || '',
          sourceBlogId: sourceBlog?._id ? String(sourceBlog._id) : '',
          sourceBlogSlug: sourceBlog?.slug || source || '',
          sourceBlogTitle: sourceBlog?.title || '',
        },
        $setOnInsert: { totalNotifications: 0 },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    res.json({
      success: true,
      message: subscriber?.createdAt && subscriber.createdAt.getTime() === subscriber.updatedAt.getTime()
        ? 'Subscribed successfully'
        : 'Subscription updated successfully',
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

    const source = String(req.body?.sourceSlug || req.body?.source || '').trim().slice(0, 120)
    const query = source
      ? { email: emailRaw, $or: [{ sourceBlogSlug: source }, { subscribedFrom: source }] }
      : { email: emailRaw }

    const subscriber = await BlogSubscriber.findOne(query)
    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Subscription not found for this email' })
    }

    subscriber.isActive = false
    await subscriber.save()

    res.json({ success: true, message: 'Unsubscribed successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
