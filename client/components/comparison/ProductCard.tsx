import Link from 'next/link'
import type { Product } from '@/types'
import { cn } from '@/lib/utils'
import { CheckIcon, XIcon } from '@/components/ui/icons'

const BADGE_STYLES: Record<string, string> = {
  top: 'bg-brand text-white',
  free: 'bg-green-100 text-green-800',
  trial: 'bg-yellow-50 text-yellow-800',
  new: 'bg-purple-100 text-purple-800',
}

const EMOJI_REGEX = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu

interface ProductCardProps {
  product: Product
  compareHref?: string
  quoteHref?: string
  variant?: 'default' | 'marketing-smooth' | 'technology-smooth' | 'sales-smooth' | 'hr-smooth'
}

export function ProductCard({
  product,
  compareHref = '/browse-all-software',
  quoteHref,
  variant = 'default',
}: ProductCardProps) {
  const isMarketingSmooth = variant === 'marketing-smooth'
  const isTechnologySmooth = variant === 'technology-smooth'
  const isSalesSmooth = variant === 'sales-smooth'
  const isHrSmooth = variant === 'hr-smooth'

  const smoothHeaderBg = isMarketingSmooth
    ? 'bg-gradient-to-r from-[#fff7ef] via-white to-[#fff4e8]'
    : isTechnologySmooth
      ? 'bg-gradient-to-r from-[#eef6ff] via-white to-[#ecfeff]'
      : isSalesSmooth
        ? 'bg-gradient-to-r from-[#f3f0ff] via-white to-[#eef2ff]'
        : 'bg-gradient-to-r from-[#eefcf5] via-white to-[#effcf9]'

  const smoothFooterBg = isMarketingSmooth
    ? 'bg-gradient-to-r from-white to-orange-50/60'
    : isTechnologySmooth
      ? 'bg-gradient-to-r from-white to-cyan-50/60'
      : isSalesSmooth
        ? 'bg-gradient-to-r from-white to-indigo-50/60'
        : 'bg-gradient-to-r from-white to-emerald-50/60'
  return (
    <article
      id={product.id}
      className={cn(
        isMarketingSmooth || isTechnologySmooth || isSalesSmooth || isHrSmooth
          ? 'border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_50px_-24px_rgba(15,31,61,0.5)] bg-white/95 backdrop-blur-sm'
          : 'border rounded-2xl overflow-hidden transition-shadow hover:shadow-lg',
        product.isTopPick ? 'border-blue-300' : 'border-gray-200'
      )}
    >
      {/* Header */}
      <div className={cn(
        'border-b border-gray-200 px-6 py-5 flex flex-wrap items-center gap-4',
        isMarketingSmooth || isTechnologySmooth || isSalesSmooth || isHrSmooth ? smoothHeaderBg : 'bg-gray-50'
      )}>
        {/* Logo */}
        <div
          className={cn(
            'w-13 h-13 rounded-xl border border-gray-200 flex items-center justify-center font-bold text-sm text-brand flex-shrink-0',
            isMarketingSmooth || isTechnologySmooth || isSalesSmooth || isHrSmooth
              ? 'bg-gradient-to-br from-white to-gray-50 shadow-[0_10px_22px_-16px_rgba(15,23,42,0.45)]'
              : 'bg-white'
          )}
          aria-hidden="true"
          style={{ width: 52, height: 52 }}
        >
          {product.logo}
        </div>

        {/* Title */}
        <div className="flex-1 min-w-[140px]">
          <h3 className="text-[20px] font-semibold text-navy tracking-tight">
            {product.name}
          </h3>
          <p className="text-sm text-brand font-medium">{product.tagline}</p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          {product.badges.map((badge) => (
            <span
              key={badge.label}
              className={cn('text-xs font-semibold px-2 py-1 rounded', BADGE_STYLES[badge.variant])}
            >
              {badge.label.replace(EMOJI_REGEX, '').trim()}
            </span>
          ))}
        </div>

        <Link
          href={compareHref}
          prefetch
          className="bg-[#F27F25] hover:bg-[#E97A13] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          aria-label={`Compare ${product.name} options`}
        >
          Compare +
        </Link>

        {/* Score */}
        <div className="text-center min-w-[72px]">
          <div className="w-14 h-14 rounded-full bg-brand text-white text-xl font-bold flex items-center justify-center mx-auto shadow-[0_14px_28px_-16px_rgba(242,127,37,0.8)]">
            {product.score}
          </div>
          <p className="text-xs text-gray-400 mt-1">out of 5</p>
        </div>
      </div>

      {/* Pros / Cons */}
      <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F27F25] mb-3">
            Pros
          </h4>
          <ul className="space-y-2 list-none">
            {product.pros.map((pro, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600 leading-snug">
                <CheckIcon className="w-3.5 h-3.5 text-[#F27F25] flex-shrink-0 mt-0.5" />
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F27F25] mb-3">
            Cons
          </h4>
          <ul className="space-y-2 list-none">
            {product.cons.map((con, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600 leading-snug">
                <XIcon className="w-3.5 h-3.5 text-[#F27F25] flex-shrink-0 mt-0.5" />
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className={cn(
        'border-t border-gray-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3',
        isMarketingSmooth || isTechnologySmooth || isSalesSmooth || isHrSmooth ? smoothFooterBg : ''
      )}>
        <div>
          <span className="block text-xs text-gray-400">{product.pricingLabel}</span>
          <span className="text-xl font-bold text-navy">{product.pricingAmount}</span>
          <span className="text-xs text-gray-400">{product.pricingPeriod}</span>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {quoteHref ? (
            <Link
              href={quoteHref}
              className="bg-[#F27F25] hover:bg-[#E97A13] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
              aria-label={`Get free quotes for ${product.name}`}
            >
              Compare Quotes
            </Link>
          ) : null}
          {/* All outbound vendor links use real URLs + rel="sponsored" */}
          {product.affiliateActive === true ? (
            <a
              href={product.vendorUrl}
              rel="sponsored noopener noreferrer"
              target="_blank"
              className="bg-brand hover:bg-brand-hover text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
              aria-label={`Visit ${product.name} website`}
            >
              Visit {product.name.split(' ')[0]} →
            </a>
          ) : (
            <span
              className="bg-brand text-white text-sm font-semibold px-4 py-2 rounded-xl opacity-50 cursor-not-allowed select-none relative group"
              aria-disabled="true"
            >
              Visit {product.name.split(' ')[0]} →
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs text-white shadow-lg">
                Coming soon
              </span>
            </span>
          )}
          <Link
            href={`/reviews/${product.reviewSlug}`}
            className="border border-brand text-brand hover:bg-brand-light text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            aria-label={`Read full ${product.name} review`}
          >
            Full Review
          </Link>
        </div>
      </div>
    </article>
  )
}
