const Anthropic = require('@anthropic-ai/sdk').default
const slugify = require('slugify')
const Settings = require('../models/blogAdminSettings.model')
const { extractPdfText } = require('../utils/pdf-text')
const { uploadBufferToCloudinary } = require('../utils/cloudinary-upload')

function assertCloudinaryConfigured() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary is not configured (CLOUDINARY_* in backend/.env)')
  }
}

const getModel = () => process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6'

async function resolveAnthropicKey() {
  const env = String(process.env.ANTHROPIC_API_KEY || '').trim()
  if (env) return env
  const row = await Settings.findOne({ key: 'claude_api_key' })
  return row?.value ? String(row.value).trim() : ''
}

function parseMetadataInput(raw) {
  if (!raw) return {}
  if (typeof raw === 'object') return raw
  try {
    return JSON.parse(String(raw))
  } catch {
    return { extra: String(raw).trim() }
  }
}

const HIGHLIGHT_QUESTIONS_MAX = 20

function parseHighlightQuestions(raw) {
  if (raw == null || raw === '') return []
  let arr = raw
  if (typeof raw === 'string') {
    try {
      arr = JSON.parse(raw)
    } catch {
      return []
    }
  }
  if (!Array.isArray(arr)) return []
  return arr
    .map((q) => String(q || '').trim())
    .filter(Boolean)
    .slice(0, HIGHLIGHT_QUESTIONS_MAX)
}

const SHORT_DESCRIPTION_MAX = 220
const SHORT_STRUCTURED_SEO_MAX = 280

