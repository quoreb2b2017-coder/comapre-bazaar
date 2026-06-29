export type HighlightQuestion = {
  question: string
  options: string[]
}

export const HIGHLIGHT_QUESTIONS_MAX = 20
export const HIGHLIGHT_OPTIONS_MAX = 15

export function normalizeHighlightQuestion(raw: unknown): HighlightQuestion | null {
  if (typeof raw === 'string') {
    const question = raw.trim()
    return question ? { question, options: [] } : null
  }
  if (raw && typeof raw === 'object') {
    const item = raw as { question?: string; text?: string; options?: unknown[] }
    const question = String(item.question || item.text || '').trim()
    if (!question) return null
    const options = Array.isArray(item.options)
      ? item.options.map((o) => String(o || '').trim()).filter(Boolean).slice(0, HIGHLIGHT_OPTIONS_MAX)
      : []
    return { question, options }
  }
  return null
}

export function parseHighlightQuestions(raw: unknown): HighlightQuestion[] {
  if (raw == null || raw === '') return []
  let arr: unknown = raw
  if (typeof raw === 'string') {
    try {
      arr = JSON.parse(raw)
    } catch {
      return []
    }
  }
  if (!Array.isArray(arr)) return []
  return arr.map(normalizeHighlightQuestion).filter(Boolean).slice(0, HIGHLIGHT_QUESTIONS_MAX) as HighlightQuestion[]
}

export function isDropdownQuestion(item: HighlightQuestion) {
  return item.options.length >= 2
}

export function emptyHighlightQuestion(): HighlightQuestion {
  return { question: '', options: [] }
}
