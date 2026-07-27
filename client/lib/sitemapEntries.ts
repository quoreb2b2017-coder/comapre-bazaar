import type { MetadataRoute } from 'next'
import { comparisonPages } from '@/data/comparisons'
import { hubPages } from '@/data/hubs'
import { lastVerifiedForPost, normalizeBlogSlug } from '@/lib/content-map'
import { fetchPublishedBlogSummaries } from '@/lib/blogCms'
import { QUOTE_PAGE_CONFIGS } from '@/lib/pageMetaDescriptions'
import { buildReviewVendorQuotePath } from '@/lib/reviewQuoteCta'
import { fetchPublishedWhitePapers } from '@/lib/whitePaperCms'

export const SITEMAP_BASE_URL = 'https://www.compare-bazaar.com'

/** Paths that 301 to another canonical — omit from sitemap to avoid duplicate entries. */
const SITEMAP_REDIRECT_PATHS = new Set([
  '/technology/best-employee-management-software',
  '/technology/best-employee-management-software/get-free-quotes',
  '/sales/best-crm-software',
  '/sales/best-crm-software/get-free-quotes',
  '/marketing/best-crm-software/get-free-quote',
  '/privacy-policy/ccpa-opt-out',
  '/do-not-sell-my-info',
  '/resources/whitepapers',
])

function isSitemapPath(path: string): boolean {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return !SITEMAP_REDIRECT_PATHS.has(normalized)
}

function uniqueReviewProducts() {
  const seen = new Set<string>()
  const entries: { reviewSlug: string; name: string; categoryPath: string; lastReviewed: Date }[] = []

  for (const page of comparisonPages) {
    const lastReviewed = new Date(page.lastReviewed)
    for (const product of page.products) {
      if (!product.reviewSlug || seen.has(product.reviewSlug)) continue
      seen.add(product.reviewSlug)
      entries.push({
        reviewSlug: product.reviewSlug,
        name: product.name,
        categoryPath: page.canonical,
        lastReviewed,
      })
    }
  }

  return entries
}

function compareUrl(category: string, brand: string): string {
  const params = new URLSearchParams({ category, brand })
  return `${SITEMAP_BASE_URL}/compare?${params.toString()}`
}

