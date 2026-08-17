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

export function whitePaperPublicShareUrl(slug: string): string {
  const safe = encodeURIComponent(String(slug || '').trim())
  return `${SITE_URL}/resources/whitepapers/${safe}`
}

/** 1200×630 card used by LinkedIn, Facebook, WhatsApp, and Instagram link stickers. */
export function whitePaperOpenGraphImagePath(slug: string): string {
  const safe = encodeURIComponent(String(slug || '').trim())
  return `/resources/whitepapers/${safe}/opengraph-image`
}

function cloudinaryLandscapePreview(url: string): string | null {
  if (!/res\.cloudinary\.com/i.test(url) || !url.includes('/upload/')) return null
  if (url.includes('w_1200,h_630')) return url
  return url.replace('/upload/', '/upload/w_1200,h_630,c_pad,b_rgb:0B2A6F,f_jpg,q_85/')
}

/** Absolute URL for Open Graph / social crawlers — 1200×630 share card when slug is known. */
export function whitePaperOgImageUrl(thumbnailUrl?: string | null, slug?: string): string {
  if (slug) return `${SITE_URL}${whitePaperOpenGraphImagePath(slug)}`
  const thumb = String(thumbnailUrl || '').trim()
  const cloudinary = thumb ? cloudinaryLandscapePreview(thumb) : null
  if (cloudinary) return cloudinary
  if (!thumb) return defaultOgImageUrl()
  if (thumb.startsWith('http://') || thumb.startsWith('https://')) return thumb
  return `${SITE_URL}${thumb.startsWith('/') ? thumb : `/${thumb}`}`
}