function normalizeSentence(s, max = 280) {
  return String(s || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

/** Strip em/en dashes from public copy — use commas instead */
function stripEmDashes(text) {
  return String(text || '')
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/,{2,}/g, ',')
    .replace(/\s+,/g, ',')
    .replace(/,\s+/g, ', ')
    .trim()
}

/** Short public-page blurb — one or two sentences max */
function shortenDescription(text, max = SHORT_DESCRIPTION_MAX) {
  let s = normalizeSentence(text, max + 80)
  if (!s) return ''
  if (s.length <= max) return s

  const cut = s.slice(0, max)
  const lastDot = cut.lastIndexOf('.')
  if (lastDot >= 80) return cut.slice(0, lastDot + 1).trim()

  const lastSpace = cut.lastIndexOf(' ')
  const trimmed = (lastSpace > 50 ? cut.slice(0, lastSpace) : cut).trim()
  return trimmed.endsWith('…') ? trimmed : `${trimmed}…`
}

function titleFromFilename(fileName = '') {
  return String(fileName || '')
    .replace(/\.pdf$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractTitleAndDescriptionFromPdf({ pdfText = '', fileName = '' }) {
  const text = normalizeSentence(pdfText, 24000)
  const fallbackTitle = titleFromFilename(fileName) || 'Untitled whitepaper'

  if (!text) {
    return {
      title: fallbackTitle.slice(0, 180),
      description: 'Download this whitepaper to explore key insights, strategies, and implementation guidance.',
    }
  }

  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => normalizeSentence(s, 260))
    .filter(Boolean)

  const first = sentences[0] || text.slice(0, 120)
  const second = sentences[1] || ''

  let title = first
    .replace(/^abstract[:\-\s]*/i, '')
    .replace(/^title[:\-\s]*/i, '')
    .trim()
  if (title.length < 8) title = fallbackTitle
  if (title.length > 140) title = `${title.slice(0, 137).trim()}...`

  // Use abstract/intro only — keep description short for the public page
  const introSource =
    second && second.length > 40 && !/^abstract\b/i.test(first)
      ? `${first} ${second}`
      : first
  const description = shortenDescription(
    introSource,
    SHORT_DESCRIPTION_MAX
  )

  return {
    title: title || fallbackTitle.slice(0, 180),
    description:
      description || 'Download this whitepaper for practical insights and implementation guidance.',
  }
}

function getMessageText(message) {
  const block = message.content?.find((b) => b.type === 'text')
  return block?.text || message.content?.[0]?.text || ''
}

function fallbackSeoFromAdmin({ title, description }) {
  const base = slugify(title, { lower: true, strict: true }) || `whitepaper-${Date.now()}`
  const desc = description.slice(0, 160)
  return {
    seoTitle: title.slice(0, 70),
    metaTitle: title.slice(0, 60),
    metaDescription: desc,
    metaKeywords: [],
    slug: base.slice(0, 120),
    ogTitle: title.slice(0, 70),
    ogDescription: desc.slice(0, 200),
    structuredSeoContent: description.slice(0, 300),
  }
}

function parseSeoJson(raw, admin) {
  let s = String(raw || '').trim()
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fence) s = fence[1].trim()
  const start = s.indexOf('{')
  const end = s.lastIndexOf('}')
  if (start >= 0 && end > start) s = s.slice(start, end + 1)
  let parsed
  try {
    parsed = JSON.parse(s)
  } catch {
    return fallbackSeoFromAdmin(admin)
  }
  const keywords = Array.isArray(parsed.metaKeywords)
    ? parsed.metaKeywords.map((k) => String(k).trim()).filter(Boolean).slice(0, 20)
    : String(parsed.metaKeywords || '')
        .split(/[,;\n]/)
        .map((k) => k.trim())
        .filter(Boolean)
        .slice(0, 20)
  return {
    seoTitle: String(parsed.seoTitle || parsed.title || '').trim(),
    metaTitle: String(parsed.metaTitle || parsed.seoTitle || '').trim().slice(0, 70),
    metaDescription: String(parsed.metaDescription || '').trim().slice(0, 160),
    metaKeywords: keywords,
    slug: String(parsed.slug || '')
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 120),
    ogTitle: String(parsed.ogTitle || parsed.metaTitle || '').trim(),
    ogDescription: String(parsed.ogDescription || parsed.metaDescription || '').trim().slice(0, 200),
    structuredSeoContent: String(parsed.structuredSeoContent || parsed.structuredContent || '').trim(),
    insideOverview: String(parsed.insideOverview || '').trim().slice(0, 600),
    insideSections: normalizeInsideSections(parsed.insideSections, parsed.insidePoints),
    insidePoints: Array.isArray(parsed.insidePoints)
      ? parsed.insidePoints
          .map((p) => String(p || '').trim())
          .filter(Boolean)
          .slice(0, 6)
      : [],
    testimonialsHeading: String(parsed.testimonialsHeading || '').trim().slice(0, 80),
    testimonials: normalizeTestimonials(parsed.testimonials),
  }
}

function initialsFromName(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (!parts.length) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] || ''}${parts[parts.length - 1][0] || ''}`.toUpperCase()
}

function normalizeTestimonials(raw) {
  if (!Array.isArray(raw)) return []
  return raw
    .map((t) => {
      if (!t || typeof t !== 'object') return null
      const quote = stripEmDashes(String(t.quote || t.body || t.text || '').trim()).slice(0, 420)
      const name = stripEmDashes(String(t.name || '').trim()).slice(0, 60)
      const role = stripEmDashes(String(t.role || t.title || '').trim()).slice(0, 80)
      const company = stripEmDashes(String(t.company || t.organization || '').trim()).slice(0, 100)
      if (!quote || !name) return null
      const initials = String(t.initials || '').trim().slice(0, 4).toUpperCase() || initialsFromName(name)
      return { quote, name, initials, role, company }
    })
    .filter(Boolean)
    .slice(0, 3)
}

function normalizeInsideSections(sections, legacyPoints) {
  if (Array.isArray(sections) && sections.length) {
    return sections
      .map((s) => {
        if (!s || typeof s !== 'object') return null
        const title = stripEmDashes(String(s.title || '').trim())
        const summary = stripEmDashes(String(s.summary || s.description || '').trim())
        const pages = String(s.pages || s.pageCount || '').trim()
        if (!title && !summary) return null
        return { title: title || summary.slice(0, 80), summary, pages }
      })
      .filter(Boolean)
      .slice(0, 6)
  }
  if (Array.isArray(legacyPoints) && legacyPoints.length) {
    return legacyPoints
      .map((p) => String(p || '').trim())
      .filter(Boolean)
      .slice(0, 6)
      .map((text) => ({ title: text.slice(0, 80), summary: text, pages: '' }))
  }
  return []
}

/** Admin form questions only — not PDF inside sections */
function resolveHighlightQuestions(manualRaw) {
  return parseHighlightQuestions(manualRaw)
}

/**
 * Analyze PDF text + admin fields; return SEO package for MongoDB.
 */
async function generateWhitePaperSeo({ title, description, metadata, pdfText }) {
  const apiKey = await resolveAnthropicKey()
  if (!apiKey) throw new Error('Anthropic API key not configured')

  const client = new Anthropic({ apiKey })
  const site = process.env.WEBSITE_URL || 'https://www.compare-bazaar.com'

  const prompt = `You are an SEO strategist for Compare Bazaar (B2B software comparisons).

