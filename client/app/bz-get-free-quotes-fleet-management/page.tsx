import type { Metadata } from 'next'
import { BuyerZoneQuotePage } from '@/components/quotes/BuyerZoneQuotePage'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Get Free Fleet Management Quotes',
  description:
    'Compare fleet management software quotes from leading vendors. Share your fleet size and get matched options at no cost.',
  canonical: '/bz-get-free-quotes-fleet-management',
})

export default function BzFleetManagementQuotesPage() {
  return (
    <BuyerZoneQuotePage
      title="Get Free Fleet Management Software Quotes"
      description="Tell vendors your fleet size and tracking needs once. We match you with fleet management software providers — free and no obligation."
      categoryId="10230"
      sideImageUrl="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1400&q=80"
      sideImageAlt="Commercial trucks on a highway for fleet operations"
      sideEyebrow="Fleet management software"
      sideHeading="Track vehicles, cut idle time, and keep drivers safer"
      sideBody="Compare GPS tracking, ELD compliance, dashcam safety, and maintenance tools from vendors that fit your fleet size — not a generic vendor list."
      sideHighlights={[
        {
          title: 'Matched to your fleet mix',
          body: 'Cars, vans, trucks, construction equipment, or mixed fleets — we route your request to the right platforms.',
        },
        {
          title: 'Independent shortlist',
          body: 'Providers cannot pay for placement. You get comparable quotes you can review at your pace.',
        },
        {
          title: 'Free, no obligation',
          body: 'Submit once. Most buyers hear back within a business day with options to compare.',
        },
      ]}
      sideStats={[
        { value: '7+', label: 'Platforms' },
        { value: '24h', label: 'Typical reply' },
        { value: 'Free', label: 'To compare' },
      ]}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Fleet Management Software', href: '/technology/gps-fleet-management-software' },
        { label: 'Get Free Quotes' },
      ]}
    />
  )
}
