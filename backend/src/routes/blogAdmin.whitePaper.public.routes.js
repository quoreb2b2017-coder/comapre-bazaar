const express = require('express')
const axios = require('axios')
const WhitePaper = require('../models/whitePaper.model')
const WhitePaperLead = require('../models/whitePaperLead.model')
const { cloudinaryForceDownloadUrl, safePdfFileName } = require('../utils/pdf-download')
const { isWorkEmail } = require('../utils/work-email')
const { INSIDE_SECTIONS_MAX, resolveWhitePaperTitle, cleanWhitePaperTitle } = require('../services/blogAdmin.whitePaper.service')
const {
  parseHighlightQuestions,
  validateHighlightAnswer,
} = require('../utils/highlightQuestions')

const router = express.Router()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizeCustomAnswers(body, paper) {
  const questions = parseHighlightQuestions(paper?.highlightQuestions)
  const raw = body?.highlightAnswers ?? body?.customAnswers
  const byQuestion = {}
  if (Array.isArray(raw)) {
    for (const item of raw) {
      const question = String(item?.question || '').trim()
      const answer = String(item?.answer || '').trim()
      if (question) byQuestion[question] = answer
    }
  }
  return questions.map((item) => {
    const answer = byQuestion[item.question] || ''
    const check = validateHighlightAnswer(item, answer)
    return { question: item.question, answer: check.ok ? check.answer : '' }
  })
}

function publicFields(p, { includePdf = false } = {}) {
  const pdfText = p.pdfTextExcerpt || ''
  const displayTitle =
    cleanWhitePaperTitle(p.seoTitle || p.title || '') ||
    resolveWhitePaperTitle({ rawTitle: p.seoTitle || p.title, pdfText })
  const base = {
    slug: p.slug,
    title: cleanWhitePaperTitle(p.title || '') || displayTitle,
    seoTitle: displayTitle,
    description: String(p.description || p.metaDescription || '').trim(),
    structuredSeoContent: p.structuredSeoContent,
    metaTitle: cleanWhitePaperTitle(p.metaTitle || displayTitle).slice(0, 70),
    metaDescription: p.metaDescription,
    metaKeywords: p.metaKeywords || [],
    ogTitle: p.ogTitle,
    ogDescription: p.ogDescription,
    thumbnailUrl: p.thumbnailUrl,
    metadata: p.metadata,
    insideOverview: p.insideOverview || '',
    insideSections: Array.isArray(p.insideSections)
      ? p.insideSections
          .filter((s) => s && (s.title || s.summary))
          .slice(0, INSIDE_SECTIONS_MAX)
          .map((s) => ({
            title: s.title || '',
            summary: s.summary || '',
            body: s.body || s.summary || '',
            pages: s.pages || '',
          }))
      : [],
    insidePoints: Array.isArray(p.insidePoints) ? p.insidePoints.filter(Boolean).slice(0, INSIDE_SECTIONS_MAX) : [],
    highlightQuestions: parseHighlightQuestions(p.highlightQuestions),
    testimonialsHeading: p.testimonialsHeading || 'Trusted by operations teams',
    testimonials: Array.isArray(p.testimonials)
      ? p.testimonials
          .filter((t) => t && t.quote && t.name)
          .slice(0, 3)
          .map((t) => ({
            quote: t.quote || '',
            name: t.name || '',
            initials: t.initials || '',
            role: t.role || '',
            company: t.company || '',
          }))
      : [],
    publishedAt: p.publishedAt,
    viewCount: p.viewCount || 0,
  }
  if (includePdf) base.pdfUrl = p.pdfUrl
  return base
}

