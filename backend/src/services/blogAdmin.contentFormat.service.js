/**
 * Compare Bazaar blog field length standards (SEO + listing cards).
 * Enforced after AI generation and on admin save.
 */

const LIMITS = {
  metaTitle: { minChars: 50, maxChars: 60 },
  metaDescription: { minChars: 120, maxChars: 130 },
  excerpt: { minWords: 50, maxWords: 60 },
  heroTitle: { minChars: 50, maxChars: 60 },
  heroSubtitle: { minWords: 50, maxWords: 60 },
}

function countWords(text) {
  const t = String(text || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!t) return 0
  return t.split(/\s+/).filter(Boolean).length
}

function stripHtml(text) {
  return String(text || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function truncateWords(text, maxWords) {
  const words = stripHtml(text).split(/\s+/).filter(Boolean)
  if (words.length <= maxWords) return words.join(' ')
  return `${words.slice(0, maxWords).join(' ')}…`
}

function truncateChars(text, maxChars) {
  const t = String(text || '').trim()
  if (t.length <= maxChars) return t
  const cut = t.slice(0, maxChars)
  const lastSpace = cut.lastIndexOf(' ')
  if (lastSpace > maxChars * 0.7) return cut.slice(0, lastSpace).trim()
  return cut.trim()
}

function clampMetaTitle(raw) {
  return truncateChars(stripHtml(raw), LIMITS.metaTitle.maxChars)
}

function clampMetaDescription(raw) {
  return truncateChars(stripHtml(raw), LIMITS.metaDescription.maxChars)
}

function clampExcerpt(raw) {
  return truncateWords(raw, LIMITS.excerpt.maxWords)
}

function normalizeHeroSubtitleInHtml(html) {
  const re = /(<p[^>]*\bblog-hero-subtitle\b[^>]*>)([\s\S]*?)(<\/p>)/i
  const m = String(html || '').match(re)
  if (!m) return html
  const inner = stripHtml(m[2])
  const clamped = truncateWords(inner, LIMITS.heroSubtitle.maxWords)
  return String(html).replace(re, `$1${clamped}$3`)
}

function normalizeHeroTitleInHtml(html) {
  const re = /(<h1[^>]*\bblog-hero-title\b[^>]*>)([\s\S]*?)(<\/h1>)/i
  const m = String(html || '').match(re)
  if (!m) return html
  const inner = stripHtml(m[2])
  const clamped = truncateChars(inner, LIMITS.heroTitle.maxChars)
  return String(html).replace(re, `$1${clamped}$3`)
}

function extractHeroSubtitle(html) {
  const m = String(html || '').match(/<p[^>]*\bblog-hero-subtitle\b[^>]*>([\s\S]*?)<\/p>/i)
  return m ? stripHtml(m[1]) : ''
}

function fieldStatus(label, value, { minChars, maxChars, minWords, maxWords }) {
  const chars = String(value || '').length
  const words = countWords(value)
  let status = 'ok'
  let detail = ''

  if (maxChars != null) {
    detail = `${chars} chars (target ${minChars ?? '—'}–${maxChars})`
    if (chars > maxChars) status = 'error'
    else if (minChars != null && chars < minChars) status = 'warn'
  } else if (maxWords != null) {
    detail = `${words} words (target ${minWords ?? '—'}–${maxWords})`
    if (words > maxWords) status = 'error'
    else if (minWords != null && words < minWords) status = 'warn'
  }

  return { label, status, ok: status === 'ok', detail, chars, words }
}

/**
 * Normalize generated/saved blog fields to standard limits.
 */
function normalizeBlogFields({ title, content, metaTitle, metaDescription, excerpt }) {
  let nextContent = normalizeHeroTitleInHtml(content)
  nextContent = normalizeHeroSubtitleInHtml(nextContent)

  const titleMatch = nextContent.match(/<h1[^>]*>(.*?)<\/h1>/i)
  const extractedTitle = titleMatch ? stripHtml(titleMatch[1]) : title

  const heroSubtitle = extractHeroSubtitle(nextContent)
  let nextExcerpt = excerpt?.trim() ? excerpt : heroSubtitle
  if (!nextExcerpt?.trim()) {
    const plain = stripHtml(nextContent)
    nextExcerpt = truncateWords(plain, LIMITS.excerpt.maxWords)
  }

  return {
    title: truncateChars(extractedTitle || title, LIMITS.heroTitle.maxChars),
    content: nextContent,
    metaTitle: clampMetaTitle(metaTitle || extractedTitle || title),
    metaDescription: clampMetaDescription(metaDescription),
    excerpt: clampExcerpt(nextExcerpt),
  }
}

/** Validation report for admin UI (does not mutate). */
function validateBlogFormat({ title, content, metaTitle, metaDescription, excerpt }) {
  const heroSubtitle = extractHeroSubtitle(content)
  const titleFromH1 = (() => {
    const m = String(content || '').match(/<h1[^>]*>(.*?)<\/h1>/i)
    return m ? stripHtml(m[1]) : title
  })()

  const checks = [
    fieldStatus('Meta title', metaTitle, LIMITS.metaTitle),
    fieldStatus('Meta description', metaDescription, LIMITS.metaDescription),
    fieldStatus('Excerpt', excerpt || heroSubtitle, LIMITS.excerpt),
    fieldStatus('Hero subtitle', heroSubtitle, LIMITS.heroSubtitle),
    fieldStatus('Hero title (H1)', titleFromH1, LIMITS.heroTitle),
  ]

  return {
    ok: checks.every((c) => c.status !== 'error'),
    checks,
    limits: LIMITS,
  }
}

module.exports = {
  LIMITS,
  normalizeBlogFields,
  validateBlogFormat,
  clampMetaTitle,
  clampMetaDescription,
  clampExcerpt,
  countWords,
}
