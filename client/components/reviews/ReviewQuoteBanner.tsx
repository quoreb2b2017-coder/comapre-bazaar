import Link from 'next/link'
import type { ReviewQuoteCta } from '@/lib/reviewQuoteCta'
import { humanizeReviewCopy } from '@/lib/humanizeReviewCopy'

export function ReviewQuoteBanner({ cta }: { cta: ReviewQuoteCta }) {
  const title = humanizeReviewCopy(cta.title)
  const body = humanizeReviewCopy(cta.body)

  return (
    <section
      id="review-quote-cta"
      className="rounded-2xl border border-orange-200 bg-[linear-gradient(180deg,#fff7ef_0%,#ffffff_100%)] p-6 shadow-sm"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cb-orange">Free quote matching</p>
      <h2 className="mt-1 text-xl font-semibold tracking-tight text-navy">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">{body}</p>
      <Link
        href={cta.href}
        className="mt-4 inline-flex items-center justify-center rounded-lg bg-cb-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cb-orange-hover"
      >
        {cta.buttonLabel} →
      </Link>
      <p className="mt-2 text-xs text-gray-500">Opens our short quote form for this category. No spam calls upfront.</p>
    </section>
  )
}
