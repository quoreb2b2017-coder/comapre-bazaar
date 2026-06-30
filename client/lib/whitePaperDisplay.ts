import { cleanDisplayText } from '@/lib/cleanDisplayText'
import { parseHighlightQuestions } from '@/lib/highlightQuestions'

const DOMAIN_RE = /(?:https?:\/\/)?(?:www\.)?compare[-_\s]?bazaar(?:\.com)?/gi

/** Public whitepaper title — report name only, no compare-bazaar.com prefix. */
export function whitePaperDisplayTitle(title?: string, seoTitle?: string): string {
  const raw = String(seoTitle || title || '').trim()
  if (!raw) return ''

  let s = raw
    .replace(/©\s*\d{4}[^|]*/gi, ' ')
    .replace(/\ball rights reserved\b/gi, ' ')
    .replace(/^compare-bazaar\.com\s*[-–—|,:\s]+/i, '')
    .replace(DOMAIN_RE, ' ')
    .replace(/^[,:\s|]+/, '')
    .replace(/\s+/g, ' ')
    .trim()

  s = cleanDisplayText(s).replace(/^[,:\s|]+/, '').trim()
  return s.replace(/\s+\.\s*$/, '').slice(0, 180)
}

/** Short blurb for cards and listings. */
export function whitePaperDisplayDescription(paper: {
  description?: string
  metaDescription?: string
  structuredSeoContent?: string
}): string {
  return whitePaperFullDescription(paper).slice(0, 220)
}

export type WhitePaperContentFields = {
  description?: string
  metaDescription?: string
  structuredSeoContent?: string
  insideOverview?: string
  insideSections?: { title?: string; summary?: string; body?: string }[]
  insidePoints?: string[]
  highlightQuestions?: unknown
}

/** Full public description — overview, body, or SEO fallbacks (no truncation). */
export function whitePaperFullDescription(paper: WhitePaperContentFields): string {
  const raw =
    String(paper.insideOverview || '').trim() ||
    String(paper.description || '').trim() ||
    String(paper.metaDescription || '').trim() ||
    String(paper.structuredSeoContent || '').trim()
  return cleanDisplayText(raw)
}

const SIDEBAR_HIGHLIGHT_MAX = 4
const SIDEBAR_HIGHLIGHT_MIN = 3
const SIDEBAR_TEASER_CHARS = 145

function normKey(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim()
}

function isDuplicateText(candidate: string, existing: string[]): boolean {
  const key = normKey(candidate)
  if (!key) return true
  return existing.some((item) => {
    const other = normKey(item)
    if (!other) return false
    if (key === other) return true
    if (key.length > 40 && other.length > 40 && (key.includes(other) || other.includes(key))) return true
    return key.slice(0, 72) === other.slice(0, 72)
  })
}

function teaserText(text: string, max = SIDEBAR_TEASER_CHARS): string {
  const cleaned = cleanDisplayText(text).trim()
  if (!cleaned || cleaned.length <= max) return cleaned
  const cut = cleaned.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  const trimmed = lastSpace > max * 0.55 ? cut.slice(0, lastSpace) : cut
  return `${trimmed.trim()}…`
}

function sentenceList(text: string): string[] {
  return text.match(/[^.!?]+[.!?]+/g)?.map((s) => s.trim()).filter(Boolean) || []
}

const OVERVIEW_LINE_MIN = 3
const OVERVIEW_LINE_MAX = 4

function pushUniqueSentence(sentences: string[], text: string) {
  const cleaned = cleanDisplayText(text).trim()
  if (!cleaned || isDuplicateText(cleaned, sentences)) return
  sentences.push(cleaned)
}

function collectOverviewSentences(paper: WhitePaperContentFields): string[] {
  const sentences: string[] = []

  const addSentences = (text: string) => {
    for (const sentence of sentenceList(text)) {
      if (sentences.length >= OVERVIEW_LINE_MAX) return
      pushUniqueSentence(sentences, sentence)
    }
  }

  if (paper.insideOverview) addSentences(paper.insideOverview)
  if (sentences.length < OVERVIEW_LINE_MAX && paper.description) addSentences(paper.description)
  if (sentences.length < OVERVIEW_LINE_MAX && paper.structuredSeoContent) {
    addSentences(paper.structuredSeoContent)
  }
  if (sentences.length < OVERVIEW_LINE_MAX && paper.metaDescription) {
    addSentences(paper.metaDescription)
  }

  for (const section of paper.insideSections || []) {
    if (sentences.length >= OVERVIEW_LINE_MAX) break
    const summary = cleanDisplayText(String(section.summary || '').trim())
    const body = cleanDisplayText(String(section.body || '').trim())
    if (summary) addSentences(summary)
    else if (body) addSentences(body)

    if (sentences.length < OVERVIEW_LINE_MIN && body) {
      for (const sentence of sentenceList(body)) {
        if (sentences.length >= OVERVIEW_LINE_MAX) break
        pushUniqueSentence(sentences, sentence)
      }
    }
  }

  if (sentences.length < OVERVIEW_LINE_MIN) {
    for (const point of paper.insidePoints || []) {
      if (sentences.length >= OVERVIEW_LINE_MAX) break
      addSentences(String(point || ''))
    }
  }

  if (sentences.length < OVERVIEW_LINE_MIN) {
    for (const item of parseHighlightQuestions(paper.highlightQuestions)) {
      if (sentences.length >= OVERVIEW_LINE_MAX) break
      pushUniqueSentence(sentences, item.question)
    }
  }

  return sentences
}

