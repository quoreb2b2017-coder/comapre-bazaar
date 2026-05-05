/** First-party cookie preferences + anonymous visitor id for Compare Bazaar (marketing site). */

export const CONSENT_COOKIE = 'cb_consent'
export const VISITOR_COOKIE = 'cb_vid'
export const CONSENT_VERSION = 1 as const

export type ConsentPreferences = {
  version: typeof CONSENT_VERSION
  necessary: true
  analytics: boolean
  marketing: boolean
  updatedAt: string
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const prefix = `${encodeURIComponent(name)}=`
  const parts = document.cookie.split(';')
  for (const part of parts) {
    const p = part.trim()
    if (p.startsWith(prefix)) {
      return decodeURIComponent(p.slice(prefix.length))
    }
  }
  return null
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === 'undefined') return
  const secure = typeof window !== 'undefined' && window.location?.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`
}

export function parseConsentCookie(): ConsentPreferences | null {
  const raw = readCookie(CONSENT_COOKIE)
  if (!raw) return null
  try {
    const v = JSON.parse(raw) as Partial<ConsentPreferences>
    if (v.version !== CONSENT_VERSION || v.necessary !== true) return null
    if (typeof v.analytics !== 'boolean' || typeof v.marketing !== 'boolean') return null
    if (typeof v.updatedAt !== 'string') return null
    return v as ConsentPreferences
  } catch {
    return null
  }
}

export function saveConsentCookie(preferences: Omit<ConsentPreferences, 'version' | 'necessary' | 'updatedAt'> & { updatedAt?: string }) {
  const full: ConsentPreferences = {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: preferences.analytics,
    marketing: preferences.marketing,
    updatedAt: preferences.updatedAt ?? new Date().toISOString(),
  }
  writeCookie(CONSENT_COOKIE, JSON.stringify(full), 180 * 24 * 60 * 60)
  return full
}

/** Stable anonymous id per browser; required for admin visitor metrics. */
export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return ''
  let id = readCookie(VISITOR_COOKIE)
  if (id && /^[a-zA-Z0-9_-]{12,64}$/.test(id)) return id
  id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 24)
      : `v${Date.now().toString(36)}${Math.random().toString(36).slice(2, 14)}`
  writeCookie(VISITOR_COOKIE, id, 400 * 24 * 60 * 60)
  return id
}

export function siteAnalyticsEndpoint(): string {
  const base =
    typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SITE_ANALYTICS_URL?.trim()
      ? String(process.env.NEXT_PUBLIC_SITE_ANALYTICS_URL).replace(/\/$/, '')
      : ''
  if (base) return `${base}/public/site-analytics/event`
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api/v1/blog-admin/public/site-analytics/event`
  }
  return '/api/v1/blog-admin/public/site-analytics/event'
}

export function isSiteAnalyticsEnabled(): boolean {
  const v = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SITE_ANALYTICS : ''
  if (v === '0' || v === 'false') return false
  return true
}

/** First-touch marketing attribution (90 days), only written when visitor allows marketing cookies. */
export const ATTRIBUTION_COOKIE = 'cb_attr'
const ATTR_VERSION = 1 as const
const EMAIL_DOMAIN_HINT_KEY = 'cb_email_domain_hint'
let inMemoryEmailDomainHint = ''

export type UtmBundle = {
  source: string
  medium: string
  campaign: string
  content: string
  term: string
}

type UrlSearch = {
  get: (key: string) => string | null
  forEach?: (callback: (value: string, key: string) => void) => void
} | null

export function utmFromSearchParams(sp: UrlSearch): UtmBundle {
  const g = (k: string) => sp?.get(k)?.trim().slice(0, 120) ?? ''
  return {
    source: g('utm_source'),
    medium: g('utm_medium'),
    campaign: g('utm_campaign'),
    content: g('utm_content'),
    term: g('utm_term'),
  }
}

type FtCookieShape = {
  v: typeof ATTR_VERSION
  ft: {
    path: string
    at: string
    src?: string
    med?: string
    camp?: string
    cnt?: string
    term?: string
  }
}

function parseAttrCookie(): FtCookieShape | null {
  const raw = readCookie(ATTRIBUTION_COOKIE)
  if (!raw) return null
  try {
    const p = JSON.parse(raw) as FtCookieShape
    if (p?.v !== ATTR_VERSION || !p.ft?.path || !p.ft?.at) return null
    return p
  } catch {
    return null
  }
}

