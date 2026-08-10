const { extractPdfText } = require('../utils/pdf-text')

const SECTION = (name) => new RegExp(`^===\\s*${name}\\s*===\\s*$`, 'im')

function extractSection(text, sectionName) {
  const lines = String(text || '').split(/\r?\n/)
  const marker = `=== ${sectionName} ===`
  let start = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().toUpperCase() === marker.toUpperCase()) {
      start = i + 1
      break
    }
  }
  if (start < 0) return ''

  const out = []
  for (let i = start; i < lines.length; i++) {
    const line = lines[i]
    if (/^===\s*.+\s*===$/.test(line.trim())) break
    out.push(line)
  }
  return out.join('\n').trim()
}

function parseJsonSection(text, sectionName, fallback) {
  const raw = extractSection(text, sectionName)
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function parseMarkdownTemplate(text, baseContent = {}) {
  const slug = extractSection(text, 'SLUG') || baseContent.slug || ''
  const content = {
    ...baseContent,
    slug: slug || baseContent.slug,
    title: extractSection(text, 'SEO TITLE') || baseContent.title || '',
    metaDescription: extractSection(text, 'META DESCRIPTION') || baseContent.metaDescription || '',
    canonical: extractSection(text, 'CANONICAL URL') || baseContent.canonical || '',
    h1: extractSection(text, 'H1') || baseContent.h1 || '',
    intro: extractSection(text, 'INTRO') || baseContent.intro || '',
    winnerSummary: extractSection(text, 'WINNER SUMMARY') || baseContent.winnerSummary || '',
    reviewer: extractSection(text, 'REVIEWER') || baseContent.reviewer || '',
    lastReviewed: extractSection(text, 'LAST REVIEWED') || baseContent.lastReviewed || '',
    ctaTitle: extractSection(text, 'CTA TITLE') || baseContent.ctaTitle || '',
    ctaBody: extractSection(text, 'CTA BODY') || baseContent.ctaBody || '',
    ctaSlug: extractSection(text, 'CTA LINK') || baseContent.ctaSlug || '',
    author: {
      ...(baseContent.author || {}),
      initials: extractSection(text, 'AUTHOR INITIALS') || baseContent.author?.initials || '',
      name: extractSection(text, 'AUTHOR NAME') || baseContent.author?.name || '',
      credential: extractSection(text, 'AUTHOR CREDENTIAL') || baseContent.author?.credential || '',
    },
    products: parseJsonSection(text, 'PRODUCTS (JSON)', baseContent.products || []),
    table: parseJsonSection(text, 'COMPARISON TABLE (JSON)', baseContent.table || { headers: [], rows: [] }),
    faqs: parseJsonSection(text, 'FAQS (JSON)', baseContent.faqs || []),
    tocItems: parseJsonSection(text, 'TABLE OF CONTENTS (JSON)', baseContent.tocItems || []),
  }

  const breadcrumbs = parseJsonSection(text, 'BREADCRUMBS (JSON)', null)
  if (breadcrumbs) content.breadcrumbs = breadcrumbs

  return content
}

function parseQuoteMarkdownTemplate(text, baseConfig = {}) {
  return {
    ...baseConfig,
    baseTitle: extractSection(text, 'SEO TITLE') || baseConfig.baseTitle || '',
    baseDescription: extractSection(text, 'META DESCRIPTION') || baseConfig.baseDescription || '',
    canonical: extractSection(text, 'CANONICAL URL') || baseConfig.canonical || '',
    baseH1: extractSection(text, 'H1') || baseConfig.baseH1 || '',
    vendorCategoryLabel: extractSection(text, 'VENDOR CATEGORY LABEL') || baseConfig.vendorCategoryLabel || '',
    vendorH1Category: extractSection(text, 'VENDOR H1 CATEGORY') || baseConfig.vendorH1Category || '',
    vendorTitleSuffix: extractSection(text, 'VENDOR TITLE SUFFIX') || baseConfig.vendorTitleSuffix || '',
  }
}

function buildComparisonMarkdownTemplate(content = {}) {
  const products = JSON.stringify(content.products || [], null, 2)
  const table = JSON.stringify(content.table || { headers: [], rows: [] }, null, 2)
  const faqs = JSON.stringify(content.faqs || [], null, 2)
  const toc = JSON.stringify(content.tocItems || [], null, 2)
  const breadcrumbs = JSON.stringify(content.breadcrumbs || [], null, 2)

  return `COMPARE BAZAAR — SERVICE PAGE TEMPLATE
Edit this file in Word, Google Docs, or any text editor, then upload as .docx, .pdf, .txt, or .md

=== SLUG ===
${content.slug || ''}

=== CANONICAL URL ===
${content.canonical || ''}

=== SEO TITLE ===
${content.title || ''}

=== META DESCRIPTION ===
${content.metaDescription || ''}

=== H1 ===
${content.h1 || ''}

=== INTRO ===
${content.intro || ''}

=== WINNER SUMMARY ===
${content.winnerSummary || ''}

=== AUTHOR INITIALS ===
${content.author?.initials || ''}

=== AUTHOR NAME ===
${content.author?.name || ''}

=== AUTHOR CREDENTIAL ===
${content.author?.credential || ''}

=== REVIEWER ===
${content.reviewer || ''}

=== LAST REVIEWED ===
${content.lastReviewed || ''}

=== CTA TITLE ===
${content.ctaTitle || ''}

=== CTA BODY ===
${content.ctaBody || ''}

=== CTA LINK ===
${content.ctaSlug || ''}

=== BREADCRUMBS (JSON) ===
${breadcrumbs}

=== PRODUCTS (JSON) ===
${products}

=== COMPARISON TABLE (JSON) ===
${table}

=== FAQS (JSON) ===
${faqs}

=== TABLE OF CONTENTS (JSON) ===
${toc}
`
}

function buildQuoteMarkdownTemplate(config = {}) {
  return `COMPARE BAZAAR — QUOTE PAGE TEMPLATE
Edit this file in Word, Google Docs, or any text editor, then upload as .docx, .pdf, .txt, or .md

=== CANONICAL URL ===
${config.canonical || ''}

=== SEO TITLE ===
${config.baseTitle || ''}

=== META DESCRIPTION ===
${config.baseDescription || ''}

=== H1 ===
${config.baseH1 || ''}

=== VENDOR CATEGORY LABEL ===
${config.vendorCategoryLabel || ''}

=== VENDOR H1 CATEGORY ===
${config.vendorH1Category || ''}

=== VENDOR TITLE SUFFIX ===
${config.vendorTitleSuffix || ''}
`
}

function normalizeComparisonContent(raw, slug, base = {}) {
  const content = { ...base, ...raw, slug: raw.slug || slug || base.slug }
  if (!content.author || typeof content.author !== 'object') {
    content.author = base.author || { initials: '', name: '', credential: '' }
  }
  if (!Array.isArray(content.products)) content.products = base.products || []
  if (!Array.isArray(content.faqs)) content.faqs = base.faqs || []
  if (!content.table || typeof content.table !== 'object') {
    content.table = base.table || { headers: [], rows: [] }
  }
  if (!Array.isArray(content.tocItems)) content.tocItems = base.tocItems || []
  if (!Array.isArray(content.breadcrumbs)) content.breadcrumbs = base.breadcrumbs || []
  return content
}

async function extractDocxText(buffer) {
  const mammoth = require('mammoth')
  const result = await mammoth.extractRawText({ buffer })
  return String(result?.value || '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function detectFileKind(file) {
  const name = String(file.originalname || '').toLowerCase()
  const mime = String(file.mimetype || '').toLowerCase()
  if (name.endsWith('.json') || mime.includes('json')) return 'json'
  if (name.endsWith('.md') || name.endsWith('.txt') || mime.includes('text/')) return 'markdown'
  if (name.endsWith('.docx') || mime.includes('wordprocessingml')) return 'docx'
  if (name.endsWith('.pdf') || mime.includes('pdf')) return 'pdf'
  return 'unknown'
}

async function importComparisonFile(file, { slug, baseContent = {} }) {
  const kind = detectFileKind(file)
  let text = ''

  if (kind === 'json') {
    const parsed = JSON.parse(file.buffer.toString('utf8'))
    const content = normalizeComparisonContent(parsed, slug, baseContent)
    return { content, source: 'json', warnings: [] }
  }

  if (kind === 'markdown') {
    text = file.buffer.toString('utf8')
  } else if (kind === 'pdf') {
    text = await extractPdfText(file.buffer, 120000)
    if (!text) throw new Error('Could not read text from PDF')
  } else if (kind === 'docx') {
    text = await extractDocxText(file.buffer)
    if (!text) throw new Error('Could not read text from Word document')
  } else {
    throw new Error('Unsupported file type. Upload .json, .md, .txt, .docx, or .pdf')
  }

  const content = normalizeComparisonContent(parseMarkdownTemplate(text, baseContent), slug, baseContent)
  const warnings = []
  if (!content.h1) warnings.push('H1 was not found — please fill the H1 section in the template')
  if (!content.title) warnings.push('SEO title was not found')
  if (!content.metaDescription) warnings.push('Meta description was not found')

  return { content, source: kind, warnings }
}

async function importQuoteFile(file, { pageKey, baseConfig = {} }) {
  const kind = detectFileKind(file)
  let text = ''

  if (kind === 'json') {
    const parsed = JSON.parse(file.buffer.toString('utf8'))
    return {
      config: { ...baseConfig, ...parsed, pageKey: pageKey || baseConfig.pageKey },
      source: 'json',
      warnings: [],
    }
  }

  if (kind === 'markdown') {
    text = file.buffer.toString('utf8')
  } else if (kind === 'pdf') {
    text = await extractPdfText(file.buffer, 50000)
    if (!text) throw new Error('Could not read text from PDF')
  } else if (kind === 'docx') {
    text = await extractDocxText(file.buffer)
    if (!text) throw new Error('Could not read text from Word document')
  } else {
    throw new Error('Unsupported file type. Upload .json, .md, .txt, .docx, or .pdf')
  }

  const config = parseQuoteMarkdownTemplate(text, baseConfig)
  const warnings = []
  if (!config.baseH1) warnings.push('H1 was not found in uploaded file')

  return { config, source: kind, warnings }
}

module.exports = {
  buildComparisonMarkdownTemplate,
  buildQuoteMarkdownTemplate,
  parseMarkdownTemplate,
  importComparisonFile,
  importQuoteFile,
}
