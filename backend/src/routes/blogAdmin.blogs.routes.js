const express = require('express')
const router = express.Router()
const Blog = require("../models/automationBlog.model");
const Settings = require("../models/blogAdminSettings.model");
const { protect } = require("../middlewares/blogAdminAuth.middleware");
const { sendBlogApprovalNotification, sendPublishedNotification, editMessage } = require("../services/blogAdmin.telegram.service");
const { resolveTelegramCredentials } = require("../services/blogAdmin.pendingNotify.service");
const BlogSubscriber = require("../models/blogSubscriber.model");
const { sendNewBlogPublishedEmail } = require("../services/blogAdmin.email.service");
const axios = require('axios')

// Helper to get settings
const getSetting = async (key) => {
  const setting = await Settings.findOne({ key })
  return setting?.value
}

/** Compare Bazaar / live site base URL only — no trailing slash, no /blog path (publish hits POST {base}/api/blogs). */
const normalizeWebsiteBase = (url) => {
  if (!url || typeof url !== 'string') return ''
  return url.trim().replace(/\/+$/, '')
}

// @route   GET /api/blogs
router.get('/', protect, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', dateFrom, dateTo } = req.query

    const query = {}
    if (status && status !== 'all') query.status = status
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { keywords: { $in: [new RegExp(search, 'i')] } },
      ]
    }
    if (dateFrom || dateTo) {
      query.createdAt = {}
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom)
      if (dateTo) query.createdAt.$lte = new Date(new Date(dateTo).setHours(23, 59, 59))
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 }

    const [blogs, total] = await Promise.all([
      Blog.find(query).sort(sortOptions).skip(skip).limit(parseInt(limit)).select('-content'),
      Blog.countDocuments(query),
    ])

    res.json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// @route   GET /api/blogs/stats
