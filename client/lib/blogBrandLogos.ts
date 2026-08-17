import { comparisonPages } from '@/data/comparisons'
import { resolveProductLogoDomain } from '@/lib/vendorLogo'

export type BlogBrandMark = {
  names: string[]
  domain: string
  logoUrl: string
}

/** Always-on brand list so affiliate URLs cannot drop logos (ADP, OnPay, etc.). */
const CANONICAL_BRANDS: Array<{ names: string[]; domain: string }> = [
  { names: ['HubSpot CRM', 'HubSpot'], domain: 'hubspot.com' },
  { names: ['Salesforce Sales Cloud', 'Salesforce'], domain: 'salesforce.com' },
  { names: ['Zoho CRM', 'Zoho Payroll', 'Zoho'], domain: 'zoho.com' },
  { names: ['Pipedrive'], domain: 'pipedrive.com' },
  { names: ['Creatio'], domain: 'creatio.com' },
  { names: ['HoneyBook'], domain: 'honeybook.com' },
  { names: ['Nextiva'], domain: 'nextiva.com' },
  { names: ['RingCentral'], domain: 'ringcentral.com' },
  { names: ['Ooma'], domain: 'ooma.com' },
  { names: ['Dialpad'], domain: 'dialpad.com' },
  { names: ['Gusto'], domain: 'gusto.com' },
  { names: ['ADP Workforce Now', 'ADP Run', 'ADP'], domain: 'adp.com' },
  { names: ['Paychex'], domain: 'paychex.com' },
  { names: ['OnPay'], domain: 'onpay.com' },
  { names: ['Rippling'], domain: 'rippling.com' },
  { names: ['BambooHR'], domain: 'bamboohr.com' },
  { names: ['QuickBooks Workforce', 'QuickBooks Payroll', 'QuickBooks'], domain: 'quickbooks.intuit.com' },
  { names: ['Deel'], domain: 'deel.com' },
  { names: ['Remote'], domain: 'remote.com' },
  { names: ['Papaya Global Payroll', 'Papaya Global', 'Papaya EOR'], domain: 'papayaglobal.com' },
  { names: ['Buddy Punch'], domain: 'buddypunch.com' },
  { names: ['Patriot Payroll', 'Patriot'], domain: 'patriotsoftware.com' },
  { names: ['Mailchimp'], domain: 'mailchimp.com' },
  { names: ['Klaviyo'], domain: 'klaviyo.com' },
  { names: ['ActiveCampaign'], domain: 'activecampaign.com' },
  { names: ['GetResponse'], domain: 'getresponse.com' },
  { names: ['Campaign Monitor'], domain: 'campaignmonitor.com' },
  { names: ['Campaigner'], domain: 'campaigner.com' },
  { names: ['Wix'], domain: 'wix.com' },
  { names: ['GoDaddy'], domain: 'godaddy.com' },
  { names: ['Squarespace'], domain: 'squarespace.com' },
  { names: ['Bluehost'], domain: 'bluehost.com' },
  { names: ['Web.com'], domain: 'web.com' },
  { names: ['MochaHost'], domain: 'mochahost.com' },
  { names: ['Shopify'], domain: 'shopify.com' },
  { names: ['Slack'], domain: 'slack.com' },
  { names: ['Zoom'], domain: 'zoom.us' },
  { names: ['Xero'], domain: 'xero.com' },
  { names: ['Asana'], domain: 'asana.com' },
  { names: ['Trello'], domain: 'trello.com' },
  { names: ['Monday.com'], domain: 'monday.com' },
  { names: ['Jira'], domain: 'atlassian.com' },
  { names: ['Intercom'], domain: 'intercom.com' },
  { names: ['Zendesk'], domain: 'zendesk.com' },
  { names: ['Microsoft 365', 'Microsoft Teams'], domain: 'microsoft.com' },
  { names: ['Google Workspace', 'Google Ads'], domain: 'google.com' },
  { names: ['Stripe'], domain: 'stripe.com' },
  { names: ['Notion'], domain: 'notion.so' },
]

function duckDuckGoIcon(domain: string): string {
  return `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`
}

