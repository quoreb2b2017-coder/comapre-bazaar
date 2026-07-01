import type { MetadataRoute } from 'next'
import { comparisonPages } from '@/data/comparisons'
import { hubPages } from '@/data/hubs'
import { fetchPublishedBlogSummaries } from '@/lib/blogCms'
import { QUOTE_PAGE_CONFIGS } from '@/lib/pageMetaDescriptions'
import { buildReviewVendorQuotePath } from '@/lib/reviewQuoteCta'
import { fetchPublishedWhitePapers } from '@/lib/whitePaperCms'

const BASE_URL = 'https://www.compare-bazaar.com'

/** Regenerate on each request so CMS blog/whitepaper URLs stay current when backend is available. */
export const revalidate = 3600

/** Paths that 301 to another canonical — omit from sitemap to avoid duplicate entries. */
const SITEMAP_REDIRECT_PATHS = new Set([
  '/technology/best-employee-management-software',
  '/technology/best-employee-management-software/get-free-quotes',
  '/sales/best-crm-software',
  '/sales/best-crm-software/get-free-quotes',
  '/marketing/best-crm-software/get-free-quote',
])

function isSitemapPath(path: string): boolean {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return !SITEMAP_REDIRECT_PATHS.has(normalized)
}

function uniqueReviewProducts() {
  const seen = new Set<string>()
  const entries: { reviewSlug: string; name: string; categoryPath: string }[] = []

  for (const page of comparisonPages) {
    for (const product of page.products) {
      if (!product.reviewSlug || seen.has(product.reviewSlug)) continue
      seen.add(product.reviewSlug)
      entries.push({
        reviewSlug: product.reviewSlug,
        name: product.name,
        categoryPath: page.canonical,
      })
    }
  }

  return entries
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // ── 1. Core pages ────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                          lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/blog`,                lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/browse-all-software`, lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/editorial-process`,   lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${BASE_URL}/about`,               lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${BASE_URL}/resources`,           lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/resources/whitepaper`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/start-a-business`,    lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/business-planning`,   lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/advertise`,           lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${BASE_URL}/contact`,             lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${BASE_URL}/human-resources/buddy-punch`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]

  // ── 2. Legal / compliance ─────────────────────────────────────────────────
  const legalRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/advertising-disclosure`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/privacy-policy`,         lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms-of-use`,           lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/copyright-policy`,       lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/accessibility`,          lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/limit-the-use`,          lastModified: now, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${BASE_URL}/do-not-sell`,            lastModified: now, changeFrequency: 'yearly', priority: 0.1 },
  ]

  // ── 3. Hub pages ─────────────────────────────────────────────────────────
  const hubRoutes: MetadataRoute.Sitemap = hubPages.map((hub) => ({
    url: `${BASE_URL}${hub.canonical}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // ── 4. Comparison / category pages ───────────────────────────────────────
  const comparisonRoutes: MetadataRoute.Sitemap = comparisonPages
    .filter((page) => isSitemapPath(page.canonical))
    .map((page) => ({
      url: `${BASE_URL}${page.canonical}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

  // ── 5. Lead-gen quote pages (from QUOTE_PAGE_CONFIGS + quote hub landings) ─
  const quoteConfigRoutes: MetadataRoute.Sitemap = Object.values(QUOTE_PAGE_CONFIGS)
    .filter((config) => isSitemapPath(config.canonical))
    .map((config) => ({
      url: `${BASE_URL}${config.canonical}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    }))

  const quoteHubRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/technology/get-free-quotes`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/marketing/get-free-quotes`,  lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const leadGenRoutes: MetadataRoute.Sitemap = [...quoteConfigRoutes, ...quoteHubRoutes]

  // ── 6. Compare brand pages (?category=&brand=) ───────────────────────────
  const compareRoutes: MetadataRoute.Sitemap = comparisonPages.flatMap((page) =>
    page.products.map((product) => ({
      url: `${BASE_URL}/compare?category=${encodeURIComponent(page.slug)}&brand=${encodeURIComponent(product.id)}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.55,
    }))
  )

  // ── 7. Review pages ───────────────────────────────────────────────────────
  const reviewSlugs = uniqueReviewProducts().map((entry) => entry.reviewSlug)

  const reviewRoutes: MetadataRoute.Sitemap = reviewSlugs.map((slug) => ({
    url: `${BASE_URL}/reviews/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  // ── 8. Review-sourced vendor quote landings (?ref=review&product=&vendor=) ─
  const vendorQuoteRoutes: MetadataRoute.Sitemap = uniqueReviewProducts().flatMap((entry) => {
    const path = buildReviewVendorQuotePath(entry.reviewSlug, entry.name, entry.categoryPath)
    if (!path) return []

    return [{
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.35,
    }]
  })

  // ── 9. Blog posts (CMS) ───────────────────────────────────────────────────
  const cmsPosts = await fetchPublishedBlogSummaries()

  const blogRoutes: MetadataRoute.Sitemap = cmsPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }))

// ── 10. Whitepapers (CMS) ───────────────────────────────────────────────────
  const whitePapers = await fetchPublishedWhitePapers()
  const whitePaperRoutes: MetadataRoute.Sitemap = whitePapers.map((paper) => ({
    url: `${BASE_URL}/resources/whitepaper/${paper.slug}`,
    lastModified: paper.publishedAt ? new Date(paper.publishedAt) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // ── Merge: first-write-wins dedupe ────────────────────────────────────────
  const combined = [
    ...staticRoutes,
    ...legalRoutes,
    ...hubRoutes,
    ...comparisonRoutes,
    ...leadGenRoutes,
    ...compareRoutes,
    ...reviewRoutes,
    ...vendorQuoteRoutes,
    ...blogRoutes,
    ...whitePaperRoutes,
  ]

  const seen = new Set<string>()
  return combined.filter((entry) => {
    if (seen.has(entry.url)) return false
    seen.add(entry.url)
    return true
  })
}
