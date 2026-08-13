import type { Metadata } from 'next'
import { BuyerZoneQuotePage } from '@/components/quotes/BuyerZoneQuotePage'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Get Free Payroll Software Quotes',
  description:
    'Compare payroll software quotes from leading providers. Share your team size and get matched options at no cost.',
  canonical: '/bz-get-free-quotes-payroll-software',
})

export default function BzPayrollSoftwareQuotesPage() {
  return (
    <BuyerZoneQuotePage
      title="Get Free Payroll Software Quotes"
      description="Tell vendors your headcount and payroll needs once. We match you with payroll software providers — free and no obligation."
      categoryId="10113"
      sideImageUrl="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80"
      sideImageAlt="Finance team reviewing payroll and reports"
      sideEyebrow="Payroll software"
      sideHeading="Run payroll on time without the tax-season scramble"
      sideBody="Compare platforms on tax filing, direct deposit, benefits, and per-employee cost. We match you to providers that fit your headcount and states."
      sideHighlights={[
        {
          title: 'Sized to your team',
          body: 'From a handful of employees to multi-state payroll — quotes reflect how you actually pay people.',
        },
        {
          title: 'Tax and compliance first',
          body: 'Look for filings, garnishments, and year-end forms in the same conversation — not after you sign.',
        },
        {
          title: 'Free, no obligation',
          body: 'One form. Multiple payroll quotes. Review pricing and features before you book a demo.',
        },
      ]}
      sideStats={[
        { value: '8+', label: 'Vendors' },
        { value: '24h', label: 'Typical reply' },
        { value: 'Free', label: 'To compare' },
      ]}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Payroll Software', href: '/human-resources/best-payroll-software' },
        { label: 'Get Free Quotes' },
      ]}
    />
  )
}
