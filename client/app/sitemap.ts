import type { MetadataRoute } from 'next'
import { comparisonPages } from '@/data/comparisons'
import { hubPages } from '@/data/hubs'
import { fetchPublishedBlogSummaries } from '@/lib/blogCms'

const BASE_URL = 'https://www.compare-bazaar.com'

// ─── BUG FIXED ────────────────────────────────────────────────────────────────
// Original code used new Map() which is LAST-WRITE-WINS. That meant
// importedRoutes (flat 0.8 for everything) was silently overriding the
// carefully tiered priorities in staticRoutes, hubRoutes, and comparisonRoutes.
//
// Example of what was actually being emitted before this fix:
//   /          → 0.8  (importedRoutes won over staticRoutes 1.0)
//   /marketing → 0.8  (importedRoutes won over hubRoutes 0.9)
//   /marketing/best-crm-software → 0.8  (importedRoutes won over comparisonRoutes 0.95)
//
// Fix: XML_IMPORTED_PATHS removed entirely. Every URL now lives in exactly one
// typed array with correct priority + changeFrequency. Deduplication uses
// first-write-wins (Set) so higher-tier arrays always take precedence.
// ──────────────────────────────────────────────────────────────────────────────

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // ── 1. Core pages ────────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/browse-all-software`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/editorial-process`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/resources`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/resources/whitepaper`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/start-a-business`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/business-planning`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/advertise`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    // ── Dedicated brand/product pages ──────────────────────────────────────────
    {
      url: `${BASE_URL}/human-resources/deel-hr-payroll`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/human-resources/papaya-global-payroll`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/human-resources/buddy-punch`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/technology/best-payroll-system`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // ── 2. Legal / compliance — crawlable but low priority ───────────────────────
  const legalRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/advertising-disclosure`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-of-use`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/copyright-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/accessibility`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/limit-the-use`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.1,
    },
    {
      url: `${BASE_URL}/do-not-sell`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.1,
    },
  ]

  // ── 3. Hub pages — from data source ─────────────────────────────────────────
  const hubRoutes: MetadataRoute.Sitemap = hubPages.map((hub) => ({
    url: `${BASE_URL}${hub.canonical}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // ── 4. Comparison / category pages — primary ranking targets ─────────────────
  const comparisonRoutes: MetadataRoute.Sitemap = comparisonPages.map((page) => ({
    url: `${BASE_URL}${page.canonical}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // ── 5. Lead-gen quote pages — live + indexed, low SEO priority ───────────────
  // Kept in sitemap at 0.3 so Google knows they exist but deprioritises them
  // in favour of the category and review pages above.
  const leadGenRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/technology/get-free-quotes`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/marketing/get-free-quotes`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/marketing/best-crm-software/get-free-quote`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/marketing/best-email-marketing-services/get-free-quotes`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/marketing/best-website-building-platform/get-free-quotes`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/human-resources/best-payroll-software/get-free-quotes`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/technology/best-payroll-system/get-free-quotes`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/technology/business-phone-systems/get-free-quotes`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/technology/gps-fleet-management-software/get-free-quotes`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/human-resources/best-employee-management-software/get-free-quotes`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/sales/best-crm-software/get-free-quotes`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/sales/best-call-center-management-software/get-free-quotes`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/sales/best-project-management-software/get-free-quotes`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // ── 6. Individual software review pages ──────────────────────────────────────
  const reviewSlugs = [
    // CRM
    'hubspot-crm-review',
    'zoho-crm-review',
    'creatio-review',
    'honeybook-review',
    'pipedrive-review',
    'salesforce-review',
    'hubspot-sales-review',
    'pipedrive-sales-review',
    // Payroll & HR
    'adp-review',
    'zoho-payroll-review',
    'bamboohr-review',
    'bamboohr-employee-review',
    'onpay-review',
    'quickbooks-payroll-review',
    'gusto-review',
    'rippling-review',
    'workday-review',
    'deel-eor-review',
    'deel-contractor-review',
    'deel-payroll-review',
    'deel-hr-review',
    'deel-us-payroll-review',
    'papaya-global-payroll-review',
    'papaya-eor-review',
    'papaya-contractor-review',
    'papaya-workforce-review',
    'buddy-punch-review',
    // Email marketing
    'campaign-monitor-review',
    'campaigner-review',
    'klaviyo-review',
    'getresponse-review',
    'hubspot-email-review',
    'mailchimp-review',
    'activecampaign-review',
    // Project management
    'monday-review',
    'clickup-review',
    'asana-review',
    'notion-review',
    'jira-review',
    // VoIP / phone
    'ooma-review',
    '800com-review',
    'zoom-phone-review',
    'nextiva-review',
    'vonage-review',
    'ringcentral-review',
    'goto-review',
    // Website builders
    'wix-review',
    'godaddy-website-builder-review',
    'mochahost-review',
    'webcom-review',
    'bluehost-review',
    'squarespace-review',
    'shopify-review',
    // GPS fleet
    'motive-review',
    'teletrac-navman-review',
    'verizon-connect-review',
    'samsara-review',
    'surecam-review',
    'fleetio-review',
    // Employee management
    'teramind-review',
    'activtrak-review',
    'hubstaff-review',
    'intelogos-review',
    // Call centre
    'goanswer-review',
    'twilio-review',
    'talkdesk-review',
    'genesys-review',
    'freshdesk-cc-review',
  ] as const

  const reviewRoutes: MetadataRoute.Sitemap = reviewSlugs.map((slug) => ({
    url: `${BASE_URL}/reviews/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  // ── 7. Blog posts — real publish date from CMS ───────────────────────────────
  const cmsPosts = await fetchPublishedBlogSummaries()
  const blogRoutes: MetadataRoute.Sitemap = cmsPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }))

  // ── Merge: first-write-wins ──────────────────────────────────────────────────
  // Arrays listed first have highest precedence. Order matters:
  // staticRoutes > legalRoutes > hubRoutes > comparisonRoutes > leadGenRoutes
  //   > reviewRoutes > blogRoutes
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