// GET /api/v1/blog-admin/public/whitepapers
router.get('/', async (_req, res) => {
  try {
    const papers = await WhitePaper.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .lean()
    res.json({ success: true, data: papers.map((p) => publicFields(p)) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// POST /api/v1/blog-admin/public/whitepapers/:slug/view
router.post('/:slug/view', async (req, res) => {
  try {
    const slug = String(req.params.slug || '').trim()
    const paper = await WhitePaper.findOneAndUpdate(
      { slug, status: 'published' },
      { $inc: { viewCount: 1 } },
      { returnDocument: 'after' }
    ).lean()
    if (!paper) return res.status(404).json({ success: false, message: 'Not found' })
    res.json({ success: true, viewCount: paper.viewCount })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// POST /api/v1/blog-admin/public/whitepapers/:slug/download-email — step 1
router.post('/:slug/download-email', async (req, res) => {
  try {
    const slug = String(req.params.slug || '').trim()
    const email = String(req.body?.email || '')
      .toLowerCase()
      .trim()

    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, message: 'Valid work email is required' })
    }
    if (!isWorkEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please use your work email. Personal addresses (Gmail, Yahoo, Outlook, etc.) are not accepted.',
      })
    }

    const paper = await WhitePaper.findOne({ slug, status: 'published' })
    if (!paper) return res.status(404).json({ success: false, message: 'Not found' })

    let lead = await WhitePaperLead.findOne({ whitePaperId: paper._id, email })
    if (!lead) {
      lead = await WhitePaperLead.create({
        whitePaperId: paper._id,
        slug,
        email,
        profileCompleted: false,
      })
    }

    res.json({
      success: true,
      message: 'Email saved. Complete your profile to download.',
      data: { email: lead.email, step: 'profile' },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// POST /api/v1/blog-admin/public/whitepapers/:slug/download-complete — step 2 + PDF
router.post('/:slug/download-complete', async (req, res) => {
  try {
    const slug = String(req.params.slug || '').trim()
    const email = String(req.body?.email || '')
      .toLowerCase()
      .trim()

    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, message: 'Valid work email is required' })
    }
    if (!isWorkEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please use your work email. Personal addresses (Gmail, Yahoo, Outlook, etc.) are not accepted.',
      })
    }

    const required = ['firstName', 'lastName', 'jobTitle', 'workPhone', 'companyStreet', 'companyPostal', 'companyCity', 'companyCountry']
    for (const key of required) {
      if (!String(req.body?.[key] || '').trim()) {
        return res.status(400).json({ success: false, message: `${key} is required` })
      }
    }

    const paper = await WhitePaper.findOne({ slug, status: 'published' })
    if (!paper) return res.status(404).json({ success: false, message: 'Not found' })

    const marketingConsent = req.body?.marketingConsent === true || req.body?.marketingConsent === 'true'
    const customAnswers = normalizeCustomAnswers(req.body, paper)
    const missingAnswer = customAnswers.find((a) => !a.answer)
    if (missingAnswer) {
      return res.status(400).json({
        success: false,
        message: `Please answer: ${missingAnswer.question}`,
      })
    }

    const existing = await WhitePaperLead.findOne({ whitePaperId: paper._id, email }).lean()
    const isFirstDownload = !existing?.profileCompleted

    await WhitePaperLead.findOneAndUpdate(
      { whitePaperId: paper._id, email },
      {
        whitePaperId: paper._id,
        slug,
        email,
        firstName: String(req.body.firstName).trim(),
        lastName: String(req.body.lastName).trim(),
        jobTitle: String(req.body.jobTitle).trim(),
        workPhone: String(req.body.workPhone).trim(),
        companyStreet: String(req.body.companyStreet).trim(),
        companySuite: String(req.body.companySuite || '').trim(),
        companyPostal: String(req.body.companyPostal).trim(),
        companyCity: String(req.body.companyCity).trim(),
        companyState: String(req.body.companyState || '').trim(),
        companyCountry: String(req.body.companyCountry).trim(),
        customAnswers,
        marketingConsent,
        profileCompleted: true,
        downloadedAt: new Date(),
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    )

    if (isFirstDownload) {
      await WhitePaper.findByIdAndUpdate(paper._id, { $inc: { downloadCount: 1 } })
    }

    const fileName = safePdfFileName(paper.slug, paper.title)
    const downloadPath = `/api/v1/blog-admin/public/whitepapers/${encodeURIComponent(slug)}/download-file?email=${encodeURIComponent(email)}`

    res.json({
      success: true,
      message: 'Download ready',
      data: {
        fileName,
        downloadUrl: downloadPath,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/v1/blog-admin/public/whitepapers/:slug/download-file — verified PDF download
router.get('/:slug/download-file', async (req, res) => {
  try {
    const slug = String(req.params.slug || '').trim()
    const email = String(req.query.email || '')
      .toLowerCase()
      .trim()

    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, message: 'Valid email is required' })
    }

    const lead = await WhitePaperLead.findOne({ slug, email, profileCompleted: true }).lean()
    if (!lead) {
      return res.status(403).json({ success: false, message: 'Please complete the download form first' })
    }

    const paper = await WhitePaper.findOne({ slug, status: 'published' }).lean()
    if (!paper?.pdfUrl) return res.status(404).json({ success: false, message: 'PDF not found' })

    const pdfUrl = cloudinaryForceDownloadUrl(paper.pdfUrl)
    const fileResponse = await axios.get(pdfUrl, {
      responseType: 'arraybuffer',
      timeout: 120000,
      maxContentLength: 50 * 1024 * 1024,
    })

    const fileName = safePdfFileName(paper.slug, paper.title)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
    res.setHeader('Cache-Control', 'private, max-age=3600')
    res.send(Buffer.from(fileResponse.data))
  } catch (error) {
    console.error('PDF download-file error:', error?.message || error)
    res.status(500).json({ success: false, message: 'Failed to download PDF' })
  }
})

// GET /api/v1/blog-admin/public/whitepapers/:slug
router.get('/:slug', async (req, res) => {
  try {
    const slug = String(req.params.slug || '').trim()
    const paper = await WhitePaper.findOne({ slug, status: 'published' }).lean()
    if (!paper) return res.status(404).json({ success: false, message: 'Not found' })
    res.json({ success: true, data: publicFields(paper) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
