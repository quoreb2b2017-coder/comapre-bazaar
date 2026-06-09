import type { Metadata } from 'next'
import { getComparisonPageBySlug } from '@/data/comparisons'
import { buildMetadata, SITE_URL } from '@/lib/seo'

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

export type QuoteSearchParams = {
  vendor?: string | string[]
  ref?: string | string[]
  product?: string | string[]
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
  const path = brandId
    ? `/compare?category=${category}&brand=${brandId}`
    : `/compare?category=${category}`
  const title = `${product.name} Review and Pricing 2026`
  const description = buildCompareBrandMetaDescription(product.name, category)

  return buildMetadata({
    title,
    description,
    canonical: path,
    ogTitle: `${title} | Compare Bazaar`,
    ogUrl: `${SITE_URL}${path}`,
  })
}

export type QuotePageConfig = {
  baseTitle: string
  canonical: string
  baseDescription: string
  vendorCategoryLabel: string
  vendorTitleSuffix: string
  baseH1: string
  vendorH1Category: string
}

export const QUOTE_PAGE_CONFIGS = {
  'technology/best-payroll-system/get-free-quotes': {
    baseTitle: 'Best Payroll Software 2026',
    canonical: '/technology/best-payroll-system/get-free-quotes',
    baseDescription:
      'Get free quotes from top Payroll Software providers. Compare pricing and features to find the right fit for your team.',
    vendorCategoryLabel: 'payroll software',
    vendorTitleSuffix: 'Payroll Software Quote',
    baseH1: 'Get Free Quotes from Top Payroll Software Providers',
    vendorH1Category: 'Payroll Software',
  },
  'technology/gps-fleet-management-software/get-free-quotes': {
    baseTitle: 'Best GPS Fleet Tracking Software 2026',
    canonical: '/technology/gps-fleet-management-software/get-free-quotes',
    baseDescription:
      'Get free quotes from top Gps Fleet Tracking Software providers. Compare pricing and features to find the right fit for your team.',
    vendorCategoryLabel: 'GPS fleet management software',
    vendorTitleSuffix: 'Fleet Tracking Quote',
    baseH1: 'Get Free Quotes from Leading GPS Fleet Tracking Providers',
    vendorH1Category: 'GPS Fleet Tracking Software',
  },
  'technology/business-phone-systems/get-free-quotes': {
    baseTitle: 'Best Business Phone Systems 2026',
    canonical: '/technology/business-phone-systems/get-free-quotes',
    baseDescription:
      'Get free quotes from top Business Phone System providers. Compare pricing and features to find the right fit for your team.',
    vendorCategoryLabel: 'business phone system',
    vendorTitleSuffix: 'Phone System Quote',
    baseH1: 'Get Free Quotes from Top Business Phone System Providers',
    vendorH1Category: 'Business Phone System',
  },
  'sales/best-call-center-management-software/get-free-quotes': {
    baseTitle: 'Best Call Center Software 2026',
    canonical: '/sales/best-call-center-management-software/get-free-quotes',
    baseDescription:
      'Get free quotes from top Call Center Software providers. Compare pricing and features to find the right fit for your team.',
    vendorCategoryLabel: 'call center software',
    vendorTitleSuffix: 'Call Center Quote',
    baseH1: 'Get Free Quotes from Top Call Center Software Providers',
    vendorH1Category: 'Call Center Software',
  },
  'sales/best-project-management-software/get-free-quotes': {
    baseTitle: 'Best Project Management Software 2026',
    canonical: '/sales/best-project-management-software/get-free-quotes',
    baseDescription:
      'Get free quotes from top Project Management Software providers. Compare pricing and features to find the right fit for your team.',
    vendorCategoryLabel: 'project management software',
    vendorTitleSuffix: 'Project Management Quote',
    baseH1: 'Get Free Quotes from Top Project Management Software Providers',
    vendorH1Category: 'Project Management Software',
  },
  'sales/best-crm-software/get-free-quotes': {
    baseTitle: 'Best CRM Software 2026',
    canonical: '/sales/best-crm-software/get-free-quotes',
    baseDescription:
      'Get free quotes from top Crm Software providers. Compare pricing and features to find the right fit for your team.',
    vendorCategoryLabel: 'CRM software',
    vendorTitleSuffix: 'CRM Software Quote',
    baseH1: 'Get Free Quotes from Top CRM Software Providers',
    vendorH1Category: 'CRM Software',
  },
  'marketing/best-email-marketing-services/get-free-quotes': {
    baseTitle: 'Best Email Marketing Software 2026',
    canonical: '/marketing/best-email-marketing-services/get-free-quotes',
    baseDescription:
      'Get free quotes from top Email Marketing Software providers. Compare pricing and features to find the right fit for your team.',
    vendorCategoryLabel: 'email marketing software',
    vendorTitleSuffix: 'Email Marketing Quote',
    baseH1: 'Get Free Quotes from Top Email Marketing Platforms',
    vendorH1Category: 'Email Marketing Software',
  },
  'marketing/best-website-building-platform/get-free-quotes': {
    baseTitle: 'Best Website Builders 2026',
    canonical: '/marketing/best-website-building-platform/get-free-quotes',
    baseDescription:
      'Get free quotes from top Website Builder providers. Compare pricing and features to find the right fit for your team.',
    vendorCategoryLabel: 'website builder',
    vendorTitleSuffix: 'Website Builder Quote',
    baseH1: 'Get Free Quotes from Top Website Builders',
    vendorH1Category: 'Website Builder',
  },
  'marketing/best-crm-software/get-free-quote': {
    baseTitle: 'Best CRM Software 2026',
    canonical: '/marketing/best-crm-software/get-free-quote',
    baseDescription:
      'Get free quotes from top Crm Software providers. Compare pricing and features to find the right fit for your team.',
    vendorCategoryLabel: 'CRM software',
    vendorTitleSuffix: 'CRM Software Quote',
    baseH1: 'Get Free Quotes from Top CRM Software Providers',
    vendorH1Category: 'CRM Software',
  },
  'human-resources/best-payroll-software/get-free-quotes': {
    baseTitle: 'Best Payroll Software 2026',
    canonical: '/human-resources/best-payroll-software/get-free-quotes',
    baseDescription:
      'Get free quotes from top Payroll Software providers. Compare pricing and features to find the right fit for your team.',
    vendorCategoryLabel: 'payroll software',
    vendorTitleSuffix: 'Payroll Software Quote',
    baseH1: 'Get Free Quotes from Top Payroll Software Providers',
    vendorH1Category: 'Payroll Software',
  },
  'human-resources/best-employee-management-software/get-free-quotes': {
    baseTitle: 'Best Employee Management Software 2026',
    canonical: '/human-resources/best-employee-management-software/get-free-quotes',
    baseDescription:
      'Compare top employee management software providers. Get free quotes for onboarding, performance, and workforce analytics tools.',
    vendorCategoryLabel: 'employee management software',
    vendorTitleSuffix: 'Employee Management Quote',
    baseH1: 'Find the Right Employee Management Software for Your Team',
    vendorH1Category: 'Employee Management Software',
  },
  'technology/best-employee-management-software/get-free-quotes': {
    baseTitle: 'Best Employee Management Software 2026',
    canonical: '/technology/best-employee-management-software/get-free-quotes',
    baseDescription:
      'Compare top employee management software providers. Get free quotes for onboarding, performance, and workforce analytics tools.',
    vendorCategoryLabel: 'employee management software',
    vendorTitleSuffix: 'Employee Management Quote',
    baseH1: 'Find the Right Employee Management Software for Your Team',
    vendorH1Category: 'Employee Management Software',
  },
} as const satisfies Record<string, QuotePageConfig>

