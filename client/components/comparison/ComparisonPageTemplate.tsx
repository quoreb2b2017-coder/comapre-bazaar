import type { ComparisonPageData } from '@/types'
import { ProductCard } from '@/components/comparison/ProductCard'
import { ComparisonTableSection } from '@/components/comparison/ComparisonTableSection'
import { FaqAccordion } from '@/components/comparison/FaqAccordion'
import { ComparisonSidebar } from '@/components/comparison/ComparisonSidebar'
import { WinnerBanner } from '@/components/comparison/WinnerBanner'
import { ComparisonSectionHeader } from '@/components/comparison/ComparisonSectionHeader'
import { ComparisonPageHero } from '@/components/comparison/ComparisonPageHero'
import { hasHubRelatedContent, HubRelatedContent } from '@/components/seo/seo-components'
import { comparisonSectionIds, productTocAnchor, resolveComparisonTocItems } from '@/lib/comparisonToc'
import {
  ComparisonReveal,
  ComparisonSidebarReveal,
  ComparisonStagger,
  ComparisonStaggerItem,
} from '@/components/comparison/ComparisonMotion'

interface ComparisonPageProps {
  data: ComparisonPageData
  hubSlug?: string | null
  heroCoverUrl?: string
}

export function ComparisonPageTemplate({ data, hubSlug, heroCoverUrl }: ComparisonPageProps) {
  const vendorCount = data.products.length
  const sectionIds = comparisonSectionIds(data)
  const tocItems = resolveComparisonTocItems(data)
  const showHubRelated = hubSlug ? hasHubRelatedContent(hubSlug) : false

  return (
    <>
      <ComparisonPageHero data={data} vendorCount={vendorCount} heroCoverUrl={heroCoverUrl} />

      <div className="bg-gradient-to-b from-[#EEF3FB] via-[#F3F5F9] to-[#F9FAFB]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(240px,280px)_minmax(0,1fr)] lg:gap-10">
            <ComparisonSidebarReveal className="order-2 lg:order-1 lg:sticky lg:top-24">
              <ComparisonSidebar
                tocItems={tocItems}
                pagePath={data.canonical}
                ctaTitle={data.ctaTitle}
                ctaBody={data.ctaBody}
                ctaSlug={data.ctaSlug}
                vendorCount={vendorCount}
                lastReviewed={data.lastReviewed}
              />
            </ComparisonSidebarReveal>

            <div className="order-1 min-w-0 space-y-8 lg:order-2 lg:space-y-10">
              <ComparisonReveal>
                <ComparisonSectionHeader
                  id="verdict-heading"
                  title="Quick verdict"
                  description="Our editorial summary before the full breakdown."
                />
                <div id={sectionIds.verdict} className="scroll-mt-24 mt-3">
                  <WinnerBanner summary={data.winnerSummary} embedded />
                </div>
              </ComparisonReveal>

              <ComparisonReveal as="section" id={sectionIds.picks} aria-labelledby="picks-heading" className="scroll-mt-24">
                <ComparisonSectionHeader
                  id="picks-heading"
                  step={1}
                  title="Our top picks for 2026"
                  description={`${vendorCount} platforms ranked by expert score · pricing verified ${data.lastReviewed}`}
                />
                <ComparisonStagger className="mt-3 space-y-3">
                  {data.products.map((product, index) => (
                    <ComparisonStaggerItem key={product.id}>
                      <ProductCard
                        product={product}
                        rank={index + 1}
                        anchorId={productTocAnchor(product)}
                        compareHref={`/compare?category=${encodeURIComponent(data.slug)}&brand=${encodeURIComponent(product.id)}`}
                        quoteHref={data.ctaSlug}
                      />
                    </ComparisonStaggerItem>
                  ))}
                </ComparisonStagger>
              </ComparisonReveal>

              <ComparisonReveal
                as="section"
                id={sectionIds.compare}
                className="scroll-mt-24"
                aria-labelledby="compare-heading"
                delay={0.04}
              >
                <ComparisonTableSection data={data} sectionId={sectionIds.compare} />
              </ComparisonReveal>

              {data.faqs.length > 0 ? (
                <ComparisonReveal
                  as="section"
                  id={sectionIds.faqs}
                  className="scroll-mt-24"
                  aria-labelledby="faqs-heading"
                  delay={0.06}
                >
                <ComparisonSectionHeader
                  id="faqs-heading"
                  step={3}
                  title="Frequently asked questions"
                  description="Expert answers from our software buying guides."
                />
                <div className="mt-3">
                  <FaqAccordion items={data.faqs} />
                </div>
                </ComparisonReveal>
              ) : null}

              {showHubRelated && hubSlug ? (
                <ComparisonReveal delay={0.08}>
                  <HubRelatedContent hubSlug={hubSlug} />
                </ComparisonReveal>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
