import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata: Metadata = buildMetadata({
  title: 'Software Whitepapers & Reports',
  description:
    'Download research resources and software buying reports from Compare Bazaar.',
  canonical: '/resources/whitepaper',
})

export default function WhitepaperPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Resources' }, { label: 'Whitepaper' }]} className="mb-6" />
      <h1 className="text-3xl sm:text-4xl text-navy tracking-tight mb-4">Whitepapers & Reports</h1>
      <p className="text-gray-600 leading-relaxed">
        This resource center includes practical B2B software research, category benchmarks, and pricing trend summaries.
      </p>
    </main>
  )
}
