import type { ComparisonPageData, TocItem } from '@/types'

const GENERIC_ANCHORS = new Set(['picks', 'compare', 'faqs', 'verdict'])

export function slugToAnchor(value: string) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '_')
}

export function bestComparedAnchor(slug: string) {
  return `best_${slugToAnchor(slug)}_compared`
}

export function productTocAnchor(product: { id: string; name: string }) {
  return slugToAnchor(product.id || product.name)
}

function categoryShortLabel(data: ComparisonPageData) {
  if (data.slug.includes('payroll')) return 'payroll software'
  if (data.slug.includes('crm')) return 'CRM software'
  if (data.slug.includes('email')) return 'email marketing software'
  if (data.slug.includes('phone')) return 'business phone systems'
  if (data.slug.includes('fleet') || data.slug.includes('gps')) return 'fleet management software'
  if (data.slug.includes('employee')) return 'employee management software'
  if (data.slug.includes('call-center')) return 'call center software'
  if (data.slug.includes('project')) return 'project management software'
  if (data.slug.includes('website')) return 'website builder software'
  return 'business software'
}

function advisorCategoryLabel(data: ComparisonPageData) {
  if (data.slug.includes('payroll')) return 'HR Software'
  if (data.slug.includes('crm') || data.slug.includes('email') || data.slug.includes('website')) return 'Marketing Software'
  if (data.slug.includes('employee') || data.slug.includes('deel') || data.slug.includes('papaya')) return 'HR Software'
  return 'Business Software'
}

/** Build rich TOC like Forbes — CTA, overview, what's new, each vendor, table, FAQ */
export function buildRichComparisonTocItems(data: ComparisonPageData): TocItem[] {
  const shortCategory = categoryShortLabel(data)
  const comparedAnchor = bestComparedAnchor(data.slug)

  const items: TocItem[] = [
    {
      label: `Need Help? Talk to an ${advisorCategoryLabel(data)} Advisor`,
      anchor: 'get_free_quotes',
    },
    {
      label: `Best ${shortCategory} compared`,
      anchor: comparedAnchor,
    },
    {
      label: `What's new (as of ${data.lastReviewed})`,
      anchor: 'whats_new',
    },
  ]

  for (const product of data.products) {
    items.push({
      label: `${product.name}: ${product.tagline}`,
      anchor: productTocAnchor(product),
    })
  }

  items.push(
    { label: 'Full comparison table', anchor: 'compare' },
    { label: 'Compare side-by-side', anchor: 'compare_side_by_side' },
    { label: 'Frequently asked questions', anchor: 'faqs' }
  )

  return items
}

/** Use CMS/custom TOC when provided; otherwise auto-build rich TOC */
export function resolveComparisonTocItems(data: ComparisonPageData): TocItem[] {
  const custom = data.tocItems || []
  const looksGeneric =
    custom.length === 0 ||
    (custom.length <= 3 && custom.every((item) => GENERIC_ANCHORS.has(item.anchor)))

  if (!looksGeneric && custom.length > 0) {
    return custom.map((item) => ({
      ...item,
      anchor: slugToAnchor(item.anchor),
    }))
  }

  return buildRichComparisonTocItems(data)
}

export function comparisonSectionIds(data: ComparisonPageData) {
  return {
    picks: bestComparedAnchor(data.slug),
    verdict: 'whats_new',
    compare: 'compare',
    faqs: 'faqs',
    cta: 'get_free_quotes',
  }
}
