import Link from 'next/link'
import type { ReviewQuoteCta } from '@/lib/reviewQuoteCta'
import { humanizeReviewCopy } from '@/lib/humanizeReviewCopy'
import { reviewBodyClass, reviewSectionClass, reviewSectionTitleClass } from '@/components/reviews/ReviewPageUi'

export function ReviewQuoteBanner({ cta }: { cta: ReviewQuoteCta }) {
  const title = humanizeReviewCopy(cta.title)
  const body = humanizeReviewCopy(cta.body)

  return (
    <section
      id="review-quote-cta"
      className={`${reviewSectionClass} rounded-lg border border-orange-100 border-l-4 border-l-cb-orange bg-orange-50/40 px-4 py-6 sm:px-5`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cb-orange">Free quote matching</p>
      <h2 className={`mt-1 ${reviewSectionTitleClass}`}>{title}</h2>
      <p className={`mt-2 max-w-2xl ${reviewBodyClass}`}>{body}</p>
      <Link
        href={cta.href}
        className="mt-4 inline-flex items-center justify-center rounded-md bg-cb-orange px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cb-orange-hover"
      >
        {cta.buttonLabel} →
      </Link>
      <p className="mt-2 text-xs text-gray-500">Opens our short quote form for this category. No spam calls upfront.</p>
    </section>
  )
}
