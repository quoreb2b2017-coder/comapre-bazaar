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

const { parseHighlightQuestions } = require('../utils/highlightQuestions')
const INSIDE_SECTIONS_MIN = 3
const INSIDE_SECTIONS_MAX = 5
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

const COMPARE_BAZAAR_DOMAIN = 'compare-bazaar.com'
const DOMAIN_RE = /(?:https?:\/\/)?(?:www\.)?compare[-_\s]?bazaar(?:\.com)?/gi
const COPYRIGHT_RE = /©\s*\d{4}[^.]*?(?:compare[-_\s]?bazaar[^.]*)?\.?/gi

function stripCopyrightNotice(text) {
  return String(text || '')
    .replace(COPYRIGHT_RE, ' ')
    .replace(/\s*©\s*\d{4}.*$/i, ' ')
    .replace(/\ball rights reserved\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeCompareBazaarDomain(text) {
  return String(text || '').replace(DOMAIN_RE, COMPARE_BAZAAR_DOMAIN)
}

function cleanWhitePaperTitle(raw = '') {
  let s = stripEmDashes(stripCopyrightNotice(normalizeCompareBazaarDomain(raw)))
  s = s.replace(/\.\s*compare-bazaar\.?\s*$/i, '')
  s = s.replace(/\s+\|\s*compare-bazaar\.com\s*$/i, '')
  s = s.replace(/\s+\.\s*$/,'')
  s = s.replace(/\s{2,}/g, ' ').trim()
  return s.slice(0, 180)
}

function isCompareBazaarBranded(text = '') {
  DOMAIN_RE.lastIndex = 0
  return DOMAIN_RE.test(String(text || ''))
}

function stripPublisherFromTitle(text = '') {
  return String(text || '')
    .replace(new RegExp(`^${COMPARE_BAZAAR_DOMAIN}\\s*[-–—|:]\\s*`, 'i'), '')
    .replace(new RegExp(`^${COMPARE_BAZAAR_DOMAIN}\\s+`, 'i'), '')
    .replace(new RegExp(`\\s*[-–—|:]\\s*${COMPARE_BAZAAR_DOMAIN}\\s*$`, 'i'), '')
    .replace(new RegExp(COMPARE_BAZAAR_DOMAIN, 'gi'), '')
    .replace(/\s+/g, ' ')
    .trim()
}

function scoreReportTitleCandidate(text) {
  let score = 0
  if (/\b20\d{2}\b/.test(text)) score += 4
  if (/\b(report|benchmark|guide|whitepaper|analysis|pricing|telematics|fleet|software|payroll|crm)\b/i.test(text)) {
    score += 3
  }
  if (text.length >= 25 && text.length <= 100) score += 2
  if (/^compare/i.test(text)) score -= 5
  if (/^©/.test(text)) score -= 10
  return score
}

function extractReportTitleFromPdfChunk(pdfText = '', fileName = '') {
  const chunk = String(pdfText || '').slice(0, 2500)
  const fallback = titleFromFilename(fileName) || 'Untitled whitepaper'
  if (!chunk.trim()) return fallback

  const candidates = []
  const pushCandidate = (value) => {
    const c = stripPublisherFromTitle(stripCopyrightNotice(normalizeCompareBazaarDomain(String(value || ''))))
    if (c.length >= 12 && c.length <= 140) candidates.push(c)
  }

  const lines = chunk
    .split(/\n+/)
    .map((l) => stripCopyrightNotice(normalizeCompareBazaarDomain(normalizeSentence(l, 200))))
    .filter((l) => l.length >= 8)
    .filter((l) => !/^©/.test(l))

  for (const line of lines) pushCandidate(line)

  const beforeCopy = chunk.split(/©\s*\d{4}/i)[0] || chunk
  pushCandidate(beforeCopy)

  const domainLead = beforeCopy.match(/compare-bazaar\.com\s+(.+)/i)
  if (domainLead) pushCandidate(domainLead[1])

  if (!candidates.length) return fallback

  candidates.sort((a, b) => scoreReportTitleCandidate(b) - scoreReportTitleCandidate(a))
  return candidates[0] || fallback
}

function formatWhitePaperDisplayTitle(reportTitle, pdfText = '') {
  const cleaned = cleanWhitePaperTitle(reportTitle)
  if (!cleaned) return ''

  const branded =
    isCompareBazaarBranded(String(pdfText || '').slice(0, 2500)) || isCompareBazaarBranded(cleaned)

  if (!branded) return cleaned.slice(0, 180)

  const core = stripPublisherFromTitle(cleaned) || cleaned
  return `${COMPARE_BAZAAR_DOMAIN} — ${core}`.slice(0, 180)
}

function resolveWhitePaperTitle({ rawTitle = '', pdfText = '', fileName = '' } = {}) {
  const fromPdf = extractReportTitleFromPdfChunk(pdfText, fileName)
  const seed = String(rawTitle || '').trim()
  const rawMessy =
    /©\s*\d{4}/i.test(seed) ||
    (isCompareBazaarBranded(seed) && stripPublisherFromTitle(seed).length >= 12 && seed.length > 50)

  const reportTitle = rawMessy
    ? fromPdf
    : stripPublisherFromTitle(stripCopyrightNotice(seed)) || fromPdf

  return formatWhitePaperDisplayTitle(reportTitle, pdfText)
}

function extractTitleAndDescriptionFromPdf({ pdfText = '', fileName = '' }) {
  const text = String(pdfText || '').slice(0, 4000)
  const fallbackTitle = titleFromFilename(fileName) || 'Untitled whitepaper'

  if (!text.trim()) {
    return {
      title: fallbackTitle.slice(0, 180),
      description: 'Download this whitepaper to explore key insights, strategies, and implementation guidance.',
    }
  }

  const title = resolveWhitePaperTitle({ rawTitle: '', pdfText: text, fileName })

  const bodyText = stripCopyrightNotice(normalizeCompareBazaarDomain(text))
    .split(/\n+/)
    .map((l) => normalizeSentence(l, 260))
    .filter((l) => l.length > 40)
    .filter((l) => !/^compare-bazaar\.com$/i.test(l))
    .filter((l) => !/^©/.test(l))

  const introSource = bodyText[0] || bodyText[1] || stripPublisherFromTitle(bodyText.join(' '))
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
          .slice(0, INSIDE_SECTIONS_MAX)
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
        const body = stripEmDashes(String(s.body || s.detail || s.content || '').trim())
        const pages = String(s.pages || s.pageCount || '').trim()
        if (!title && !summary && !body) return null
        return {
          title: title || summary.slice(0, 80),
          summary: summary || body.slice(0, 180),
          body: (body || summary).slice(0, 1000),
          pages,
        }
      })
      .filter(Boolean)
      .slice(0, INSIDE_SECTIONS_MAX)
  }
  if (Array.isArray(legacyPoints) && legacyPoints.length) {
    return legacyPoints
      .map((p) => String(p || '').trim())
      .filter(Boolean)
      .slice(0, INSIDE_SECTIONS_MAX)
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

Rules for seoTitle, metaTitle, and ogTitle:
- Use the exact report title from the PDF cover (year + topic when present), not copyright/footer text
- For Compare Bazaar PDFs, format as: compare-bazaar.com — {Report Title}
- Always write the domain lowercase as compare-bazaar.com (never Compare-bazaar.com)
- NEVER include copyright lines (© 2026...), duplicate publisher names, or "all rights reserved"

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
      "summary": "One-line teaser under 120 chars for the section list",
      "body": "4-6 sentences drawn from the PDF for this section. Include specific numbers, benchmarks, pricing tiers, hidden costs, or ROI findings when the PDF has them. Write in plain editorial prose as one or two short paragraphs, max 900 chars.",
      "pages": "e.g. 2 pages or 3 pages — estimate from PDF if possible, else empty string"
    }
  ]
}

