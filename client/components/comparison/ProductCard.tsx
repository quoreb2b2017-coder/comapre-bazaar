import Link from 'next/link'
import type { Product } from '@/types'
import { cn } from '@/lib/utils'
import { CheckIcon, XIcon } from '@/components/ui/icons'
import { FullReviewLink } from '@/components/reviews/FullReviewLink'

const BADGE_STYLES: Record<string, string> = {
  top: 'bg-cb-orange/10 text-cb-orange ring-1 ring-cb-orange/20',
  free: 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80',
  trial: 'bg-amber-50 text-amber-900 ring-1 ring-amber-200/80',
  new: 'bg-violet-50 text-violet-800 ring-1 ring-violet-200/80',
}

const EMOJI_REGEX = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu

interface ProductCardProps {
  product: Product
  rank?: number
  compareHref?: string
  quoteHref?: string
  variant?: 'default' | 'marketing-smooth' | 'technology-smooth' | 'sales-smooth' | 'hr-smooth'
}

export function ProductCard({
  product,
  rank,
  compareHref = '/browse-all-software',
  quoteHref,
}: ProductCardProps) {
  const displayName = product.id === 'hubspot' ? 'HubSpot CRM' : product.name

  return (
    <article
      id={product.id}
      className={cn('px-5 py-5 sm:px-6 sm:py-6', product.isTopPick && 'bg-[#FFFBF7]')}
    >
      {/* Header row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[auto_1fr_auto] sm:items-start sm:gap-4">
        <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-2">
          {rank != null ? (
            <span className="font-serif text-lg tabular-nums leading-none text-gray-300 sm:text-xl">
              {String(rank).padStart(2, '0')}
            </span>
          ) : null}
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-xs font-bold text-navy"
            aria-hidden
          >
            {product.logo}
          </div>
        </div>

        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            {product.isTopPick ? (
              <span className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-cb-orange/10 text-cb-orange ring-1 ring-cb-orange/20">
                Editor&apos;s pick
              </span>
            ) : null}
            {product.badges.map((badge) => (
              <span
                key={badge.label}
                className={cn(
                  'rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                  BADGE_STYLES[badge.variant] ?? BADGE_STYLES.trial
                )}
              >
                {badge.label.replace(EMOJI_REGEX, '').trim()}
              </span>
            ))}
          </div>
          <h3 className="font-serif text-[1.2rem] leading-snug tracking-tight text-navy sm:text-[1.3rem]">
            {displayName}
          </h3>
          <p className="mt-1 text-[13px] text-gray-600">{product.tagline}</p>
        </div>

        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-start">
          <div className="rounded-md border border-gray-200 bg-white px-3 py-2 text-center sm:min-w-[72px]">
            <p className="font-serif text-xl tabular-nums leading-none text-navy">{product.score}</p>
            <p className="mt-0.5 text-[9px] uppercase tracking-wider text-gray-400">Score / 5</p>
          </div>
          <Link
            href={compareHref}
            prefetch
            className="text-[12px] font-semibold text-cb-orange hover:text-cb-orange-hover sm:mt-1"
            aria-label={`Compare ${product.name} options`}
          >
            Compare →
          </Link>
        </div>
      </div>

      {/* Pros / cons */}
      <div className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-gray-200 bg-gray-200 sm:grid-cols-2">
        <div className="bg-[#FAFBFD] p-3.5 sm:p-4">
          <h4 className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">Pros</h4>
          <ul className="space-y-2">
            {product.pros.map((pro, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-snug text-gray-700">
                <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cb-orange" />
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-3.5 sm:p-4">
          <h4 className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">Cons</h4>
          <ul className="space-y-2">
            {product.cons.map((con, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-snug text-gray-700">
                <XIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer toolbar */}
      <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
            {product.pricingLabel}
          </p>
          <p className="mt-0.5">
            <span className="text-base font-semibold tabular-nums text-navy">{product.pricingAmount}</span>
            <span className="ml-1 text-[13px] text-gray-500">{product.pricingPeriod}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {quoteHref ? (
            <Link
              href={quoteHref}
              className="inline-flex rounded-md bg-cb-orange px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-cb-orange-hover"
            >
              Get free quotes
            </Link>
          ) : null}
          {product.affiliateActive === true ? (
            <a
              href={product.vendorUrl}
              rel="sponsored noopener noreferrer"
              target="_blank"
              className="inline-flex rounded-md border border-gray-200 bg-white px-4 py-2 text-[13px] font-semibold text-navy transition-colors hover:border-gray-300"
            >
              Visit website
            </a>
          ) : (
            <span
              className="inline-flex cursor-not-allowed rounded-md border border-gray-100 bg-gray-50 px-4 py-2 text-[13px] font-semibold text-gray-400"
              aria-disabled="true"
            >
              Visit website
            </span>
          )}
          <FullReviewLink
            reviewSlug={product.reviewSlug}
            productName={product.name}
            linkClassName="inline-flex px-3 py-2 text-[13px] font-semibold text-cb-orange hover:text-cb-orange-hover"
          />
        </div>
      </div>
    </article>
  )
}
