const express = require('express')
const { protect } = require('../middlewares/blogAdminAuth.middleware')
const { whitePaperUpload } = require('../middlewares/whitePaperUpload.middleware')
const WhitePaper = require('../models/whitePaper.model')
const WhitePaperLead = require('../models/whitePaperLead.model')
const {
  parseMetadataInput,
  parseHighlightQuestions,
  resolveHighlightQuestions,
  extractPdfText,
  extractTitleAndDescriptionFromPdf,
  shortenDescription,
  parseSeoOverrides,
  applySeoOverrides,
  parseClaudeContentPayload,
  applyGeneratedSeoToPaper,
  shouldUsePreGeneratedClaude,
  uploadPdfToCloudinary,
  uploadThumbnailToCloudinary,
  generateWhitePaperSeo,
  fallbackSeoFromAdmin,
  resolveWhitePaperTitle,
  resolveAdminWhitePaperTitle,
  syncSeoTitleFromAdminTitle,
  parseSeoMode,
  applyManualSeoToPaper,
} = require('../services/blogAdmin.whitePaper.service')
const { deleteCloudinaryAsset } = require('../utils/cloudinary-upload')
const { formatLeadForAdmin } = require('../utils/whitePaperLeadFormat')

const router = express.Router()

router.use(protect)

// POST /api/v1/blog-admin/whitepapers/preview
// Reads PDF and suggests title + description before submit.
router.post(
  '/preview',
  (req, res, next) => {
    whitePaperUpload(req, res, (err) => {
      if (err) {
        const msg = err.code === 'LIMIT_FILE_SIZE' ? 'File too large (max 25 MB)' : err.message
        return res.status(400).json({ success: false, message: msg })
      }
      next()
    })
  },
  async (req, res) => {
    try {
      const pdfFile = req.files?.pdf?.[0]
      if (!pdfFile) return res.status(400).json({ success: false, message: 'PDF file is required' })
      const pdfText = await extractPdfText(pdfFile.buffer)
      const suggested = extractTitleAndDescriptionFromPdf({
        pdfText,
        fileName: pdfFile.originalname,
      })
      res.json({
        success: true,
        data: {
          title: suggested.title,
          description: suggested.description,
          pdfTextExcerpt: pdfText.slice(0, 500),
        },
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || 'Failed to preview PDF' })
    }
  }
)

// POST /api/v1/blog-admin/whitepapers/generate-seo
// Claude SEO preview — fill form fields before publish; user can edit then save.
router.post(
  '/generate-seo',
  (req, res, next) => {
    whitePaperUpload(req, res, (err) => {
      if (err) {
        const msg = err.code === 'LIMIT_FILE_SIZE' ? 'File too large (max 25 MB)' : err.message
        return res.status(400).json({ success: false, message: msg })
      }
      next()
    })
  },
  async (req, res) => {
    try {
      const pdfFile = req.files?.pdf?.[0]
      let pdfText = ''
      if (pdfFile) {
        try {
          pdfText = await extractPdfText(pdfFile.buffer)
        } catch (pdfErr) {
          console.warn('PDF extract:', pdfErr?.message)
        }
      } else if (req.body?.paperId) {
        const existing = await WhitePaper.findById(req.body.paperId)
        if (!existing) return res.status(404).json({ success: false, message: 'White paper not found' })
        pdfText = existing.pdfTextExcerpt || ''
      } else {
        return res.status(400).json({ success: false, message: 'PDF file or paperId is required' })
      }

      let title = String(req.body?.title || '').trim()
      let description = String(req.body?.description || '').trim()
      if (!title || !description) {
        const suggested = extractTitleAndDescriptionFromPdf({
          pdfText,
          fileName: pdfFile?.originalname || '',
        })
        if (!title) title = suggested.title
        if (!description) description = suggested.description
      }
      title = resolveAdminWhitePaperTitle({
        rawTitle: title,
        pdfText,
        fileName: pdfFile?.originalname || '',
      })
      description = shortenDescription(description)

      const metaRaw = parseMetadataInput(req.body?.metadata)
      const metadata = {
        offeredBy: String(metaRaw.offeredBy || req.body?.offeredBy || 'Compare Bazaar').trim(),
        author: String(metaRaw.author || req.body?.author || '').trim(),
        category: String(metaRaw.category || req.body?.category || '').trim(),
        extra: String(metaRaw.extra || '').trim(),
      }

      let seo
      try {
        seo = await generateWhitePaperSeo({ title, description, metadata, pdfText })
      } catch (seoErr) {
        console.warn('White paper SEO generate fallback:', seoErr?.message || seoErr)
        seo = fallbackSeoFromAdmin({ title, description })
      }
      res.json({ success: true, data: seo })
    } catch (error) {
      console.error('White paper SEO generate error:', error)
      res.status(500).json({ success: false, message: error.message || 'Failed to generate SEO' })
    }
  }
)