export async function getSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // These routes have no real "last edited" timestamp anywhere in the data
  // layer. Stamping them with the sitemap's build time (`now`) makes every
  // one of them look like it changed on every hourly regen, which is a
  // false freshness signal — Google explicitly discounts lastmod once it
  // notices it doesn't correlate with real content changes. Omitting
  // lastModified for these is more honest than fabricating it.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITEMAP_BASE_URL, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITEMAP_BASE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITEMAP_BASE_URL}/browse-all-software`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITEMAP_BASE_URL}/editorial-process`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITEMAP_BASE_URL}/about`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITEMAP_BASE_URL}/resources`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITEMAP_BASE_URL}/resources/whitepapers`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITEMAP_BASE_URL}/start-a-business`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITEMAP_BASE_URL}/business-planning`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITEMAP_BASE_URL}/advertise`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITEMAP_BASE_URL}/contact`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITEMAP_BASE_URL}/human-resources/buddy-punch`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITEMAP_BASE_URL}/human-resources/remote-payroll`, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const legalRoutes: MetadataRoute.Sitemap = [
    { url: `${SITEMAP_BASE_URL}/advertising-disclosure`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITEMAP_BASE_URL}/privacy-policy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITEMAP_BASE_URL}/terms-of-use`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITEMAP_BASE_URL}/copyright-policy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITEMAP_BASE_URL}/accessibility`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITEMAP_BASE_URL}/limit-the-use`, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${SITEMAP_BASE_URL}/do-not-sell`, changeFrequency: 'yearly', priority: 0.1 },
  ]

  const hubRoutes: MetadataRoute.Sitemap = hubPages.map((hub) => ({
    url: `${SITEMAP_BASE_URL}${hub.canonical}`,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Comparison/review/quote pages DO have a real editorial date
  // (`lastReviewed` on the comparison record) — use it instead of `now`.
  const comparisonRoutes: MetadataRoute.Sitemap = comparisonPages
    .filter((page) => isSitemapPath(page.canonical))
    .map((page) => ({
      url: `${SITEMAP_BASE_URL}${page.canonical}`,
      lastModified: new Date(page.lastReviewed),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

  const quoteConfigRoutes: MetadataRoute.Sitemap = Object.values(QUOTE_PAGE_CONFIGS)
    .filter((config) => isSitemapPath(config.canonical))
    .map((config) => ({
      url: `${SITEMAP_BASE_URL}${config.canonical}`,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    }))

  const quoteHubRoutes: MetadataRoute.Sitemap = [
    { url: `${SITEMAP_BASE_URL}/technology/get-free-quotes`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITEMAP_BASE_URL}/marketing/get-free-quotes`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const compareRoutes: MetadataRoute.Sitemap = comparisonPages.flatMap((page) =>
    page.products.map((product) => ({
      url: compareUrl(page.slug, product.id),
      lastModified: new Date(page.lastReviewed),
      changeFrequency: 'monthly' as const,
      priority: 0.55,
    }))
  )

  const reviewProducts = uniqueReviewProducts()

  const reviewRoutes: MetadataRoute.Sitemap = reviewProducts.map((entry) => ({
    url: `${SITEMAP_BASE_URL}/reviews/${entry.reviewSlug}`,
    lastModified: entry.lastReviewed,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const vendorQuoteRoutes: MetadataRoute.Sitemap = reviewProducts.flatMap((entry) => {
    const path = buildReviewVendorQuotePath(entry.reviewSlug, entry.name, entry.categoryPath)
    if (!path) return []

    return [{
      url: `${SITEMAP_BASE_URL}${path}`,
      lastModified: entry.lastReviewed,
      changeFrequency: 'yearly' as const,
      priority: 0.35,
    }]
  })

  const cmsPosts = await fetchPublishedBlogSummaries()

  const blogRoutes: MetadataRoute.Sitemap = cmsPosts.map((post) => {
    const verified = lastVerifiedForPost(post.slug)
    const lastModified = verified
      ? new Date(verified)
      : post.publishedAt
        ? new Date(post.publishedAt)
        : now

    return {
      url: `${SITEMAP_BASE_URL}/blog/${normalizeBlogSlug(post.slug)}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    }
  })

  const whitePapers = await fetchPublishedWhitePapers()
  const whitePaperRoutes: MetadataRoute.Sitemap = whitePapers.map((paper) => ({
    url: `${SITEMAP_BASE_URL}/resources/whitepapers/${paper.slug}`,
    lastModified: paper.publishedAt ? new Date(paper.publishedAt) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // /description sub-pages are real, self-canonical, indexable pages (unlike
  // /reviews/[slug]/description, which is noindex + canonical-to-parent) —
  // they were reachable via on-page links but missing from this sitemap.
  const whitePaperDescriptionRoutes: MetadataRoute.Sitemap = whitePapers.map((paper) => ({
    url: `${SITEMAP_BASE_URL}/resources/whitepapers/${paper.slug}/description`,
    lastModified: paper.publishedAt ? new Date(paper.publishedAt) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  const combined = [
    ...staticRoutes,
    ...legalRoutes,
    ...hubRoutes,
    ...comparisonRoutes,
    ...quoteConfigRoutes,
    ...quoteHubRoutes,
    ...compareRoutes,
    ...reviewRoutes,
    ...vendorQuoteRoutes,
    ...blogRoutes,
    ...whitePaperRoutes,
    ...whitePaperDescriptionRoutes,
  ]

  const seen = new Set<string>()
  return combined.filter((entry) => {
    if (seen.has(entry.url)) return false
    seen.add(entry.url)
    return true
  })
}
