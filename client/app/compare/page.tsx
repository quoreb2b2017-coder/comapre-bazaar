import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ComparePageClient } from '@/components/comparison/compare/ComparePageClient'
import { ComparePageSkeleton } from '@/components/comparison/compare/ComparePageSkeleton'
import type { ComparePagePayload } from '@/components/comparison/compare/types'
import { parseVsParam } from '@/lib/compareUrl'
import { getComparisonPageBySlug } from '@/data/comparisons'
import type { Product } from '@/types'

type ComparePageProps = {
  searchParams: {
    category?: string
    brand?: string | string[]
    vs?: string | string[]
  }
}

function toComparePayload(page: NonNullable<ReturnType<typeof getComparisonPageBySlug>>): ComparePagePayload {
  return {
    slug: page.slug,
    canonical: page.canonical,
    lastReviewed: page.lastReviewed,
    breadcrumbs: page.breadcrumbs,
    products: page.products,
  }
}

function ComparePageContent({ searchParams }: ComparePageProps) {
  const category = searchParams.category ?? ''
  const baseBrandId = Array.isArray(searchParams.brand)
    ? searchParams.brand[0] ?? ''
    : searchParams.brand ?? ''
  const vsIds = parseVsParam(searchParams.vs)
  const page = getComparisonPageBySlug(category)

  if (!page) notFound()

  if (baseBrandId && !page.products.some((p) => p.id === baseBrandId)) {
    notFound()
  }

  const baseProduct = page.products.find((p) => p.id === baseBrandId) ?? page.products[0]
  if (!baseProduct) notFound()

  const relatedProducts = page.products.filter((p) => p.id !== baseProduct.id)
  const selectedProducts = vsIds
    .map((id) => relatedProducts.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p))

  if (vsIds.length !== selectedProducts.length) notFound()

  const brandId = baseProduct.id

  return (
    <ComparePageClient
      page={toComparePayload(page)}
      initialBrandId={brandId}
      initialVsIds={vsIds}
    />
  )
}

export default function ComparePage(props: ComparePageProps) {
  return (
    <Suspense fallback={<ComparePageSkeleton />}>
      <ComparePageContent {...props} />
    </Suspense>
  )
}
