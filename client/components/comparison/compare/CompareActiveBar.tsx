'use client'

import type { Product } from '@/types'
import { MAX_COMPARE } from './constants'

export function CompareActiveBar({
  comparedProducts,
  onReset,
  selectedCount,
}: {
  comparedProducts: Product[]
  onReset: () => void
  selectedCount: number
}) {
  return (
    <div className="compare-active-bar" role="status" aria-live="polite">
      <span className="text-xs font-semibold uppercase tracking-wider text-cb-orange">Comparing</span>
      {comparedProducts.map((p) => (
        <span
          key={p.id}
          className="inline-flex items-center gap-1.5 rounded-full border border-cb-orange-border bg-white px-3 py-1 text-sm font-semibold text-navy shadow-sm"
        >
          <span className="text-xs font-bold text-cb-orange">{p.logo}</span>
          {p.name.split(' ')[0]}
        </span>
      ))}
      <button
        type="button"
        onClick={onReset}
        className="ml-auto text-sm font-semibold text-gray-600 transition-colors hover:text-cb-orange"
      >
        Reset
      </button>
      <span className="w-full text-xs text-gray-500 sm:ml-0 sm:w-auto">
        {selectedCount} of {MAX_COMPARE - 1} extra slots
      </span>
    </div>
  )
}
