const express = require('express')
const QuotePageConfig = require('../models/quotePageConfig.model')
const { protect } = require('../middlewares/blogAdminAuth.middleware')
const { servicePageUpload } = require('../middlewares/servicePageUpload.middleware')
const {
  buildQuoteMarkdownTemplate,
  importQuoteFile,
} = require('../services/servicePageImport.service')

const router = express.Router()

function pageKeyToVertical(pageKey = '') {
  if (pageKey.startsWith('marketing/')) return 'marketing'
  if (pageKey.startsWith('sales/')) return 'sales'
  if (pageKey.startsWith('technology/')) return 'technology'
  if (pageKey.startsWith('human-resources/')) return 'human-resources'
  return 'general'
}

/** GET /quote-pages — list all quote pages */
router.get('/', protect, async (_req, res) => {
  try {
    const pages = await QuotePageConfig.find()
      .select('pageKey vertical displayName status baseTitle baseH1 canonical updatedAt')
      .sort({ vertical: 1, displayName: 1 })

    res.json({ success: true, data: pages })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

/** GET /quote-pages/:pageKey/template */
router.get('/:pageKey/template', protect, async (req, res) => {
  try {
    const pageKey = decodeURIComponent(req.params.pageKey)
    const format = String(req.query.format || 'md').toLowerCase()
    let baseConfig = null

    const page = await QuotePageConfig.findOne({ pageKey })
    if (page) {
      baseConfig = {
        baseTitle: page.baseTitle,
        canonical: page.canonical,
        baseDescription: page.baseDescription,
        vendorCategoryLabel: page.vendorCategoryLabel,
        vendorTitleSuffix: page.vendorTitleSuffix,
        baseH1: page.baseH1,
        vendorH1Category: page.vendorH1Category,
      }
    }

    if (!baseConfig && req.query.baseConfig) {
      try {
        baseConfig = JSON.parse(String(req.query.baseConfig))
      } catch {
        /* ignore */
      }
    }

    if (!baseConfig) {
      return res.status(404).json({ success: false, message: 'No content found for template' })
    }

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Content-Disposition', `attachment; filename="quote-template.json"`)
      return res.send(JSON.stringify({ pageKey, ...baseConfig }, null, 2))
    }

    const markdown = buildQuoteMarkdownTemplate(baseConfig)
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="quote-template.md"`)
    return res.send(markdown)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

/** POST /quote-pages/:pageKey/import */
router.post('/:pageKey/import', protect, (req, res, next) => {
  servicePageUpload(req, res, (err) => {
    if (err) {
      const msg = err.code === 'LIMIT_FILE_SIZE' ? 'File too large (max 15 MB)' : err.message
      return res.status(400).json({ success: false, message: msg })
    }
    next()
  })
}, async (req, res) => {
  try {
    const pageKey = decodeURIComponent(req.params.pageKey)
    const file = req.file
    if (!file) return res.status(400).json({ success: false, message: 'File is required' })

    let baseConfig = {}
    try {
      if (req.body?.baseConfig) {
        baseConfig = JSON.parse(req.body.baseConfig)
      }
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid baseConfig JSON' })
    }

    const existing = await QuotePageConfig.findOne({ pageKey })
    if (existing) {
      baseConfig = {
        baseTitle: existing.baseTitle,
        canonical: existing.canonical,
        baseDescription: existing.baseDescription,
        vendorCategoryLabel: existing.vendorCategoryLabel,
        vendorTitleSuffix: existing.vendorTitleSuffix,
        baseH1: existing.baseH1,
        vendorH1Category: existing.vendorH1Category,
        ...baseConfig,
      }
    }

    const result = await importQuoteFile(file, { pageKey, baseConfig })
    res.json({
      success: true,
      data: result.config,
      source: result.source,
      warnings: result.warnings,
      message: 'Template imported — review and click Save & publish',
    })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Import failed' })
  }
})

/** GET /quote-pages/:pageKey — full config (pageKey URL-encoded) */
router.get('/:pageKey', protect, async (req, res) => {
  try {
    const pageKey = decodeURIComponent(req.params.pageKey)
    const page = await QuotePageConfig.findOne({ pageKey })
    if (!page) {
      return res.status(404).json({ success: false, message: 'Quote page not found' })
    }
    res.json({ success: true, data: page })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

/** PUT /quote-pages/:pageKey — update quote page SEO/content */
router.put('/:pageKey', protect, async (req, res) => {
  try {
    const pageKey = decodeURIComponent(req.params.pageKey)
    const body = req.body || {}

    if (!body.baseH1?.trim()) {
      return res.status(400).json({ success: false, message: 'H1 heading is required' })
    }
    if (!body.baseTitle?.trim()) {
      return res.status(400).json({ success: false, message: 'Page title is required' })
    }
    if (!body.baseDescription?.trim()) {
      return res.status(400).json({ success: false, message: 'Meta description is required' })
    }

    const vertical = pageKeyToVertical(pageKey)
    const page = await QuotePageConfig.findOneAndUpdate(
      { pageKey },
      {
        pageKey,
        vertical,
        displayName: body.displayName || body.baseH1,
        baseTitle: body.baseTitle,
        canonical: body.canonical,
        baseDescription: body.baseDescription,
        vendorCategoryLabel: body.vendorCategoryLabel,
        vendorTitleSuffix: body.vendorTitleSuffix,
        baseH1: body.baseH1,
        vendorH1Category: body.vendorH1Category,
        landingContent: body.landingContent ?? null,
        status: body.status === 'draft' ? 'draft' : 'published',
        updatedBy: req.admin?.email || req.admin?.name || 'admin',
      },
      { new: true, upsert: true }
    )

    res.json({ success: true, data: page, message: 'Quote page updated' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

/** POST /quote-pages/seed — bulk import defaults */
router.post('/seed', protect, async (req, res) => {
  try {
    const pages = req.body?.pages
    if (!Array.isArray(pages) || pages.length === 0) {
      return res.status(400).json({ success: false, message: 'pages array is required' })
    }

    let created = 0
    let updated = 0

    for (const item of pages) {
      if (!item?.pageKey) continue
      const existing = await QuotePageConfig.findOne({ pageKey: item.pageKey })
      const vertical = pageKeyToVertical(item.pageKey)
      await QuotePageConfig.findOneAndUpdate(
        { pageKey: item.pageKey },
        {
          ...item,
          vertical,
          displayName: item.displayName || item.baseH1,
          status: 'published',
          updatedBy: req.admin?.email || 'seed',
        },
        { upsert: true, new: true }
      )
      if (existing) updated += 1
      else created += 1
    }

    res.json({
      success: true,
      message: `Seeded ${pages.length} quote pages (${created} new, ${updated} updated)`,
      created,
      updated,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
