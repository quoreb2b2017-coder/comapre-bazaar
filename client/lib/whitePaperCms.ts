import { cmsBackendBase } from '@/lib/cmsBackendBase'

export function whitePaperBackendBase(): string {
  return cmsBackendBase()
}

export type WhitePaperPublic = {
  slug: string
  title: string
  seoTitle: string
  description: string
  structuredSeoContent?: string
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
  ogTitle?: string
  ogDescription?: string
  thumbnailUrl: string
  pdfUrl?: string
  viewCount?: number
  metadata?: {
    offeredBy?: string
    author?: string
    category?: string
    extra?: string
  }
  insideOverview?: string
  insideSections?: { title: string; summary: string; body?: string; pages?: string }[]
  insidePoints?: string[]
  highlightQuestions?: string[]
  testimonialsHeading?: string
  testimonials?: {
    quote: string
    name: string
    initials: string
    role: string
    company: string
  }[]
  publishedAt?: string
}

const REVALIDATE = 120

export async function fetchPublishedWhitePapers(): Promise<WhitePaperPublic[]> {
  const url = `${whitePaperBackendBase()}/api/v1/blog-admin/public/whitepapers`
  try {
    const res =
      process.env.NODE_ENV === 'development'
        ? await fetch(url, { cache: 'no-store', headers: { Accept: 'application/json' } })
        : await fetch(url, { next: { revalidate: REVALIDATE }, headers: { Accept: 'application/json' } })
    if (!res.ok) return []
    const json = await res.json()
    if (!json?.success || !Array.isArray(json.data)) return []
    return json.data as WhitePaperPublic[]
  } catch {
    return []
  }
}

export async function fetchWhitePaperBySlug(slug: string): Promise<WhitePaperPublic | null> {
  const safe = encodeURIComponent(slug)
  const url = `${whitePaperBackendBase()}/api/v1/blog-admin/public/whitepapers/${safe}`
  try {
    const res =
      process.env.NODE_ENV === 'development'
        ? await fetch(url, { cache: 'no-store', headers: { Accept: 'application/json' } })
        : await fetch(url, { next: { revalidate: REVALIDATE }, headers: { Accept: 'application/json' } })
    if (!res.ok) return null
    const json = await res.json()
    if (!json?.success || !json.data) return null
    return json.data as WhitePaperPublic
  } catch {
    return null
  }
}
