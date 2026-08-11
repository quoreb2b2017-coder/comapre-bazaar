const express = require('express')
const ComparisonPage = require('../models/comparisonPage.model')
const { protect } = require('../middlewares/blogAdminAuth.middleware')
const { servicePageUpload } = require('../middlewares/servicePageUpload.middleware')
const {
  buildComparisonMarkdownTemplate,
  importComparisonFile,
} = require('../services/servicePageImport.service')
const router = express.Router()

const VERTICAL_LABELS = {
  marketing: 'Marketing',
  sales: 'Sales',
  technology: 'Technology',
  'human-resources': 'Human Resources',
  general: 'General',
}

function slugToVertical(slug, canonical = '') {
  if (canonical.includes('/marketing/')) return 'marketing'
  if (canonical.includes('/sales/')) return 'sales'
  if (canonical.includes('/technology/')) return 'technology'
  if (canonical.includes('/human-resources/')) return 'human-resources'
  return 'general'
}

function buildDisplayName(content) {
  return content?.h1 || content?.title || content?.slug || 'Untitled page'
}

function normalizeComparisonContent(content) {
  const next = { ...content }
  if (Array.isArray(next.products)) {
    next.products = next.products.map((product) => {
      const vendorUrl = String(product.vendorUrl || '').trim()
      return {
        ...product,
        badges: Array.isArray(product.badges) ? product.badges : [],
        affiliateActive:
          product.affiliateActive === false
            ? false
            : product.affiliateActive === true || Boolean(vendorUrl),
      }
    })
  }
  if (next.heroCoverUrl != null) {
    next.heroCoverUrl = String(next.heroCoverUrl).trim()
  }
  return next
}

/** GET /comparison-pages — list all pages for admin dropdown */
router.get('/', protect, async (_req, res) => {
  try {
    const pages = await ComparisonPage.find()
      .select('slug vertical displayName status updatedAt content.title content.h1 content.canonical')
      .sort({ vertical: 1, displayName: 1 })

    res.json({
      success: true,
      data: pages.map((p) => ({
        slug: p.slug,
        vertical: p.vertical,
        verticalLabel: VERTICAL_LABELS[p.vertical] || p.vertical,
        displayName: p.displayName || p.content?.h1 || p.slug,
        status: p.status,
        canonical: p.content?.canonical,
        title: p.content?.title,
        h1: p.content?.h1,
        updatedAt: p.updatedAt,
      })),
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

/** GET /comparison-pages/:slug/template — download editable template */
router.get('/:slug/template', protect, async (req, res) => {
  try {
    const slug = req.params.slug
    const format = String(req.query.format || 'md').toLowerCase()
    let baseContent = null

    const page = await ComparisonPage.findOne({ slug })
    if (page?.content) baseContent = page.content

    if (!baseContent && req.query.baseContent) {
      try {
        baseContent = JSON.parse(String(req.query.baseContent))
      } catch {
        /* ignore */
      }
    }

    if (!baseContent) {
      return res.status(404).json({ success: false, message: 'No content found for template' })
    }

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Content-Disposition', `attachment; filename="${slug}-template.json"`)
      return res.send(JSON.stringify(baseContent, null, 2))
    }

    const markdown = buildComparisonMarkdownTemplate(baseContent)
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="${slug}-template.md"`)
    return res.send(markdown)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

/** POST /comparison-pages/:slug/import — upload JSON, Word, or PDF template */
router.post('/:slug/import', protect, (req, res, next) => {
  servicePageUpload(req, res, (err) => {
    if (err) {
      const msg = err.code === 'LIMIT_FILE_SIZE' ? 'File too large (max 15 MB)' : err.message
      return res.status(400).json({ success: false, message: msg })
    }
    next()
  })
}, async (req, res) => {
  try {
    const slug = req.params.slug
    const file = req.file
    if (!file) return res.status(400).json({ success: false, message: 'File is required' })

    let baseContent = {}
    try {
      if (req.body?.baseContent) {
        baseContent = JSON.parse(req.body.baseContent)
      }
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid baseContent JSON' })
    }

    const existing = await ComparisonPage.findOne({ slug })
    if (existing?.content) {
      baseContent = { ...existing.content, ...baseContent }
    }

    const result = await importComparisonFile(file, { slug, baseContent })
    res.json({
      success: true,
      data: result.content,
      source: result.source,
      warnings: result.warnings,
      message: 'Template imported — review content and click Save & publish',
    })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Import failed' })
  }
})

/** GET /comparison-pages/:slug — full page for editing */
router.get('/:slug', protect, async (req, res) => {
  try {
    const page = await ComparisonPage.findOne({ slug: req.params.slug })
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' })
    }
    res.json({ success: true, data: page })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

/** PUT /comparison-pages/:slug — update page content */
router.put('/:slug', protect, async (req, res) => {
  try {
    const { content, status, displayName } = req.body || {}
    if (!content || typeof content !== 'object') {
      return res.status(400).json({ success: false, message: 'content object is required' })
    }

    if (!content.slug) content.slug = req.params.slug
    const normalized = normalizeComparisonContent(content)
    if (!normalized.h1?.trim()) {
      return res.status(400).json({ success: false, message: 'H1 heading is required for SEO' })
    }
    if (!normalized.title?.trim()) {
      return res.status(400).json({ success: false, message: 'Page title is required for SEO' })
    }
    if (!normalized.metaDescription?.trim()) {
      return res.status(400).json({ success: false, message: 'Meta description is required for SEO' })
    }

    const vertical = slugToVertical(normalized.slug, normalized.canonical)
    const page = await ComparisonPage.findOneAndUpdate(
      { slug: req.params.slug },
      {
        slug: req.params.slug,
        content: normalized,
        vertical,
        displayName: displayName || buildDisplayName(normalized),
        status: status === 'draft' ? 'draft' : 'published',
        updatedBy: req.admin?.email || req.admin?.name || 'admin',
      },
      { new: true, upsert: true, runValidators: true }
    )

    res.json({ success: true, data: page, message: 'Page updated successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

/** POST /comparison-pages/seed — bulk import from static defaults */
router.post('/seed', protect, async (req, res) => {
  try {
    const pages = req.body?.pages
    if (!Array.isArray(pages) || pages.length === 0) {
      return res.status(400).json({ success: false, message: 'pages array is required' })
    }

    let created = 0
    let updated = 0

    for (const content of pages) {
      if (!content?.slug) continue
      const vertical = slugToVertical(content.slug, content.canonical)
      const existing = await ComparisonPage.findOne({ slug: content.slug })
      await ComparisonPage.findOneAndUpdate(
        { slug: content.slug },
        {
          slug: content.slug,
          content,
          vertical,
          displayName: buildDisplayName(content),
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
      message: `Seeded ${pages.length} pages (${created} new, ${updated} updated)`,
      created,
      updated,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
