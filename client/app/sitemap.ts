import type { MetadataRoute } from 'next'
import { comparisonPages } from '@/data/comparisons'
import { hubPages } from '@/data/hubs'
import { fetchPublishedBlogSummaries } from '@/lib/blogCms'

const BASE_URL = 'https://www.compare-bazaar.com'

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

  // ── 4. Comparison / category pages ───────────────────────────────────────
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
    { url: `${BASE_URL}/technology/business-phone-systems/get-free-quotes`,                 lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/technology/gps-fleet-management-software/get-free-quotes`,          lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/human-resources/best-employee-management-software/get-free-quotes`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/sales/best-crm-software/get-free-quotes`,                           lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/sales/best-call-center-management-software/get-free-quotes`,        lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/sales/best-project-management-software/get-free-quotes`,            lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // ── 6. Review pages — only slugs confirmed live ───────────────────────────
  // CRM slugs (hubspot-crm-review, salesforce-review, pipedrive-review, zoho-crm-review)
  // removed until content records are confirmed in database
  const reviewSlugs = [
    // Payroll & HR
    'adp-review', 'zoho-payroll-review', 'bamboohr-review', 'bamboohr-employee-review',
    'onpay-review', 'quickbooks-payroll-review', 'gusto-review', 'rippling-review', 'workday-review',
    // Email marketing
    'campaign-monitor-review', 'campaigner-review', 'klaviyo-review', 'getresponse-review',
    'hubspot-email-review', 'mailchimp-review', 'activecampaign-review',
    // Project management
    'monday-review', 'clickup-review', 'asana-review', 'notion-review', 'jira-review',
    // VoIP / phone
    'ooma-review', '800com-review', 'zoom-phone-review', 'nextiva-review',
    'vonage-review', 'ringcentral-review', 'goto-review',
    // Website builders
    'wix-review', 'godaddy-website-builder-review', 'mochahost-review', 'webcom-review',
    'bluehost-review', 'squarespace-review', 'shopify-review',
    // GPS fleet
    'motive-review', 'teletrac-navman-review', 'verizon-connect-review',
    'samsara-review', 'surecam-review', 'fleetio-review',
    // Employee management
    'teramind-review', 'activtrak-review', 'hubstaff-review', 'intelogos-review',
    // Call centre
    'goanswer-review', 'twilio-review', 'talkdesk-review', 'genesys-review', 'freshdesk-cc-review',
    // Sales CRM (these are confirmed live via comparisonPages products)
    'hubspot-sales-review', 'pipedrive-sales-review',
    // CRM - add back when database records confirmed live:
    // 'hubspot-crm-review', 'zoho-crm-review', 'pipedrive-review', 'salesforce-review',
  ] as const

  const reviewRoutes: MetadataRoute.Sitemap = reviewSlugs.map((slug) => ({
    url: `${BASE_URL}/reviews/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  // ── 7. Blog posts from CMS ────────────────────────────────────────────────
  const cmsPosts = await fetchPublishedBlogSummaries()
  const blogRoutes: MetadataRoute.Sitemap = cmsPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }))

  // ── Merge: first-write-wins ───────────────────────────────────────────────
  const combined = [
    ...staticRoutes,
    ...legalRoutes,
    ...hubRoutes,
    ...comparisonRoutes,
    ...leadGenRoutes,
    ...reviewRoutes,
    ...blogRoutes,
  ]

  const seen = new Set<string>()
  return combined.filter((entry) => {
    if (seen.has(entry.url)) return false
    seen.add(entry.url)
    return true
  })
}
