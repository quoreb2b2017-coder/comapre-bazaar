import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata: Metadata = buildMetadata({
  title: 'Resources | Compare Bazaar',
  description:
    'Browse Compare Bazaar resources including our latest blogs and whitepaper reports for software buyers.',
  canonical: '/resources',
})

const RESOURCE_ITEMS = [
  {
    title: 'Our Blogs',
    description:
      'Read software buying guides, comparison frameworks, and practical tips for choosing the right tools.',
    href: '/blog',
    cta: 'Open Blogs',
  },
  {
    title: 'Whitepaper',
    description:
      'Access in-depth software research and market insights designed for business decision-makers.',
    href: '/resources/whitepaper',
    cta: 'Open Whitepaper',
  },
]

export default function ResourcesPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb
        items={[{ label: 'Home', href: '/' }, { label: 'Resources' }]}
        className="mb-6"
      />

      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-2">Resources</p>
        <h1 className="text-3xl sm:text-4xl text-navy tracking-tight mb-3">Choose a Resource Type</h1>
        <p className="text-gray-600 max-w-2xl">
          Explore our knowledge library. Select Blogs for ongoing articles or Whitepaper for deep research.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {RESOURCE_ITEMS.map((item) => (
          <article key={item.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl text-navy tracking-tight mb-2">{item.title}</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-5">{item.description}</p>
            <Link
              href={item.href}
              className="inline-flex items-center rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover transition-colors"
            >
              {item.cta}
            </Link>
          </article>
        ))}
      </section>
    </main>
  )
}
