import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { buildMetadata } from '@/lib/seo'
import { ReviewInsideFullView } from '@/components/reviews/ReviewInsideFullView'
import { getReviewInsidePayload, generateStaticParams as reviewStaticParams } from '../page'

type PageProps = { params: { slug: string } }

export const dynamicParams = true

export function generateStaticParams() {
  return reviewStaticParams()
}

export function generateMetadata({ params }: PageProps): Metadata {
  const data = getReviewInsidePayload(params.slug)
  if (!data) {
    return buildMetadata({
      title: 'Review description',
      description: 'Full software review description.',
      canonical: `/reviews/${params.slug}/description`,
    })
  }

  return buildMetadata({
    title: `Full description: ${data.review.name} Review`,
    description: data.overview,
    canonical: `/reviews/${data.review.slug}/description`,
  })
}

export default function ReviewDescriptionPage({ params }: PageProps) {
  const data = getReviewInsidePayload(params.slug)
  if (!data) notFound()

  const { review, sections, overview, testimonials, categoryBadge, coverBackground } = data
  const reviewHref = `/reviews/${review.slug}`

  return (
    <main className="bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Reviews', href: review.categoryPath },
            { label: `${review.name} Review`, href: reviewHref },
            { label: 'Full description' },
          ]}
          className="mb-0"
        />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href={reviewHref}
          className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to review
        </Link>

        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">Full description</p>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
          {review.name} Review
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Select a section to read the complete analysis for {review.name}.
        </p>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <ReviewInsideFullView
            reviewName={review.name}
            logo={review.logo}
            score={review.score}
            categoryBadge={categoryBadge}
            overview={overview}
            coverBackground={coverBackground}
            sections={sections}
            testimonials={testimonials}
          />
        </div>

        <div className="mt-10 border-t border-gray-200 pt-8">
          <Link
            href={reviewHref}
            className="inline-flex rounded-md bg-cb-orange px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cb-orange-hover"
          >
            Read complete review →
          </Link>
        </div>
      </div>
    </main>
  )
}
