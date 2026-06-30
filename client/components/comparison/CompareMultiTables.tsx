import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CheckIcon } from '@/components/ui/icons'
import { FullReviewLink } from '@/components/reviews/FullReviewLink'
import {
  buildComparisonRows,
  type CompareCellValue,
} from '@/components/comparison/compare/compareTableContent'
import type { ComparisonTableData, Product } from '@/types'

interface CompareMultiTablesProps {
  products: Product[]
  lastReviewed?: string
  officialTable?: ComparisonTableData
}

function CompareCellContent({
  value,
  rich,
  variant = 'default',
}: {
  value: CompareCellValue
  rich?: boolean
  variant?: 'default' | 'main' | 'watch' | 'score'
}) {
  if (variant === 'score' && typeof value === 'string') {
    return <span className="compare-score-pill">{value}</span>
  }

  if (Array.isArray(value)) {
    if (variant === 'main') {
      return (
        <ol className="compare-main-points">
          {value.map((item, i) => (
            <li key={item}>
              <span className="compare-main-points-num" aria-hidden>
                {i + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      )
    }

    if (variant === 'watch') {
      return (
        <ul className="compare-watch-points">
          {value.map((item) => (
            <li key={item}>
              <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-600" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
    }

    return (
      <ul className={cn('compare-cell-list', rich && 'compare-cell-list-rich')}>
        {value.map((item) => (
          <li key={item} className="flex gap-2 text-left">
            <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-cb-orange" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <p className={cn('m-0 text-left leading-relaxed', rich ? 'text-sm text-gray-700' : 'text-gray-800')}>
      {value}
    </p>
  )
}

export function CompareMultiTables({ products, lastReviewed, officialTable }: CompareMultiTablesProps) {
  if (products.length < 2) return null

  const rows = buildComparisonRows(products, officialTable)
  const colCount = products.length
  const colSpan = colCount + 1

  return (
    <div className="compare-results-block">
      <section className="compare-table-shell compare-table-shell-expanded">
        <div className="compare-table-head">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cb-orange">
                Side-by-side comparison
              </p>
              <h2 className="font-serif text-xl font-normal tracking-tight text-navy sm:text-[1.35rem]">
                Main points & official pricing
              </h2>
              <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-gray-600">
                {lastReviewed
                  ? `${colCount} products · prices aligned to our category guide (${lastReviewed}). Confirm on each vendor site before purchase.`
                  : `${colCount} products compared with official-style pricing, main strengths, and short watch-outs.`}
              </p>
            </div>
            <p className="compare-scroll-hint hidden sm:block" aria-hidden>
              Scroll →
            </p>
          </div>
        </div>

        <div className="compare-table-scroll">
          <table className="compare-data-table compare-data-table-expanded">
            <thead>
              <tr className="compare-data-thead-row">
                <th className="compare-row-label-head" scope="col">
                  Compared
                </th>
                {products.map((product) => (
                  <th key={product.id} className="compare-col-head compare-col-head-expanded" scope="col">
                    <span className="compare-col-logo">{product.logo}</span>
                    <span className="compare-col-name">{product.name}</span>
                    <span className="compare-col-score">{product.score} / 5</span>
                    {product.isTopPick ? <span className="compare-col-badge">Top pick</span> : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) =>
                row.kind === 'section' ? (
                  <tr key={`section-${row.label}`} className="compare-section-row">
                    <th colSpan={colSpan} scope="colgroup">
                      <span className="block">{row.label}</span>
                      {row.hint ? (
                        <span className="mt-0.5 block text-[10px] font-normal normal-case tracking-normal text-white/60">
                          {row.hint}
                        </span>
                      ) : null}
                    </th>
                  </tr>
                ) : (
                  <tr
                    key={row.label}
                    className={cn('compare-data-row', rowIdx % 2 === 1 && 'compare-data-row-alt')}
                  >
                    <th className="compare-row-label compare-row-label-expanded" scope="row">
                      <span className="block font-semibold text-navy">{row.label}</span>
                      {row.sublabel ? (
                        <span className="mt-0.5 block text-xs font-normal text-gray-500">{row.sublabel}</span>
                      ) : null}
                    </th>
                    {row.values.map((value, i) => (
                      <td
                        key={`${row.label}-${products[i]?.id ?? i}`}
                        className={cn(
                          'compare-data-cell',
                          row.rich && 'compare-data-cell-rich',
                          row.highlight && 'compare-data-cell-highlight',
                          row.variant === 'score' && row.bestIndex === i && 'compare-data-cell-best'
                        )}
                      >
                        <CompareCellContent
                          value={value}
                          rich={row.rich}
                          variant={row.variant}
                        />
                      </td>
                    ))}
                  </tr>
                )
              )}

              <tr className="compare-section-row">
                <th colSpan={colSpan} scope="colgroup">
                  Next steps
                </th>
              </tr>
              <tr className="compare-data-row">
                <th className="compare-row-label compare-row-label-expanded" scope="row">
                  <span className="block font-semibold text-navy">Official site</span>
                </th>
                {products.map((product) => (
                  <td key={`visit-${product.id}`} className="compare-data-cell compare-data-cell-rich">
                    <a
                      href={product.vendorUrl}
                      rel="sponsored noopener noreferrer"
                      target="_blank"
                      className="compare-table-link"
                    >
                      Visit {product.name.split(' ')[0]} →
                    </a>
                  </td>
                ))}
              </tr>
              <tr className="compare-data-row compare-data-row-alt">
                <th className="compare-row-label compare-row-label-expanded" scope="row">
                  <span className="block font-semibold text-navy">Full review</span>
                </th>
                {products.map((product) => (
                  <td key={`review-${product.id}`} className="compare-data-cell compare-data-cell-rich">
                    <FullReviewLink
                      reviewSlug={product.reviewSlug}
                      productName={product.name}
                      label="Read review"
                      linkClassName="compare-table-link-secondary"
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <p className="border-t border-gray-100 bg-gray-50 px-5 py-3 text-xs leading-relaxed text-gray-500">
          Pricing and plan details are taken from each vendor&apos;s public pages and our category comparison
          tables{lastReviewed ? ` (last reviewed ${lastReviewed})` : ''}. Rates change — always confirm on the
          official site before signing up.
        </p>
      </section>
    </div>
  )
}
