import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata: Metadata = buildMetadata({
  title: 'Advertising Disclosure | Compare Bazaar',
  description: 'How Compare Bazaar earns revenue and how it does not affect our editorial rankings.',
  canonical: '/advertising-disclosure',
})

export default function AdvertisingDisclosurePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb
        items={[{ label: 'Home', href: '/' }, { label: 'Advertising Disclosure' }]}
        className="mb-6"
      />
      <h1 className="text-3xl sm:text-4xl text-navy tracking-tight mb-4">
        Advertising Disclosure
      </h1>
      <p className="text-gray-600 leading-relaxed mb-8">
        Compare Bazaar is reader-supported. We may earn money from affiliate partnerships and sponsored
        placements, but we do not allow advertisers to buy editorial rankings. This page explains exactly
        how revenue works, how we separate commercial and editorial decisions, and what that means for your
        software buying process.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <article className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-base font-semibold text-navy mb-1">Commercial Transparency</h2>
          <p className="text-sm text-gray-600">Paid placements are clearly labeled so readers can distinguish them.</p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-base font-semibold text-navy mb-1">Editorial Independence</h2>
          <p className="text-sm text-gray-600">Scores and rankings are created independently by our review team.</p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-base font-semibold text-navy mb-1">Buyer-First Policy</h2>
          <p className="text-sm text-gray-600">Our goal is practical software shortlisting, not vendor promotion.</p>
        </article>
      </div>

      <div className="prose-editorial max-w-none">
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
          <Link href="/editorial-process">editorial process page</Link> and applied consistently regardless
          of commercial relationships.
        </p>
        <h2>How we keep this process fair</h2>
        <ul>
          <li>Structured scoring framework applied across all vendors in a category.</li>
          <li>Commercial placements are visually separated from editorial tables.</li>
          <li>Periodic content refreshes to keep pricing and feature claims current.</li>
          <li>Disclosure language is shown on high-intent comparison and review pages.</li>
        </ul>
        <h2>Why this matters for software buyers</h2>
        <p>
          Buyers often search terms like &ldquo;best CRM software for small business&rdquo; or
          &ldquo;payroll software comparison&rdquo; and need trustworthy guidance. Clear disclosure helps you
          evaluate recommendations with confidence and quickly separate organic rankings from sponsored options.
        </p>
      </div>
    </div>
  )
}
