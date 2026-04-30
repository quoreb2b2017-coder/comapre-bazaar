import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, XCircle } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { comparisonPages } from '@/data/comparisons'

type ReviewEntry = {
  slug: string
  name: string
  tagline: string
  score: string
  reviewCount: number
  pros: string[]
  cons: string[]
  pricingLabel: string
  pricingAmount: string
  pricingPeriod: string
  vendorUrl: string
  categoryLabel: string
  categoryPath: string
}

const reviewEntries: ReviewEntry[] = comparisonPages.flatMap((page) =>
  page.products.map((product) => ({
    slug: product.reviewSlug,
    name: product.name,
    tagline: product.tagline,
    score: product.score,
    reviewCount: product.reviewCount,
    pros: product.pros,
    cons: product.cons,
    pricingLabel: product.pricingLabel,
    pricingAmount: product.pricingAmount,
    pricingPeriod: product.pricingPeriod,
    vendorUrl: product.vendorUrl,
    categoryLabel: page.h1,
    categoryPath: page.canonical,
  }))
)

export function generateStaticParams() {
  return reviewEntries.map((entry) => ({ slug: entry.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const review = reviewEntries.find((item) => item.slug === params.slug)
  if (!review) {
    return buildMetadata({
      title: 'Review Not Found',
      description: 'This review page does not exist.',
      canonical: '/reviews/hubspot-crm-review',
    })
  }
  return buildMetadata({
    title: `${review.name} Review 2026 | Compare Bazaar`,
    description: `${review.name} review: ${review.tagline}. Pricing, pros, cons, and editorial verdict for business buyers.`,
    canonical: `/reviews/${review.slug}`,
  })
}

export default function DynamicReviewPage({ params }: { params: { slug: string } }) {
  const review = reviewEntries.find((item) => item.slug === params.slug)
  if (!review) notFound()

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Reviews', href: '/blog' },
          { label: `${review.name} Review` },
        ]}
        className="mb-6"
      />

      <header className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-8">
        <h1 className="text-3xl text-navy tracking-tight mb-2">{review.name} Review</h1>
        <p className="text-gray-600 mb-4">{review.tagline}</p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <span className="inline-flex rounded-full bg-brand-light text-brand px-3 py-1 font-semibold">
            Score: {review.score}/5
          </span>
          <span>{review.reviewCount.toLocaleString()} user reviews analyzed</span>
          <span>
            {review.pricingLabel}: <strong className="text-navy">{review.pricingAmount}</strong>
            <span className="text-gray-500">{review.pricingPeriod}</span>
          </span>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <article className="rounded-xl border border-green-200 bg-green-50 p-5">
          <h2 className="text-lg text-green-900 mb-3">Pros</h2>
          <ul className="space-y-2">
            {review.pros.map((pro) => (
              <li key={pro} className="flex gap-2 text-sm text-green-900/90">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {pro}
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-xl border border-red-200 bg-red-50 p-5">
          <h2 className="text-lg text-red-900 mb-3">Cons</h2>
          <ul className="space-y-2">
            {review.cons.map((con) => (
              <li key={con} className="flex gap-2 text-sm text-red-900/90">
                <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {con}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl text-navy tracking-tight mb-2">Editorial Verdict</h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          {review.name} is a strong option for teams that match its category fit and budget profile. Use this review
          as a shortlist filter, then compare onboarding effort, reporting needs, and integration depth before final
          purchase.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={review.vendorUrl}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="bg-brand hover:bg-brand-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Visit {review.name}
          </a>
          <Link
            href={review.categoryPath}
            className="border border-brand text-brand hover:bg-brand-light text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Compare Alternatives
          </Link>
        </div>
      </section>
    </main>
  )
}