// GET /api/v1/blog-admin/whitepapers/stats
router.get('/stats', async (_req, res) => {
  try {
    const [published, unpublished, processing, failed, agg] = await Promise.all([
      WhitePaper.countDocuments({ status: 'published' }),
      WhitePaper.countDocuments({ status: 'unpublished' }),
      WhitePaper.countDocuments({ status: 'processing' }),
      WhitePaper.countDocuments({ status: 'failed' }),
      WhitePaper.aggregate([
        {
          $group: {
            _id: null,
            totalViews: { $sum: '$viewCount' },
            totalDownloads: { $sum: '$downloadCount' },
          },
        },
      ]),
    ])
    const totals = agg[0] || { totalViews: 0, totalDownloads: 0 }
    res.json({
      success: true,
      data: {
        published,
        unpublished,
        processing,
        failed,
        total: published + unpublished + processing + failed,
        totalViews: totals.totalViews || 0,
        totalDownloads: totals.totalDownloads || 0,
        totalLeads: await WhitePaperLead.countDocuments({ profileCompleted: true }),
        totalLeadRecords: await WhitePaperLead.countDocuments(),
        emailOnlyLeads: await WhitePaperLead.countDocuments({ profileCompleted: false }),
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/v1/blog-admin/whitepapers/leads — all download form submissions (paginated)
router.get('/leads', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || '25'), 10) || 25))
    const skip = (page - 1) * limit
    const search = String(req.query.search || '').trim()
    const status = String(req.query.status || 'all').trim()

    const filter = {}
    if (status === 'completed') filter.profileCompleted = true
    else if (status === 'email_only') filter.profileCompleted = false

    if (search) {
      const re = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      filter.$or = [
        { email: re },
        { firstName: re },
        { lastName: re },
        { slug: re },
        { jobTitle: re },
        { companyCity: re },
        { companyCountry: re },
        { workPhone: re },
      ]
    }

    const [leads, total] = await Promise.all([
      WhitePaperLead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      WhitePaperLead.countDocuments(filter),
    ])

    const paperIds = [...new Set(leads.map((l) => String(l.whitePaperId)))]
    const papers = await WhitePaper.find({ _id: { $in: paperIds } })
      .select('_id title seoTitle slug')
      .lean()
    const paperById = Object.fromEntries(papers.map((p) => [String(p._id), p]))

    const data = leads.map((lead) => formatLeadForAdmin(lead, paperById[String(lead.whitePaperId)]))

    res.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/v1/blog-admin/whitepapers?page=1&limit=10
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || '10'), 10) || 10))
    const skip = (page - 1) * limit

    const [papers, total] = await Promise.all([
      WhitePaper.find().sort({ publishedAt: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      WhitePaper.countDocuments(),
    ])

    res.json({
      success: true,
      data: papers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/v1/blog-admin/whitepapers/:id/leads
router.get('/:id/leads', async (req, res) => {
  try {
    const paper = await WhitePaper.findById(req.params.id).lean()
    if (!paper) return res.status(404).json({ success: false, message: 'Not found' })

    const leads = await WhitePaperLead.find({ whitePaperId: paper._id })
      .sort({ createdAt: -1 })
      .limit(500)
      .lean()

    const data = leads.map((lead) => formatLeadForAdmin(lead, paper))

    res.json({
      success: true,
      data,
      paper: {
        _id: paper._id,
        title: paper.seoTitle || paper.title,
        slug: paper.slug,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// PATCH /api/v1/blog-admin/whitepapers/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const status = String(req.body?.status || '').trim()
    if (!['published', 'unpublished'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be published or unpublished' })
    }

    const paper = await WhitePaper.findById(req.params.id)
    if (!paper) return res.status(404).json({ success: false, message: 'Not found' })

    paper.status = status
    if (status === 'published' && !paper.publishedAt) paper.publishedAt = new Date()
    await paper.save()

    res.json({ success: true, message: `White paper ${status}`, data: paper })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/v1/blog-admin/whitepapers/:id
router.get('/:id', async (req, res) => {
  try {
    const paper = await WhitePaper.findById(req.params.id).lean()
    if (!paper) return res.status(404).json({ success: false, message: 'Not found' })
    res.json({ success: true, data: paper })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// POST /api/v1/blog-admin/whitepapers — full automated pipeline
router.post('/', (req, res, next) => {
  whitePaperUpload(req, res, (err) => {
    if (err) {
      const msg = err.code === 'LIMIT_FILE_SIZE' ? 'File too large (max 25 MB)' : err.message
      return res.status(400).json({ success: false, message: msg })
    }
    next()
  })
}, async (req, res) => {
  let draft = null
  try {
    const pdfFile = req.files?.pdf?.[0]
    const thumbFile = req.files?.thumbnail?.[0]
    let title = String(req.body?.title || '').trim()
    let description = String(req.body?.description || '').trim()
    let pdfText = ''

    if (!pdfFile) return res.status(400).json({ success: false, message: 'PDF file is required' })
    if (!thumbFile) return res.status(400).json({ success: false, message: 'Thumbnail image is required' })

    try {
      pdfText = await extractPdfText(pdfFile.buffer)
    } catch (pdfErr) {
      console.warn('PDF extract:', pdfErr?.message)
    }

    if (!title || !description) {
      const suggested = extractTitleAndDescriptionFromPdf({
        pdfText,
        fileName: pdfFile.originalname,
      })
      if (!title) title = suggested.title
      if (!description) description = suggested.description
    }
    title = resolveAdminWhitePaperTitle({
      rawTitle: String(req.body?.title || title || '').trim(),
      pdfText,
      fileName: pdfFile.originalname,
    })
    description = shortenDescription(description)

    const metaRaw = parseMetadataInput(req.body?.metadata)
    const metadata = {
      offeredBy: String(metaRaw.offeredBy || req.body?.offeredBy || 'Compare Bazaar').trim(),
      author: String(metaRaw.author || req.body?.author || '').trim(),
      category: String(metaRaw.category || req.body?.category || '').trim(),
      extra: String(metaRaw.extra || '').trim(),
    }

    const [pdfUpload, thumbUpload] = await Promise.all([
      uploadPdfToCloudinary(pdfFile.buffer),
      uploadThumbnailToCloudinary(thumbFile.buffer),
    ])

    const highlightQuestions = parseHighlightQuestions(req.body?.highlightQuestions)

    draft = await WhitePaper.create({
      title,
      description,
      metadata,
      highlightQuestions,
      status: 'processing',
      pdfUrl: pdfUpload.url,
      pdfPublicId: pdfUpload.publicId,
      thumbnailUrl: thumbUpload.url,
      thumbnailPublicId: thumbUpload.publicId,
    })

    const seoMode = parseSeoMode(req.body?.seoMode)
    const seoOverrides = parseSeoOverrides(req.body?.seo)
    if (seoMode === 'manual') {
      applyManualSeoToPaper(draft, {
        title: draft.title,
        description: draft.description,
        seoOverrides,
      })
    } else {
      const preGenerated = shouldUsePreGeneratedClaude(req.body)
      const claudeContent = parseClaudeContentPayload(req.body?.claudeContent)

      if (preGenerated && claudeContent) {
        applyGeneratedSeoToPaper(draft, claudeContent)
        applySeoOverrides(draft, seoOverrides)
      } else {
        let seo
        try {
          seo = await generateWhitePaperSeo({ title, description, metadata, pdfText })
        } catch (seoErr) {
          console.warn('White paper publish SEO fallback:', seoErr?.message || seoErr)
          seo = fallbackSeoFromAdmin({ title, description })
        }

        applyGeneratedSeoToPaper(draft, seo)
        applySeoOverrides(draft, seoOverrides)
      }
    }

    draft.title = resolveAdminWhitePaperTitle({
      rawTitle: String(req.body?.title || title || '').trim(),
      pdfText,
      fileName: pdfFile.originalname,
    })
    syncSeoTitleFromAdminTitle(draft, seoOverrides)
    draft.highlightQuestions = resolveHighlightQuestions(req.body?.highlightQuestions)
    draft.pdfTextExcerpt = pdfText.slice(0, 5000)
    draft.status = 'published'
    draft.publishedAt = new Date()
    await draft.save()

    res.status(201).json({
      success: true,
      message:
        seoMode === 'manual'
          ? 'White paper published with manual SEO'
          : 'White paper published automatically',
      data: draft,
      publicUrl: `/resources/whitepaper/${draft.slug}`,
    })
  } catch (error) {
    console.error('White paper submit error:', error)
    if (draft?._id) {
      try {
        draft.status = 'failed'
        draft.processingError = error.message
        await draft.save()
      } catch {
        /* ignore */
      }
    }

    let message =
      error.message ||
      (error.http_code ? `Cloudinary error (${error.http_code})` : 'Failed to publish white paper')

    if (/Cloudinary is not configured/i.test(message)) {
      message = 'Cloudinary is not configured on the server. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET on the backend host.'
    } else if (error.name === 'ValidationError') {
      message = Object.values(error.errors || {})
        .map((e) => e.message)
        .filter(Boolean)
        .join('; ') || message
    } else if (error.code === 11000) {
      message = 'A white paper with this slug already exists. Change the URL slug and try again.'
    }

    const status = error.name === 'ValidationError' || error.code === 11000 ? 400 : 500
    res.status(status).json({ success: false, message })
  }
})

// PUT /api/v1/blog-admin/whitepapers/:id — update whitepaper + optional PDF/thumbnail replace
router.put(
  '/:id',
  (req, res, next) => {
    whitePaperUpload(req, res, (err) => {
      if (err) {
        const msg = err.code === 'LIMIT_FILE_SIZE' ? 'File too large (max 25 MB)' : err.message
        return res.status(400).json({ success: false, message: msg })
      }
      next()
    })
  },
  async (req, res) => {
    try {
      const paper = await WhitePaper.findById(req.params.id)
      if (!paper) return res.status(404).json({ success: false, message: 'Not found' })

      const pdfFile = req.files?.pdf?.[0]
      const thumbFile = req.files?.thumbnail?.[0]
      let pdfText = String(paper.pdfTextExcerpt || '')

      if (pdfFile) {
        const pdfUpload = await uploadPdfToCloudinary(pdfFile.buffer)
        paper.pdfUrl = pdfUpload.url
        paper.pdfPublicId = pdfUpload.publicId
        pdfText = await extractPdfText(pdfFile.buffer)
      }

      if (thumbFile) {
        const thumbUpload = await uploadThumbnailToCloudinary(thumbFile.buffer)
        paper.thumbnailUrl = thumbUpload.url
        paper.thumbnailPublicId = thumbUpload.publicId
      }

      const metaRaw = parseMetadataInput(req.body?.metadata)
      const metadata = {
        offeredBy: String(metaRaw.offeredBy || req.body?.offeredBy || paper.metadata?.offeredBy || 'Compare Bazaar').trim(),
        author: String(metaRaw.author || req.body?.author || paper.metadata?.author || '').trim(),
        category: String(metaRaw.category || req.body?.category || paper.metadata?.category || '').trim(),
        extra: String(metaRaw.extra || paper.metadata?.extra || '').trim(),
      }

      paper.title = resolveAdminWhitePaperTitle({
        rawTitle: String(req.body?.title || paper.title || '').trim(),
        pdfText: pdfText || '',
        fileName: pdfFile?.originalname || '',
      })
      paper.description = shortenDescription(String(req.body?.description || paper.description || '').trim())
      paper.metadata = metadata
      paper.pdfTextExcerpt = pdfText ? String(pdfText).slice(0, 5000) : paper.pdfTextExcerpt

      const seoMode = parseSeoMode(req.body?.seoMode)
      const seoOverrides = parseSeoOverrides(req.body?.seo)
      if (seoMode === 'manual') {
        applyManualSeoToPaper(paper, {
          title: paper.title,
          description: paper.description,
          seoOverrides,
        })
      } else {
        const preGenerated = shouldUsePreGeneratedClaude(req.body)
        const claudeContent = parseClaudeContentPayload(req.body?.claudeContent)

        if (preGenerated && claudeContent) {
          applyGeneratedSeoToPaper(paper, claudeContent)
          applySeoOverrides(paper, seoOverrides)
        } else {
          let seo
          try {
            seo = await generateWhitePaperSeo({
              title: paper.title,
              description: paper.description,
              metadata,
              pdfText: pdfText || '',
            })
          } catch (seoErr) {
            console.warn('White paper update SEO fallback:', seoErr?.message || seoErr)
            seo = fallbackSeoFromAdmin({ title: paper.title, description: paper.description })
          }

          applyGeneratedSeoToPaper(paper, seo)
          applySeoOverrides(paper, seoOverrides)
        }
      }

      syncSeoTitleFromAdminTitle(paper, seoOverrides)

      paper.highlightQuestions = resolveHighlightQuestions(req.body?.highlightQuestions)
      paper.status = 'published'
      if (!paper.publishedAt) paper.publishedAt = new Date()
      paper.processingError = ''

      await paper.save()

      res.json({
        success: true,
        message: 'White paper updated successfully',
        data: paper,
        publicUrl: `/resources/whitepaper/${paper.slug}`,
      })
    } catch (error) {
      console.error('White paper update error:', error)
      res.status(500).json({ success: false, message: error.message || 'Failed to update white paper' })
    }
  }
)

// PATCH /api/v1/blog-admin/whitepapers/:id/seo — save SEO + optional title/description
router.patch('/:id/seo', async (req, res) => {
  try {
    const paper = await WhitePaper.findById(req.params.id)
    if (!paper) return res.status(404).json({ success: false, message: 'Not found' })

    const overrides = parseSeoOverrides(req.body?.seo || req.body)
    if (!overrides && !req.body?.title && !req.body?.description) {
      return res.status(400).json({ success: false, message: 'SEO payload is required' })
    }

    if (req.body?.title) {
      paper.title = resolveAdminWhitePaperTitle({
        rawTitle: String(req.body.title).trim(),
        pdfText: paper.pdfTextExcerpt || '',
      }).slice(0, 300)
    }
    if (req.body?.description) {
      paper.description = shortenDescription(String(req.body.description).trim())
    }
    applySeoOverrides(paper, overrides)
    syncSeoTitleFromAdminTitle(paper, overrides)
    await paper.save()

    res.json({
      success: true,
      message: 'SEO updated',
      data: paper,
      publicUrl: `/resources/whitepaper/${paper.slug}`,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// DELETE /api/v1/blog-admin/whitepapers/:id — MongoDB + Cloudinary (PDF + thumbnail)
router.delete('/:id', async (req, res) => {
  try {
    const paper = await WhitePaper.findById(req.params.id)
    if (!paper) return res.status(404).json({ success: false, message: 'Not found' })

    const cloudinaryDeletes = []
    if (paper.pdfPublicId) {
      cloudinaryDeletes.push(deleteCloudinaryAsset(paper.pdfPublicId, 'raw'))
    }
    if (paper.thumbnailPublicId) {
      cloudinaryDeletes.push(deleteCloudinaryAsset(paper.thumbnailPublicId, 'image'))
    }
    if (cloudinaryDeletes.length) {
      const outcomes = await Promise.allSettled(cloudinaryDeletes)
      const failed = outcomes.filter((o) => o.status === 'rejected')
      if (failed.length) {
        return res.status(502).json({
          success: false,
          message: 'Failed to delete files from Cloudinary. White paper was not removed from database.',
        })
      }
    }

    await paper.deleteOne()

    res.json({ success: true, message: 'Deleted from database and Cloudinary' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
