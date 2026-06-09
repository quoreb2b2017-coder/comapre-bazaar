import type { MetadataRoute } from 'next'
import { comparisonPages } from '@/data/comparisons'
import { hubPages } from '@/data/hubs'
import { fetchPublishedBlogSummaries, getBlogTopics, loadUnifiedBlogIndex } from '@/lib/blogCms'
import { buildReviewVendorQuotePath } from '@/lib/reviewQuoteCta'
import { fetchPublishedWhitePapers } from '@/lib/whitePaperCms'
import { getReviewInsidePayload, generateStaticParams as reviewStaticParams } from '@/app/reviews/[slug]/page'

const BASE_URL = 'https://www.compare-bazaar.com'

/** XML sitemaps require escaped ampersands inside query-string URLs. */
function sitemapUrl(pathOrUrl: string): string {
  const absolute = pathOrUrl.startsWith('http') ? pathOrUrl : `${BASE_URL}${pathOrUrl}`
  return absolute.replace(/&/g, '&amp;')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // ── 1. Core pages ────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                                    lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/blog`,                          lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/browse-all-software`,           lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/editorial-process`,             lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${BASE_URL}/about`,                         lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${BASE_URL}/resources`,                     lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/resources/whitepaper`,          lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/start-a-business`,              lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/business-planning`,             lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/advertise`,                     lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${BASE_URL}/contact`,                       lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
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

  // ── 4. Comparison / category pages (includes /technology/best-payroll-system) ──
  const comparisonRoutes: MetadataRoute.Sitemap = comparisonPages.map((page) => ({
    url: `${BASE_URL}${page.canonical}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // ── 5. Lead-gen quote pages — live + indexed, low SEO priority ────────────
  const leadGenRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/technology/get-free-quotes`,                                        lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/marketing/get-free-quotes`,                                         lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/marketing/best-crm-software/get-free-quote`,                        lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/marketing/best-email-marketing-services/get-free-quotes`,           lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/marketing/best-website-building-platform/get-free-quotes`,          lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/human-resources/best-payroll-software/get-free-quotes`,             lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/technology/best-payroll-system/get-free-quotes`,                    lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/technology/business-phone-systems/get-free-quotes`,                 lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/technology/gps-fleet-management-software/get-free-quotes`,          lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/human-resources/best-employee-management-software/get-free-quotes`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/sales/best-crm-software/get-free-quotes`,                           lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/sales/best-call-center-management-software/get-free-quotes`,        lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/sales/best-project-management-software/get-free-quotes`,            lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // ── 6. Compare detail URLs (?category=&brand=) from comparison dataset ──────
  const compareDetailRoutes: MetadataRoute.Sitemap = comparisonPages.flatMap((page) =>
    page.products.map((product) => ({
      url: sitemapUrl(`/compare?category=${encodeURIComponent(page.slug)}&brand=${encodeURIComponent(product.id)}`),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  )

  // ── 7. Review pages — derive from live comparison data to avoid omissions ──
  const reviewSlugs = Array.from(
    new Set(
      comparisonPages.flatMap((page) =>
        page.products.map((product) => product.reviewSlug)
      )
    )
  )

  const reviewRoutes: MetadataRoute.Sitemap = reviewSlugs.map((slug) => ({
    url: `${BASE_URL}/reviews/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  // ── 8. Review full-description pages (linked from review CTAs) ─────────────
  const reviewDescriptionRoutes: MetadataRoute.Sitemap = reviewStaticParams()
    .filter(({ slug }) => getReviewInsidePayload(slug) !== null)
    .map(({ slug }) => ({
      url: `${BASE_URL}/reviews/${slug}/description`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.55,
    }))

  // ── 9. Vendor-specific quote landings (?ref=review&product=&vendor=) ───────
  const vendorQuoteRoutes: MetadataRoute.Sitemap = comparisonPages.flatMap((page) =>
    page.products
      .map((product) => {
        const path = buildReviewVendorQuotePath(product.reviewSlug, product.name, page.canonical)
        if (!path) return null
        return {
          url: sitemapUrl(path),
          lastModified: now,
          changeFrequency: 'yearly' as const,
          priority: 0.25,
        }
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
  )

  // ── 10. Blog posts from CMS ───────────────────────────────────────────────
  const cmsPosts = await fetchPublishedBlogSummaries()
  const blogRoutes: MetadataRoute.Sitemap = cmsPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }))

  // ── 11. Blog topic filter pages (?topic=) ───────────────────────────────────
  let blogTopicRoutes: MetadataRoute.Sitemap = []
  try {
    const blogIndex = await loadUnifiedBlogIndex()
    blogTopicRoutes = getBlogTopics(blogIndex).map((topic) => ({
      url: sitemapUrl(`/blog?topic=${encodeURIComponent(topic.slug)}`),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))
  } catch {
    blogTopicRoutes = []
  }

  const whitePapers = await fetchPublishedWhitePapers()
  const whitePaperRoutes: MetadataRoute.Sitemap = whitePapers.flatMap((paper) => {
    const lastModified = paper.publishedAt ? new Date(paper.publishedAt) : now
    return [
      {
        url: `${BASE_URL}/resources/whitepaper/${paper.slug}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      },
      {
        url: `${BASE_URL}/resources/whitepaper/${paper.slug}/description`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.55,
      },
    ]
  })

  // ── Merge: first-write-wins ───────────────────────────────────────────────
  const combined = [
    ...staticRoutes,
    ...legalRoutes,
    ...hubRoutes,
    ...comparisonRoutes,
    ...leadGenRoutes,
    ...compareDetailRoutes,
    ...reviewRoutes,
    ...reviewDescriptionRoutes,
    ...vendorQuoteRoutes,
    ...blogRoutes,
    ...blogTopicRoutes,
    ...whitePaperRoutes,
  ]

  const seen = new Set<string>()
  return combined.filter((entry) => {
    if (seen.has(entry.url)) return false
    seen.add(entry.url)
    return true
  })
}
