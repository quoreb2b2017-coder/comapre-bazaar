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
  const isFirst = rank === 1

  return (
    <article
      id={product.id}
      className={cn(
        'px-5 py-5 transition-colors sm:px-6 sm:py-6',
        product.isTopPick && 'bg-gradient-to-br from-[#FFFBF7] via-white to-cb-orange/[0.04]',
        isFirst && 'relative before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-cb-orange before:to-cb-orange-hover'
      )}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr_auto] sm:items-start sm:gap-5">
        <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-2.5">
          {rank != null ? (
            <span
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full font-serif text-sm tabular-nums',
                isFirst
                  ? 'bg-cb-orange text-white shadow-md shadow-cb-orange/30'
                  : 'bg-gray-100 text-gray-400 ring-1 ring-gray-200'
              )}
            >
              {String(rank).padStart(2, '0')}
            </span>
          ) : null}
          <div
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-xs font-bold text-navy shadow-sm',
              isFirst
                ? 'border-cb-orange/20 bg-gradient-to-br from-white to-cb-orange/5'
                : 'border-gray-200 bg-white'
            )}
            aria-hidden
          >
            {product.logo}
          </div>
        </div>

        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            {product.isTopPick ? (
              <span className="rounded-full bg-cb-orange px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                Editor&apos;s pick
              </span>
            ) : null}
            {product.badges.map((badge) => (
              <span
                key={badge.label}
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                  BADGE_STYLES[badge.variant] ?? BADGE_STYLES.trial
                )}
              >
                {badge.label.replace(EMOJI_REGEX, '').trim()}
              </span>
            ))}
          </div>
          <h3 className="font-serif text-[1.25rem] leading-snug tracking-tight text-navy sm:text-[1.35rem]">
            {displayName}
          </h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-gray-600">{product.tagline}</p>
        </div>

        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-start">
          <div
            className={cn(
              'rounded-xl px-3.5 py-2.5 text-center shadow-sm sm:min-w-[80px]',
              isFirst
                ? 'bg-navy text-white shadow-navy/20'
                : 'border border-gray-200 bg-white'
            )}
          >
            <p className={cn('font-serif text-2xl tabular-nums leading-none', !isFirst && 'text-navy')}>
              {product.score}
            </p>
            <p className={cn('mt-0.5 text-[9px] uppercase tracking-wider', isFirst ? 'text-white/70' : 'text-gray-400')}>
              Score / 5
            </p>
          </div>
          <Link
            href={compareHref}
            prefetch
            className="inline-flex items-center gap-1 rounded-full border border-cb-orange/20 bg-cb-orange/5 px-3 py-1.5 text-[12px] font-semibold text-cb-orange transition-colors hover:bg-cb-orange hover:text-white sm:mt-1"
            aria-label={`Compare ${product.name} options`}
          >
            Compare →
          </Link>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
          <h4 className="mb-2.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
            <CheckIcon className="h-3.5 w-3.5" /> Pros
          </h4>
          <ul className="space-y-2">
            {product.pros.map((pro, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-snug text-gray-700">
                <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h4 className="mb-2.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500">
            <XIcon className="h-3.5 w-3.5" /> Cons
          </h4>
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

      <div className="mt-5 flex flex-col gap-3 rounded-xl border border-gray-100 bg-[#FAFBFD]/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">{product.pricingLabel}</p>
          <p className="mt-0.5">
            <span className="text-lg font-bold tabular-nums text-navy">{product.pricingAmount}</span>
            <span className="ml-1 text-[13px] text-gray-500">{product.pricingPeriod}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {product.quoteUrl ? (
            <a
              href={product.quoteUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="inline-flex rounded-lg bg-cb-orange px-4 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-cb-orange/25 transition-all hover:bg-cb-orange-hover hover:shadow-lg"
            >
              Get free quotes
            </a>
          ) : quoteHref ? (
            <Link
              href={quoteHref}
              className="inline-flex rounded-lg bg-cb-orange px-4 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-cb-orange/25 transition-all hover:bg-cb-orange-hover hover:shadow-lg"
            >
              Get free quotes
            </Link>
          ) : null}
          {product.affiliateActive === true ? (
            <a
              href={product.vendorUrl}
              rel="sponsored noopener noreferrer"
              target="_blank"
              className="inline-flex rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-navy transition-colors hover:border-navy/20 hover:bg-gray-50"
            >
              Visit website
            </a>
          ) : (
            <span
              className="inline-flex cursor-not-allowed rounded-lg border border-gray-100 bg-gray-50 px-4 py-2.5 text-[13px] font-semibold text-gray-400"
              aria-disabled="true"
            >
              Visit website
            </span>
          )}
          <FullReviewLink
            reviewSlug={product.reviewSlug}
            productName={product.name}
            linkClassName="inline-flex px-3 py-2.5 text-[13px] font-semibold text-cb-orange hover:text-cb-orange-hover"
          />
        </div>
      </div>
    </article>
  )
}