export type QuotePageKey = keyof typeof QUOTE_PAGE_CONFIGS

function parseParam(value?: string | string[]): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value
  const trimmed = raw?.trim()
  return trimmed ? decodeURIComponent(trimmed) : undefined
}

function buildVendorQuoteDescription(vendor: string, categoryLabel: string): string {
  return `Ready to try ${vendor}? Get a free quote today and see if it is the right ${categoryLabel} for your business.`
}

export function buildQuotePagePath(
  canonical: string,
  searchParams?: QuoteSearchParams
): string {
  const params = new URLSearchParams()
  const vendor = parseParam(searchParams?.vendor)
  const ref = parseParam(searchParams?.ref)
  const product = parseParam(searchParams?.product)

  if (ref) params.set('ref', ref)
  if (product) params.set('product', product)
  if (vendor) params.set('vendor', vendor)

  const qs = params.toString()
  return qs ? `${canonical}?${qs}` : canonical
}

export function buildQuotePageHeading(
  key: QuotePageKey,
  searchParams?: QuoteSearchParams
): string {
  const config = QUOTE_PAGE_CONFIGS[key]
  const vendor = parseParam(searchParams?.vendor)
  if (vendor) {
    return `Get a Free ${config.vendorH1Category} Quote from ${vendor}`
  }
  return config.baseH1
}

export function buildQuotePageMetadata(
  key: QuotePageKey,
  searchParams?: QuoteSearchParams
): Metadata {
  const config = QUOTE_PAGE_CONFIGS[key]
  const vendor = parseParam(searchParams?.vendor)
  const path = buildQuotePagePath(config.canonical, searchParams)
  const title = vendor ? `${vendor} ${config.vendorTitleSuffix}` : config.baseTitle
  const description = vendor
    ? buildVendorQuoteDescription(vendor, config.vendorCategoryLabel)
    : config.baseDescription

  return buildMetadata({
    title,
    description,
    canonical: path,
    ogTitle: `${title} | Compare Bazaar`,
    ogUrl: `${SITE_URL}${path}`,
  })
}