router.get('/stats', protect, async (req, res) => {
  try {
    const [total, pending, approved, rejected, published, recent] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ status: 'pending' }),
      Blog.countDocuments({ status: 'approved' }),
      Blog.countDocuments({ status: 'rejected' }),
      Blog.countDocuments({ status: 'published' }),
      Blog.find().sort({ createdAt: -1 }).limit(5).select('title status createdAt'),
    ])

    // Daily stats for last 14 days
    const days = 14
    const dailyStats = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const start = new Date(date.setHours(0, 0, 0, 0))
      const end = new Date(date.setHours(23, 59, 59, 999))
      const count = await Blog.countDocuments({ createdAt: { $gte: start, $lte: end } })
      dailyStats.push({
        date: start.toISOString().split('T')[0],
        count,
      })
    }

    res.json({
      success: true,
      stats: { total, pending, approved, rejected, published },
      recentActivity: recent,
      dailyStats,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// @route   GET /api/blogs/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' })
    res.json({ success: true, data: blog })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// @route   PUT /api/blogs/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const allowed = ['title', 'content', 'metaTitle', 'metaDescription', 'keywords', 'tags', 'excerpt', 'status']
    const updates = {}
    allowed.forEach((field) => { if (req.body[field] !== undefined) updates[field] = req.body[field] })

    const blog = await Blog.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' })
    res.json({ success: true, data: blog })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// @route   POST /api/blogs/:id/approve
router.post('/:id/approve', protect, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', approvedAt: new Date(), rejectionReason: null },
      { new: true }
    )
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' })

    // Notify via Telegram if message exists
    const { botToken, chatId } = await resolveTelegramCredentials()
    if (botToken && chatId && blog.telegramMessageId) {
      await editMessage(
        chatId,
        blog.telegramMessageId,
        `Approved\n\n${blog.title}\n\nApproved at: ${new Date().toLocaleString()}`,
        botToken
      )
    }

    res.json({ success: true, data: blog, message: 'Blog approved successfully!' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// @route   POST /api/blogs/:id/reject
router.post('/:id/reject', protect, async (req, res) => {
  try {
    const { reason } = req.body
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', rejectedAt: new Date(), rejectionReason: reason || 'No reason provided' },
      { new: true }
    )
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' })

    res.json({ success: true, data: blog, message: 'Blog rejected.' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// @route   POST /api/blogs/:id/publish
router.post('/:id/publish', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' })
    if (blog.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Blog must be approved before publishing.' })
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { status: 'published', publishedAt: new Date() },
      { new: true }
    )

    res.json({ success: true, data: updatedBlog, message: 'Blog published successfully! 🎉' })

    // Run slow integrations in background so publish returns quickly.
    void (async () => {
      // Optional external website sync
      try {
        const websiteUrl =
          normalizeWebsiteBase(await getSetting('website_url')) ||
          normalizeWebsiteBase(process.env.WEBSITE_URL)
        const websiteApiKey =
          (await getSetting('website_api_key'))?.trim() || process.env.WEBSITE_API_KEY?.trim()
        if (websiteUrl && websiteApiKey) {
          await axios.post(`${websiteUrl}/api/blogs`, {
            title: updatedBlog.title,
            content: updatedBlog.content,
            slug: updatedBlog.slug,
            metaTitle: updatedBlog.metaTitle,
            metaDescription: updatedBlog.metaDescription,
            keywords: updatedBlog.keywords,
            tags: updatedBlog.tags,
            excerpt: updatedBlog.excerpt,
          }, { headers: { Authorization: `Bearer ${websiteApiKey}` }, timeout: 6000 })
        }
      } catch (publishError) {
        console.error('Website publish error:', publishError.message)
      }

      // Telegram publish notice
      try {
        const { botToken, chatId } = await resolveTelegramCredentials()
        if (botToken && chatId) {
          await sendPublishedNotification(updatedBlog, botToken, chatId)
        }
      } catch (tgErr) {
        console.error('Telegram publish notify error:', tgErr.message)
      }

      // Subscriber emails
      try {
        const subscribers = await BlogSubscriber.find({ isActive: true }).select('_id email totalNotifications').lean()
        if (subscribers.length > 0) {
          const notifyResults = await Promise.allSettled(
            subscribers.map((s) => sendNewBlogPublishedEmail(s.email, updatedBlog))
          )
          const successEmails = []
          const failed = []
          notifyResults.forEach((r, idx) => {
            const email = subscribers[idx].email
            if (r.status === 'fulfilled' && r.value?.success) {
              successEmails.push(email)
            } else if (r.status === 'fulfilled') {
              failed.push({ email, reason: r.value?.error || 'Unknown email provider error' })
            } else {
              failed.push({ email, reason: r.reason?.message || String(r.reason) })
            }
          })
          if (successEmails.length > 0) {
            await BlogSubscriber.updateMany(
              { email: { $in: successEmails } },
              { $set: { lastNotifiedAt: new Date() }, $inc: { totalNotifications: 1 } }
            )
          }
          if (failed.length > 0) {
            console.error('[publish] subscriber email failures:', failed.slice(0, 20))
          }
          console.log(`[publish] subscriber email summary: total=${subscribers.length} success=${successEmails.length} failed=${failed.length}`)
        }
      } catch (notifyErr) {
        console.error('Subscriber notification error:', notifyErr.message)
      }
    })()
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// @route   POST /api/blogs/:id/send-approval
router.post('/:id/send-approval', protect, async (req, res) => {
  try {
    const { via } = req.body // 'telegram' | 'email' | 'both'
    const blog = await Blog.findById(req.params.id)
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' })

    const results = {}

    if (via === 'telegram' || via === 'both') {
      const { botToken, chatId } = await resolveTelegramCredentials()
      if (botToken && chatId) {
        const result = await sendBlogApprovalNotification(blog, botToken, chatId)
        if (result.success) {
          await Blog.findByIdAndUpdate(req.params.id, { telegramMessageId: result.messageId })
        }
        results.telegram = result
      } else {
        results.telegram = { success: false, error: 'Telegram not configured' }
      }
    }

    if (via === 'email' || via === 'both') {
      results.email = { skipped: true, reason: 'Approval notification emails are disabled' }
    }

    res.json({ success: true, results, message: 'Notification processed.' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// @route   DELETE /api/blogs/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id)
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' })
    res.json({ success: true, message: 'Blog deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
