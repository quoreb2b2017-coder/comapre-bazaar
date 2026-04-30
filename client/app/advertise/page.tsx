import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata: Metadata = buildMetadata({
  title: 'Advertise With Compare Bazaar',
  description:
    'Partner with Compare Bazaar through clearly labeled featured placements and sponsorship opportunities for B2B software buyers.',
  canonical: '/advertise',
})

export default function AdvertisePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Advertise' }]} className="mb-6" />
      <h1 className="text-3xl sm:text-4xl text-navy tracking-tight mb-4">Advertise with Compare Bazaar</h1>
      <p className="text-gray-600 leading-relaxed mb-4">
        We offer clearly labeled featured placements for software brands that want qualified B2B visibility.
      </p>
      <p className="text-gray-600 leading-relaxed">
        To request a media kit and current availability, contact us at{' '}
        <a className="text-brand hover:underline" href="mailto:marketing@compare-bazaar.com">
          marketing@compare-bazaar.com
        </a>
        .
      </p>
    </main>
  )
}
