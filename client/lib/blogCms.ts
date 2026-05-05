import { pickTopicCoverUrl, resolveBlogCoverUrl } from '@/lib/blogTopicCovers'

/** Server-side base URL for Express (not the browser). Production must set this to your API host. */
export function blogCmsBackendBase(): string {
  const raw = process.env.BLOG_CMS_BACKEND_URL || process.env.BACKEND_URL || 'http://127.0.0.1:5000'
  return raw.replace(/\/$/, '')
}

const REVALIDATE_SECONDS = 120

export type CmsBlogSummary = {
  slug: string
  title: string
  excerpt: string
  publishedAt: string | Date | undefined
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
  tags?: string[]
  topic?: string
  readingTime?: number
  /** Total public article visits (optional until backend migrated). */
  viewCount?: number
}

export type CmsBlogDetail = CmsBlogSummary & {
  content: string
  updatedAt?: string | Date
  approvedAt?: string | Date
}

/** Slug-only fallback for legacy callers (generic editorial rotation). */
export function blogCardCoverUrl(slug: string): string {
  return pickTopicCoverUrl({ slug })
}

const STRIP_PAIRS: readonly [string, string][] = [
  ['#0B2A6F', '#1D4ED8'],
  ['#F58220', '#D97706'],
  ['#0f766e', '#14b8a6'],
  ['#7c3aed', '#a78bfa'],
  ['#be123c', '#fb7185'],
]

export function stripGradientForSlug(slug: string): { stripFrom: string; stripTo: string } {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h + slug.charCodeAt(i) * (i + 1)) % 1000000
  const pair = STRIP_PAIRS[h % STRIP_PAIRS.length]
  return { stripFrom: pair[0], stripTo: pair[1] }
}

/**
 * Fix pasted / AI output artifacts before injecting HTML on the public blog:
 * - Markdown fences (```html) shown as a literal "html" line
 * - Stray document wrappers
 * - Bogus first paragraphs containing only "html"
 */
export function normalizeBlogCmsHtml(html: string): string {
  let s = String(html || '').trim()
  if (!s) return s

  s = s.replace(/^```(?:html|htm)?\s*\r?\n?/i, '')
  s = s.replace(/\r?\n```\s*$/i, '')
  s = s.trim()

  s = s.replace(/<!DOCTYPE[^>]*>/gi, '')
  s = s.replace(/<\/?html[^>]*>/gi, '')
  s = s.replace(/<\/?head[^>]*>[\s\S]*?<\/head>/gi, '')
  s = s.replace(/<\/?body[^>]*>/gi, '')

  // Quill/code-block line that renders as visible "html"
  s = s.replace(/^(?:\s*<pre[^>]*>\s*html\s*<\/pre>\s*)+/i, '')

  for (let i = 0; i < 6; i++) {
    const stripped = s.replace(
      /^(?:\s*<p(?:\s[^>]*)?>\s*(?:html|HTML|\{?\s*html\s*\}?)(?:\s|&nbsp;|\u00a0)*<\/p>\s*)+/i,
      ''
    )
    if (stripped === s) break
    s = stripped.trim()
  }

  s = s.replace(/^(?:\s*<p(?:\s[^>]*)?>\s*(?:&nbsp;|\u00a0|\s)*<\/p>\s*)+/i, '')
  s = s.replace(/^(?:\s*<br\s*\/?>(?:\s|&nbsp;|\u00a0)*)+/i, '')
  // Bare "html" immediately before first tag (paste / fence artifact)
  s = s.replace(/^html\s+(?=<)/i, '')
  s = s.replace(/^html(?=<)/i, '')
  return s.trim()
}

/** First hero section vs rest — lets public layout show hero at full content width and body at readable measure. */
export function splitCmsHeroFromBody(html: string): { heroHtml: string | null; bodyHtml: string } {
  const trimmed = String(html || '').trim()
  const re = /^(\s*<section\b[^>]*\bblog-hero-banner\b[^>]*>[\s\S]*?<\/section>\s*)([\s\S]*)$/i
  const m = trimmed.match(re)
  if (!m) return { heroHtml: null, bodyHtml: trimmed }
  return { heroHtml: m[1].trim(), bodyHtml: m[2].trim() }
}

/** Plain excerpt for listing cards (strip HTML from CMS snippets). */
export function plainBlogExcerpt(raw: string | undefined | null, maxLen = 220): string {
  const t = String(raw || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!t) return ''
  return t.length <= maxLen ? t : `${t.slice(0, maxLen - 1)}…`
}

function formatPublishedDay(input: string | Date | undefined): string {
  if (!input) return new Date().toISOString().slice(0, 10)
  const d = typeof input === 'string' ? new Date(input) : input
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10)
  return d.toISOString().slice(0, 10)
}

