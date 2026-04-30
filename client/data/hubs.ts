import type { HubPageData } from '@/types'

export const hubPages: HubPageData[] = [
  {
    slug: 'marketing',
    title: 'Marketing Software Comparisons & Buying Guides (2026) | Compare Bazaar',
    metaDescription:
      'Expert-reviewed comparisons of the best marketing software for 2026 — CRM, email marketing, website builders, and more. Independent, updated monthly.',
    canonical: '/marketing',
    h1: 'Marketing software comparisons & buying guides',
    subtitle:
      'Expert-tested tools for growing your business — from CRM to email marketing to website builders. Every platform independently reviewed.',
    breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Marketing' }],
    cards: [
      {
        href: '/marketing/best-crm-software',
        icon: 'handshake',
        title: 'Best CRM Software (2026)',
        description: 'HubSpot vs Zoho vs Salesforce — 11 platforms compared on pipeline, automation, and pricing.',
        meta: '11 platforms reviewed',
      },
      {
        href: '/marketing/best-email-marketing-services',
        icon: 'mail',
        title: 'Best Email Marketing Services',
        description: 'Mailchimp, Klaviyo, ActiveCampaign ranked on deliverability, automation, and list pricing.',
        meta: '9 platforms reviewed',
      },
      {
        href: '/marketing/best-website-building-platform',
        icon: 'globe',
        title: 'Best Website Builders (2026)',
        description: 'Wix, Squarespace, Shopify compared on design, SEO, and e-commerce features.',
        meta: '8 platforms reviewed',
      },
    ],
  },
  {
    slug: 'technology',
    title: 'Business Technology Software Reviews (2026) | Compare Bazaar',
    metaDescription:
      'Expert comparisons of the best business technology tools — payroll, VoIP, fleet management, employee management software. Updated for 2026.',
    canonical: '/technology',
    h1: 'Business technology software comparisons',
    subtitle:
      'From payroll to VoIP to fleet management — unbiased comparisons to help you choose the right tools.',
    breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Technology' }],
    cards: [
      {
        href: '/human-resources/best-payroll-software',
        icon: 'wallet',
        title: 'Best Payroll Software (2026)',
        description: 'Gusto, ADP, OnPay compared on tax compliance, contractor support, and pricing.',
        meta: '8 platforms reviewed',
      },
      {
        href: '/technology/business-phone-systems',
        icon: 'phone',
        title: 'Best VoIP & Business Phone Systems',
        description: 'RingCentral, Nextiva, Ooma compared on call quality, mobile apps, and pricing.',
        meta: '8 platforms reviewed',
      },
      {
        href: '/technology/gps-fleet-management-software',
        icon: 'truck',
        title: 'Best GPS Fleet Management Software',
        description: 'Samsara, Verizon Connect, Fleetio ranked on GPS accuracy, AI safety, and cost.',
        meta: '7 platforms reviewed',
      },
      {
        href: '/human-resources/best-employee-management-software',
        icon: 'users',
        title: 'Best Employee Management Software',
        description: 'Rippling, BambooHR, Workday compared on HR automation, onboarding, and compliance.',
        meta: '8 platforms reviewed',
      },
    ],
  },
  {
    slug: 'sales',
    title: 'Sales Software Comparisons & Buying Guides (2026) | Compare Bazaar',
    metaDescription:
      'Expert comparisons of the best sales software — CRM, call centre, project management. Tested and ranked for 2026.',
    canonical: '/sales',
    h1: 'Sales software comparisons & buying guides',
    subtitle:
      'CRM, call centre, and project management tools — tested and ranked to help your team close more.',
    breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Sales' }],
    cards: [
      {
        href: '/sales/best-crm-software',
        icon: 'target',
        title: 'Best CRM for Sales Teams (2026)',
        description: 'Pipedrive, Salesforce, HubSpot Sales Hub ranked for pipeline management and forecasting.',
        meta: '8 platforms reviewed',
      },
      {
        href: '/sales/best-call-center-management-software',
        icon: 'headset',
        title: 'Best Call Centre Software (2026)',
        description: 'Talkdesk, Genesys, Freshdesk Contact Centre compared on AI, omnichannel, and pricing.',
        meta: '8 platforms reviewed',
      },
      {
        href: '/sales/best-project-management-software',
        icon: 'clipboard',
        title: 'Best Project Management Software',
        description: 'Monday.com, ClickUp, Asana ranked on views, automation, and team size fit.',
        meta: '9 platforms reviewed',
      },
    ],
  },
  {
    slug: 'human-resources',
    title: 'Best HR Software Comparisons & Reviews (2026) | Compare Bazaar',
    metaDescription:
      'Expert-reviewed HR software comparisons — employee management, payroll, onboarding tools. Updated for 2026.',
    canonical: '/human-resources',
    h1: 'HR software comparisons & buying guides',
    subtitle:
      'Employee management, payroll, and HR tools — tested by experts with real HR backgrounds.',
    breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'HR Software' }],
    cards: [
      {
        href: '/human-resources/best-employee-management-software',
        icon: 'users',
        title: 'Best Employee Management Software',
        description: 'Rippling, BambooHR, Workday ranked on automation, onboarding, and compliance.',
        meta: '8 platforms reviewed',
      },
      {
        href: '/human-resources/best-payroll-software',
        icon: 'wallet',
        title: 'Best Payroll Software for Small Business',
        description: 'Gusto, ADP, OnPay compared on tax filing, contractors, and ease of use.',
        meta: '8 platforms reviewed',
      },
    ],
  },
]

export function getHubBySlug(slug: string): HubPageData | undefined {
  return hubPages.find((h) => h.slug === slug)
}
