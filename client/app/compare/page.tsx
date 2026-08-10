import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ComparePageClient } from '@/components/comparison/compare/ComparePageClient'
import type { ComparePagePayload } from '@/components/comparison/compare/types'
import { parseVsParam } from '@/lib/compareUrl'
import { loadComparisonPage } from '@/lib/comparisonPageCms'
import { buildComparePageMetadataAsync } from '@/lib/pageMetaDescriptions'
import type { ComparisonPageData, Product } from '@/types'

export const revalidate = 120

type ComparePageProps = {
  searchParams: {
    category?: string
    brand?: string | string[]
    vs?: string | string[]
  }
}

export async function generateMetadata({ searchParams }: ComparePageProps): Promise<Metadata> {
  return buildComparePageMetadataAsync(searchParams)
}

function toComparePayload(page: ComparisonPageData): ComparePagePayload {
  return {
    slug: page.slug,
    canonical: page.canonical,
    lastReviewed: page.lastReviewed,
    breadcrumbs: page.breadcrumbs,
    products: page.products,
    officialTable: page.table,
  }
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const category = searchParams.category ?? ''
  const baseBrandId = Array.isArray(searchParams.brand)
    ? searchParams.brand[0] ?? ''
    : searchParams.brand ?? ''
  const vsIds = parseVsParam(searchParams.vs)
  const page = await loadComparisonPage(category)

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

  return (
    <ComparePageClient
      page={toComparePayload(page)}
      initialBrandId={baseProduct.id}
      initialVsIds={vsIds}
    />
  )
}
