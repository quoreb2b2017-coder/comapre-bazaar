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

function compareUrl(category: string, brand: string): string {
  const params = new URLSearchParams({ category, brand })
  return `${SITEMAP_BASE_URL}/compare?${params.toString()}`
}

export async function getSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITEMAP_BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITEMAP_BASE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITEMAP_BASE_URL}/browse-all-software`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITEMAP_BASE_URL}/editorial-process`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITEMAP_BASE_URL}/about`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITEMAP_BASE_URL}/resources`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITEMAP_BASE_URL}/resources/whitepapers`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITEMAP_BASE_URL}/start-a-business`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITEMAP_BASE_URL}/business-planning`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITEMAP_BASE_URL}/advertise`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITEMAP_BASE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITEMAP_BASE_URL}/human-resources/buddy-punch`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const legalRoutes: MetadataRoute.Sitemap = [
    { url: `${SITEMAP_BASE_URL}/advertising-disclosure`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITEMAP_BASE_URL}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITEMAP_BASE_URL}/terms-of-use`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITEMAP_BASE_URL}/copyright-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITEMAP_BASE_URL}/accessibility`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITEMAP_BASE_URL}/limit-the-use`, lastModified: now, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${SITEMAP_BASE_URL}/do-not-sell`, lastModified: now, changeFrequency: 'yearly', priority: 0.1 },
  ]

  const hubRoutes: MetadataRoute.Sitemap = hubPages.map((hub) => ({
    url: `${SITEMAP_BASE_URL}${hub.canonical}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const comparisonRoutes: MetadataRoute.Sitemap = comparisonPages
    .filter((page) => isSitemapPath(page.canonical))
    .map((page) => ({
      url: `${SITEMAP_BASE_URL}${page.canonical}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

  const quoteConfigRoutes: MetadataRoute.Sitemap = Object.values(QUOTE_PAGE_CONFIGS)
    .filter((config) => isSitemapPath(config.canonical))
    .map((config) => ({
      url: `${SITEMAP_BASE_URL}${config.canonical}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    }))

  const quoteHubRoutes: MetadataRoute.Sitemap = [
    { url: `${SITEMAP_BASE_URL}/technology/get-free-quotes`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITEMAP_BASE_URL}/marketing/get-free-quotes`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const compareRoutes: MetadataRoute.Sitemap = comparisonPages.flatMap((page) =>
    page.products.map((product) => ({
      url: compareUrl(page.slug, product.id),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.55,
    }))
  )

  const reviewSlugs = uniqueReviewProducts().map((entry) => entry.reviewSlug)

  const reviewRoutes: MetadataRoute.Sitemap = reviewSlugs.map((slug) => ({
    url: `${SITEMAP_BASE_URL}/reviews/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const vendorQuoteRoutes: MetadataRoute.Sitemap = uniqueReviewProducts().flatMap((entry) => {
    const path = buildReviewVendorQuotePath(entry.reviewSlug, entry.name, entry.categoryPath)
    if (!path) return []

    return [{
      url: `${SITEMAP_BASE_URL}${path}`,
      lastModified: now,
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
  ]

  const seen = new Set<string>()
  return combined.filter((entry) => {
    if (seen.has(entry.url)) return false
    seen.add(entry.url)
    return true
  })
}
