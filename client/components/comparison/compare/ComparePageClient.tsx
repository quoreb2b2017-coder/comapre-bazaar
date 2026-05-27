'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Pencil } from 'lucide-react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { CompareActiveBar } from '@/components/comparison/compare/CompareActiveBar'
import { ComparePageHeader } from '@/components/comparison/compare/ComparePageHeader'
import { CompareProductPanel } from '@/components/comparison/compare/CompareProductPanel'
import { CompareSelectionStep } from '@/components/comparison/compare/CompareSelectionStep'
import { CompareTablesSkeleton } from '@/components/comparison/compare/ComparePageSkeleton'
import { MAX_COMPARE } from '@/components/comparison/compare/constants'
import type { ComparePagePayload } from '@/components/comparison/compare/types'
import type { Product } from '@/types'

const CompareMultiTables = dynamic(
  () =>
    import('@/components/comparison/CompareMultiTables').then((mod) => mod.CompareMultiTables),
  { loading: () => <CompareTablesSkeleton /> }
)

function buildCompareUrl(slug: string, brandId: string, vsIds: string[]) {
  const params = new URLSearchParams()
  params.set('category', slug)
  params.set('brand', brandId)
  if (vsIds.length > 0) params.set('vs', vsIds.join(','))
  return `/compare?${params.toString()}`
}

type ComparePhase = 'select' | 'results'

export function ComparePageClient({
  page,
  initialBrandId,
  initialVsIds,
}: {
  page: ComparePagePayload
  initialBrandId: string
  initialVsIds: string[]
}) {
  const initialBaseProduct = page.products.find((p) => p.id === initialBrandId) ?? page.products[0]
  const initialVsKey = initialVsIds.join(',')

  const brandId = initialBaseProduct.id
  const [vsIds, setVsIds] = useState(initialVsIds)
  const [phase, setPhase] = useState<ComparePhase>('select')

  const baseProduct = useMemo(
    () => page.products.find((p) => p.id === brandId) ?? page.products[0],
    [page.products, brandId]
  )

  const relatedProducts = useMemo(
    () => page.products.filter((p) => p.id !== baseProduct.id),
    [page.products, baseProduct.id]
  )

  const selectedProducts = useMemo(
    () =>
      vsIds
        .map((id) => relatedProducts.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p)),
    [vsIds, relatedProducts]
  )

  const comparedProducts = useMemo(
    () => [baseProduct, ...selectedProducts],
    [baseProduct, selectedProducts]
  )

  const atMax = comparedProducts.length >= MAX_COMPARE
  const baseShort = baseProduct.name.split(' ')[0]
  const showDetailPanels = phase === 'results' && selectedProducts.length === 1

  const syncUrl = useCallback(
    (nextVsIds: string[]) => {
      const url = buildCompareUrl(page.slug, baseProduct.id, nextVsIds)
      window.history.replaceState(window.history.state, '', url)
    },
    [page.slug, baseProduct.id]
  )

  const toggleProduct = useCallback(
    (productId: string) => {
      setVsIds((prev) => {
        const isSelected = prev.includes(productId)
        const next = isSelected ? prev.filter((id) => id !== productId) : [...prev, productId]
        syncUrl(next)
        return next
      })
    },
    [syncUrl]
  )

  const clearSelection = useCallback(() => {
    setVsIds([])
    syncUrl([])
    setPhase('select')
  }, [syncUrl])

  const openComparison = useCallback(() => {
    if (vsIds.length === 0) return
    setPhase('results')
  }, [vsIds.length])

  const editSelection = useCallback(() => {
    setPhase('select')
  }, [])

  // Sync only when URL-driven brand/vs changes — not on every client render.
  useEffect(() => {
    const ids = initialVsKey ? initialVsKey.split(',').filter(Boolean) : []
    setVsIds(ids)
    setPhase('select')
  }, [initialBaseProduct.id, initialVsKey])

  return (
    <main className="compare-page">
      <div className="compare-page-inner">
        <Breadcrumb
          items={[...page.breadcrumbs, { label: `Compare ${baseShort}` }]}
          className="mb-4"
        />

        <ComparePageHeader
          baseShort={baseShort}
          selectedProducts={selectedProducts}
          phase={phase}
          backHref={page.canonical}
        />

        {phase === 'select' ? (
          <CompareSelectionStep
            baseProduct={baseProduct}
            relatedProducts={relatedProducts}
            selectedIds={vsIds}
            previewProductId={relatedProducts[0]?.id}
            atMax={atMax}
            onToggle={toggleProduct}
            onCompare={openComparison}
            onClear={clearSelection}
          />
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <CompareActiveBar
                comparedProducts={comparedProducts}
                onReset={clearSelection}
                selectedCount={vsIds.length}
              />
              <button
                type="button"
                onClick={editSelection}
                className="compare-btn-secondary inline-flex items-center gap-2 !py-2 text-sm"
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                Edit selection
              </button>
            </div>

            <section className="mb-8" aria-label="Comparison tables">
              <CompareMultiTables products={comparedProducts} lastReviewed={page.lastReviewed} />
            </section>

            {showDetailPanels ? (
              <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <CompareProductPanel product={baseProduct} variant="primary" />
                <div className="relative min-w-0">
                  <span className="compare-vs-badge" aria-hidden="true">
                    VS
                  </span>
                  <CompareProductPanel product={selectedProducts[0]} variant="secondary" />
                </div>
              </div>
            ) : selectedProducts.length > 1 ? (
              <p className="mb-6 rounded-2xl border border-dashed border-cb-orange-border bg-white/90 px-4 py-3 text-sm leading-relaxed text-gray-600">
                <span className="font-semibold text-navy">{comparedProducts.length} products</span> in
                your tables above. Select exactly one competitor to also see full detail cards
                side-by-side.
              </p>
            ) : null}
          </>
        )}
      </div>
    </main>
  )
}
