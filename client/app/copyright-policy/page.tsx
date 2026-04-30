import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata: Metadata = buildMetadata({
  title: 'Copyright Policy | Compare Bazaar',
  description: 'Copyright and intellectual property policy for content published on Compare Bazaar.',
  canonical: '/copyright-policy',
})

export default function CopyrightPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Copyright Policy' }]} className="mb-6" />
      <h1 className="text-3xl sm:text-4xl text-navy tracking-tight mb-4">Copyright Policy</h1>
      <p className="text-gray-600 leading-relaxed mb-4">
        All original content on Compare Bazaar is protected by copyright law. Unauthorized reproduction, republication,
        or commercial reuse without written permission is prohibited.
      </p>
      <p className="text-gray-600 leading-relaxed">
        If you believe your copyright has been infringed, email legal@compare-bazaar.com with supporting details.
      </p>
    </main>
  )
}
