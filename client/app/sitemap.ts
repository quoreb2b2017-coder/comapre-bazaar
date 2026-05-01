import type { MetadataRoute } from 'next'
import { comparisonPages } from '@/data/comparisons'
import { hubPages } from '@/data/hubs'
import { blogPosts } from '@/data/blogPosts'

const BASE_URL = 'https://www.compare-bazaar.com'
const XML_IMPORTED_PATHS = [
  '/advertising-disclosure',
  '/',
  '/marketing',
  '/technology',
  '/sales',
  '/human-resources',
  '/blog',
  '/technology/get-free-quotes',
  '/marketing/get-free-quotes',
  '/editorial-process',
  '/marketing/best-crm-software',
  '/human-resources/best-payroll-software',
  '/marketing/best-email-marketing-services',
  '/sales/best-project-management-software',
  '/technology/business-phone-systems',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms-of-use',
  '/accessibility',
  '/do-not-sell',
  '/marketing/best-website-building-platform',
  '/technology/gps-fleet-management-software',
  '/human-resources/best-employee-management-software',
  '/sales/best-crm-software',
  '/sales/best-call-center-management-software',
  '/marketing/best-crm-software/get-free-quote',
  '/marketing/best-email-marketing-services/get-free-quotes',
  '/marketing/best-website-building-platform/get-free-quotes',
  '/human-resources/best-payroll-software/get-free-quotes',
  '/technology/business-phone-systems/get-free-quotes',
  '/technology/gps-fleet-management-software/get-free-quotes',
  '/human-resources/best-employee-management-software/get-free-quotes',
  '/sales/best-crm-software/get-free-quotes',
  '/sales/best-call-center-management-software/get-free-quotes',
  '/sales/best-project-management-software/get-free-quotes',
  '/browse-all-software',
  '/reviews/hubspot-crm-review',
  '/reviews/zoho-crm-review',
  '/reviews/creatio-review',
  '/reviews/honeybook-review',
  '/reviews/pipedrive-review',
  '/reviews/salesforce-review',
  '/reviews/adp-review',
  '/reviews/zoho-payroll-review',
  '/reviews/bamboohr-review',
  '/reviews/bamboohr-employee-review',
  '/reviews/onpay-review',
  '/reviews/quickbooks-payroll-review',
  '/reviews/gusto-review',
  '/reviews/campaign-monitor-review',
  '/reviews/campaigner-review',
  '/reviews/klaviyo-review',
  '/reviews/getresponse-review',
  '/reviews/hubspot-email-review',
  '/reviews/mailchimp-review',
  '/reviews/activecampaign-review',
  '/reviews/monday-review',
  '/reviews/clickup-review',
  '/reviews/asana-review',
  '/reviews/notion-review',
  '/reviews/jira-review',
  '/reviews/ooma-review',
  '/reviews/800com-review',
  '/reviews/zoom-phone-review',
  '/reviews/nextiva-review',
  '/reviews/vonage-review',
  '/reviews/ringcentral-review',
  '/reviews/wix-review',
  '/reviews/godaddy-website-builder-review',
  '/reviews/mochahost-review',
  '/reviews/webcom-review',
  '/reviews/bluehost-review',
  '/reviews/squarespace-review',
  '/reviews/shopify-review',
  '/reviews/motive-review',
  '/reviews/teletrac-navman-review',
  '/reviews/verizon-connect-review',
  '/reviews/samsara-review',
  '/reviews/surecam-review',
  '/reviews/fleetio-review',
  '/reviews/teramind-review',
  '/reviews/activtrak-review',
  '/reviews/hubstaff-review',
  '/reviews/intelogos-review',
  '/reviews/rippling-review',
  '/reviews/workday-review',
  '/reviews/hubspot-sales-review',
  '/reviews/pipedrive-sales-review',
  '/reviews/goto-review',
  '/reviews/goanswer-review',
  '/reviews/twilio-review',
  '/reviews/talkdesk-review',
  '/reviews/genesys-review',
  '/reviews/freshdesk-cc-review',
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/editorial-process`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/resources`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/advertising-disclosure`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/advertise`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/start-a-business`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/business-planning`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/resources/whitepaper`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/limit-the-use`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE_URL}/copyright-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
  ]

  const hubRoutes: MetadataRoute.Sitemap = hubPages.map((hub) => ({
    url: `${BASE_URL}${hub.canonical}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const comparisonRoutes: MetadataRoute.Sitemap = comparisonPages.map((page) => ({
    url: `${BASE_URL}${page.canonical}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.95,
  }))

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }))

  const importedRoutes: MetadataRoute.Sitemap = XML_IMPORTED_PATHS.map((path) => ({
    url: path === '/' ? BASE_URL : `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: path.startsWith('/reviews/') ? 0.75 : 0.8,
  }))

  const combined = [...staticRoutes, ...hubRoutes, ...comparisonRoutes, ...blogRoutes, ...importedRoutes]

  return Array.from(
    new Map(combined.map((entry) => [entry.url, entry])).values()
  )
}
