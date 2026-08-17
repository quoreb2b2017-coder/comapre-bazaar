import Link from 'next/link'

import type { Product } from '@/types'

import { cn } from '@/lib/utils'

import { CheckIcon, XIcon } from '@/components/ui/icons'

import { FullReviewLink } from '@/components/reviews/FullReviewLink'

import { ProductLogo } from '@/components/comparison/ProductLogo'



const BADGE_STYLES: Record<string, string> = {

  top: 'bg-cb-orange/10 text-cb-orange ring-1 ring-cb-orange/20',

  free: 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80',

  trial: 'bg-amber-50 text-amber-900 ring-1 ring-amber-200/80',

  new: 'bg-violet-50 text-violet-800 ring-1 ring-violet-200/80',

}



const EMOJI_REGEX = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu

function vendorLinkActive(product: Product): boolean {
  if (product.affiliateActive === false) return false
  return Boolean(product.vendorUrl?.trim())
}



interface ProductCardProps {

  product: Product

  rank?: number

  anchorId?: string

  compareHref?: string

  quoteHref?: string

  variant?: 'default' | 'marketing-smooth' | 'technology-smooth' | 'sales-smooth' | 'hr-smooth'

}



export function ProductCard({

  product,

  rank,

  anchorId,

  compareHref = '/browse-all-software',

  quoteHref,

}: ProductCardProps) {

  const displayName = product.id === 'hubspot' ? 'HubSpot CRM' : product.name

  const isFirst = rank === 1



  return (

    <article

      id={anchorId || product.id}

      className={cn(

        'scroll-mt-24 rounded-xl border border-gray-200/90 bg-white px-4 py-5 sm:px-5 sm:py-5',

        product.isTopPick && 'bg-gradient-to-r from-[#FFFBF7] via-white to-white',

        isFirst && 'relative before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-cb-orange before:to-cb-orange-hover'

      )}

    >

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">

        <div className="flex items-start gap-3.5 sm:flex-col sm:items-center sm:gap-2">

          {rank != null ? (

            <span

              className={cn(

                'flex h-8 w-8 items-center justify-center rounded-full font-serif text-[13px] tabular-nums',

                isFirst

                  ? 'bg-cb-orange text-white shadow-md shadow-cb-orange/25'

                  : 'bg-gray-100 text-gray-500 ring-1 ring-gray-200/80'

              )}

            >

              {String(rank).padStart(2, '0')}

            </span>

          ) : null}

          <ProductLogo product={product} size="lg" highlighted={isFirst} />

        </div>



        <div className="min-w-0 flex-1">

          <div className="mb-2 flex flex-wrap items-center gap-1.5">

            {product.isTopPick ? (

              <span className="rounded-full bg-cb-orange px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">

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



          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

            <div className="min-w-0">

              <h3 className="font-serif text-[1.3rem] leading-snug tracking-tight text-cb-orange sm:text-[1.4rem]">

                {displayName}

              </h3>

              <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-gray-600">{product.tagline}</p>

            </div>



            <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">

              <div

                className={cn(

                  'rounded-lg px-3 py-2 text-center',

                  isFirst ? 'bg-navy text-white' : 'border border-gray-200 bg-gray-50/80'

                )}

              >

                <p className={cn('font-serif text-2xl tabular-nums leading-none', !isFirst && 'text-navy')}>

                  {product.score}

                </p>

                <p className={cn('mt-0.5 text-[9px] uppercase tracking-wider', isFirst ? 'text-white/70' : 'text-gray-400')}>

                  / 5 score

                </p>

              </div>

              <Link

                href={compareHref}

                prefetch

                className="inline-flex items-center gap-1 text-[12px] font-semibold text-cb-orange transition-colors hover:text-cb-orange-hover"

                aria-label={`Compare ${product.name} options`}

              >

                Compare side-by-side →

              </Link>

            </div>

          </div>

        </div>

      </div>



      <div className="mt-6 grid grid-cols-1 gap-8 border-t border-gray-100 pt-6 sm:grid-cols-2 sm:gap-10">

        <div>

          <h4 className="mb-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-cb-orange">

            <CheckIcon className="h-3.5 w-3.5" /> Strengths

          </h4>

          <ul className="space-y-3">

            {product.pros.map((pro, i) => (

              <li key={i} className="flex gap-2.5 text-[13px] leading-snug text-gray-700">

                <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />

                {pro}

              </li>

            ))}

          </ul>

        </div>

        <div>

          <h4 className="mb-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-cb-orange">

            <XIcon className="h-3.5 w-3.5" /> Limitations

          </h4>

          <ul className="space-y-3">

            {product.cons.map((con, i) => (

              <li key={i} className="flex gap-2.5 text-[13px] leading-snug text-gray-700">

                <XIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />

                {con}

              </li>

            ))}

          </ul>

        </div>

      </div>



      <div className="mt-6 flex flex-col gap-5 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">{product.pricingLabel}</p>

          <p className="mt-0.5">

            <span className="text-xl font-bold tabular-nums text-navy">{product.pricingAmount}</span>

            <span className="ml-1.5 text-[13px] text-gray-500">{product.pricingPeriod}</span>

          </p>

        </div>



        <div className="flex flex-wrap items-center gap-2">

          {product.quoteUrl ? (

            <a

              href={product.quoteUrl}

              target="_blank"

              rel="sponsored noopener noreferrer"

              className="inline-flex rounded-lg bg-cb-orange px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-cb-orange-hover"

            >

              Get free quotes

            </a>

          ) : quoteHref ? (

            <Link

              href={quoteHref}

              className="inline-flex rounded-lg bg-cb-orange px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-cb-orange-hover"

            >

              Get free quotes

            </Link>

          ) : null}

          {vendorLinkActive(product) ? (

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


