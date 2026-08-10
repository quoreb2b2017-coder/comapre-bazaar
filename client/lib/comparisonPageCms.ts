import type { ComparisonPageData } from '@/types'
import { getComparisonPageBySlug as getStaticComparisonPage } from '@/data/comparisons'
import { cmsBackendBase } from '@/lib/cmsBackendBase'

const REVALIDATE_SECONDS = 120

export async function fetchComparisonPageBySlug(slug: string): Promise<ComparisonPageData | null> {
  const base = cmsBackendBase()
  const url = `${base}/api/v1/blog-admin/public/comparison-pages/${encodeURIComponent(slug)}`

  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
    })
    if (!res.ok) return null
    const json = await res.json()
    if (!json?.success || !json?.data) return null
    return json.data as ComparisonPageData
  } catch {
    return null
  }
}

/** CMS first, static `comparisons.ts` fallback — for SSR pages */
export async function loadComparisonPage(slug: string): Promise<ComparisonPageData | undefined> {
  const cms = await fetchComparisonPageBySlug(slug)
  if (cms) return cms
  return getStaticComparisonPage(slug)
}

export async function fetchAllComparisonPageSlugs(): Promise<string[]> {
  const base = cmsBackendBase()
  try {
    const res = await fetch(`${base}/api/v1/blog-admin/comparison-pages`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    const json = await res.json()
    return (json?.data || []).map((p: { slug: string }) => p.slug)
  } catch {
    return []
  }
}
