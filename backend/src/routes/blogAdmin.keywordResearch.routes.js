const express = require('express')
const router = express.Router()
const Settings = require('../models/blogAdminSettings.model')
const { protect } = require('../middlewares/blogAdminAuth.middleware')
const {
  integrationStatus,
  discoverAndUpsertPages,
  listPages,
  addManualPage,
  analyzePage,
  analyzeBulk,
  listAnalyses,
  getAnalysis,
  updateRecommendationApproval,
  exportAnalysisCsv,
  addManualKeywords,
  addManualKeywordsForPage,
  removeRecommendation,
  BULK_MAX,
  siteBaseUrl,
} = require('../services/blogAdmin.keywordResearch.service')

async function resolveAnthropicApiKey() {
  const envKey = String(process.env.ANTHROPIC_API_KEY || '').trim()
  if (envKey) return envKey
  const row = await Settings.findOne({ key: 'claude_api_key' })
  if (row?.value == null || row?.value === '') return null
  return String(row.value).trim()
}

router.get('/integrations', protect, async (_req, res) => {
  try {
    const status = integrationStatus()
    // Reflect Settings key even if env empty
    const apiKey = await resolveAnthropicApiKey()
    status.claude.configured = Boolean(apiKey)
    if (apiKey && !process.env.ANTHROPIC_API_KEY) {
      status.claude.note = 'Using Claude key from Blog Admin Settings'
    }
    res.json({
      success: true,
      data: {
        ...status,
        siteBaseUrl: siteBaseUrl(),
        bulkMax: BULK_MAX,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.post('/pages/discover', protect, async (_req, res) => {
  try {
    const result = await discoverAndUpsertPages()
    res.json({ success: true, data: result })
  } catch (error) {
    console.error('keyword-research discover:', error)
    res.status(500).json({ success: false, message: error.message || 'Discover failed' })
  }
})

router.get('/pages', protect, async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 50))
    const result = await listPages({
      q: String(req.query.q || '').trim(),
      pageType: String(req.query.pageType || '').trim(),
      status: String(req.query.status || '').trim(),
      page,
      limit,
    })
    res.json({ success: true, ...result })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.post('/pages/manual', protect, async (req, res) => {
  try {
    const url = String(req.body?.url || '').trim()
    if (!url) {
      return res.status(400).json({ success: false, message: 'url is required' })
    }
    const doc = await addManualPage(url)
    res.json({ success: true, data: doc })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

router.get('/analyses', protect, async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20))
    const result = await listAnalyses({
      page,
      limit,
      pageId: req.query.pageId || undefined,
    })
    res.json({ success: true, ...result })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get('/analyses/:id', protect, async (req, res) => {
  try {
    const data = await getAnalysis(req.params.id)
    res.json({ success: true, data })
  } catch (error) {
    res.status(404).json({ success: false, message: error.message })
  }
})

router.get('/analyses/:id/export.csv', protect, async (req, res) => {
  try {
    const data = await getAnalysis(req.params.id)
    const csv = exportAnalysisCsv(data)
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="keyword-research-${data._id}.csv"`
    )
    res.send(csv)
  } catch (error) {
    res.status(404).json({ success: false, message: error.message })
  }
})

router.patch('/analyses/:id/recommendations/:recId', protect, async (req, res) => {
  try {
    const approvalStatus = String(req.body?.approvalStatus || '').trim()
    const doc = await updateRecommendationApproval(
      req.params.id,
      req.params.recId,
      approvalStatus
    )
    res.json({ success: true, data: doc })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

router.post('/analyses/:id/keywords', protect, async (req, res) => {
  try {
    const keywords = req.body?.keywords ?? req.body?.keyword ?? ''
    const data = await addManualKeywords(req.params.id, keywords, req.body?.region)
    res.json({ success: true, data, message: `Added ${data.added?.length || 0} keyword(s)` })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

router.post('/pages/:pageId/keywords', protect, async (req, res) => {
  try {
    const keywords = req.body?.keywords ?? req.body?.keyword ?? ''
    const data = await addManualKeywordsForPage(req.params.pageId, keywords, req.body?.region)
    res.json({ success: true, data, message: `Added ${data.added?.length || 0} keyword(s)` })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

router.delete('/analyses/:id/recommendations/:recId', protect, async (req, res) => {
  try {
    const data = await removeRecommendation(req.params.id, req.params.recId)
    res.json({ success: true, data })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

router.post('/analyze', protect, async (req, res) => {
  try {
    const apiKey = await resolveAnthropicApiKey()
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message:
          'Claude API key not configured. Set ANTHROPIC_API_KEY or add claude_api_key in Settings.',
      })
    }

    const region = req.body?.region || {}
    const force = Boolean(req.body?.force)
    const analyzedBy = req.admin?.email || req.admin?.id || ''

    if (Array.isArray(req.body?.pageIds) && req.body.pageIds.length > 1) {
      const data = await analyzeBulk({
        pageIds: req.body.pageIds,
        region,
        apiKey,
        analyzedBy,
        force,
      })
      return res.json({ success: true, data })
    }

    const pageId = req.body?.pageId || req.body?.pageIds?.[0]
    const pageUrl = req.body?.pageUrl
    if (!pageId && !pageUrl) {
      return res.status(400).json({
        success: false,
        message: 'pageId or pageUrl is required',
      })
    }

    // Returns immediately with status "processing"; Claude runs in background.
    const analysis = await analyzePage({
      pageId,
      pageUrl,
      region,
      apiKey,
      analyzedBy,
      force: true,
    })
    res.json({
      success: true,
      data: analysis,
      async: true,
      message: 'Analysis started. Poll this analysis until status is done or failed.',
    })
  } catch (error) {
    console.error('keyword-research analyze:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Analysis failed',
    })
  }
})

module.exports = router
