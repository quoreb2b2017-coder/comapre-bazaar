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
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article
      id={product.id}
      className={cn(
        'border rounded-2xl overflow-hidden transition-shadow hover:shadow-lg',
        product.isTopPick ? 'border-blue-300' : 'border-gray-200'
      )}
      itemScope
      itemType="https://schema.org/SoftwareApplication"
    >
      <meta itemProp="applicationCategory" content="BusinessApplication" />

      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-5 flex flex-wrap items-center gap-4">
        {/* Logo */}
        <div
          className="w-13 h-13 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-bold text-sm text-brand flex-shrink-0"
          aria-hidden="true"
          style={{ width: 52, height: 52 }}
        >
          {product.logo}
        </div>

        {/* Title */}
        <div className="flex-1 min-w-[140px]">
          <h3 className="text-lg font-semibold text-navy" itemProp="name">
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

        {/* Score */}
        <div
          className="text-center min-w-[72px]"
          itemProp="aggregateRating"
          itemScope
          itemType="https://schema.org/AggregateRating"
        >
          <meta itemProp="ratingValue" content={product.score} />
          <meta itemProp="reviewCount" content={String(product.reviewCount)} />
          <meta itemProp="bestRating" content="5" />
          <div className="w-14 h-14 rounded-full bg-brand text-white text-xl font-bold flex items-center justify-center mx-auto">
            {product.score}
          </div>
          <p className="text-xs text-gray-400 mt-1">out of 5</p>
        </div>
      </div>

      {/* Pros / Cons */}
      <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F27F25] mb-3">
            Pros
          </h4>
          <ul className="space-y-1.5 list-none">
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
          <ul className="space-y-1.5 list-none">
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
      <div className="border-t border-gray-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="block text-xs text-gray-400">{product.pricingLabel}</span>
          <span className="text-xl font-bold text-navy">{product.pricingAmount}</span>
          <span className="text-xs text-gray-400">{product.pricingPeriod}</span>
        </div>
        <div className="flex gap-2">
          {/* All outbound vendor links use real URLs + rel="sponsored" */}
          <a
            href={product.vendorUrl}
            rel="sponsored noopener noreferrer"
            target="_blank"
            className="bg-brand hover:bg-brand-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Visit {product.name.split(' ')[0]} →
          </a>
          <Link
            href={`/reviews/${product.reviewSlug}`}
            className="border border-brand text-brand hover:bg-brand-light text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Full review
          </Link>
        </div>
      </div>
    </article>
  )
}
