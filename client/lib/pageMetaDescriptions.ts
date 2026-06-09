import type { Metadata } from 'next'
import { getComparisonPageBySlug } from '@/data/comparisons'
import { buildMetadata } from '@/lib/seo'

const COMPARE_CATEGORY_LABELS: Record<string, string> = {
  'crm-software': 'CRM software',
  'email-marketing': 'email marketing software',
  'website-builder': 'website builder',
  'papaya-global-payroll': 'global payroll software',
  'deel-hr-payroll': 'HR and payroll software',
  'payroll-software': 'payroll software',
  'technology-payroll': 'payroll software',
  'business-phone-systems': 'business phone system',
  'gps-fleet-management': 'GPS fleet tracking software',
  'employee-management': 'employee management software',
  'sales-crm': 'CRM software',
  'call-center': 'call center software',
  'project-management': 'project management software',
}

export function buildCompareBrandMetaDescription(brandName: string, categorySlug: string): string {
  const categoryLabel = COMPARE_CATEGORY_LABELS[categorySlug] ?? 'software'
  return `See how ${brandName} compares to other ${categoryLabel} options. Honest review covering features, real pricing, and who it works best for.`
}

export function buildComparePageMetadata(searchParams: {
  category?: string
  brand?: string | string[]
}): Metadata {
  const category = searchParams.category ?? ''
  const brandId = Array.isArray(searchParams.brand)
    ? searchParams.brand[0] ?? ''
    : searchParams.brand ?? ''
  const page = getComparisonPageBySlug(category)

  if (!page) {
    return buildMetadata({
      title: 'Compare Business Software',
      description:
        'Side-by-side software comparisons with expert reviews, pricing breakdowns, and ranked recommendations.',
      canonical: '/compare',
    })
  }

  const product = page.products.find((p) => p.id === brandId) ?? page.products[0]
  const canonical = brandId
    ? `/compare?category=${category}&brand=${brandId}`
    : `/compare?category=${category}`

  return buildMetadata({
    title: `${product.name} Comparison`,
    description: buildCompareBrandMetaDescription(product.name, category),
    canonical,
  })
}

export type QuotePageConfig = {
  title: string
  canonical: string
  baseDescription: string
  vendorCategoryLabel: string
  baseH1: string
  vendorH1Category: string
}

