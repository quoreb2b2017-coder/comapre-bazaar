const express = require('express')
const router = express.Router()
const Blog = require("../models/automationBlog.model");
const Settings = require("../models/blogAdminSettings.model");
const { generateBlog, validateAnthropicKey, getModel } = require("../services/blogAdmin.claude.service");
const { notifyPendingBlogForApproval } = require("../services/blogAdmin.pendingNotify.service");
const { protect } = require("../middlewares/blogAdminAuth.middleware");

/** Prefer .env so a good key in ANTHROPIC_API_KEY is never overridden by an old row in MongoDB. */
async function resolveAnthropicApiKeyForGeneration() {
  const envKey = (process.env.ANTHROPIC_API_KEY || "").trim()
  if (envKey) return envKey
  const row = await Settings.findOne({ key: "claude_api_key" })
  if (row?.value == null || row?.value === "") return null
  return String(row.value).trim()
}

// @route   POST /api/generate-blog/validate-key — check Claude key (Settings form or .env)
router.post('/validate-key', protect, async (req, res) => {
  try {
    let bodyKey = req.body?.apiKey
    if (bodyKey === '••••••••' || (typeof bodyKey === 'string' && !bodyKey.trim())) bodyKey = undefined

    const settingKey = await Settings.findOne({ key: 'claude_api_key' })
    const dbKey = settingKey?.value != null ? String(settingKey.value).trim() : ""
    const envKey = (process.env.ANTHROPIC_API_KEY || "").trim()
    const apiKey =
      (typeof bodyKey === "string" && bodyKey.trim() ? bodyKey.trim() : undefined) ||
      envKey ||
      dbKey ||
      null

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: 'No API key: paste a key in Settings and save, or set ANTHROPIC_API_KEY in .env',
      })
    }

    await validateAnthropicKey(apiKey)
    res.json({
      success: true,
      message: 'Claude API key is valid.',
      model: getModel(),
    })
  } catch (error) {
    const status = error.status ?? error.statusCode
    const msg =
      status === 401
        ? 'Invalid Claude API key (unauthorized).'
        : error.message || 'Claude API check failed'
    res.status(400).json({ success: false, message: msg })
  }
})

// @route   POST /api/generate-blog
router.post('/', protect, async (req, res) => {
  try {
    const { topic, keywords = [], tone = 'professional', customInstructions = '', saveAsDraft = false } = req.body

    if (!topic?.trim()) {
      return res.status(400).json({ success: false, message: 'Topic is required' })
    }

    const apiKey = await resolveAnthropicApiKeyForGeneration()

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message:
          'Claude API key not configured. Set ANTHROPIC_API_KEY in backend/.env or save claude_api_key in Blog Admin Settings.',
      })
    }

    // Generate blog
    const result = await generateBlog({ topic, keywords, tone, customInstructions }, apiKey)

    if (!result.success) {
      return res.status(500).json({ success: false, message: 'Blog generation failed' })
    }

    const { data } = result

    // Save as draft if requested
    let savedBlog = null
    if (saveAsDraft) {
      savedBlog = await Blog.create({
        title: data.title,
        content: data.content,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        keywords: data.keywords,
        tags: data.tags,
        excerpt: data.excerpt,
        topic: data.topic,
        tone: data.tone,
        status: 'pending',
      })
      try {
        await notifyPendingBlogForApproval(savedBlog)
      } catch (notifyErr) {
        console.error('[generate-blog] approval notify:', notifyErr.message)
      }
    }

    res.json({
      success: true,
      data: { ...data, savedBlog },
      message: saveAsDraft ? 'Blog generated and saved as draft!' : 'Blog generated successfully!',
    })
  } catch (error) {
    const msg = error?.message || String(error)
    console.error('Generate blog error:', msg, error?.body || error?.stack)
    res.status(500).json({
      success: false,
      message: msg || 'Blog generation failed',
    })
  }
})

// @route   POST /api/generate-blog/save
router.post('/save', protect, async (req, res) => {
  try {
    const { title, content, metaTitle, metaDescription, keywords, tags, excerpt, topic, tone } = req.body

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' })
    }

    const blog = await Blog.create({
      title, content, metaTitle, metaDescription,
      keywords: keywords || [], tags: tags || [],
      excerpt, topic, tone: tone || 'professional',
      status: 'pending',
    })

    try {
      await notifyPendingBlogForApproval(blog)
    } catch (notifyErr) {
      console.error('[generate-blog/save] approval notify:', notifyErr.message)
    }

    res.status(201).json({
      success: true,
      data: blog,
      message: 'Blog saved as draft successfully!',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
