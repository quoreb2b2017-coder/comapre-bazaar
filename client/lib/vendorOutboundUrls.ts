const SITE_UTM_SOURCE = 'compare-bazaar'

type OutboundUtmParams = {
  campaign: string
  content?: string
  medium?: string
  term?: string
}

/** Append Compare Bazaar UTM params so vendor analytics show referral source. */
export function withCompareBazaarUtms(baseUrl: string, params: OutboundUtmParams): string {
  const url = new URL(baseUrl)
  url.searchParams.set('utm_source', SITE_UTM_SOURCE)
  url.searchParams.set('utm_medium', params.medium ?? 'referral')
  url.searchParams.set('utm_campaign', params.campaign)
  if (params.content) url.searchParams.set('utm_content', params.content)
  if (params.term) url.searchParams.set('utm_term', params.term)
  return url.toString()
}

const REMOTE_CAMPAIGN = 'remote-payroll'

/** Default Remote outbound link from product cards and review pages. */
export const REMOTE_VENDOR_OUTBOUND_URL = withCompareBazaarUtms('https://remote.com/', {
  campaign: REMOTE_CAMPAIGN,
  content: 'product-card',
})

/** Remote Impact affiliate — Get free quotes / get started only (not Visit website). */
export const REMOTE_GET_FREE_QUOTES_URL =
  'https://remote.com/lp/get-started?irclickid=V3aQ2yyMexyZUqyxnCRf6SLEUkuVVgSNPXUzUs0&utm_source=impact&utm_medium=affiliate&utm_mediapartner=Compare-Bazaar&utm_mediaid=&utm_adid=1349460&utm_partnerid=7319987&utm_campaign=&irgwc=1&afsrc=1'

export function remoteOutboundUrl(options?: {
  path?: string
  content?: string
  term?: string
}): string {
  const path = options?.path ?? '/'
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const base = normalizedPath === '/' ? 'https://remote.com/' : `https://remote.com${normalizedPath}`
  return withCompareBazaarUtms(base, {
    campaign: REMOTE_CAMPAIGN,
    content: options?.content ?? 'visit-website',
    term: options?.term,
  })
}
