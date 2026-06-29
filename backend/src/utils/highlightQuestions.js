const HIGHLIGHT_QUESTIONS_MAX = 20
const HIGHLIGHT_OPTIONS_MAX = 15

function normalizeHighlightQuestionItem(raw) {
  if (typeof raw === 'string') {
    const question = raw.trim()
    return question ? { question, options: [] } : null
  }
  if (raw && typeof raw === 'object') {
    const question = String(raw.question || raw.text || '').trim()
    if (!question) return null
    const options = Array.isArray(raw.options)
      ? raw.options.map((o) => String(o || '').trim()).filter(Boolean).slice(0, HIGHLIGHT_OPTIONS_MAX)
      : []
    return { question, options }
  }
  return null
}

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
  return arr.map(normalizeHighlightQuestionItem).filter(Boolean).slice(0, HIGHLIGHT_QUESTIONS_MAX)
}

function isDropdownQuestion(item) {
  return Array.isArray(item?.options) && item.options.length >= 2
}

function validateHighlightAnswer(item, answer) {
  const value = String(answer || '').trim()
  if (!value) return { ok: false, message: `Please answer: ${item.question}` }
  if (isDropdownQuestion(item) && !item.options.includes(value)) {
    return { ok: false, message: `Please select a valid option for: ${item.question}` }
  }
  return { ok: true, answer: value }
}

module.exports = {
  HIGHLIGHT_QUESTIONS_MAX,
  HIGHLIGHT_OPTIONS_MAX,
  parseHighlightQuestions,
  normalizeHighlightQuestionItem,
  isDropdownQuestion,
  validateHighlightAnswer,
}
