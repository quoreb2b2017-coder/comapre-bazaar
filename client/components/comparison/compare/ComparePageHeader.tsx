import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Product } from '@/types'

type ComparePhase = 'select' | 'results'

export function ComparePageHeader({
  baseShort,
  selectedProducts,
  phase,
  backHref,
}: {
  baseShort: string
  selectedProducts: Product[]
  phase: ComparePhase
  backHref: string
}) {
  const isSelect = phase === 'select'

  return (
    <header className="compare-hero">
      <div>
        <p className="compare-eyebrow">Compare Bazaar · Side-by-side</p>
        <h1 className="compare-title">
          {isSelect ? (
            <>Compare {baseShort}</>
          ) : (
            <>
              {baseShort}
              {selectedProducts.length === 1 ? (
                <>
                  {' '}
                  <span className="font-sans font-normal text-gray-400">vs</span>{' '}
                  {selectedProducts[0].name.split(' ')[0]}
                </>
              ) : (
                <span className="font-sans font-normal text-gray-500">
                  {' '}
                  vs {selectedProducts.length} others
                </span>
              )}
            </>
          )}
        </h1>
        <p className="compare-subtitle">
          {isSelect
            ? 'Pick competitors below, then open your comparison — tables load only when you are ready.'
            : 'Pricing and feature tables below. Use Edit selection to change products without leaving the page.'}
        </p>
      </div>
      <Link href={backHref} className="compare-btn-ghost">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to rankings
      </Link>
    </header>
  )
}