/** One main overview block — 3–4 lines merged into a single paragraph. */
export function whitePaperMainOverview(paper: WhitePaperContentFields): string {
  const sentences = collectOverviewSentences(paper)
  if (!sentences.length) return whitePaperFullDescription(paper)
  return sentences.slice(0, OVERVIEW_LINE_MAX).join(' ')
}

/** Full description page overview (single paragraph). */
export function whitePaperOverviewParagraphs(paper: WhitePaperContentFields): string[] {
  const main = whitePaperMainOverview(paper)
  return main ? [main] : []
}

export type WhitePaperSidebarHighlight = { title: string; text: string }

function highlightsFromSections(
  sections: { title?: string; summary?: string; body?: string }[]
): WhitePaperSidebarHighlight[] {
  const highlights: WhitePaperSidebarHighlight[] = []

  for (const [index, section] of sections.entries()) {
    if (highlights.length >= SIDEBAR_HIGHLIGHT_MAX) break
    const title = cleanDisplayText(String(section.title || `Section ${index + 1}`).trim())
    const summary = cleanDisplayText(String(section.summary || '').trim())
    const body = cleanDisplayText(String(section.body || '').trim())

    if (summary) {
      highlights.push({ title, text: teaserText(summary) })
      continue
    }
    if (body) {
      highlights.push({ title, text: teaserText(body) })
    }
  }

  if (highlights.length >= SIDEBAR_HIGHLIGHT_MIN) {
    return highlights.slice(0, SIDEBAR_HIGHLIGHT_MAX)
  }

  for (const [index, section] of sections.entries()) {
    if (highlights.length >= SIDEBAR_HIGHLIGHT_MAX) break
    const title = cleanDisplayText(String(section.title || `Section ${index + 1}`).trim())
    const body = cleanDisplayText(String(section.body || '').trim())
    for (const sentence of sentenceList(body)) {
      if (highlights.length >= SIDEBAR_HIGHLIGHT_MAX) break
      if (isDuplicateText(sentence, highlights.map((item) => item.text))) continue
      highlights.push({ title, text: teaserText(sentence) })
    }
  }

  return highlights.slice(0, SIDEBAR_HIGHLIGHT_MAX)
}

const HIGHLIGHT_LABELS = ['Why it matters', 'What you get', 'How to use it', "Who it's for"]

/** 3–4 short highlight blocks for the full description page (left column). */
export function whitePaperSidebarHighlights(paper: WhitePaperContentFields): WhitePaperSidebarHighlight[] {
  const sections = (paper.insideSections || []).filter((s) => s && (s.title || s.summary || s.body))
  if (sections.length) {
    const fromSections = highlightsFromSections(sections)
    if (fromSections.length >= SIDEBAR_HIGHLIGHT_MIN) return fromSections
  }

  const points = (paper.insidePoints || []).map((p) => String(p || '').trim()).filter(Boolean)
  if (points.length >= SIDEBAR_HIGHLIGHT_MIN) {
    return points.slice(0, SIDEBAR_HIGHLIGHT_MAX).map((point, index) => ({
      title: `Key takeaway ${index + 1}`,
      text: teaserText(point),
    }))
  }

  const questions = parseHighlightQuestions(paper.highlightQuestions)
  if (questions.length >= SIDEBAR_HIGHLIGHT_MIN) {
    return questions.slice(0, SIDEBAR_HIGHLIGHT_MAX).map((item, index) => ({
      title: `Topic ${index + 1}`,
      text: teaserText(item.question),
    }))
  }

  const overviewText = whitePaperOverviewParagraphs(paper).join(' ')
  const sentences = sentenceList(overviewText)

  if (sentences.length >= SIDEBAR_HIGHLIGHT_MIN) {
    return sentences.slice(0, SIDEBAR_HIGHLIGHT_MAX).map((sentence, index) => ({
      title: HIGHLIGHT_LABELS[index] || `Highlight ${index + 1}`,
      text: teaserText(sentence),
    }))
  }

  const overviewParas = whitePaperOverviewParagraphs(paper)
  if (overviewParas[0] && overviewParas[0].length > 180) {
    const words = overviewParas[0].split(/\s+/)
    const chunkSize = Math.max(12, Math.ceil(words.length / SIDEBAR_HIGHLIGHT_MAX))
    const highlights: WhitePaperSidebarHighlight[] = []
    for (let i = 0; i < SIDEBAR_HIGHLIGHT_MAX && i * chunkSize < words.length; i += 1) {
      highlights.push({
        title: HIGHLIGHT_LABELS[i] || `Point ${i + 1}`,
        text: teaserText(words.slice(i * chunkSize, (i + 1) * chunkSize).join(' ')),
      })
    }
    if (highlights.length >= SIDEBAR_HIGHLIGHT_MIN) return highlights
  }

  return overviewParas.slice(0, SIDEBAR_HIGHLIGHT_MAX).map((paragraph, index) => ({
    title: index === 0 ? 'Overview' : `Insight ${index + 1}`,
    text: teaserText(paragraph),
  }))
}
