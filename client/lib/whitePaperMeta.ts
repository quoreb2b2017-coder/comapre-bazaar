import { defaultOgImageUrl, SITE_URL } from '@/lib/seo'

export const WHITEPAPER_DEFAULT_AUTHOR = 'Compare Bazaar Editorial'
export const WHITEPAPER_DEFAULT_OFFERED_BY = 'Compare Bazaar'

export function whitePaperAuthorName(metadata?: { author?: string; offeredBy?: string }): string {
  const author = String(metadata?.author || '').trim()
  if (author) return author
  return WHITEPAPER_DEFAULT_AUTHOR
}

export function whitePaperOfferedBy(metadata?: { offeredBy?: string }): string {
  const offeredBy = String(metadata?.offeredBy || '').trim()
  return offeredBy || WHITEPAPER_DEFAULT_OFFERED_BY
}

/** Absolute URL for Open Graph / social crawlers (whitepaper cover when available). */
export function whitePaperOgImageUrl(thumbnailUrl?: string | null): string {
  const thumb = String(thumbnailUrl || '').trim()
  if (!thumb) return defaultOgImageUrl()
  if (thumb.startsWith('http://') || thumb.startsWith('https://')) return thumb
  return `${SITE_URL}${thumb.startsWith('/') ? thumb : `/${thumb}`}`
}
