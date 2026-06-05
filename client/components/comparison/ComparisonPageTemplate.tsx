import type { ComparisonPageData } from '@/types'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { AuthorBar } from '@/components/ui/AuthorBar'
import { ProductCard } from '@/components/comparison/ProductCard'
import { ComparisonTable } from '@/components/comparison/ComparisonTable'
import { FaqAccordion } from '@/components/comparison/FaqAccordion'
import { ComparisonSidebar } from '@/components/comparison/ComparisonSidebar'
import { WinnerBanner } from '@/components/comparison/WinnerBanner'
import { cn } from '@/lib/utils'

interface ComparisonPageProps {
  data: ComparisonPageData
}

export function ComparisonPageTemplate({ data }: ComparisonPageProps) {
  const isCrmPage = data.slug === 'crm-software' || data.slug === 'sales-crm'
  const isEmailMarketingPage = data.slug === 'email-marketing'
  const isWebsiteBuilderPage = data.slug === 'website-builder'
  const isVoipPage = data.slug === 'business-phone-systems'
  const isGpsPage = data.slug === 'gps-fleet-management'
  const isEmployeePage = data.slug === 'employee-management'
  const isPayrollPage = data.slug === 'payroll-software' || data.slug === 'technology-payroll'
  const isCallCenterPage = data.slug === 'call-center'
  const isProjectManagementPage = data.slug === 'project-management'
  const isMarketingTrio = isCrmPage || isEmailMarketingPage || isWebsiteBuilderPage
  const isTechnologyHub = isVoipPage || isGpsPage || data.slug === 'technology-payroll'
  const isSalesHub = data.slug === 'sales-crm' || isCallCenterPage || isProjectManagementPage
  const isHrHub = isEmployeePage || data.slug === 'payroll-software'
  const smoothVariant: 'default' | 'marketing-smooth' | 'technology-smooth' | 'sales-smooth' | 'hr-smooth' = isMarketingTrio
    ? 'marketing-smooth'
    : isTechnologyHub
      ? 'technology-smooth'
      : isSalesHub
        ? 'sales-smooth'
        : isHrHub
          ? 'hr-smooth'
          : 'default'
  return (
    <>
      {/* Page header */}
      <div
        className={
          smoothVariant === 'marketing-smooth'
            ? 'bg-[radial-gradient(120%_120%_at_10%_0%,#ffe7cf_0%,#fff8f0_35%,#ffffff_70%)]'
            : smoothVariant === 'technology-smooth'
              ? 'bg-[radial-gradient(120%_120%_at_10%_0%,#dbeafe_0%,#f3f9ff_35%,#ffffff_72%)]'
              : smoothVariant === 'sales-smooth'
                ? 'bg-[radial-gradient(120%_120%_at_10%_0%,#e9e5ff_0%,#f5f3ff_35%,#ffffff_72%)]'
                : smoothVariant === 'hr-smooth'
                  ? 'bg-[radial-gradient(120%_120%_at_10%_0%,#d1fae5_0%,#f0fdf8_35%,#ffffff_72%)]'
                  : 'bg-gray-50'
        }
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <Breadcrumb items={data.breadcrumbs} className="mb-4" />

          {/* H1, exact target keyword */}
          <h1 className="text-2xl sm:text-3xl lg:text-[40px] text-navy leading-tight tracking-tight mb-4">
            {data.h1}
          </h1>

          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
            {data.intro}
          </p>

          {/* Author bar, E-E-A-T */}
          <AuthorBar
            author={data.author}
            reviewer={data.reviewer}
            lastReviewed={data.lastReviewed}
          />

        </div>
      </div>

      {/* Body */}
      <div
        className={cn(
          'max-w-7xl mx-auto px-4 sm:px-6 py-10',
          smoothVariant === 'marketing-smooth'
            ? 'bg-gradient-to-b from-white to-[#fffaf5]'
            : smoothVariant === 'technology-smooth'
              ? 'bg-gradient-to-b from-white to-[#f6fbff]'
              : smoothVariant === 'sales-smooth'
                ? 'bg-gradient-to-b from-white to-[#f7f7ff]'
                : smoothVariant === 'hr-smooth'
                  ? 'bg-gradient-to-b from-white to-[#f4fdf8]'
                  : ''
        )}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 items-start">

          {/* Main content */}
          <div>
            {/* Winner banner */}
            <WinnerBanner summary={data.winnerSummary} variant={smoothVariant} />

            {/* Products */}
            <section aria-labelledby="picks-heading">
              <h2
                id="picks"
                className="text-2xl sm:text-3xl text-navy tracking-tight mb-1"
              >
                Our top picks for 2026
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Ranked by expert score across 12 criteria. All pricing verified{' '}
                {data.lastReviewed}.
              </p>

              <div className="space-y-6">
                {data.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    compareHref={`/compare?category=${encodeURIComponent(data.slug)}&brand=${encodeURIComponent(product.id)}`}
                    quoteHref={data.ctaSlug}
                    variant={smoothVariant}
                  />
                ))}
              </div>
            </section>

            {/* Comparison table */}
            <section className="mt-12" aria-labelledby="compare-heading">
              <h2
                id="compare"
                className="text-2xl sm:text-3xl text-navy tracking-tight mb-1"
              >
                Full comparison table
              </h2>
              <p className="text-gray-500 text-sm mb-5">
                All platforms side by side. Pricing verified {data.lastReviewed}.
              </p>
              <ComparisonTable
                data={data.table}
                caption={`${data.h1}, pricing and feature comparison, ${data.lastReviewed}`}
              />
            </section>

            {/* FAQ */}
            <section className="mt-12" aria-labelledby="faqs-heading">
              <h2
                id="faqs"
                className="text-2xl sm:text-3xl text-navy tracking-tight mb-1"
              >
                Frequently asked questions
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Answered by {data.author.name}, {data.author.credential.split('·')[0].trim()}.
              </p>
              <FaqAccordion items={data.faqs} />
            </section>
          </div>

          {/* Sticky sidebar */}
          <div className="lg:sticky lg:top-24">
            <ComparisonSidebar
              tocItems={data.tocItems}
              ctaTitle={data.ctaTitle}
              ctaBody={data.ctaBody}
              ctaSlug={data.ctaSlug}
            />
          </div>

        </div>
      </div>
    </>
  )
}
