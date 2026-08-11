import type { ComparisonPageData } from '@/types'
import {
  pickTopicCoverUrl,
  buildUnsplashSearchQuery,
  type BlogCoverInput,
} from '@/lib/blogTopicCovers'

const COMPARISON_VERTICAL_QUERIES: { re: RegExp; query: string }[] = [
  { re: /\bvoip\b|business phone|phone system|ucaas|cloud phone/i, query: 'business phone call center headset office' },
  { re: /\bcrm\b|customer relationship|sales pipeline/i, query: 'CRM software sales team office dashboard' },
  { re: /\bpayroll\b|pay stub|paycheck|hris\b|human resources\b|\bhr\b/i, query: 'payroll accounting finance office team' },
  { re: /\bfleet\b|gps|telematics|vehicle tracking|trucking/i, query: 'fleet management GPS logistics trucks dashboard' },
  { re: /\bemail marketing\b|marketing automation|digital marketing/i, query: 'email marketing analytics laptop workspace' },
  { re: /\bproject management\b|task management|agile\b|kanban\b/i, query: 'project management team whiteboard planning' },
  { re: /\bcall center\b|contact center|customer support software/i, query: 'call center customer support headset' },
  { re: /\bemployee management\b|workforce|people analytics/i, query: 'HR team workforce analytics office' },
  { re: /\bwebsite builder\b|landing page builder/i, query: 'website design laptop creative workspace' },
]

function toCoverInput(data: Pick<ComparisonPageData, 'slug' | 'h1' | 'intro' | 'title'>): BlogCoverInput {
  return {
    slug: data.slug,
    title: data.h1 || data.title,
    metaDescription: data.intro,
    topic: data.slug.replace(/-/g, ' '),
  }
}

function buildComparisonCoverQueries(
  data: Pick<ComparisonPageData, 'slug' | 'h1' | 'intro' | 'title'>
): string[] {
  const corpus = [data.slug, data.h1, data.title, data.intro].join(' ')
  const queries: string[] = []

  for (const { re, query } of COMPARISON_VERTICAL_QUERIES) {
    if (re.test(corpus)) queries.push(query)
  }

  const input = toCoverInput(data)
  queries.push(buildUnsplashSearchQuery(input))

  const topicPhrase = data.slug.replace(/-/g, ' ')
  if (topicPhrase.length >= 3) {
    queries.push(`${topicPhrase} professional technology office`)
  }

  return [...new Set(queries.filter((q) => q.length >= 3))]
}

async function fetchUnsplashCover(query: string, accessKey: string): Promise<string | null> {
  const q = encodeURIComponent(query.slice(0, 80))
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${q}&per_page=1&orientation=landscape&content_filter=high`,
      {
        headers: { Authorization: `Client-ID ${accessKey}` },
        next: { revalidate: 86400 },
      }
    )
    if (!res.ok) return null
    const json = (await res.json()) as {
      results?: { urls?: { regular?: string; small?: string } }[]
    }
    const raw = json?.results?.[0]?.urls?.regular || json?.results?.[0]?.urls?.small
    if (!raw || typeof raw !== 'string') return null
    const base = raw.split('?')[0]
    return `${base}?auto=format&fit=crop&w=1400&h=900&q=85`
  } catch {
    return null
  }
}

function backendBaseUrl(): string | null {
  const base =
    process.env.BACKEND_URL?.trim() ||
    process.env.BLOG_CMS_BACKEND_URL?.trim() ||
    process.env.NEXT_PUBLIC_BACKEND_URL?.trim()
  return base ? base.replace(/\/$/, '') : null
}

/** Use backend Unsplash service (same key as blog generation). */
async function fetchCoverFromBackend(
  data: Pick<ComparisonPageData, 'slug' | 'h1' | 'intro' | 'title'>
): Promise<string | null> {
  const base = backendBaseUrl()
  if (!base) return null

  const params = new URLSearchParams({
    slug: data.slug,
    title: data.h1 || data.title,
    intro: data.intro.slice(0, 240),
  })

  try {
    const res = await fetch(
      `${base}/api/v1/blog-admin/public/comparison-pages/cover-image?${params}`,
      { next: { revalidate: 86400 } }
    )
    if (!res.ok) return null
    const json = (await res.json()) as { url?: string }
    return json.url?.trim() || null
  } catch {
    return null
  }
}

/** Topic-relevant Unsplash hero — API first, curated fallback. */
export async function resolveComparisonPageCoverUrl(
  data: Pick<ComparisonPageData, 'slug' | 'h1' | 'intro' | 'title'>
): Promise<string> {
  const fromBackend = await fetchCoverFromBackend(data)
  if (fromBackend) return fromBackend

  const accessKey = process.env.UNSPLASH_ACCESS_KEY?.trim()
  if (accessKey) {
    for (const query of buildComparisonCoverQueries(data)) {
      const remote = await fetchUnsplashCover(query, accessKey)
      if (remote) return remote
    }
  }

  return pickTopicCoverUrl(toCoverInput(data))
}

/** Sync fallback for non-async contexts. */
export function getComparisonPageCoverUrl(
  data: Pick<ComparisonPageData, 'slug' | 'h1' | 'intro' | 'title'>
): string {
  return pickTopicCoverUrl(toCoverInput(data))
}