/**
 * Lock first-touch landing + optional UTMs from the very first hit when cookie is created (90d).
 */
export function ensureFirstTouchAttribution(pathname: string, sessionUtm: UtmBundle): FtCookieShape['ft'] {
  const existing = parseAttrCookie()
  if (existing) return existing.ft

  const ft: FtCookieShape['ft'] = {
    path: pathname.slice(0, 512),
    at: new Date().toISOString(),
    ...(sessionUtm.source ? { src: sessionUtm.source } : {}),
    ...(sessionUtm.medium ? { med: sessionUtm.medium } : {}),
    ...(sessionUtm.campaign ? { camp: sessionUtm.campaign } : {}),
    ...(sessionUtm.content ? { cnt: sessionUtm.content } : {}),
    ...(sessionUtm.term ? { term: sessionUtm.term } : {}),
  }
  const payload: FtCookieShape = { v: ATTR_VERSION, ft }
  writeCookie(ATTRIBUTION_COOKIE, JSON.stringify(payload), 90 * 24 * 60 * 60)
  return ft
}

function deviceCategoryFromWidth(w: number): 'mobile' | 'tablet' | 'desktop' | 'unknown' {
  if (!w || w < 1) return 'unknown'
  if (w < 640) return 'mobile'
  if (w < 1024) return 'tablet'
  return 'desktop'
}

/** Payload stored on each page_view; UTMs + first-touch only when marketing cookies are allowed. */
/** Drop first-touch file when user turns off marketing cookies. */
export function clearMarketingAttributionCookie() {
  writeCookie(ATTRIBUTION_COOKIE, '', 0)
}

const EMAIL_SHAPED = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function extractEmailDomain(value: string): string {
  let s = String(value ?? '').trim()
  try {
    s = decodeURIComponent(s)
  } catch {
    /* keep raw */
  }
  if (!(s.length > 2 && s.length <= 320 && EMAIL_SHAPED.test(s))) return ''
  const at = s.lastIndexOf('@')
  if (at < 0) return ''
  const domain = s.slice(at + 1).trim().toLowerCase()
  if (!domain || domain.length > 120) return ''
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) return ''
  return domain
}

function readEmailDomainHint(): string {
  if (typeof window === 'undefined') return inMemoryEmailDomainHint
  try {
    const raw = window.sessionStorage.getItem(EMAIL_DOMAIN_HINT_KEY) || ''
    const fromStorage = raw.trim().toLowerCase().slice(0, 120)
    if (fromStorage) inMemoryEmailDomainHint = fromStorage
    return fromStorage || inMemoryEmailDomainHint
  } catch {
    return inMemoryEmailDomainHint
  }
}

function saveEmailDomainHint(domain: string) {
  const clean = String(domain || '').trim().toLowerCase().slice(0, 120)
  if (!clean) return
  inMemoryEmailDomainHint = clean
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(EMAIL_DOMAIN_HINT_KEY, clean)
  } catch {
    /* ignore */
  }
}

/** True if any query value looks like an email (prefill); never sends the value itself. */
export function hasEmailShapedQueryParam(searchParams: UrlSearch): boolean {
  if (!searchParams) return false
  try {
    return ['email', 'e', 'mail', 'user'].some((k) => {
      const d = extractEmailDomain(searchParams.get(k) ?? '')
      return !!d
    })
  } catch {
    return false
  }
}

/** Extracts only the domain from any email-like query param value, never returns the full email. */
export function emailDomainFromQueryParam(searchParams: UrlSearch): string {
  if (!searchParams) return ''
  const preferredKeys = ['email', 'e', 'mail', 'user']
  for (const key of preferredKeys) {
    const d = extractEmailDomain(searchParams.get(key) ?? '')
    if (d) return d
  }
  return ''
}

/** Store only domain derived from an email-like value, never the full email. */
export function rememberEmailDomainHintFromRaw(value: string): string {
  const domain = extractEmailDomain(value)
  if (domain) saveEmailDomainHint(domain)
  return domain
}

function viewportBucketFromWidth(w: number): string {
  if (!w || w < 1) return ''
  if (w < 475) return 'xs'
  if (w < 640) return 'sm'
  if (w < 768) return 'md'
  if (w < 1024) return 'lg'
  if (w < 1280) return 'xl'
  return '2xl'
}

