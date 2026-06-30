import type { ComparisonPageData } from '@/types'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { AuthorBar } from '@/components/ui/AuthorBar'
import { ProductCard } from '@/components/comparison/ProductCard'
import { ComparisonTable } from '@/components/comparison/ComparisonTable'
import { FaqAccordion } from '@/components/comparison/FaqAccordion'
import { ComparisonSidebar } from '@/components/comparison/ComparisonSidebar'
import { WinnerBanner } from '@/components/comparison/WinnerBanner'
import { ComparisonSectionHeader } from '@/components/comparison/ComparisonSectionHeader'

interface ComparisonPageProps {
  data: ComparisonPageData
}

export function ComparisonPageTemplate({ data }: ComparisonPageProps) {
  const vendorCount = data.products.length

  return (
    <>
      <header className="relative border-b border-gray-200 bg-white">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgba(245,130,32,0.05),transparent_55%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <Breadcrumb items={data.breadcrumbs} className="mb-5 text-sm" />

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full border border-cb-orange/20 bg-cb-orange/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cb-orange">
              Independent review
            </span>
            <span className="text-[12px] text-gray-500">Last verified {data.lastReviewed}</span>
          </div>

          <h1 className="mt-4 max-w-4xl font-serif text-[1.75rem] font-normal leading-[1.15] tracking-tight text-navy sm:text-[2.125rem] lg:text-[2.25rem]">
            {data.h1}
          </h1>

          <p className="mt-4 max-w-3xl text-[15px] leading-[1.75] text-gray-600">{data.intro}</p>

          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-gray-100 pt-5 text-[13px]">
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                Vendors compared
              </dt>
              <dd className="mt-0.5 font-semibold tabular-nums text-navy">{vendorCount}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                Scoring criteria
              </dt>
              <dd className="mt-0.5 font-semibold text-navy">12 factors</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                Methodology
              </dt>
              <dd className="mt-0.5 font-semibold text-navy">Hands-on testing</dd>
            </div>
          </dl>

          <AuthorBar author={data.author} reviewer={data.reviewer} lastReviewed={data.lastReviewed} />
        </div>
      </header>

      <div className="bg-[#F3F5F9]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_248px] lg:gap-10">
            <div className="min-w-0 space-y-8">
              <div className="overflow-hidden border border-gray-200 bg-white">
                <ComparisonSectionHeader
                  id="verdict-heading"
                  title="Quick verdict"
                  description="Our editorial summary before the full breakdown."
                />
                <div className="px-5 py-5 sm:px-6">
                  <WinnerBanner summary={data.winnerSummary} embedded />
                </div>
              </div>

              <section id="picks" aria-labelledby="picks-heading" className="scroll-mt-24">
                <div className="overflow-hidden border border-gray-200 bg-white">
                  <ComparisonSectionHeader
                    id="picks-heading"
                    step={1}
                    title="Our top picks for 2026"
                    description={`${vendorCount} platforms ranked by expert score · pricing verified ${data.lastReviewed}`}
                  />
                  <div className="divide-y divide-gray-200">
                    {data.products.map((product, index) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        rank={index + 1}
                        compareHref={`/compare?category=${encodeURIComponent(data.slug)}&brand=${encodeURIComponent(product.id)}`}
                        quoteHref={data.ctaSlug}
                      />
                    ))}
                  </div>
                </div>
              </section>

              <section id="compare" className="scroll-mt-24" aria-labelledby="compare-heading">
                <div className="overflow-hidden border border-gray-200 bg-white">
                  <ComparisonSectionHeader
                    id="compare-heading"
                    step={2}
                    title="Full comparison table"
                    description={`Side-by-side specs and pricing · ${data.lastReviewed}`}
                  />
                  <div className="p-4 sm:p-5">
                    <ComparisonTable
                      data={data.table}
                      caption={`${data.h1}, pricing and feature comparison, ${data.lastReviewed}`}
                    />
                  </div>
                </div>
              </section>

              <section id="faqs" className="scroll-mt-24" aria-labelledby="faqs-heading">
                <div className="overflow-hidden border border-gray-200 bg-white">
                  <ComparisonSectionHeader
                    id="faqs-heading"
                    step={3}
                    title="Frequently asked questions"
                    description={`Answered by ${data.author.name}`}
                  />
                  <FaqAccordion items={data.faqs} />
                </div>
              </section>
            </div>

            <div className="lg:sticky lg:top-24">
              <ComparisonSidebar
                tocItems={data.tocItems}
                ctaTitle={data.ctaTitle}
                ctaBody={data.ctaBody}
                ctaSlug={data.ctaSlug}
                vendorCount={vendorCount}
                lastReviewed={data.lastReviewed}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
