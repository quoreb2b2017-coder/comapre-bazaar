import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata: Metadata = buildMetadata({
  title: 'Careers at Compare Bazaar',
  description: 'Explore editorial, research, and operations career opportunities at Compare Bazaar.',
  canonical: '/contact-us/careers',
})

export default function CareersPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb
        items={[{ label: 'Home', href: '/' }, { label: 'Contact Us', href: '/contact' }, { label: 'Careers' }]}
        className="mb-6"
      />
      <h1 className="text-3xl sm:text-4xl text-navy tracking-tight mb-4">Careers at Compare Bazaar</h1>
      <p className="text-gray-600 leading-relaxed mb-4">
        We hire experts in software research, editorial, SEO, and product operations to build trusted buying guides.
      </p>
      <p className="text-gray-600 leading-relaxed">
        Share your profile at careers@compare-bazaar.com with your experience and role interests.
      </p>
    </main>
  )
}