function safeReferrerHostname(): string {
  if (typeof document === 'undefined' || !document.referrer) return ''
  try {
    return new URL(document.referrer).hostname.toLowerCase().slice(0, 120)
  } catch {
    return ''
  }
}

function detectPlatform(): string {
  if (typeof navigator === 'undefined') return ''
  const nd = navigator as Navigator & { userAgentData?: { platform?: string } }
  const p = nd.userAgentData?.platform ?? navigator.platform ?? ''
  return String(p).slice(0, 64)
}

function clientAnalyticsHints(
  searchParams: UrlSearch,
  viewportWidth: number
): Record<string, string | number | boolean> {
  const timeZone =
    typeof Intl !== 'undefined'
      ? String(Intl.DateTimeFormat().resolvedOptions().timeZone || '').slice(0, 64)
      : ''
  const languagesLabel =
    typeof navigator !== 'undefined'
      ? (navigator.languages?.length ? navigator.languages : [navigator.language])
          .filter(Boolean)
          .join(',')
          .slice(0, 120)
      : ''
  const primaryLanguage =
    typeof navigator !== 'undefined'
      ? String(navigator.languages?.[0] || navigator.language || '')
          .split(',')[0]
          .trim()
          .slice(0, 24)
      : ''

  let connectionEffectiveType = ''
  let connectionDownlink = 0
  if (typeof navigator !== 'undefined') {
    const nc = (navigator as Navigator & {
      connection?: { effectiveType?: string; downlink?: number }
    }).connection
    connectionEffectiveType = String(nc?.effectiveType || '').slice(0, 24)
    const dl = nc?.downlink
    if (typeof dl === 'number' && Number.isFinite(dl)) connectionDownlink = Math.min(1000, Math.max(0, dl))
  }

  const vw = viewportWidth || (typeof window !== 'undefined' ? window.innerWidth : 0)
  let screenWidth = 0
  let screenHeight = 0
  let pixelRatio = 0
  if (typeof window !== 'undefined' && window.screen) {
    screenWidth = Math.min(16384, Math.max(0, window.screen.width || 0))
    screenHeight = Math.min(16384, Math.max(0, window.screen.height || 0))
    pixelRatio = Math.min(16, Math.max(0, window.devicePixelRatio || 0))
  }

  const queryEmailDomain = emailDomainFromQueryParam(searchParams)

  return {
    timeZone,
    languagesLabel,
    primaryLanguage,
    connectionEffectiveType,
    connectionDownlink,
    emailPrefillHint: !!queryEmailDomain,
    viewportBucket: viewportBucketFromWidth(vw),
    screenWidth,
    screenHeight,
    pixelRatio,
    platform: detectPlatform(),
    referrerHost: safeReferrerHostname(),
  }
}

export function buildMarketingPayload(
  pathname: string,
  searchParams: UrlSearch,
  marketingAllowed: boolean
): Record<string, string | number | boolean> {
  const locale =
    typeof navigator !== 'undefined' ? String(navigator.language || '').slice(0, 48) : ''
  const vw = typeof window !== 'undefined' ? window.innerWidth : 0
  const deviceCategory = typeof window !== 'undefined' ? deviceCategoryFromWidth(vw) : 'unknown'

  const hints = clientAnalyticsHints(searchParams, vw)
  const queryEmailDomain = emailDomainFromQueryParam(searchParams)
  const rememberedEmailDomain = readEmailDomainHint()
  const effectiveEmailDomain = queryEmailDomain || rememberedEmailDomain
  const effectiveEmailHint = !!effectiveEmailDomain

  const base: Record<string, string | number | boolean> = {
    locale,
    deviceCategory,
    viewportWidth: vw,
    ...hints,
    emailPrefillHint: effectiveEmailHint,
    emailPrefillDomain: effectiveEmailDomain,
  }

  if (!marketingAllowed) return base

  const session = utmFromSearchParams(searchParams)
  const ft = ensureFirstTouchAttribution(pathname, session)

  return {
    ...base,
    utmSource: session.source,
    utmMedium: session.medium,
    utmCampaign: session.campaign,
    utmContent: session.content,
    utmTerm: session.term,
    ftSource: ft.src ?? '',
    ftMedium: ft.med ?? '',
    ftCampaign: ft.camp ?? '',
    ftContent: ft.cnt ?? '',
    ftTerm: ft.term ?? '',
    ftLandingPath: ft.path ?? '',
    ftAt: ft.at ?? '',
  }
}
