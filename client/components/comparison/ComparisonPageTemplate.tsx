import type { ComparisonPageData } from '@/types'
import { ProductCard } from '@/components/comparison/ProductCard'
import { ComparisonTable } from '@/components/comparison/ComparisonTable'
import { FaqAccordion } from '@/components/comparison/FaqAccordion'
import { ComparisonSidebar } from '@/components/comparison/ComparisonSidebar'
import { WinnerBanner } from '@/components/comparison/WinnerBanner'
import { ComparisonSectionHeader } from '@/components/comparison/ComparisonSectionHeader'
import { ComparisonPageHero } from '@/components/comparison/ComparisonPageHero'
import { HubRelatedContent, VerificationStamp } from '@/components/seo/seo-components'
import {
  ComparisonReveal,
  ComparisonSidebarReveal,
  ComparisonStagger,
  ComparisonStaggerItem,
} from '@/components/comparison/ComparisonMotion'

interface ComparisonPageProps {
  data: ComparisonPageData
  hubSlug?: string | null
  lastVerified?: string
}

export function ComparisonPageTemplate({ data, hubSlug, lastVerified }: ComparisonPageProps) {
  const vendorCount = data.products.length

  return (
    <>
      <ComparisonPageHero data={data} vendorCount={vendorCount} />

      <div className="bg-[#F3F5F9]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          {lastVerified ? (
            <div className="mb-6 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm text-gray-600">
              <VerificationStamp lastVerified={lastVerified} />
            </div>
          ) : null}

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-8">
            <div className="min-w-0 space-y-6">
              <ComparisonReveal className="overflow-hidden border border-gray-200 bg-white">
                <ComparisonSectionHeader
                  id="verdict-heading"
                  title="Quick verdict"
                  description="Our editorial summary before the full breakdown."
                />
                <div className="px-5 py-4 sm:px-6">
                  <WinnerBanner summary={data.winnerSummary} embedded />
                </div>
              </ComparisonReveal>

              <ComparisonReveal as="section" id="picks" aria-labelledby="picks-heading" className="scroll-mt-24">
                <div className="overflow-hidden border border-gray-200 bg-white">
                  <ComparisonSectionHeader
                    id="picks-heading"
                    step={1}
                    title="Our top picks for 2026"
                    description={`${vendorCount} platforms ranked by expert score · pricing verified ${data.lastReviewed}`}
                  />
                  <ComparisonStagger className="divide-y divide-gray-200">
                    {data.products.map((product, index) => (
                      <ComparisonStaggerItem key={product.id}>
                        <ProductCard
                          product={product}
                          rank={index + 1}
                          compareHref={`/compare?category=${encodeURIComponent(data.slug)}&brand=${encodeURIComponent(product.id)}`}
                          quoteHref={data.ctaSlug}
                        />
                      </ComparisonStaggerItem>
                    ))}
                  </ComparisonStagger>
                </div>
              </ComparisonReveal>

              <ComparisonReveal
                as="section"
                id="compare"
                className="scroll-mt-24"
                aria-labelledby="compare-heading"
                delay={0.04}
              >
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
              </ComparisonReveal>

              <ComparisonReveal
                as="section"
                id="faqs"
                className="scroll-mt-24"
                aria-labelledby="faqs-heading"
                delay={0.06}
              >
                <div className="overflow-hidden border border-gray-200 bg-white">
                  <ComparisonSectionHeader
                    id="faqs-heading"
                    step={3}
                    title="Frequently asked questions"
                    description={`Answered by ${data.author.name}`}
                  />
                  <FaqAccordion items={data.faqs} />
                </div>
              </ComparisonReveal>

              {hubSlug ? (
                <ComparisonReveal delay={0.08}>
                  <div className="overflow-hidden border border-gray-200 bg-white px-5 py-6 sm:px-6">
                    <HubRelatedContent hubSlug={hubSlug} />
                  </div>
                </ComparisonReveal>
              ) : null}
            </div>

            <ComparisonSidebarReveal className="lg:sticky lg:top-24">
              <ComparisonSidebar
                tocItems={data.tocItems}
                ctaTitle={data.ctaTitle}
                ctaBody={data.ctaBody}
                ctaSlug={data.ctaSlug}
                vendorCount={vendorCount}
                lastReviewed={data.lastReviewed}
              />
            </ComparisonSidebarReveal>
          </div>
        </div>
      </div>
    </>
  )
}
