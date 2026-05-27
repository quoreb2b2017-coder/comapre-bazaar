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
        'compare-picker-row w-full rounded-xl border bg-white transition-all duration-200',
        active
          ? 'border-navy ring-2 ring-navy/15 shadow-md'
          : selected
            ? 'border-cb-orange bg-cb-orange-soft/50'
            : 'border-gray-200 hover:border-cb-orange/40 hover:shadow-sm',
        disabled && !selected && 'opacity-60'
      )}
    >
      <button
        type="button"
        onClick={onPick}
        className="block w-full p-3.5 text-left"
        aria-current={active ? 'true' : undefined}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-xs font-bold text-cb-orange">
            {product.logo}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-navy">{product.name}</p>
            <p className="truncate text-xs text-gray-500">{product.tagline}</p>
          </div>
          <span className="rounded-lg bg-cb-orange-light px-2 py-1 text-xs font-bold text-navy">
            {product.score}
          </span>
        </div>
        <div className="mt-2.5">
          <CompareStars score={product.score} size="sm" />
        </div>
      </button>

      <div className="flex items-center justify-between border-t border-gray-100 px-3.5 py-2">
        <span className="text-[11px] font-medium text-gray-500">
          {active ? 'Previewing on left' : selected ? 'In comparison' : 'Tap to preview'}
        </span>
        <button
          type="button"
          onClick={onToggleSelect}
          disabled={disabled && !selected}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full border transition-colors',
            selected
              ? 'border-cb-orange bg-cb-orange text-white'
              : disabled
                ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                : 'border-cb-orange-border bg-cb-orange-light text-cb-orange hover:border-cb-orange hover:bg-cb-orange hover:text-white'
          )}
          aria-label={selected ? `Remove ${product.name} from comparison` : `Add ${product.name} to comparison`}
          aria-pressed={selected}
        >
          {selected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
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
      <h2 className="font-serif text-lg font-semibold text-navy">Add to comparison</h2>
      <p className="mt-1 text-sm text-gray-600">
        Right side se select karo. Left par {baseShort} ke against product ka full preview dikhega.
      </p>

      <div className="mt-3 rounded-xl border border-cb-orange-border bg-white px-3 py-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-cb-orange">Base</p>
        <p className="truncate text-sm font-semibold text-navy">{baseProduct.name}</p>
      </div>

      {selectedIds.length > 0 ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-cb-orange hover:underline"
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

      <div className="mt-4 border-t border-cb-orange-border pt-4">
        <p className="mb-2 text-xs text-gray-500">
          <span className="font-semibold text-navy">{selectedIds.length}</span> of {MAX_COMPARE - 1}{' '}
          selected
        </p>
        <button
          type="button"
          disabled={!canCompare}
          onClick={onCompare}
          className={cn(
            'compare-btn-primary w-full gap-2 py-3',
            !canCompare && 'cursor-not-allowed opacity-50'
          )}
        >
          View comparison tables
        </button>
      </div>
    </aside>
  )
}
