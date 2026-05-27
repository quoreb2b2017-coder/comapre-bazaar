import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { CheckIcon, XIcon } from '@/components/ui/icons'
import type { Product } from '@/types'

const MAX_FEATURE_ROWS = 6
const MAX_CON_ROWS = 3

interface CompareMultiTablesProps {
  products: Product[]
  lastReviewed?: string
}

function TableShell({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="compare-table-shell">
      <div className="compare-table-head">
        <h2 className="font-serif text-lg font-semibold text-white">{title}</h2>
        <p className="mt-0.5 text-sm text-white/75">{description}</p>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </section>
  )
}

export function CompareMultiTables({ products, lastReviewed }: CompareMultiTablesProps) {
  if (products.length < 2) return null

  const featureRowCount = Math.min(
    MAX_FEATURE_ROWS,
    Math.max(...products.map((p) => p.pros.length), 0)
  )
  const conRowCount = Math.min(MAX_CON_ROWS, Math.max(...products.map((p) => p.cons.length), 0))

  const priceRows: { label: string; values: string[]; highlight?: boolean }[] = [
    {
      label: 'Starting price',
      highlight: true,
      values: products.map((p) => `${p.pricingAmount}${p.pricingPeriod ? ` ${p.pricingPeriod}` : ''}`),
    },
    { label: 'Billing', values: products.map((p) => p.pricingLabel) },
    { label: 'Expert score', values: products.map((p) => `${p.score} / 5`) },
    { label: 'Reviews', values: products.map((p) => p.reviewCount.toLocaleString()) },
    { label: 'Best for', values: products.map((p) => p.tagline) },
  ]

  const featureRows: { label: string; values: (string | null)[] }[] = [
    { label: 'Summary', values: products.map((p) => p.tagline) },
    ...Array.from({ length: featureRowCount }, (_, i) => ({
      label: `Strength ${i + 1}`,
      values: products.map((p) => p.pros[i] ?? null),
    })),
    ...Array.from({ length: conRowCount }, (_, i) => ({
      label: `Limitation ${i + 1}`,
      values: products.map((p) => p.cons[i] ?? null),
    })),
  ]

  const colCount = products.length

  return (
    <div className="compare-results-block space-y-6">
      <TableShell
        title="Price comparison"
        description={
          lastReviewed
            ? `${colCount} products · pricing verified ${lastReviewed}`
            : `${colCount} products side-by-side`
        }
      >
        <table className="compare-data-table">
          <thead>
            <tr className="compare-data-thead-row">
              <th className="compare-row-label-head" scope="col">
                Metric
              </th>
              {products.map((product) => (
                <th key={product.id} className="compare-col-head" scope="col">
                  <span className="text-cb-orange">{product.logo}</span>
                  <span className="mt-0.5 block font-sans normal-case tracking-normal text-white/95">
                    {product.name.split(' ')[0]}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {priceRows.map((row, rowIdx) => (
              <tr
                key={row.label}
                className={cn(rowIdx % 2 === 1 ? 'bg-cb-orange-light/40' : 'bg-white')}
              >
                <th className="compare-row-label" scope="row">
                  {row.label}
                </th>
                {row.values.map((value, i) => (
                  <td
                    key={`${row.label}-${i}`}
                    className={cn(
                      'compare-data-cell',
                      row.highlight && 'text-base font-bold text-navy'
                    )}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </TableShell>

      <TableShell
        title="Features & highlights"
        description="Strengths and limitations from Compare Bazaar editorial reviews"
      >
        <table className="compare-data-table">
          <thead>
            <tr className="compare-data-thead-row">
              <th className="compare-row-label-head" scope="col">
                Topic
              </th>
              {products.map((product) => (
                <th key={product.id} className="compare-col-head" scope="col">
                  <span className="text-cb-orange">{product.logo}</span>
                  <span className="mt-0.5 block font-sans normal-case tracking-normal text-white/95">
                    {product.name.split(' ')[0]}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {featureRows.map((row, rowIdx) => (
              <tr
                key={row.label}
                className={cn(rowIdx % 2 === 1 ? 'bg-gray-50' : 'bg-white')}
              >
                <th className="compare-row-label" scope="row">
                  {row.label}
                </th>
                {row.values.map((value, i) => (
                  <td key={`${row.label}-${i}`} className="compare-data-cell align-top">
                    {value ? (
                      <div className="flex gap-2 text-left text-sm leading-snug text-gray-700">
                        <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-cb-orange" />
                        <span>{value}</span>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <XIcon className="h-4 w-4 text-gray-300" aria-hidden />
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </TableShell>

      <div className="compare-results-actions">
        {products.map((product) => (
          <div key={product.id} className="compare-results-action-card">
            <span className="text-xs font-bold text-cb-orange">{product.logo}</span>
            <a
              href={product.vendorUrl}
              rel="sponsored noopener noreferrer"
              target="_blank"
              className="compare-btn-primary !px-4 !py-2 text-xs"
            >
              Visit {product.name.split(' ')[0]} →
            </a>
            <Link
              href={`/reviews/${product.reviewSlug}`}
              className="text-xs font-semibold text-brand hover:underline"
            >
              Review
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