function googleBrandIcon(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`
}

function makeMark(names: string[], domain: string): BlogBrandMark {
  return {
    names: uniqueNames(...names),
    domain,
    logoUrl: googleBrandIcon(domain),
  }
}

function brandFallback(domain: string): string {
  return duckDuckGoIcon(domain)
}

function brandCoreName(name: string): string {
  return String(name || '')
    .replace(/\s+(CRM|HR|Payroll|Email|Sales Cloud|Website Builder|Phone|VoIP)$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function uniqueNames(...values: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const value of values) {
    const trimmed = String(value || '').trim()
    if (!trimmed || trimmed.length < 2) continue
    const key = trimmed.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(trimmed)
  }
  return out.sort((a, b) => b.length - a.length)
}

let cachedBrands: BlogBrandMark[] | null = null

export function getBlogBrandMarks(): BlogBrandMark[] {
  if (cachedBrands) return cachedBrands

  const byDomain = new Map<string, BlogBrandMark>()

  const add = (names: string[], domain: string) => {
    if (!domain || names.length === 0) return
    const existing = byDomain.get(domain)
    if (existing) {
      existing.names = uniqueNames(...existing.names, ...names)
      return
    }
    byDomain.set(domain, makeMark(names, domain))
  }

  for (const brand of CANONICAL_BRANDS) {
    add(brand.names, brand.domain)
  }

  for (const page of comparisonPages) {
    for (const product of page.products || []) {
      const domain = resolveProductLogoDomain(product) || ''
      if (!domain) continue
      add(uniqueNames(product.name, brandCoreName(product.name)), domain)
    }
  }

  cachedBrands = [...byDomain.values()].sort((a, b) => {
    const aLen = Math.max(...a.names.map((n) => n.length), 0)
    const bLen = Math.max(...b.names.map((n) => n.length), 0)
    return bLen - aLen
  })
  return cachedBrands
}

function isFalsePositiveBrand(name: string, afterText: string): boolean {
  if (name.toLowerCase() !== 'remote') return false
  return /^(teams?|workers?|employees?|work|staff|first|hires?|hiring|people|locations?|offices?|roles?|jobs?)\b/i.test(
    afterText.trimStart(),
  )
}

function brandNameFlags(name: string): string {
  const lower = name.toLowerCase()
  if (lower === 'remote' || lower === 'patriot' || lower === 'stripe') return ''
  return 'i'
}

function tokenize(html: string): string[] {
  return html.split(/(<[^>]+>|&[^;]+;)/g)
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function brandChip(name: string, domain: string, logoUrl: string, fallbackUrl: string): string {
  const safeName = name.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const safeSrc = logoUrl.replace(/"/g, '&quot;')
  const safeFallback = fallbackUrl.replace(/"/g, '&quot;')
  const safeDomain = domain.replace(/"/g, '&quot;')
  return `<span class="blog-brand-chip" data-brand="${safeDomain}"><img class="blog-brand-logo" src="${safeSrc}" data-fallback="${safeFallback}" alt="" width="16" height="16" loading="lazy" decoding="async" onerror="this.onerror=null;this.src=this.dataset.fallback||'';" />${safeName}</span>`
}

const SKIP_TAGS = new Set(['a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code', 'pre', 'script', 'style', 'svg', 'button', 'figcaption'])
const MAX_LOGOS_PER_BRAND = 4

function seedUsedFromExistingChips(html: string, used: Map<string, number>) {
  const re = /data-brand=["']([^"']+)["']/gi
  let match: RegExpExecArray | null
  while ((match = re.exec(html))) {
    const domain = match[1].toLowerCase()
    used.set(domain, (used.get(domain) || 0) + 1)
  }
}

function upgradeExistingBrandLogos(html: string): string {
  return html
    .replace(
      /(<img\b[^>]*class=["'][^"']*blog-brand-logo[^"']*["'][^>]*\ssrc=["'])https:\/\/icons\.duckduckgo\.com\/ip3\/([^"'>&]+)\.ico(["'])/gi,
      (_, pre, encoded, post) => {
        const domain = decodeURIComponent(encoded)
        return `${pre}${googleBrandIcon(domain)}${post}`
      },
    )
    .replace(/\swidth=["']18["']/gi, ' width="16"')
    .replace(/\sheight=["']18["']/gi, ' height="16"')
}

/** Wrap known vendor names with inline logos. Continues even if some chips already exist. */
export function injectBlogBrandLogos(html: string): string {
  if (!html) return html

  let next = html.includes('blog-brand-chip') ? upgradeExistingBrandLogos(html) : html
  const brands = getBlogBrandMarks()
  if (brands.length === 0) return next

  const tokens = tokenize(next)
  const used = new Map<string, number>()
  seedUsedFromExistingChips(next, used)
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

    let rest = token
    let built = ''
    let guard = 0
    while (rest && guard++ < 24) {
      let best: { index: number; length: number; brand: BlogBrandMark; matched: string } | null = null
      for (const brand of brands) {
        const count = used.get(brand.domain) || 0
        if (count >= MAX_LOGOS_PER_BRAND) continue
        for (const name of brand.names) {
          const re = new RegExp(`(?<![\\w-])(${escapeRegExp(name)})(?![\\w-])`, brandNameFlags(name))
          const match = re.exec(rest)
          if (!match) continue
          const matched = match[1]
          const afterText = rest.slice(match.index + matched.length)
          if (isFalsePositiveBrand(name, afterText)) continue
          if (
            !best ||
            match.index < best.index ||
            (match.index === best.index && matched.length > best.length)
          ) {
            best = { index: match.index, length: matched.length, brand, matched }
          }
        }
      }
      if (!best) break
      built += rest.slice(0, best.index)
      built += brandChip(best.matched, best.brand.domain, best.brand.logoUrl, brandFallback(best.brand.domain))
      rest = rest.slice(best.index + best.length)
      used.set(best.brand.domain, (used.get(best.brand.domain) || 0) + 1)
    }
    return built + rest
  })

  return result.join('')
}
