const express = require('express')
const ComparisonPage = require('../models/comparisonPage.model')

const router = express.Router()

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
