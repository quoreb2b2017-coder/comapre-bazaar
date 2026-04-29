import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata: Metadata = buildMetadata({
  title: 'Advertising Disclosure | Compare Bazaar',
  description: 'How Compare Bazaar earns revenue and how it does not affect our editorial rankings.',
  canonical: '/advertising-disclosure',
})

export default function AdvertisingDisclosurePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb
        items={[{ label: 'Home', href: '/' }, { label: 'Advertising Disclosure' }]}
        className="mb-6"
      />
      <h1 className="text-3xl sm:text-4xl text-navy tracking-tight mb-4">
        Advertising disclosure
      </h1>
      <div className="prose-editorial">
        <p>
          Compare Bazaar is reader-supported. When you purchase software through links on our site,
          we may earn a commission from the vendor — at no additional cost to you.
        </p>
        <h2>How we make money</h2>
        <p>
          We generate revenue through two mechanisms: affiliate commissions and clearly labelled
          &ldquo;Featured Partner&rdquo; placements. In both cases, commercial relationships have
          absolutely no influence on our editorial rankings, scores, or recommendations.
        </p>
        <h2>What &ldquo;Featured Partner&rdquo; means</h2>
        <p>
          Some vendors pay to appear in a &ldquo;Featured Partner&rdquo; or
          &ldquo;Advertisement&rdquo; section. These are always clearly labelled and always appear
          separately from our organic editorial recommendations. Paying for a featured placement does
          not improve a vendor&apos;s score or ranking in our comparison tables.
        </p>
        <h2>Our commitment to you</h2>
        <p>
          Our editorial team operates independently of our commercial team. Reviewers never see
          commission data for the products they assess. Our scoring methodology is published on our{' '}
          <a href="/editorial-process">editorial process page</a> and applied consistently regardless
          of commercial relationships.
        </p>
      </div>
    </div>
  )
}
