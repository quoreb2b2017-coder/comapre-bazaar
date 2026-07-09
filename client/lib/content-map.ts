/**
 * Single source of truth for the hub-and-spoke internal-linking system.
 * RelatedContent, breadcrumbs, and the sitemap all read from this.
 */

export type Pillar = {
  slug: string
  name: string
  path: string
}

export type Hub = {
  slug: string
  name: string
  path: string
  pillar: string
  primaryKeyword: string
  whitepapers?: string[]
}

export type Post = {
  slug: string
  title: string
  hub: string | null
  intent: 'informational' | 'commercial'
  lastVerified: string
}

export const pillars: Pillar[] = [
  { slug: 'marketing', name: 'Marketing', path: '/marketing' },
  { slug: 'technology', name: 'Technology', path: '/technology' },
  { slug: 'sales', name: 'Sales', path: '/sales' },
  { slug: 'human-resources', name: 'HR Software', path: '/human-resources' },
]

export const hubs: Hub[] = [
  { slug: 'crm', name: 'CRM Software', path: '/marketing/best-crm-software', pillar: 'marketing', primaryKeyword: 'best crm software' },
  { slug: 'email-marketing', name: 'Email Marketing', path: '/marketing/best-email-marketing-services', pillar: 'marketing', primaryKeyword: 'best email marketing services' },
  { slug: 'website-builders', name: 'Website Builders', path: '/marketing/best-website-building-platform', pillar: 'marketing', primaryKeyword: 'best website building platform' },
  { slug: 'voip', name: 'Business Phone Systems', path: '/technology/business-phone-systems', pillar: 'technology', primaryKeyword: 'best business phone systems' },
  { slug: 'gps-fleet', name: 'GPS Fleet Management', path: '/technology/gps-fleet-management-software', pillar: 'technology', primaryKeyword: 'best gps fleet management software', whitepapers: ['fleet-telematics-pricing-benchmark'] },
  { slug: 'payroll', name: 'Payroll Software', path: '/human-resources/best-payroll-software', pillar: 'human-resources', primaryKeyword: 'best payroll software', whitepapers: ['payroll-trends-report'] },
  { slug: 'hr', name: 'HR Software', path: '/human-resources/best-hr-software', pillar: 'human-resources', primaryKeyword: 'best hr software', whitepapers: ['pay-transparency-report'] },
  { slug: 'call-center', name: 'Call Center Software', path: '/sales/best-call-center-management-software', pillar: 'sales', primaryKeyword: 'best call center software' },
  { slug: 'project-management', name: 'Project Management', path: '/sales/best-project-management-software', pillar: 'sales', primaryKeyword: 'best project management software' },
]

export const posts: Post[] = [
  { slug: 'why-businesses-need-modern-payroll-systems', title: 'Why Businesses Need Modern Payroll Systems', hub: 'payroll', intent: 'informational', lastVerified: '2026-05-13' },
  { slug: 'gusto-vs-adp-vs-paychex-which-payroll-platform-fits-your-headcount', title: 'Gusto vs. ADP vs. Paychex: Which Payroll Platform Fits Your Headcount?', hub: 'payroll', intent: 'commercial', lastVerified: '2026-05-13' },
  { slug: 'how-to-choose-the-right-crm-for-your-company', title: 'How to Choose the Right CRM for Your Company', hub: 'crm', intent: 'informational', lastVerified: '2026-05-13' },
  { slug: 'hubspot-vs-salesforce-which-crm-is-right-for-your-business-in-2026', title: 'HubSpot vs Salesforce: Which CRM Is Right for Your Business in 2026?', hub: 'crm', intent: 'commercial', lastVerified: '2026-05-13' },
  { slug: 'ai-agents-vs-traditional-software-why-2026-is-the-year-business-automation-changes-forever', title: 'AI Agents vs Traditional Software', hub: 'crm', intent: 'informational', lastVerified: '2026-05-13' },
  { slug: 'smart-gps-fleet-management-solutions-for-businesses', title: 'Smart GPS Fleet Management Solutions for Businesses', hub: 'gps-fleet', intent: 'informational', lastVerified: '2026-05-12' },
  { slug: 'what-is-voip-a-complete-beginners-guide-for-2026', title: "What is VoIP? A Complete Beginner's Guide for 2026", hub: 'voip', intent: 'informational', lastVerified: '2026-05-12' },
]

export const hubBySlug = Object.fromEntries(hubs.map((h) => [h.slug, h]))
export const pillarBySlug = Object.fromEntries(pillars.map((p) => [p.slug, p]))

export function postsForHub(hubSlug: string, limit = 5): Post[] {
  return posts.filter((p) => p.hub === hubSlug).slice(0, limit)
}

export function siblingPosts(postSlug: string, limit = 3): Post[] {
  const post = posts.find((p) => p.slug === postSlug)
  if (!post?.hub) return []
  return posts.filter((p) => p.hub === post.hub && p.slug !== postSlug).slice(0, limit)
}

export function primaryHubForPost(postSlug: string): Hub | null {
  const post = posts.find((p) => p.slug === postSlug)
  return post?.hub ? hubBySlug[post.hub] ?? null : null
}

export function coverageGaps(min = 3) {
  return hubs
    .map((h) => ({ hub: h.slug, count: postsForHub(h.slug, 99).length }))
    .filter((r) => r.count < min)
}

/** Strip trailing timestamp suffix from blog slugs (matches redirect regex). */
export function normalizeBlogSlug(slug: string): string {
  return slug.replace(/-\d{10,}$/, '')
}

/** Content-map lastVerified for a blog slug, if known. */
export function lastVerifiedForPost(slug: string): string | undefined {
  const normalized = normalizeBlogSlug(slug)
  return posts.find((p) => p.slug === normalized)?.lastVerified
}