Rules for insideSections:
- Read the PDF table of contents, chapter headings, and major topic blocks first
- Return exactly 3, 4, or 5 items — choose the count that matches the PDF structure, never a fixed number every time
- Short focused PDFs with ~3 main chapters: return 3 sections
- Medium reports with ~4 distinct blocks: return 4 sections
- Longer benchmark reports with ~5 major chapters: return 5 sections
- Never return fewer than ${INSIDE_SECTIONS_MIN} or more than ${INSIDE_SECTIONS_MAX}
- Never pad with generic filler; merge minor subsections into parent topics instead of adding extra items
- If the PDF has substantive content, aim for at least ${INSIDE_SECTIONS_MIN} distinct sections when the material allows
- Base every item only on PDF content
- Titles should be scannable chapter-style headings
- summary = short list teaser; body = fuller PDF-derived copy for the detail panel (must not duplicate summary word-for-word)
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

  const resolvedTitle = resolveWhitePaperTitle({
    rawTitle: seo.seoTitle || title,
    pdfText,
  })
  seo.seoTitle = resolvedTitle
  seo.metaTitle = cleanWhitePaperTitle(seo.metaTitle || resolvedTitle).slice(0, 70)
  seo.ogTitle = cleanWhitePaperTitle(seo.ogTitle || resolvedTitle).slice(0, 70)

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
  INSIDE_SECTIONS_MIN,
  INSIDE_SECTIONS_MAX,
  resolveWhitePaperTitle,
  cleanWhitePaperTitle,
}
