import { blogPosts } from '@/data/blogPosts'
import { postsForHub } from '@/lib/content-map'
import { assignUniqueBlogCovers, pickTopicCoverUrl, resolveCoverUrlFromCms } from '@/lib/blogTopicCovers'
import { cmsBackendBase, cmsBackendBaseCandidates } from '@/lib/cmsBackendBase'

/** Server-side base URL for Express. Browser callers should use cmsBackendBase() (same-origin proxy). */
export function blogCmsBackendBase(): string {
  return cmsBackendBase()
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
  /** Unsplash cover saved at generation time (optional). */
  coverImageUrl?: string
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
  // Shorter dash in article copy (em dash → hyphen)
  s = s.replace(/\s*\u2014\s*/g, ' - ')
  s = s.replace(/\s*&mdash;\s*/gi, ' - ')
  s = stripInlineFontSizeOutsideHero(s)
  return s.trim()
}

function stripInlineFontSizeOutsideHero(html: string): string {
  const { heroHtml, bodyHtml } = splitCmsHeroFromBody(html)
  const cleaned = bodyHtml
    .replace(/font-size\s*:\s*[^;}"']+;?/gi, '')
    .replace(/\sstyle=(["'])\s*\1/gi, '')
  return heroHtml ? `${heroHtml}${cleaned}` : cleaned
}

/** First hero section vs rest — lets public layout show hero at full content width and body at readable measure. */
export function splitCmsHeroFromBody(html: string): { heroHtml: string | null; bodyHtml: string } {
  const trimmed = String(html || '').trim()
  const re = /^(\s*<section\b[^>]*\bblog-hero-banner\b[^>]*>[\s\S]*?<\/section>\s*)([\s\S]*)$/i
  const m = trimmed.match(re)
  if (!m) return { heroHtml: null, bodyHtml: trimmed }
  return { heroHtml: m[1].trim(), bodyHtml: m[2].trim() }
}

function stripTags(s: string) {
  return String(s || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

export function parseCmsHeroBanner(heroHtml: string): {
  eyebrow: string
  title: string
  subtitle: string
  pills: string[]
} {
  const html = String(heroHtml || '')
  const eyebrow = html.match(/class=["'][^"']*blog-hero-eyebrow[^"']*["'][^>]*>([\s\S]*?)<\/p>/i)
  const title = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)
  const subtitle = html.match(/class=["'][^"']*blog-hero-subtitle[^"']*["'][^>]*>([\s\S]*?)<\/p>/i)
  const pills: string[] = []
  const pillRe = /class=["'][^"']*blog-hero-pill-label[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi
  let match: RegExpExecArray | null
  while ((match = pillRe.exec(html))) {
    const label = stripTags(match[1])
    if (label) pills.push(label)
  }
  return {
    eyebrow: eyebrow ? stripTags(eyebrow[1]) : '',
    title: title ? stripTags(title[1]) : '',
    subtitle: subtitle ? stripTags(subtitle[1]) : '',
    pills: pills.slice(0, 4),
  }
}

/** Plain excerpt for listing cards (strip HTML from CMS snippets). */
export function plainBlogExcerpt(raw: string | undefined | null, maxLen = 220): string {
  const t = String(raw || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s*\u2014\s*/g, ' - ')
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

/** URL slug for blog topic filters (/blog?topic=crm-software). */
export function topicToSlug(topic: string): string {
  return topic
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Resolve ?topic= slug back to a category label present on posts. */
export function resolveTopicFromSlug(slug: string, posts: UnifiedBlogCard[]): string | null {
  const key = topicToSlug(slug)
  if (!key) return null
  const labels = [...new Set(posts.map((p) => p.category))]
  return labels.find((label) => topicToSlug(label) === key) ?? null
}

export type BlogTopicEntry = { label: string; slug: string; count: number }

export function getBlogTopics(posts: UnifiedBlogCard[]): BlogTopicEntry[] {
  const map = new Map<string, BlogTopicEntry>()
  for (const post of posts) {
    const slug = topicToSlug(post.category)
    const existing = map.get(slug)
    if (existing) {
      existing.count += 1
    } else {
      map.set(slug, { label: post.category, slug, count: 1 })
    }
  }
  return [...map.values()].sort((a, b) => a.label.localeCompare(b.label))
}

/** All ?topic= slugs from CMS tags and topic fields (for sitemap coverage). */
export function getBlogTopicsFromSummaries(summaries: CmsBlogSummary[]): BlogTopicEntry[] {
  const map = new Map<string, BlogTopicEntry>()
  for (const post of summaries) {
    const labels = [...new Set([...(post.tags || []), ...(post.topic ? [post.topic] : [])])]
    for (const label of labels) {
      const slug = topicToSlug(label)
      if (!slug) continue
      const existing = map.get(slug)
      if (existing) {
        existing.count += 1
      } else {
        map.set(slug, { label, slug, count: 1 })
      }
    }
  }
  return [...map.values()].sort((a, b) => a.label.localeCompare(b.label))
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
  /** Primary CMS topic (for related-post matching). */
  topic?: string
  tags?: string[]
}

function cmsFetchInit(): RequestInit & { next?: { revalidate: number } } {
  const headers = { Accept: 'application/json' }
  if (process.env.NODE_ENV === 'development') {
    return { cache: 'no-store', headers }
  }
  return { next: { revalidate: REVALIDATE_SECONDS }, headers }
}

export async function fetchPublishedBlogSummaries(): Promise<CmsBlogSummary[]> {
  const path = '/api/v1/blog-admin/public/blogs'
  for (const base of cmsBackendBaseCandidates()) {
    try {
      const res = await fetch(`${base}${path}`, cmsFetchInit())
      if (!res.ok) continue
      const json = await res.json()
      if (!json?.success || !Array.isArray(json.data)) continue
      return json.data as CmsBlogSummary[]
    } catch {
      // try next host (localhost vs 127.0.0.1)
    }
  }
  return []
}

export async function fetchPublishedBlogBySlug(slug: string): Promise<CmsBlogDetail | null> {
  const safe = encodeURIComponent(slug)
  const path = `/api/v1/blog-admin/public/blogs/${safe}`
  for (const base of cmsBackendBaseCandidates()) {
    try {
      const res = await fetch(`${base}${path}`, cmsFetchInit())
      if (!res.ok) continue
      const json = await res.json()
      if (!json?.success || !json.data?.content) continue
      const data = json.data as CmsBlogDetail
      return { ...data, content: normalizeBlogCmsHtml(data.content) }
    } catch {
      // try next host
    }
  }
  return null
}

function cmsSummaryToUnified(b: CmsBlogSummary): UnifiedBlogCard {
  const { stripFrom, stripTo } = stripGradientForSlug(b.slug)
  const rt =
    typeof b.readingTime === 'number' && b.readingTime > 0 ? `${b.readingTime} min read` : '8 min read'
  const category = (b.tags && b.tags[0]) || b.topic || 'Editorial'
  const coverUrl = resolveCoverUrlFromCms({
    slug: b.slug,
    title: b.title,
    topic: b.topic,
    tags: b.tags,
    keywords: b.keywords,
    metaTitle: b.metaTitle,
    metaDescription: b.metaDescription,
    coverImageUrl: b.coverImageUrl,
  })
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
    topic: b.topic,
    tags: b.tags,
  }
}

const byPublishedDesc = (a: UnifiedBlogCard, b: UnifiedBlogCard) =>
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()

/**
 * Only published posts from the blog API (Mongo). Empty when backend is down or nothing is published yet — the blog index shows “Coming soon”.
 */
export async function loadUnifiedBlogIndex(): Promise<UnifiedBlogCard[]> {
  const cms = await fetchPublishedBlogSummaries()
  const sorted = cms.map(cmsSummaryToUnified).sort(byPublishedDesc)
  return assignUniqueBlogCovers(sorted, (post) => {
    const source = cms.find((item) => item.slug === post.slug)
    return {
      slug: post.slug,
      title: post.title,
      topic: source?.topic,
      tags: source?.tags,
      keywords: source?.keywords,
      metaTitle: source?.metaTitle,
      metaDescription: source?.metaDescription,
      coverImageUrl: source?.coverImageUrl,
    }
  })
}

function staticPostsToUnified(): UnifiedBlogCard[] {
  return blogPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    publishedAt: p.publishedAt,
    category: p.category,
    readTime: p.readTime,
    authorName: p.authorName,
    authorRole: p.authorRole,
    stripFrom: p.stripFrom,
    stripTo: p.stripTo,
    coverUrl: pickTopicCoverUrl({ slug: p.slug, topic: p.category, title: p.title }),
    viewCount: 0,
    topic: p.category,
    tags: [p.category],
  }))
}

/** Labels used to match related posts (category, topic, tags). */
export function collectBlogTopicLabels(input: {
  category?: string
  topic?: string
  tags?: string[]
}): string[] {
  return [
    ...new Set(
      [input.category, input.topic, ...(input.tags || [])]
        .map((label) => String(label || '').trim())
        .filter(Boolean),
    ),
  ]
}

function topicSlugsMatch(a: string, b: string): boolean {
  const sa = topicToSlug(a)
  const sb = topicToSlug(b)
  if (!sa || !sb) return false
  if (sa === sb) return true
  if (sa.startsWith(`${sb}-`) || sb.startsWith(`${sa}-`)) return true
  const shorter = sa.length <= sb.length ? sa : sb
  const longer = sa.length > sb.length ? sa : sb
  return shorter.length >= 3 && longer.includes(shorter)
}

/** True when a post shares topic/category with any of the given labels. */
export function blogPostMatchesTopicLabels(
  post: Pick<UnifiedBlogCard, 'category' | 'topic' | 'tags'>,
  labels: string[],
): boolean {
  if (labels.length === 0) return false
  const postLabels = collectBlogTopicLabels({
    category: post.category,
    topic: post.topic,
    tags: post.tags,
  })
  return labels.some((label) => postLabels.some((postLabel) => topicSlugsMatch(label, postLabel)))
}

/** Latest posts in the same topic/category (newest first, auto-updates from CMS). */
export function pickRelatedBlogPosts(
  allPosts: UnifiedBlogCard[],
  options: {
    currentSlug: string
    category?: string
    topic?: string
    tags?: string[]
    limit?: number
  },
): UnifiedBlogCard[] {
  const { currentSlug, limit = 3, ...topicInput } = options
  const topicLabels = collectBlogTopicLabels(topicInput)

  return allPosts
    .filter((post) => {
      if (post.slug === currentSlug) return false
      if (topicLabels.length === 0) return false
      return blogPostMatchesTopicLabels(post, topicLabels)
    })
    .slice(0, limit)
}

/** Homepage preview: newest published CMS posts only (no static guide fallback). */
export async function loadHomeBlogPreview(limit = 4): Promise<UnifiedBlogCard[]> {
  const cms = await loadUnifiedBlogIndex()
  return cms.slice(0, limit)
}

export async function loadUnifiedRelated(
  currentSlug: string,
  topicInput: { category?: string; topic?: string; tags?: string[] } = {},
  limit = 3,
): Promise<UnifiedBlogCard[]> {
  const all = await loadUnifiedBlogIndex()
  return pickRelatedBlogPosts(all, { currentSlug, ...topicInput, limit })
}

/** Latest same-topic posts for a comparison hub (CRM, payroll, etc.). New CMS posts appear automatically. */
export async function loadRelatedBlogPostsForHub(
  hub: { slug: string; name: string; primaryKeyword?: string },
  limit = 3,
): Promise<UnifiedBlogCard[]> {
  let all: UnifiedBlogCard[] = []
  try {
    all = await loadUnifiedBlogIndex()
  } catch {
    all = []
  }
  if (all.length === 0) all = staticPostsToUnified()

  const related = pickRelatedBlogPosts(all, {
    currentSlug: '',
    category: hub.name,
    topic: hub.slug,
    tags: [hub.name, hub.slug, hub.primaryKeyword || ''],
    limit,
  })

  if (related.length >= limit) return related

  const mappedSlugs = postsForHub(hub.slug, 12).map((post) => post.slug)
  for (const slug of mappedSlugs) {
    if (related.length >= limit) break
    const found = all.find((post) => post.slug === slug)
    if (found && !related.some((post) => post.slug === found.slug)) {
      related.push(found)
    }
  }

  return related
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