export const QUOTE_PAGE_CONFIGS = {
  'technology/best-payroll-system/get-free-quotes': {
    title: 'Get Payroll Software Quotes',
    canonical: '/technology/best-payroll-system/get-free-quotes',
    baseDescription:
      'Get free quotes from top payroll software providers. Compare pricing and features to find the right fit for your team.',
    vendorCategoryLabel: 'payroll software',
    baseH1: 'Get Free Quotes from Top Payroll Software Providers',
    vendorH1Category: 'Payroll Software',
  },
  'technology/gps-fleet-management-software/get-free-quotes': {
    title: 'Get GPS Fleet Management Quotes',
    canonical: '/technology/gps-fleet-management-software/get-free-quotes',
    baseDescription:
      'Get free quotes from leading GPS fleet tracking providers. Find the right solution for your fleet size and budget.',
    vendorCategoryLabel: 'GPS fleet management software',
    baseH1: 'Get Free Quotes from Leading GPS Fleet Tracking Providers',
    vendorH1Category: 'GPS Fleet Tracking Software',
  },
  'technology/business-phone-systems/get-free-quotes': {
    title: 'Get Business Phone System Quotes',
    canonical: '/technology/business-phone-systems/get-free-quotes',
    baseDescription:
      'Get free quotes from top business phone system providers. Compare plans and features to find the right fit for your team.',
    vendorCategoryLabel: 'business phone system',
    baseH1: 'Get Free Quotes from Top Business Phone System Providers',
    vendorH1Category: 'Business Phone System',
  },
  'sales/best-call-center-management-software/get-free-quotes': {
    title: 'Get Call Center Software Quotes',
    canonical: '/sales/best-call-center-management-software/get-free-quotes',
    baseDescription:
      'Get free quotes from top call center software providers. Compare pricing and features to find the right fit for your support team.',
    vendorCategoryLabel: 'call center software',
    baseH1: 'Get Free Quotes from Top Call Center Software Providers',
    vendorH1Category: 'Call Center Software',
  },
  'sales/best-project-management-software/get-free-quotes': {
    title: 'Get Project Management Software Quotes',
    canonical: '/sales/best-project-management-software/get-free-quotes',
    baseDescription:
      'Get free quotes from leading project management tools. Compare pricing to find what works best for your team.',
    vendorCategoryLabel: 'project management software',
    baseH1: 'Get Free Quotes from Top Project Management Software Providers',
    vendorH1Category: 'Project Management Software',
  },
  'sales/best-crm-software/get-free-quotes': {
    title: 'Get CRM Software Quotes',
    canonical: '/sales/best-crm-software/get-free-quotes',
    baseDescription:
      'Get free quotes from top CRM platforms. Compare pricing, features, and support to find the right fit for your sales team.',
    vendorCategoryLabel: 'CRM software',
    baseH1: 'Get Free Quotes from Top CRM Software Providers',
    vendorH1Category: 'CRM Software',
  },
  'marketing/best-email-marketing-services/get-free-quotes': {
    title: 'Get Email Marketing Quotes',
    canonical: '/marketing/best-email-marketing-services/get-free-quotes',
    baseDescription:
      'Get free quotes from leading email marketing platforms. Find the right tool for your campaigns without the guesswork.',
    vendorCategoryLabel: 'email marketing software',
    baseH1: 'Get Free Quotes from Top Email Marketing Platforms',
    vendorH1Category: 'Email Marketing Software',
  },
  'marketing/best-website-building-platform/get-free-quotes': {
    title: 'Get Website Builder Quotes',
    canonical: '/marketing/best-website-building-platform/get-free-quotes',
    baseDescription:
      'Get free quotes from top website builders. Find the right platform to launch your site without overpaying.',
    vendorCategoryLabel: 'website builder',
    baseH1: 'Get Free Quotes from Top Website Builders',
    vendorH1Category: 'Website Builder',
  },
  'marketing/best-crm-software/get-free-quote': {
    title: 'Get Free CRM Software Quotes',
    canonical: '/marketing/best-crm-software/get-free-quote',
    baseDescription:
      'Get free quotes from top CRM platforms. Compare pricing, features, and support to find the right fit for your sales team.',
    vendorCategoryLabel: 'CRM software',
    baseH1: 'Get Free Quotes from Top CRM Software Providers',
    vendorH1Category: 'CRM Software',
  },
  'human-resources/best-payroll-software/get-free-quotes': {
    title: 'Get Payroll Software Quotes',
    canonical: '/human-resources/best-payroll-software/get-free-quotes',
    baseDescription:
      'Get free quotes from top payroll software providers. Compare pricing and features to find the right fit for your team.',
    vendorCategoryLabel: 'payroll software',
    baseH1: 'Get Free Quotes from Top Payroll Software Providers',
    vendorH1Category: 'Payroll Software',
  },
  'human-resources/best-employee-management-software/get-free-quotes': {
    title: 'Get Employee Management Software Quotes',
    canonical: '/human-resources/best-employee-management-software/get-free-quotes',
    baseDescription:
      'Compare top employee management software providers. Get free quotes for onboarding, performance, and workforce analytics tools.',
    vendorCategoryLabel: 'employee management software',
    baseH1: 'Find the Right Employee Management Software for Your Team',
    vendorH1Category: 'Employee Management Software',
  },
  'technology/best-employee-management-software/get-free-quotes': {
    title: 'Get Employee Management Software Quotes',
    canonical: '/technology/best-employee-management-software/get-free-quotes',
    baseDescription:
      'Compare top employee management software providers. Get free quotes for onboarding, performance, and workforce analytics tools.',
    vendorCategoryLabel: 'employee management software',
    baseH1: 'Find the Right Employee Management Software for Your Team',
    vendorH1Category: 'Employee Management Software',
  },
} as const satisfies Record<string, QuotePageConfig>

export type QuotePageKey = keyof typeof QUOTE_PAGE_CONFIGS

function parseVendorParam(vendor?: string | string[]): string | undefined {
  const raw = Array.isArray(vendor) ? vendor[0] : vendor
  const trimmed = raw?.trim()
  return trimmed ? decodeURIComponent(trimmed) : undefined
}

function buildVendorQuoteDescription(vendor: string, categoryLabel: string): string {
  return `Ready to try ${vendor}? Get a free quote today and see if it is the right ${categoryLabel} for your business.`
}

export function buildQuotePageHeading(
  key: QuotePageKey,
  searchParams?: { vendor?: string | string[] }
): string {
  const config = QUOTE_PAGE_CONFIGS[key]
  const vendor = parseVendorParam(searchParams?.vendor)
  if (vendor) {
    return `Get a Free ${config.vendorH1Category} Quote from ${vendor}`
  }
  return config.baseH1
}

export function buildQuotePageMetadata(
  key: QuotePageKey,
  searchParams?: { vendor?: string | string[] }
): Metadata {
  const config = QUOTE_PAGE_CONFIGS[key]
  const vendor = parseVendorParam(searchParams?.vendor)
  const description = vendor
    ? buildVendorQuoteDescription(vendor, config.vendorCategoryLabel)
    : config.baseDescription

  return buildMetadata({
    title: config.title,
    description,
    canonical: config.canonical,
  })
}
