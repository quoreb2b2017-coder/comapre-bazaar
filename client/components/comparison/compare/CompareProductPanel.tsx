import Link from 'next/link'
import { CheckIcon } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'
import { getMainPoints, getShortWatchOuts } from '@/components/comparison/compare/officialCompareData'
import { WORKS_BEST_FOR_BY_PRODUCT } from './constants'
import { CompareScoreLine } from './CompareStars'

export function CompareProductPanel({
  product,
  variant = 'primary',
}: {
  product: Product
  variant?: 'primary' | 'secondary'
}) {
  const worksBestFor = WORKS_BEST_FOR_BY_PRODUCT[product.id] ?? product.pros.slice(0, 4)
  const mainPoints = getMainPoints(product)
  const watchOuts = getShortWatchOuts(product)

  return (
    <article className="compare-card flex h-full flex-col">
      <div
        className={cn(
          variant === 'secondary' ? 'compare-card-header-navy border-t-4 border-t-navy' : 'compare-card-header'
        )}
      >
        <div className="flex flex-wrap items-start gap-4">
          <div
            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-cb-orange-border bg-white text-base font-bold text-cb-orange shadow-sm"
            aria-hidden="true"
          >
            {product.logo}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-serif text-xl font-semibold tracking-tight text-navy sm:text-2xl">
              {product.name}
            </h2>
            <p className="mt-0.5 text-sm font-medium text-cb-orange">{product.tagline}</p>
            <div className="mt-2">
              <CompareScoreLine score={product.score} reviewCount={product.reviewCount} />
            </div>
          </div>
          <div className="compare-score-badge" aria-label={`Score ${product.score} out of 5`}>
            <span className="text-lg font-bold leading-none">{product.score}</span>
            <span className="text-[10px] opacity-90">/ 5</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-100 px-5 py-4 sm:px-6">
        <a
          href={product.vendorUrl}
          rel="sponsored noopener noreferrer"
          target="_blank"
          className="compare-btn-primary"
        >
          Visit {product.name.split(' ')[0]} →
        </a>
        <Link href={`/reviews/${product.reviewSlug}`} className="compare-btn-secondary">
          Full review
        </Link>
      </div>

      <div className="space-y-0 divide-y divide-gray-100 px-5 sm:px-6">
        <section className="py-5">
          <h3 className="compare-section-label">Pricing</h3>
          <p className="mt-2">
            <span className="text-sm text-gray-500">{product.pricingLabel} </span>
            <span className="text-2xl font-bold text-navy">{product.pricingAmount}</span>
            <span className="text-sm text-gray-500">{product.pricingPeriod}</span>
          </p>
        </section>

        <section className="py-5">
          <h3 className="compare-section-label">Works best for</h3>
          <ul className="mt-3 space-y-2.5">
            {worksBestFor.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-snug text-gray-700">
                <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-cb-orange" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="py-5">
          <h3 className="compare-section-label">Main points</h3>
          <ul className="mt-3 space-y-2">
            {mainPoints.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-snug text-gray-700">
                <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-cb-orange" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {watchOuts.length > 0 ? (
          <section className="py-5">
            <h3 className="compare-section-label">Watch out for</h3>
            <ul className="mt-3 space-y-2">
              {watchOuts.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-snug text-amber-900/85">
                  <span className="mt-0.5 text-amber-600" aria-hidden>
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </article>
  )
}
