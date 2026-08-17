const SKIP_TAGS = new Set(['a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'b', 'code', 'pre', 'script', 'style', 'svg', 'button'])

const VERDICT_PHRASES = [
  'best overall pick',
  'best overall',
  'top pick',
  'best value',
  'best for small business',
  'best for growing teams',
  'starting price',
  'free plan',
  'free trial',
  'our recommendation',
  'not a fit',
  'billed annually',
  'per user per month',
  'hands-on testing',
].sort((a, b) => b.length - a.length)

function tokenize(html) {
  return String(html || '').split(/(<[^>]+>|&[^;]+;)/g)
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function wrapStrong(value) {
  return `<strong>${value}</strong>`
}

function applyLimited(text, pattern, remaining) {
  if (remaining.count <= 0) return text
  return text.replace(pattern, (match) => {
    if (remaining.count <= 0) return match
    remaining.count -= 1
    return wrapStrong(match)
  })
}

function injectBlogEmphasis(html) {
  if (!html) return html
  const withMarkdown = String(html).replace(/\*\*([^*]{2,80})\*\*/g, '<strong>$1</strong>')
  const tokens = tokenize(withMarkdown)
  const phraseHits = new Map()
  const prices = { count: 10 }
  const scores = { count: 8 }
  const skipDepth = {}
  let insideHero = 0
  let insideChip = 0

  const bump = (tag, closing) => {
    if (!SKIP_TAGS.has(tag)) return
    skipDepth[tag] = Math.max(0, (skipDepth[tag] || 0) + (closing ? -1 : 1))
  }
  const insideSkip = () => Object.values(skipDepth).some((n) => n > 0)

  const result = tokens.map((token) => {
    if (token.startsWith('<')) {
      const tag = token.match(/^<\/?([a-z][a-z0-9]*)/i)?.[1]?.toLowerCase() || ''
      const closing = token.startsWith('</')
      if (tag === 'section' && /blog-hero-banner/i.test(token)) insideHero += closing ? -1 : 1
      if (/blog-brand-chip/i.test(token)) insideChip += closing || token.endsWith('/>') ? -1 : 1
      bump(tag, closing)
      return token
    }
    if (insideHero > 0 || insideChip > 0 || insideSkip() || token.startsWith('&')) return token

    let text = applyLimited(
      token,
      /\$\s?\d{1,3}(?:,\d{3})*(?:\.\d+)?(?:\s*\/\s*(?:user|mo|month|yr|year|seat)(?:\s*\/\s*month)?)?/gi,
      prices,
    )
    text = applyLimited(text, /\b\d(?:\.\d)?\s*\/\s*5\b/g, scores)

    for (const phrase of VERDICT_PHRASES) {
      const used = phraseHits.get(phrase) || 0
      if (used >= 2) continue
      const re = new RegExp(`(?<![\\w-])(${escapeRegExp(phrase)})(?![\\w-])`, 'i')
      const match = re.exec(text)
      if (!match) continue
      phraseHits.set(phrase, used + 1)
      text = `${text.slice(0, match.index)}${wrapStrong(match[1])}${text.slice(match.index + match[1].length)}`
    }
    return text
  })

  return result.join('')
}

module.exports = { injectBlogEmphasis }
