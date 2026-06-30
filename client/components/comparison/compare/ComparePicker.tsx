'use client'

import { Check, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'
import { MAX_COMPARE } from './constants'
import { CompareStars } from './CompareStars'

function ComparePickerItem({
  product,
  selected,
  active,
  disabled,
  onPick,
  onToggleSelect,
}: {
  product: Product
  selected: boolean
  active: boolean
  disabled: boolean
  onPick: () => void
  onToggleSelect: () => void
}) {
  return (
    <div
      className={cn(
        'w-full border bg-white transition-colors',
        active
          ? 'border-navy/30 bg-[#FAFBFD] ring-1 ring-navy/10'
          : selected
            ? 'border-cb-orange/30 bg-[#FFFBF7]'
            : 'border-gray-200 hover:border-gray-300',
        disabled && !selected && 'opacity-50'
      )}
    >
      <button
        type="button"
        onClick={onPick}
        className="block w-full px-3 py-3 text-left"
        aria-current={active ? 'true' : undefined}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-[11px] font-bold text-navy">
            {product.logo}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-navy">{product.name}</p>
            <p className="truncate text-[11px] text-gray-500">{product.tagline}</p>
          </div>
          <span className="rounded border border-gray-200 bg-[#FAFBFD] px-2 py-0.5 font-serif text-sm tabular-nums text-navy">
            {product.score}
          </span>
        </div>
        <div className="mt-2">
          <CompareStars score={product.score} size="sm" />
        </div>
      </button>

      <div className="flex items-center justify-between border-t border-gray-100 px-3 py-2">
        <span className="text-[11px] text-gray-500">
          {active ? 'Previewing' : selected ? 'Added' : 'Tap to preview'}
        </span>
        <button
          type="button"
          onClick={onToggleSelect}
          disabled={disabled && !selected}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-md border transition-colors',
            selected
              ? 'border-cb-orange bg-cb-orange text-white'
              : disabled
                ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300'
                : 'border-gray-200 bg-white text-gray-600 hover:border-cb-orange hover:text-cb-orange'
          )}
          aria-label={selected ? `Remove ${product.name} from comparison` : `Add ${product.name} to comparison`}
          aria-pressed={selected}
        >
          {selected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  )
}

export function ComparePicker({
  relatedProducts,
  baseProduct,
  selectedIds,
  activeId,
  atMax,
  onPick,
  onToggle,
  onClear,
  onCompare,
  canCompare,
}: {
  relatedProducts: Product[]
  baseProduct: Product
  selectedIds: string[]
  activeId: string
  atMax: boolean
  onPick: (productId: string) => void
  onToggle: (productId: string) => void
  onClear: () => void
  onCompare: () => void
  canCompare: boolean
}) {
  const baseShort = baseProduct.name.split(' ')[0]

  return (
    <aside className="compare-picker">
      <h2 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
        Add to comparison
      </h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-gray-600">
        Pick up to {MAX_COMPARE - 1} competitors to compare against {baseShort}.
      </p>

      <div className="mt-4 border border-gray-200 bg-[#FAFBFD] px-3 py-2.5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-gray-400">Base</p>
        <p className="truncate text-[13px] font-semibold text-navy">{baseProduct.name}</p>
      </div>

      {selectedIds.length > 0 ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-cb-orange hover:text-cb-orange-hover"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          Clear selection
        </button>
      ) : null}

      <div className="mt-4 flex-1 space-y-2 overflow-y-auto pr-0.5">
        {relatedProducts.map((product) => (
          <ComparePickerItem
            key={product.id}
            product={product}
            selected={selectedIds.includes(product.id)}
            active={activeId === product.id}
            disabled={atMax && !selectedIds.includes(product.id)}
            onPick={() => onPick(product.id)}
            onToggleSelect={() => onToggle(product.id)}
          />
        ))}
      </div>

      <div className="mt-4 border-t border-gray-200 pt-4">
        <p className="mb-2 text-[11px] text-gray-500">
          <span className="font-semibold tabular-nums text-navy">{selectedIds.length}</span> of{' '}
          {MAX_COMPARE - 1} selected
        </p>
        <button
          type="button"
          disabled={!canCompare}
          onClick={onCompare}
          className={cn('compare-btn-primary w-full py-2.5', !canCompare && 'cursor-not-allowed opacity-50')}
        >
          View comparison table
        </button>
      </div>
    </aside>
  )
}