Analyze this white paper and admin inputs. Return ONLY valid JSON (no markdown prose).

Site: ${site}
Public URL pattern: /resources/whitepaper/{slug}

Admin title: ${title}
Admin description: ${description}
Admin metadata: ${JSON.stringify(metadata)}

PDF content excerpt:
${pdfText ? pdfText.slice(0, 24000) : '(No extractable text — use admin title and description only.)'}

Return JSON with exactly these keys:
{
  "seoTitle": "H1-style page title, compelling, under 70 chars",
  "metaTitle": "Google SERP title tag, under 60 chars, primary keyword near start",
  "metaDescription": "Google meta description 150-160 chars with clear CTA",
  "metaKeywords": ["8-12 keywords: mix of head terms, long-tail, and topic clusters — suitable for Google Search indexing and social/OG discovery; no stuffing"],
  "slug": "url-slug-lowercase-hyphens",
  "ogTitle": "Open Graph / social share title (Facebook, LinkedIn, WhatsApp) — can differ slightly from metaTitle, under 70 chars",
  "ogDescription": "Open Graph description for social previews — engaging, under 200 chars; may differ from metaDescription",
  "structuredSeoContent": "1-2 short sentences only (max 280 chars) for the public intro block",
  "insideOverview": "2-3 sentence overview paragraph (max 600 chars) summarizing what the reader will learn from this PDF. First sentence MUST contain the phrase 'Not another vendor whitepaper' and state it is independent benchmark data structured for decision-making.",
  "insideSections": [
    {
      "title": "Short section title under 60 chars",
      "summary": "1-2 sentence summary under 180 chars",
      "pages": "e.g. 2 pages or 3 pages — estimate from PDF if possible, else empty string"
    }
  ]
}

Rules for insideSections:
- Return exactly 5 or 6 items (prefer 6 when PDF has enough content)
- Base every item only on PDF content
- Titles should be scannable chapter-style headings
- No duplicate sections

  "testimonialsHeading": "Short trust line under 60 chars, e.g. Trusted by operations teams — match the PDF audience",
  "testimonials": [
    {
      "quote": "First-person quote under 280 chars referencing a SPECIFIC finding, number, or section from this PDF",
      "name": "First name + last initial only, e.g. Marcus R.",
      "initials": "Two-letter initials, e.g. MR",
      "role": "Job title matching the PDF vertical",
      "company": "Realistic SMB/mid-market company type, not a famous brand"
    }
  ]
}

