const express = require('express')
const ComparisonPage = require('../models/comparisonPage.model')
const { resolveBlogCoverImageUrl } = require('../services/blogAdmin.unsplash.service')

const router = express.Router()

/** GET /public/comparison-pages/cover-image?slug=&title=&intro= — Unsplash hero for SSR */
router.get('/cover-image', async (req, res) => {
  try {
    const slug = String(req.query.slug || '').trim()
    const title = String(req.query.title || '').trim()
    const intro = String(req.query.intro || '').trim()

    if (!slug && !title) {
      return res.status(400).json({ success: false, message: 'slug or title required' })
    }

    const result = await resolveBlogCoverImageUrl({
      topic: slug.replace(/-/g, ' '),
      title,
      keywords: intro ? intro.split(/\s+/).filter((w) => w.length > 3).slice(0, 10) : [],
    })

    if (!result?.coverImageUrl) {
      return res.status(404).json({ success: false, message: 'No Unsplash cover found' })
    }

    res.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')
    res.json({
      success: true,
      url: result.coverImageUrl,
      query: result.searchQuery || null,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

/** GET /public/comparison-pages/:slug — published page for SSR */
router.get('/:slug', async (req, res) => {
  try {
    const page = await ComparisonPage.findOne({
      slug: req.params.slug,
      status: 'published',
    }).select('-updatedBy -__v')

    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' })
    }

    res.set('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600')
    res.json({ success: true, data: page.content })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
