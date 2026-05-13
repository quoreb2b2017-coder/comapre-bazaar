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
  const showcaseTitle = isCrmPage
    ? 'CRM quick picks'
    : isEmailMarketingPage
      ? 'Email marketing quick picks'
      : isVoipPage
        ? 'VoIP quick picks'
        : isGpsPage
          ? 'GPS fleet quick picks'
          : isEmployeePage
            ? 'Employee management quick picks'
            : isPayrollPage
              ? 'Payroll quick picks'
              : isCallCenterPage
                ? 'Call center quick picks'
                : isProjectManagementPage
                  ? 'Project management quick picks'
          : 'Website builder quick picks'
  const showcaseCards = (isCrmPage || isEmailMarketingPage || isWebsiteBuilderPage || isVoipPage || isGpsPage || isEmployeePage || isPayrollPage || isCallCenterPage || isProjectManagementPage)
    ? (isCrmPage
      ? [
        { name: 'Zoho CRM', subtitle: 'Best for Growing Businesses' },
        { name: 'Creatio', subtitle: 'Best for Customer Lifecycle Management' },
        { name: 'Hub CRM', subtitle: 'Best for Sales and Marketing Integrations' },
        { name: 'HoneyBook', subtitle: 'Best for All-in-One Option' },
        { name: 'Pipedrive', subtitle: 'Best for Automation and Management' },
      ]
      : isEmailMarketingPage
      ? [
        { name: 'Campaign Monitor', subtitle: 'Best for Deliverability' },
        { name: 'Campaigner', subtitle: 'Best for Larger Businesses' },
        { name: 'Klaviyo', subtitle: 'Best for Data-Driven Marketing' },
        { name: 'GetResponse', subtitle: 'Best AI-powered automation' },
        { name: 'HubSpot', subtitle: 'Best Bundled Marketing Solution' },
      ]
      : isWebsiteBuilderPage
      ? [
        { name: 'Wix', subtitle: 'Best Templates' },
        { name: 'GoDaddy', subtitle: 'Best for Added Tools' },
        { name: 'MochaHost', subtitle: 'Best for Businesses on a Budget' },
        { name: 'Web.com', subtitle: 'Best for Beginners' },
        { name: 'Bluehost', subtitle: 'Best for WordPress' },
      ]
      : isVoipPage
      ? [
        { name: 'Ooma Office', subtitle: 'Best for Ease of Use' },
        { name: '800.com', subtitle: 'Best for Unified Communications' },
        { name: 'Zoom', subtitle: 'Video Conferencing' },
        { name: 'Nextiva', subtitle: 'Best for Support' },
        { name: 'Vonage', subtitle: 'Best for Support' },
      ]
      : isGpsPage
      ? [
        { name: 'Motive', subtitle: 'Best for Accountability and Automation' },
        { name: 'Teletrac Navman', subtitle: 'Best for Maintenance and Safety' },
        { name: 'Verizon Connect', subtitle: 'Best for Midsize Fleets Services' },
        { name: 'Samsara', subtitle: 'Best for Sustainability and Safety' },
        { name: 'Surecam', subtitle: 'Best for Video Telematics and Safety' },
      ]
      : isEmployeePage
      ? [
        { name: 'Teramind', subtitle: 'Best for Security Threat Detection' },
        { name: 'ActivTrak', subtitle: 'Best for Workforce Analytics' },
        { name: 'Hubstaff', subtitle: 'Best for Remote Teams management' },
        { name: 'BambooHR', subtitle: 'Best for Performance Management' },
        { name: 'Intelogos', subtitle: 'Best for Larger Organizations' },
      ]
      : isPayrollPage
      ? [
        { name: 'ADP', subtitle: 'Best for Large Enterprises', phone: '1-800-225-5237' },
        { name: 'Zoho', subtitle: 'Best for Small Businesses' },
        { name: 'BambooHR', subtitle: 'Best for HR Integration' },
        { name: 'OnPay', subtitle: 'Best for SMBs with contractors' },
        { name: 'QuickBooks', subtitle: 'Best for Accounting Sync' },
      ]
      : isCallCenterPage
      ? [
        { name: 'GoTo', subtitle: 'Best for Small Businesses Management' },
        { name: 'RingCentral', subtitle: 'Best for Inbound Customer Services' },
        { name: 'GoAnswer', subtitle: 'Best Outsourced Call Center Service' },
        { name: 'Twilio', subtitle: 'Best for Complex Communication' },
        { name: 'Salesforce', subtitle: 'Best for Improving Customer Service' },
      ]
      : isProjectManagementPage
      ? [
        { name: 'Monday.com', subtitle: 'Best for Team Flexibility' },
        { name: 'ClickUp', subtitle: 'Best for Value and Free Plan' },
        { name: 'Asana', subtitle: 'Best for Enterprise Workflows' },
        { name: 'Notion', subtitle: 'Best for Docs + Project Collaboration' },
        { name: 'Jira', subtitle: 'Best for Agile and Engineering Teams' },
      ]
      : [
        { name: 'Wix', subtitle: 'Best Templates' },
        { name: 'GoDaddy', subtitle: 'Best for Added Tools' },
        { name: 'MochaHost', subtitle: 'Best for Businesses on a Budget' },
        { name: 'Web.com', subtitle: 'Best for Beginners' },
        { name: 'Bluehost', subtitle: 'Best for WordPress' },
      ]).map((card) => {
        const normalizedCardName = card.name
          .toLowerCase()
          .replace('hub crm', 'hubspot')
          .replace('hubspot crm', 'hubspot')
        const tableRow = data.table.rows.find((row) => row.cells[0].toLowerCase().includes(normalizedCardName))
        const product = data.products.find((p) => p.name.toLowerCase().includes(normalizedCardName))
        return {
          ...card,
          price: tableRow?.cells?.[2] || product?.pricingAmount || 'Custom quote',
          note: product?.tagline || 'Independent expert-rated platform',
          vendorUrl: product?.vendorUrl || '#compare',
          phone: (card as { phone?: string }).phone || '',
        }
      })
    : []

  return (
    <>
      {/* Page header */}
      <div
        className={
          smoothVariant === 'marketing-smooth'
            ? 'bg-[radial-gradient(120%_120%_at_10%_0%,#ffe7cf_0%,#fff8f0_35%,#ffffff_70%)] border-b border-[#f3d6bd]'
            : smoothVariant === 'technology-smooth'
              ? 'bg-[radial-gradient(120%_120%_at_10%_0%,#dbeafe_0%,#f3f9ff_35%,#ffffff_72%)] border-b border-[#bfdbfe]'
              : smoothVariant === 'sales-smooth'
                ? 'bg-[radial-gradient(120%_120%_at_10%_0%,#e9e5ff_0%,#f5f3ff_35%,#ffffff_72%)] border-b border-[#c7d2fe]'
                : smoothVariant === 'hr-smooth'
                  ? 'bg-[radial-gradient(120%_120%_at_10%_0%,#d1fae5_0%,#f0fdf8_35%,#ffffff_72%)] border-b border-[#a7f3d0]'
                  : 'bg-gray-50 border-b border-gray-200'
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

          {(isCrmPage || isEmailMarketingPage || isWebsiteBuilderPage || isVoipPage || isGpsPage || isEmployeePage || isPayrollPage || isCallCenterPage || isProjectManagementPage) && (
            <section aria-label={showcaseTitle} className="mt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-stretch">
                {showcaseCards.map((card) => (
                  <article
                    key={card.name}
                    className={cn(
                      'rounded-2xl p-3 sm:p-4 h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_42px_-24px_rgba(16,24,40,0.45)]',
                      smoothVariant === 'marketing-smooth'
                        ? 'bg-gradient-to-br from-white via-[#fff9f3] to-[#fff3e7] border border-[#f3c79b] shadow-[0_18px_34px_-26px_rgba(242,127,37,0.55)]'
                        : smoothVariant === 'technology-smooth'
                          ? 'bg-gradient-to-br from-white via-[#f4fbff] to-[#effbff] border border-[#93c5fd] shadow-[0_18px_34px_-26px_rgba(37,99,235,0.45)]'
                          : smoothVariant === 'sales-smooth'
                            ? 'bg-gradient-to-br from-white via-[#f7f5ff] to-[#f0efff] border border-[#a5b4fc] shadow-[0_18px_34px_-26px_rgba(79,70,229,0.45)]'
                            : smoothVariant === 'hr-smooth'
                              ? 'bg-gradient-to-br from-white via-[#f2fdf7] to-[#ecfdf5] border border-[#86efac] shadow-[0_18px_34px_-26px_rgba(16,185,129,0.4)]'
                              : 'bg-white border border-[#F27F25] shadow-sm'
                    )}
                  >
                    <h3
                      className="text-lg sm:text-xl font-semibold text-navy leading-tight mb-1 truncate whitespace-nowrap"
                      title={card.name}
                    >
                      {card.name}
                    </h3>
                    <p className="text-xs text-gray-500 min-h-[30px] sm:min-h-[34px]">{card.subtitle}</p>
                    <div className="mt-3 rounded-xl border border-gray-200/90 bg-white/80 backdrop-blur-sm p-3 sm:min-h-[116px]">
                      <p className="text-xs text-gray-500">Starts at {card.price}</p>
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">{card.note}</p>
                    </div>
                    <div className="mt-auto pt-4 space-y-2">
                      <a
                        href={data.ctaSlug}
                        className="block text-center bg-[#F27F25] hover:bg-[#E97A13] text-white text-sm font-semibold py-2 rounded-xl transition-colors"
                      >
                        Compare Quotes
                      </a>
                      {card.vendorUrl && card.vendorUrl !== '#compare' && card.name === 'ADP' ? (
                        <a
                          href={card.vendorUrl}
                          target="_blank"
                          rel="sponsored noopener noreferrer"
                          className="block text-center border border-[#F27F25] text-[#F27F25] hover:bg-orange-50 text-sm font-semibold py-2 rounded-xl transition-colors"
                        >
                          Visit Site
                        </a>
                      ) : (
                        <span
                          aria-disabled="true"
                          className="block text-center border border-[#F27F25] text-[#F27F25] text-sm font-semibold py-2 rounded-xl opacity-50 cursor-not-allowed select-none"
                        >
                          Visit Site
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
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
