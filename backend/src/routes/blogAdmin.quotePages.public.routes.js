const express = require('express')
const QuotePageConfig = require('../models/quotePageConfig.model')

const router = express.Router()

/** GET /public/quote-pages/:pageKey — published config for SSR */
router.get('/:pageKey', async (req, res) => {
  try {
    const pageKey = decodeURIComponent(req.params.pageKey)
    const page = await QuotePageConfig.findOne({
      pageKey,
      status: 'published',
    }).select('-updatedBy -__v')

    if (!page) {
      return res.status(404).json({ success: false, message: 'Quote page not found' })
    }

    res.set('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600')
    res.json({
      success: true,
      data: {
        baseTitle: page.baseTitle,
        canonical: page.canonical,
        baseDescription: page.baseDescription,
        vendorCategoryLabel: page.vendorCategoryLabel,
        vendorTitleSuffix: page.vendorTitleSuffix,
        baseH1: page.baseH1,
        vendorH1Category: page.vendorH1Category,
        landingContent: page.landingContent || null,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
