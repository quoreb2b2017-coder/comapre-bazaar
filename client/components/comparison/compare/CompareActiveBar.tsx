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
    <div className="compare-active-bar flex-1" role="status" aria-live="polite">
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">Comparing</span>
      <div className="flex flex-wrap items-center gap-1.5">
        {comparedProducts.map((p, i) => (
          <span key={p.id} className="inline-flex items-center gap-1.5 text-[13px] text-navy">
            {i > 0 ? <span className="text-gray-300">vs</span> : null}
            <span className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-[#FAFBFD] px-2.5 py-1">
              <span className="text-[10px] font-bold text-cb-orange">{p.logo}</span>
              <span className="font-medium">{p.name.split(' ')[0]}</span>
            </span>
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={onReset}
        className="ml-auto text-[12px] font-semibold text-gray-500 transition-colors hover:text-cb-orange"
      >
        Reset
      </button>
      <span className="w-full text-[11px] text-gray-400 sm:ml-0 sm:w-auto">
        {selectedCount} of {MAX_COMPARE - 1} slots used
      </span>
    </div>
  )
}
