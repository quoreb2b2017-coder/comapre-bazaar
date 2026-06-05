import { comparisonPages } from '@/data/comparisons'

export type ReviewCatalogEntry = {
  slug: string
  name: string
  logo: string
  tagline: string
  score: string
  pros: string[]
  categoryPath: string
  categoryLabel: string
}

export function findReviewBySlug(slug: string): ReviewCatalogEntry | null {
  for (const page of comparisonPages) {
    const product = page.products.find((p) => p.reviewSlug === slug)
    if (!product?.reviewSlug) continue
    return {
      slug: product.reviewSlug,
      name: product.name,
      logo: product.logo,
      tagline: product.tagline,
      score: product.score,
      pros: product.pros,
      categoryPath: page.canonical,
      categoryLabel: page.h1,
    }
  }
  return null
}

export function categoryBadgeFromPath(categoryPath: string): string {
  const path = categoryPath.toLowerCase()
  if (path.includes('email-marketing')) return 'Email Marketing Software Review'
  if (path.includes('website-building')) return 'Website Builder Review'
  if (path.includes('payroll') || path.includes('deel') || path.includes('papaya')) return 'Payroll Software Review'
  if (path.includes('business-phone')) return 'Business VoIP Review'
  if (path.includes('call-center')) return 'Call Center Software Review'
  if (path.includes('gps-fleet')) return 'GPS Fleet Management Review'
  if (path.includes('employee-management')) return 'Employee Management Software Review'
  if (path.includes('project-management')) return 'Project Management Software Review'
  if (path.includes('crm')) return 'CRM Software Review'
  return 'Software Review'
}

export const REVIEW_DESCRIPTION_DEFAULT_COVER =
  'linear-gradient(120deg, #0B2A6F 0%, #1D4ED8 72%, #F58220 140%)'
