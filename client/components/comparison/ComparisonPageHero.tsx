import Image from 'next/image'
import Link from 'next/link'
import type { ComparisonPageData } from '@/types'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ProductLogo } from '@/components/comparison/ProductLogo'
import { ComparisonHeroQuoteForm } from '@/components/comparison/ComparisonHeroQuoteForm'
import { getComparisonPageCoverUrl } from '@/lib/comparisonPageCovers'
import { resolveComparisonQuoteFormKey } from '@/lib/comparisonQuoteForm'

type ComparisonPageHeroProps = {
  data: ComparisonPageData
  vendorCount: number
  heroCoverUrl?: string
}

export function ComparisonPageHero({ data, vendorCount, heroCoverUrl }: ComparisonPageHeroProps) {
  const coverUrl = heroCoverUrl || getComparisonPageCoverUrl(data)
  const featuredProducts = data.products.slice(0, 6)
  const quoteFormKey = resolveComparisonQuoteFormKey(data.slug, data.ctaSlug)

  return (
    <header className="border-b border-[#0B2A6F]/20">
      {/* Full-width blue hero — covers left content + form column */}
      <div className="relative isolate overflow-hidden bg-[#0B2A6F]">
        <Image
          src={coverUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-[0.14]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#0B2A6F] via-[#0f1f3d] to-[#071d4d]"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_100%_0%,rgba(245,130,32,0.12),transparent_50%)]"
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <Breadcrumb items={data.breadcrumbs} tone="onDark" className="mb-3" />

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_min(420px,38%)] lg:gap-10">
            <div className="min-w-0 flex flex-col gap-5 self-start sm:gap-6">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] sm:text-[11px]">
                <span className="font-bold uppercase tracking-[0.12em] text-cb-orange">
                  Independent review
                </span>
                <span className="text-white/35" aria-hidden>
                  ·
                </span>
                <span className="font-medium text-white/85">{data.lastReviewed}</span>
                <span className="text-white/35" aria-hidden>
                  ·
                </span>
                <Link
                  href="/editorial-process"
                  className="font-semibold text-white/90 underline-offset-2 hover:text-white hover:underline"
                >
                  How we test →
                </Link>
              </div>

              <h1 className="font-serif text-[1.5rem] font-normal leading-[1.15] tracking-tight text-cb-orange sm:text-[1.85rem] lg:text-[2rem]">
                {data.h1}
              </h1>

              {data.author?.name || data.reviewer ? (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/80 sm:text-[12px]">
                  {data.author?.name ? (
                    <span>
                      By{' '}
                      <span className="font-semibold text-white">
                        {data.author.name}
                        {data.author.initials ? ` (${data.author.initials})` : ''}
                      </span>
                      {data.author.credential ? ` · ${data.author.credential}` : ''}
                    </span>
                  ) : null}
                  {data.reviewer ? (
                    <span>
                      Reviewed by <span className="font-semibold text-white">{data.reviewer}</span>
                    </span>
                  ) : null}
                </div>
              ) : null}

              <p className="max-w-3xl text-[16px] leading-[1.72] text-white sm:text-[17px] lg:text-[18px] lg:leading-[1.75]">
                {data.intro}
              </p>

              {data.ctaBody ? (
                <p className="max-w-3xl text-[15px] leading-[1.7] text-white/90 sm:text-[16px] lg:text-[17px]">
                  {data.ctaBody}
                </p>
              ) : null}

              <div className="border-t border-white/10 pt-6 sm:pt-7">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="mb-2.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white/60 sm:text-[10px]">
                      Vendors in this guide
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {featuredProducts.map((product) => (
                        <ProductLogo key={product.id} product={product} size="sm" flat />
                      ))}
                      {vendorCount > featuredProducts.length ? (
                        <span className="text-[11px] font-medium text-white/70">
                          +{vendorCount - featuredProducts.length}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <dl className="flex shrink-0 flex-wrap gap-x-5 gap-y-2 text-white sm:gap-x-6">
                    <div>
                      <dt className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/50">Vendors</dt>
                      <dd className="mt-0.5 font-serif text-lg tabular-nums text-white">{vendorCount}</dd>
                    </div>
                    <div>
                      <dt className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/50">Criteria</dt>
                      <dd className="mt-0.5 font-serif text-lg text-white">12</dd>
                    </div>
                    <div>
                      <dt className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/50">Method</dt>
                      <dd className="mt-0.5 font-serif text-lg text-white">Hands-on</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <ComparisonHeroQuoteForm formKey={quoteFormKey} ctaTitle={data.ctaTitle} />
          </div>
        </div>
      </div>
    </header>
  )
}
