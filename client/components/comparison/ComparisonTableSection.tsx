'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Table2, Columns3 } from 'lucide-react'
import type { ComparisonPageData } from '@/types'
import { ComparisonTable } from '@/components/comparison/ComparisonTable'
import { CompareMultiTables } from '@/components/comparison/CompareMultiTables'
import { ComparisonSectionHeader } from '@/components/comparison/ComparisonSectionHeader'
import { parseScore } from '@/components/comparison/compare/officialCompareData'
import { cn } from '@/lib/utils'

const COMPARE_SIDE_BY_SIDE_ANCHOR = 'compare_side_by_side'

type ComparisonTableSectionProps = {
  data: ComparisonPageData
  sectionId: string
}

export function ComparisonTableSection({ data, sectionId }: ComparisonTableSectionProps) {
  const [activeTab, setActiveTab] = useState<'table' | 'compare'>('table')

  const compareProducts = [...data.products]
    .sort((a, b) => parseScore(b.score) - parseScore(a.score))
    .slice(0, 4)

  const comparePageHref = `/compare?category=${encodeURIComponent(data.slug)}`

  useEffect(() => {
    const syncTabFromHash = () => {
      const hash = window.location.hash.replace(/^#/, '')
      if (hash === COMPARE_SIDE_BY_SIDE_ANCHOR) {
        setActiveTab('compare')
      } else if (hash === sectionId || hash === 'compare') {
        setActiveTab('table')
      }
    }

    syncTabFromHash()
    window.addEventListener('hashchange', syncTabFromHash)
    return () => window.removeEventListener('hashchange', syncTabFromHash)
  }, [])

  const selectTab = (tab: 'table' | 'compare') => {
    setActiveTab(tab)
    if (tab === 'compare') {
      window.history.replaceState(null, '', `#${COMPARE_SIDE_BY_SIDE_ANCHOR}`)
    } else if (window.location.hash.replace(/^#/, '') === COMPARE_SIDE_BY_SIDE_ANCHOR) {
      window.history.replaceState(null, '', `#${sectionId}`)
    }
  }

  return (
    <div>
      <ComparisonSectionHeader
        id="compare-heading"
        step={2}
        title="Full comparison table"
        description={`Side-by-side specs and pricing · ${data.lastReviewed}`}
      />

      <div className="mt-3 border-b border-gray-100 pb-4">
        <div
          className="inline-flex w-full max-w-md rounded-xl border border-gray-200 bg-gray-50 p-1 sm:w-auto"
          role="tablist"
          aria-label="Comparison view"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'table'}
            onClick={() => selectTab('table')}
            className={cn(
              'inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all sm:flex-initial',
              activeTab === 'table'
                ? 'bg-white text-cb-orange shadow-sm ring-1 ring-cb-orange/25'
                : 'text-gray-500 hover:text-cb-orange'
            )}
          >
            <Table2 className="h-4 w-4" />
            Full table
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'compare'}
            onClick={() => selectTab('compare')}
            className={cn(
              'inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all sm:flex-initial',
              activeTab === 'compare'
                ? 'bg-white text-cb-orange shadow-sm ring-1 ring-cb-orange/25'
                : 'text-gray-500 hover:text-cb-orange'
            )}
          >
            <Columns3 className="h-4 w-4" />
            Compare
          </button>
        </div>
      </div>

      <div id={sectionId} className="scroll-mt-24 mt-4">
        <div id={COMPARE_SIDE_BY_SIDE_ANCHOR} className="scroll-mt-24" aria-hidden="true" />
        {activeTab === 'table' ? (
          <ComparisonTable
            data={data.table}
            caption={`${data.h1}, pricing and feature comparison, ${data.lastReviewed}`}
          />
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              Side-by-side view of our top {compareProducts.length} picks — pricing, strengths, and trade-offs.
            </p>
            <div className="compare-embedded overflow-hidden rounded-xl border border-gray-200 bg-white">
              <CompareMultiTables
                products={compareProducts}
                lastReviewed={data.lastReviewed}
                officialTable={data.table}
              />
            </div>
            {data.products.length > compareProducts.length ? (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cb-orange/20 bg-cb-orange/[0.04] px-4 py-3">
                <p className="text-sm text-gray-600">
                  Compare all {data.products.length} vendors in our interactive tool
                </p>
                <Link
                  href={comparePageHref}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-cb-orange hover:text-cb-orange-hover"
                >
                  Open full compare <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
