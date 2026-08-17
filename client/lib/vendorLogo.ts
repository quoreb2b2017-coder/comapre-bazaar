import type { Product } from '@/types'

/** Curated logos when auto-resolution returns a weak favicon. */
const LOGO_OVERRIDES: Record<string, string> = {
  hubspot: 'https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png',
  'hubspot-email': 'https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png',
  nextiva: 'https://icons.duckduckgo.com/ip3/nextiva.com.ico',
  ringcentral: 'https://icons.duckduckgo.com/ip3/ringcentral.com.ico',
  ooma: 'https://icons.duckduckgo.com/ip3/ooma.com.ico',
  dialpad: 'https://icons.duckduckgo.com/ip3/dialpad.com.ico',
  adp: 'https://www.google.com/s2/favicons?domain=adp.com&sz=128',
  gusto: 'https://www.google.com/s2/favicons?domain=gusto.com&sz=128',
}

/** Affiliate / trial hosts that don't have their own favicon. */
const LOGO_DOMAIN_ALIASES: Record<string, string> = {
  'trial.nextiva.com': 'nextiva.com',
  'adppartner.partnerstack.com': 'adp.com',
  'get.gusto.com': 'gusto.com',
  'get.deel.com': 'deel.com',
  'get.papayaglobal.com': 'papayaglobal.com',
  'try.buddypunch.com': 'buddypunch.com',
}

const AFFILIATE_HOST_RE =
  /partnerstack|impact\.com|sjv\.io|shareasale|anrdoezrs|awin1|doubleclick|googleadservices|clickbank|cj\.com|growsumo/i

/** Product ids whose vendorUrl is an affiliate hop, not the real logo domain. */
const PRODUCT_CANONICAL_DOMAINS: Record<string, string> = {
  adp: 'adp.com',
  gusto: 'gusto.com',
  nextiva: 'nextiva.com',
  hubspot: 'hubspot.com',
  'hubspot-email': 'hubspot.com',
  'buddy-punch': 'buddypunch.com',
  'remote-payroll': 'remote.com',
  'bamboohr-payroll': 'bamboohr.com',
  onpay: 'onpay.com',
  'quickbooks-payroll': 'quickbooks.intuit.com',
  'rippling-payroll': 'rippling.com',
}

function googleFavicon(domain: string, size = 128): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`
}

/** Resolve the real brand domain even when vendorUrl is an affiliate hop. */
export function resolveProductLogoDomain(product: Pick<Product, 'id' | 'vendorUrl'>): string | null {
  const id = String(product.id || '').toLowerCase()
  if (PRODUCT_CANONICAL_DOMAINS[id]) return PRODUCT_CANONICAL_DOMAINS[id]
  if (id.startsWith('papaya')) return 'papayaglobal.com'
  if (id.startsWith('deel')) return 'deel.com'
  if (id.startsWith('remote')) return 'remote.com'
  if (id.startsWith('gusto')) return 'gusto.com'
  if (id.startsWith('adp')) return 'adp.com'
  if (id.startsWith('nextiva')) return 'nextiva.com'
  if (id.startsWith('buddy')) return 'buddypunch.com'
  return extractVendorDomain(product.vendorUrl || '')
}

const SKIP_SUBDOMAINS = new Set(['trial', 'go', 'app', 'www', 'login', 'get', 'my'])

export function normalizeVendorDomain(raw: string): string {
  const hostname = String(raw || '')
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .split('/')[0]
    .split('?')[0]
    .toLowerCase()
    .trim()

  if (!hostname) return ''

  if (LOGO_DOMAIN_ALIASES[hostname]) return LOGO_DOMAIN_ALIASES[hostname]
  if (AFFILIATE_HOST_RE.test(hostname)) return ''

  const parts = hostname.split('.')
  if (parts.length > 2 && SKIP_SUBDOMAINS.has(parts[0])) {
    return parts.slice(1).join('.')
  }

  return hostname
}

export function extractVendorDomain(vendorUrl: string): string | null {
  try {
    const hostname = new URL(vendorUrl).hostname
    const normalized = normalizeVendorDomain(hostname)
    return normalized || null
  } catch {
    return null
  }
}

/** Rewrite legacy Google favicon URLs to DuckDuckGo with a canonical domain. */
export function normalizeExternalLogoUrl(url: string): string | null {
  const trimmed = String(url || '').trim()
  if (!trimmed) return null

  const googleMatch = trimmed.match(/google\.com\/s2\/favicons\?domain=([^&]+)/i)
  if (googleMatch?.[1]) {
    const domain = normalizeVendorDomain(decodeURIComponent(googleMatch[1]))
    return domain ? duckDuckGoIcon(domain) : null
  }

  return trimmed
}

function duckDuckGoIcon(domain: string): string {
  return `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`
}

/** True for remote favicon/icon URLs that should bypass Next.js image optimization. */
export function isRemoteIconUrl(url: string): boolean {
  return /icons\.duckduckgo\.com|google\.com\/s2\/favicons|img\.logo\.dev/i.test(url)
}

/** Ordered logo sources — first loadable image wins in ProductLogo. */
export function getVendorLogoSources(product: Pick<Product, 'id' | 'vendorUrl' | 'logoUrl'>): string[] {
  const sources: string[] = []

  const customLogo = product.logoUrl ? normalizeExternalLogoUrl(product.logoUrl) : null
  if (customLogo) {
    sources.push(customLogo)
  }

  const override = LOGO_OVERRIDES[product.id]
  if (override) {
    sources.push(override)
  }

  const domain = resolveProductLogoDomain(product)
  if (!domain) return [...new Set(sources)]

  const logoDevToken = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN?.trim()
  if (logoDevToken) {
    sources.push(`https://img.logo.dev/${domain}?token=${logoDevToken}&size=128&format=png`)
  }

  sources.push(googleFavicon(domain, 128))
  sources.push(duckDuckGoIcon(domain))

  return [...new Set(sources)]
}
