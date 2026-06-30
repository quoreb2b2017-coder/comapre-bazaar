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
const SIDEBAR_LEAD_TEASER_CHARS = 400

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

function sidebarItemText(text: string, index: number): string {
  const max = index === 0 ? SIDEBAR_LEAD_TEASER_CHARS : SIDEBAR_TEASER_CHARS
  return teaserText(text, max)
}

function leadSidebarText(paper: WhitePaperContentFields): string {
  const sentences = collectOverviewSentences(paper)
  if (sentences.length >= 3) return sentences.slice(0, 3).join(' ')
  if (sentences.length) return sentences.join(' ')
  return whitePaperMainOverview(paper)
}

function enrichSidebarHighlights(
  highlights: WhitePaperSidebarHighlight[],
  paper: WhitePaperContentFields
): WhitePaperSidebarHighlight[] {
  if (!highlights.length) return highlights

  const lead = leadSidebarText(paper)
  const normalized = highlights.map((item, index) => ({
    title: item.title,
    text: sidebarItemText(item.text, index),
  }))

  if (!lead) return normalized

  const first = normalized[0]
  const weakLead = first.text.length < 200
  const genericTitle = /^topic \d+$/i.test(first.title) || /^key takeaway \d+$/i.test(first.title)

  normalized[0] = {
    title: genericTitle || !first.title ? 'What this report covers' : first.title,
    text: sidebarItemText(weakLead ? lead : first.text.length < lead.length ? lead : first.text, 0),
  }

  return normalized
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
    const isLead = highlights.length === 0

    if (summary && body && isLead) {
      const rich = [summary, ...sentenceList(body).slice(0, 2)].join(' ')
      highlights.push({ title, text: sidebarItemText(rich, 0) })
      continue
    }
    if (summary) {
      highlights.push({ title, text: sidebarItemText(summary, highlights.length) })
      continue
    }
    if (body) {
      highlights.push({ title, text: sidebarItemText(body, highlights.length) })
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
      highlights.push({ title, text: sidebarItemText(sentence, highlights.length) })
    }
  }

  return highlights.slice(0, SIDEBAR_HIGHLIGHT_MAX)
}

const HIGHLIGHT_LABELS = ['What this report covers', 'Key benchmark', 'How teams use it', "Who it's for"]

function highlightsFromSentences(sentences: string[]): WhitePaperSidebarHighlight[] {
  return sentences.slice(0, SIDEBAR_HIGHLIGHT_MAX).map((sentence, index) => ({
    title: HIGHLIGHT_LABELS[index] || `Insight ${index + 1}`,
    text: sidebarItemText(index === 0 ? sentences.slice(0, 3).join(' ') || sentence : sentence, index),
  }))
}

function highlightsFromQuestions(
  questions: { question: string }[],
  paper: WhitePaperContentFields
): WhitePaperSidebarHighlight[] {
  const sentences = collectOverviewSentences(paper)
  const highlights: WhitePaperSidebarHighlight[] = [
    {
      title: 'What this report covers',
      text: sidebarItemText(leadSidebarText(paper), 0),
    },
  ]

  const extraSentences = sentences.slice(3)
  for (let i = 1; i < SIDEBAR_HIGHLIGHT_MAX; i += 1) {
    const sentence = extraSentences[i - 1]
    if (sentence) {
      highlights.push({
        title: HIGHLIGHT_LABELS[i] || `Insight ${i + 1}`,
        text: sidebarItemText(sentence, i),
      })
      continue
    }
    const question = questions[i - 1]?.question
    if (!question) break
    highlights.push({
      title: question,
      text: sidebarItemText(question, i),
    })
  }

  return highlights.slice(0, SIDEBAR_HIGHLIGHT_MAX)
}

/** 3–4 short highlight blocks for the full description page (left column). */
export function whitePaperSidebarHighlights(paper: WhitePaperContentFields): WhitePaperSidebarHighlight[] {
  const sections = (paper.insideSections || []).filter((s) => s && (s.title || s.summary || s.body))
  if (sections.length) {
    const fromSections = highlightsFromSections(sections)
    if (fromSections.length >= SIDEBAR_HIGHLIGHT_MIN) {
      return enrichSidebarHighlights(fromSections, paper)
    }
  }

  const sentences = collectOverviewSentences(paper)
  if (sentences.length >= SIDEBAR_HIGHLIGHT_MIN) {
    return enrichSidebarHighlights(highlightsFromSentences(sentences), paper)
  }

  const points = (paper.insidePoints || []).map((p) => String(p || '').trim()).filter(Boolean)
  if (points.length >= SIDEBAR_HIGHLIGHT_MIN) {
    return enrichSidebarHighlights(
      points.slice(0, SIDEBAR_HIGHLIGHT_MAX).map((point, index) => ({
        title: HIGHLIGHT_LABELS[index] || `Insight ${index + 1}`,
        text: sidebarItemText(point, index),
      })),
      paper
    )
  }

  const questions = parseHighlightQuestions(paper.highlightQuestions)
  if (questions.length >= SIDEBAR_HIGHLIGHT_MIN) {
    return enrichSidebarHighlights(highlightsFromQuestions(questions, paper), paper)
  }

  const overviewText = whitePaperMainOverview(paper)
  if (overviewText) {
    return enrichSidebarHighlights(
      [
        {
          title: 'What this report covers',
          text: sidebarItemText(overviewText, 0),
        },
      ],
      paper
    )
  }

  return []
}
