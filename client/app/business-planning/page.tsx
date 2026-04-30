import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata: Metadata = buildMetadata({
  title: 'Business Planning Resources',
  description:
    'Business planning resources from Compare Bazaar with software selection guidance for growth-focused teams.',
  canonical: '/business-planning',
})

export default function BusinessPlanningPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Business Planning' }]} className="mb-6" />
      <h1 className="text-3xl sm:text-4xl text-navy tracking-tight mb-4">Business Planning Resources</h1>
      <p className="text-gray-600 leading-relaxed mb-4">
        Effective planning includes choosing operational systems that support your goals across acquisition, delivery,
        retention, and reporting.
      </p>
      <p className="text-gray-600 leading-relaxed">
        Use Compare Bazaar comparison guides to evaluate software by pricing, feature depth, scalability, and usability.
      </p>
    </main>
  )
}