Rules for testimonials:
- Return exactly 3 testimonials
- Each quote must cite something concrete from the PDF (pricing, benchmarks, hidden costs, ROI, comparisons, etc.)
- Sound like real busy operators — contractions OK, specific dollar amounts or percentages when the PDF has them
- NEVER use AI clichés: game-changer, invaluable, comprehensive guide, dive deep, leverage, robust, cutting-edge, this whitepaper, delighted
- Vary roles and company types across the three quotes
- Names must look human (not Brand X Manager); company names generic but believable
- NEVER use em dash (—) or en dash (–) anywhere; use commas or periods instead`

  const message = await client.messages.create({
    model: getModel(),
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })

  const seo = parseSeoJson(getMessageText(message), { title, description })
  if (!seo.slug) seo.slug = fallbackSeoFromAdmin({ title, description }).slug
  seo.structuredSeoContent = stripEmDashes(shortenDescription(seo.structuredSeoContent, SHORT_STRUCTURED_SEO_MAX))
  seo.insideOverview = stripEmDashes(shortenDescription(seo.insideOverview || '', 600))
  seo.testimonialsHeading = stripEmDashes(seo.testimonialsHeading || '')
  if (!seo.insideSections?.length) {
    seo.insideSections = []
  }
  if (!seo.testimonialsHeading) {
    seo.testimonialsHeading = 'Trusted by operations teams'
  }
  if (!seo.testimonials?.length) {
    seo.testimonials = []
  }
  return seo
}

function parseSeoOverrides(raw) {
  if (!raw) return null
  let data = raw
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch {
      return null
    }
  }
  if (!data || typeof data !== 'object') return null

  const metaKeywords = Array.isArray(data.metaKeywords)
    ? data.metaKeywords.map((k) => String(k).trim()).filter(Boolean).slice(0, 20)
    : String(data.metaKeywords || '')
        .split(/[,;\n]/)
        .map((k) => k.trim())
        .filter(Boolean)
        .slice(0, 20)

  const slug = String(data.slug || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)

  return {
    seoTitle: String(data.seoTitle || '').trim().slice(0, 70),
    metaTitle: String(data.metaTitle || '').trim().slice(0, 70),
    metaDescription: String(data.metaDescription || '').trim().slice(0, 160),
    metaKeywords,
    slug: slug || undefined,
    ogTitle: String(data.ogTitle || '').trim().slice(0, 70),
    ogDescription: String(data.ogDescription || '').trim().slice(0, 200),
    structuredSeoContent: String(data.structuredSeoContent || '').trim().slice(0, 280),
  }
}

function applySeoOverrides(paper, overrides) {
  if (!overrides) return
  if (overrides.seoTitle) paper.seoTitle = overrides.seoTitle
  if (overrides.metaTitle) paper.metaTitle = overrides.metaTitle
  if (overrides.metaDescription) paper.metaDescription = overrides.metaDescription
  if (overrides.metaKeywords?.length) paper.metaKeywords = overrides.metaKeywords
  if (overrides.slug) paper.slug = overrides.slug
  if (overrides.ogTitle) paper.ogTitle = overrides.ogTitle
  if (overrides.ogDescription) paper.ogDescription = overrides.ogDescription
  if (overrides.structuredSeoContent) paper.structuredSeoContent = overrides.structuredSeoContent
}

async function uploadPdfToCloudinary(buffer) {
  assertCloudinaryConfigured()
  const result = await uploadBufferToCloudinary(buffer, {
    folder: 'cc-final/whitepapers/pdf',
    resource_type: 'raw',
  })
  return {
    url: result.secure_url,
    publicId: result.public_id,
  }
}

async function uploadThumbnailToCloudinary(buffer) {
  assertCloudinaryConfigured()
  const result = await uploadBufferToCloudinary(buffer, {
    folder: 'cc-final/whitepapers/thumbnails',
    resource_type: 'image',
  })
  return {
    url: result.secure_url,
    publicId: result.public_id,
  }
}

module.exports = {
  parseMetadataInput,
  parseHighlightQuestions,
  resolveHighlightQuestions,
  normalizeInsideSections,
  parseSeoOverrides,
  applySeoOverrides,
  extractPdfText,
  extractTitleAndDescriptionFromPdf,
  shortenDescription,
  uploadPdfToCloudinary,
  uploadThumbnailToCloudinary,
  generateWhitePaperSeo,
}
