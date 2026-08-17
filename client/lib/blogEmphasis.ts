/**
 * Bold key facts in blog HTML: prices, scores, and short verdict phrases.
 * Skips headings, links, existing <strong>, and brand chips.
 */

const SKIP_TAGS = new Set([
  'a',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'strong',
  'b',
  'code',
  'pre',
  'script',
  'style',
  'svg',
  'button',
  'figcaption',
])

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

const MAX_PHRASE_HITS = 2
const MAX_PRICE_HITS = 10
const MAX_SCORE_HITS = 8

function tokenize(html: string): string[] {
  return html.split(/(<[^>]+>|&[^;]+;)/g)
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function wrapStrong(value: string): string {
  return `<strong>${value}</strong>`
}

function convertMarkdownBold(html: string): string {
  return html.replace(/\*\*([^*]{2,80})\*\*/g, '<strong>$1</strong>')
}

function applyOnce(
  text: string,
  pattern: RegExp,
  remaining: { count: number },
): string {
  if (remaining.count <= 0) return text
  return text.replace(pattern, (match) => {
    if (remaining.count <= 0) return match
    remaining.count -= 1
    return wrapStrong(match)
  })
}

export function injectBlogEmphasis(html: string): string {
  if (!html) return html

  const withMarkdown = convertMarkdownBold(html)
  const tokens = tokenize(withMarkdown)
  const phraseHits = new Map<string, number>()
  const prices = { count: MAX_PRICE_HITS }
  const scores = { count: MAX_SCORE_HITS }
  const skipDepth: Record<string, number> = {}
  let insideHero = 0
  let insideChip = 0

  const bump = (tag: string, closing: boolean) => {
    if (!SKIP_TAGS.has(tag)) return
    skipDepth[tag] = Math.max(0, (skipDepth[tag] || 0) + (closing ? -1 : 1))
  }
  const insideSkip = () => Object.values(skipDepth).some((n) => n > 0)

  const result = tokens.map((token) => {
    if (token.startsWith('<')) {
      const tag = token.match(/^<\/?([a-z][a-z0-9]*)/i)?.[1]?.toLowerCase() ?? ''
      const closing = token.startsWith('</')
      if (tag === 'section' && /blog-hero-banner/i.test(token)) {
        insideHero += closing ? -1 : 1
      }
      if (/blog-brand-chip/i.test(token)) {
        insideChip += closing || token.endsWith('/>') ? -1 : 1
      }
      bump(tag, closing)
      return token
    }

    if (insideHero > 0 || insideChip > 0 || insideSkip()) return token
    if (token.startsWith('&')) return token

    let text = token

    text = applyOnce(
      text,
      /\$\s?\d{1,3}(?:,\d{3})*(?:\.\d+)?(?:\s*\/\s*(?:user|mo|month|yr|year|seat)(?:\s*\/\s*month)?)?/gi,
      prices,
    )
    text = applyOnce(text, /\b\d(?:\.\d)?\s*\/\s*5\b/g, scores)

    for (const phrase of VERDICT_PHRASES) {
      const used = phraseHits.get(phrase) || 0
      if (used >= MAX_PHRASE_HITS) continue
      const re = new RegExp(`(?<![\\w-])(${escapeRegExp(phrase)})(?![\\w-])`, 'i')
      const match = re.exec(text)
      if (!match) continue
      const before = text.slice(0, match.index)
      const matched = match[1]
      const after = text.slice(match.index + matched.length)
      phraseHits.set(phrase, used + 1)
      text = `${before}${wrapStrong(matched)}${after}`
    }

    return text
  })

  return result.join('')
}