export type UnifiedBlogCard = {
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  category: string
  readTime: string
  authorName: string
  authorRole: string
  stripFrom: string
  stripTo: string
  coverUrl: string
  viewCount: number
}

export async function fetchPublishedBlogSummaries(): Promise<CmsBlogSummary[]> {
  const base = blogCmsBackendBase()
  const url = `${base}/api/v1/blog-admin/public/blogs`
  try {
    const res =
      process.env.NODE_ENV === 'development'
        ? await fetch(url, { cache: 'no-store', headers: { Accept: 'application/json' } })
        : await fetch(url, {
            next: { revalidate: REVALIDATE_SECONDS },
            headers: { Accept: 'application/json' },
          })
    if (!res.ok) return []
    const json = await res.json()
    if (!json?.success || !Array.isArray(json.data)) return []
    return json.data as CmsBlogSummary[]
  } catch {
    return []
  }
}

export async function fetchPublishedBlogBySlug(slug: string): Promise<CmsBlogDetail | null> {
  const base = blogCmsBackendBase()
  const safe = encodeURIComponent(slug)
  const url = `${base}/api/v1/blog-admin/public/blogs/${safe}`
  try {
    const res =
      process.env.NODE_ENV === 'development'
        ? await fetch(url, { cache: 'no-store', headers: { Accept: 'application/json' } })
        : await fetch(url, {
            next: { revalidate: REVALIDATE_SECONDS },
            headers: { Accept: 'application/json' },
          })
    if (!res.ok) return null
    const json = await res.json()
    if (!json?.success || !json.data?.content) return null
    const data = json.data as CmsBlogDetail
    return { ...data, content: normalizeBlogCmsHtml(data.content) }
  } catch {
    return null
  }
}

async function cmsSummaryToUnified(b: CmsBlogSummary): Promise<UnifiedBlogCard> {
  const { stripFrom, stripTo } = stripGradientForSlug(b.slug)
  const rt =
    typeof b.readingTime === 'number' && b.readingTime > 0 ? `${b.readingTime} min read` : '8 min read'
  const category = (b.tags && b.tags[0]) || b.topic || 'Editorial'
  const coverUrl = await resolveBlogCoverUrl(b)
  const viewCount = typeof b.viewCount === 'number' && b.viewCount >= 0 ? b.viewCount : 0
  return {
    slug: b.slug,
    title: b.title,
    excerpt: plainBlogExcerpt(b.excerpt || b.metaDescription || ''),
    publishedAt: formatPublishedDay(b.publishedAt),
    category,
    readTime: rt,
    authorName: 'Compare Bazaar Editorial',
    authorRole: 'Editorial Team',
    stripFrom,
    stripTo,
    coverUrl,
    viewCount,
  }
}

const byPublishedDesc = (a: UnifiedBlogCard, b: UnifiedBlogCard) =>
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()

/**
 * Only published posts from the blog API (Mongo). Empty when backend is down or nothing is published yet — the blog index shows “Coming soon”.
 */
export async function loadUnifiedBlogIndex(): Promise<UnifiedBlogCard[]> {
  const cms = await fetchPublishedBlogSummaries()
  const rows = await Promise.all(cms.map((b) => cmsSummaryToUnified(b)))
  return rows.sort(byPublishedDesc)
}

export async function loadUnifiedRelated(currentSlug: string, limit = 3): Promise<UnifiedBlogCard[]> {
  const all = await loadUnifiedBlogIndex()
  return all.filter((p) => p.slug !== currentSlug).slice(0, limit)
}

/** Public /blog index: first page shows 5 posts; each further page shows 3 */
export const BLOG_INDEX_FIRST_PAGE_SIZE = 5
export const BLOG_INDEX_OTHER_PAGES_SIZE = 3

export function blogIndexPageCount(totalPosts: number): number {
  if (totalPosts <= 0) return 0
  if (totalPosts <= BLOG_INDEX_FIRST_PAGE_SIZE) return 1
  return 1 + Math.ceil((totalPosts - BLOG_INDEX_FIRST_PAGE_SIZE) / BLOG_INDEX_OTHER_PAGES_SIZE)
}

/** 1-based page */
export function sliceBlogIndexByPage(all: UnifiedBlogCard[], page: number): UnifiedBlogCard[] {
  const p = Math.max(1, Math.floor(page) || 1)
  if (p === 1) return all.slice(0, BLOG_INDEX_FIRST_PAGE_SIZE)
  const skip = BLOG_INDEX_FIRST_PAGE_SIZE + (p - 2) * BLOG_INDEX_OTHER_PAGES_SIZE
  return all.slice(skip, skip + BLOG_INDEX_OTHER_PAGES_SIZE)
}
