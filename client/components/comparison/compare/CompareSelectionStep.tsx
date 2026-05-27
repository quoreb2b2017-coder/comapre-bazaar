'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { ComparePicker } from '@/components/comparison/compare/ComparePicker'
import { CompareProductPanel } from '@/components/comparison/compare/CompareProductPanel'
import { CompareScoreLine } from '@/components/comparison/compare/CompareStars'
import type { Product } from '@/types'

function resolveActiveId(
  relatedProducts: Product[],
  selectedIds: string[],
  preferredId?: string
): string {
  if (preferredId && relatedProducts.some((p) => p.id === preferredId)) return preferredId
  if (selectedIds[0] && relatedProducts.some((p) => p.id === selectedIds[0])) return selectedIds[0]
  return relatedProducts[0]?.id ?? ''
}

export function CompareSelectionStep({
  baseProduct,
  relatedProducts,
  selectedIds,
  previewProductId,
  atMax,
  onToggle,
  onCompare,
  onClear,
}: {
  baseProduct: Product
  relatedProducts: Product[]
  selectedIds: string[]
  /** Left-panel preview when nothing is selected yet (not added to comparison). */
  previewProductId?: string
  atMax: boolean
  onToggle: (productId: string) => void
  onCompare: () => void
  onClear: () => void
}) {
  const canCompare = selectedIds.length > 0
  const baseShort = baseProduct.name.split(' ')[0]

  const [activeId, setActiveId] = useState(() =>
    resolveActiveId(relatedProducts, selectedIds, previewProductId)
  )

  useEffect(() => {
    setActiveId((current) => {
      if (relatedProducts.some((p) => p.id === current)) return current
      return resolveActiveId(relatedProducts, selectedIds, previewProductId)
    })
  }, [relatedProducts, selectedIds, previewProductId])

  const activeProduct = useMemo(
    () => relatedProducts.find((p) => p.id === activeId) ?? relatedProducts[0],
    [relatedProducts, activeId]
  )

  const handleToggle = useCallback(
    (productId: string) => {
      onToggle(productId)
      setActiveId(productId)
    },
    [onToggle]
  )

  const handlePick = useCallback((productId: string) => {
    setActiveId(productId)
  }, [])

  const handleClear = useCallback(() => {
    onClear()
    setActiveId(relatedProducts[0]?.id ?? '')
  }, [onClear, relatedProducts])

  if (!activeProduct) {
    return (
      <p className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-600">
        No other products available to compare.
      </p>
    )
  }

  return (
    <div className="compare-select-step">
      <div className="compare-base-banner">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/30 bg-white/15 text-base font-bold text-white">
            {baseProduct.logo}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-cb-orange-light">
              Your base pick
            </p>
            <p className="font-serif text-xl font-semibold text-white">{baseProduct.name}</p>
            <p className="text-sm text-white/80">{baseProduct.tagline}</p>
          </div>
          <div className="compare-score-badge shrink-0">
            <span className="text-lg font-bold leading-none">{baseProduct.score}</span>
            <span className="text-[10px] opacity-90">/ 5</span>
          </div>
        </div>
      </div>

      <div className="compare-select-layout">
        <div className="compare-select-main min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-cb-orange">
                Against {baseShort}
              </p>
              <h2 className="font-serif text-xl font-semibold text-navy sm:text-2xl">
                {activeProduct.name}
              </h2>
              <div className="mt-1">
                <CompareScoreLine
                  score={activeProduct.score}
                  reviewCount={activeProduct.reviewCount}
                />
              </div>
            </div>
            <span className="compare-vs-pill" aria-hidden="true">
              VS
            </span>
          </div>

          <CompareProductPanel product={activeProduct} variant="secondary" />

          <p className="mt-3 text-center text-xs text-gray-500 lg:hidden">
            Use the list on the right to switch preview or add more products.
          </p>
        </div>

        <ComparePicker
          relatedProducts={relatedProducts}
          baseProduct={baseProduct}
          selectedIds={selectedIds}
          activeId={activeProduct.id}
          atMax={atMax}
          onPick={handlePick}
          onToggle={handleToggle}
          onClear={handleClear}
          onCompare={onCompare}
          canCompare={canCompare}
        />
      </div>
    </div>
  )
}
