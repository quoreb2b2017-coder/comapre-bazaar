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

const DOWNLOAD_FIELD_KEYS = [
  'firstName',
  'lastName',
  'jobTitle',
  'workPhone',
  'companyStreet',
  'companySuite',
  'companyPostal',
  'companyCity',
  'companyState',
  'companyCountry',
]

const DEFAULT_DOWNLOAD_FORM_FIELDS = [
  { label: 'Zip/Postal Code', key: 'companyPostal', inputType: 'text', required: true },
  { label: 'Phone', key: 'workPhone', inputType: 'tel', required: true },
]

const DEFAULT_DOWNLOAD_CONSENT = {
  emailNote:
    'Company email only. Not Gmail, Yahoo, Outlook, or other personal addresses.',
  termsText:
    "I agree to Compare Bazaar's {{terms}}, {{privacy}}, and the transfer of my information to the United States for processing to provide me with relevant information as described in our {{privacy}}.",
  partnersText:
    'I agree to my information being processed by Compare Bazaar and its partners to contact me via phone, email or other means regarding information relevant to my professional interests. I may {{unsubscribe}} at any time.',
  optOutText:
    '**Optional:** check this box only if you want to **opt out of further emails** from Compare Bazaar. Leave it unchecked to keep receiving relevant updates. Read our {{privacy-statement}}.',
  footerText: 'I have read and understood privacy statement of {{publisher}}.',
  showTerms: true,
  showPartners: true,
  showOptOut: true,
}

function clipConsent(value, max, fallback) {
  const text = String(value || '').trim().slice(0, max)
  return text || fallback
}

function flagConsent(value, fallback) {
  if (value === false || value === 'false') return false
  if (value === true || value === 'true') return true
  return fallback
}

function parseConsentExtra(raw) {
  if (!Array.isArray(raw)) return []
  const out = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const text = String(item.text || '').trim().slice(0, 800)
    if (!text) continue
    out.push({
      text,
      required: item.required !== false && item.required !== 'false',
    })
    if (out.length >= 8) break
  }
  return out
}

function parseDownloadConsent(raw) {
  let src = raw
  if (typeof raw === 'string') {
    try {
      src = JSON.parse(raw)
    } catch {
      src = null
    }
  }
  const item = src && typeof src === 'object' ? src : {}
  return {
    emailNote: clipConsent(item.emailNote, 400, DEFAULT_DOWNLOAD_CONSENT.emailNote),
    termsText: clipConsent(item.termsText, 800, DEFAULT_DOWNLOAD_CONSENT.termsText),
    partnersText: clipConsent(item.partnersText, 800, DEFAULT_DOWNLOAD_CONSENT.partnersText),
    optOutText: clipConsent(item.optOutText, 800, DEFAULT_DOWNLOAD_CONSENT.optOutText),
    footerText: clipConsent(item.footerText, 400, DEFAULT_DOWNLOAD_CONSENT.footerText),
    showTerms: flagConsent(item.showTerms, true),
    showPartners: flagConsent(item.showPartners, true),
    showOptOut: flagConsent(item.showOptOut, true),
    extra: parseConsentExtra(item.extra),
  }
}

function parseDownloadFormFields(raw, { useDefault = true } = {}) {
  if (raw == null || raw === '') return useDefault ? DEFAULT_DOWNLOAD_FORM_FIELDS : []
  let arr = raw
  if (typeof raw === 'string') {
    try {
      arr = JSON.parse(raw)
    } catch {
      return useDefault ? DEFAULT_DOWNLOAD_FORM_FIELDS : []
    }
  }
  if (!Array.isArray(arr) || arr.length === 0) return useDefault ? DEFAULT_DOWNLOAD_FORM_FIELDS : []
  const seen = new Set()
  const out = []
  for (const item of arr) {
    if (!item || typeof item !== 'object') continue
    const key = String(item.key || '').trim()
    const label = String(item.label || '').trim().slice(0, 80)
    if (!DOWNLOAD_FIELD_KEYS.includes(key) || !label || seen.has(key)) continue
    seen.add(key)
    const inputType = ['text', 'tel', 'email'].includes(item.inputType) ? item.inputType : 'text'
    out.push({
      label,
      key,
      inputType,
      required: item.required !== false && item.required !== 'false',
    })
    if (out.length >= 12) break
  }
  if (!out.length) return useDefault ? DEFAULT_DOWNLOAD_FORM_FIELDS : []
  return out
}

module.exports = {
  HIGHLIGHT_QUESTIONS_MAX,
  HIGHLIGHT_OPTIONS_MAX,
  DOWNLOAD_FIELD_KEYS,
  DEFAULT_DOWNLOAD_FORM_FIELDS,
  DEFAULT_DOWNLOAD_CONSENT,
  parseHighlightQuestions,
  parseDownloadFormFields,
  parseDownloadConsent,
  normalizeHighlightQuestionItem,
  isDropdownQuestion,
  validateHighlightAnswer,
}
