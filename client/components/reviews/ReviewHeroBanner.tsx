import Link from 'next/link'
import { CalendarDays, FileClock, ShieldCheck, UserCircle2 } from 'lucide-react'
import { ReviewVendorVisitButton } from '@/components/reviews/ReviewVendorVisitButton'

export type ReviewHeroBannerProps = {
  reviewName: string
  reviewSlug: string
  tagline: string
  score: string
  reviewCount: number
  pricingLabel: string
  pricingAmount: string
  pricingPeriod: string
  vendorUrl: string
  categoryPath: string
  categoryBadge: string
  compareLabel: string
  featureTags?: string[]
  summary?: string
  reviewer?: string
  reviewerRole?: string
  updatedOn?: string
  publishedOn?: string
  quoteHref: string
  quoteLabel: string
  background: string
}

export function ReviewHeroBanner({
  reviewName,
  reviewSlug,
  tagline,
  score,
  reviewCount,
  pricingLabel,
  pricingAmount,
  pricingPeriod,
  vendorUrl,
  categoryPath,
  categoryBadge,
  compareLabel,
  featureTags = [],
  reviewer,
  reviewerRole,
  updatedOn,
  publishedOn,
  quoteHref,
  quoteLabel,
  background,
}: ReviewHeroBannerProps) {
  return (
    <header className="relative mt-4 overflow-hidden rounded-xl border border-navy/10 shadow-[0_16px_36px_-28px_rgba(15,31,61,0.4)]">
      <div className="absolute inset-0" style={{ background }} aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,transparent_48%,rgba(15,31,61,0.14)_100%)]"
        aria-hidden="true"
      />

      <div className="relative px-4 py-5 sm:px-5 sm:py-6 lg:px-6 lg:py-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-5">
          <div className="min-w-0 flex-1 text-white">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80">
              {categoryBadge}
            </p>

            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl lg:text-[1.65rem] lg:leading-tight">
              {reviewName} Review
            </h1>

            <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-white/85">{tagline}</p>

            {featureTags.length > 0 ? (
              <div className="mt-2.5 flex flex-wrap gap-1">
                {featureTags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex rounded border border-white/20 bg-white/8 px-2 py-0.5 text-[10px] font-medium text-white/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-3.5 flex flex-wrap gap-2">
              <Link
                href={quoteHref}
                className="inline-flex items-center justify-center rounded-md bg-cb-orange px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-cb-orange-hover sm:px-3.5 sm:py-2 sm:text-sm"
              >
                {quoteLabel} →
              </Link>
              <ReviewVendorVisitButton
                reviewSlug={reviewSlug}
                reviewName={reviewName}
                vendorUrl={vendorUrl}
                className="rounded-md px-3 py-1.5 text-xs sm:px-3.5 sm:py-2 sm:text-sm"
              />
              <Link
                href={categoryPath}
                className="inline-flex items-center justify-center rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/15 sm:px-3.5 sm:py-2 sm:text-sm"
              >
                {compareLabel}
              </Link>
            </div>
          </div>

          <div className="w-full shrink-0 rounded-lg border border-white/20 bg-white/10 p-3 backdrop-blur-md lg:w-[210px]">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/70">Score</p>
            <div className="mt-1 flex items-end gap-1.5">
              <span className="text-3xl font-semibold tabular-nums leading-none text-white">{score}</span>
              <span className="pb-0.5 text-sm font-medium text-white/65">/5</span>
            </div>
            <p className="mt-0.5 text-[11px] text-white/75">{reviewCount.toLocaleString()} reviews</p>

            <dl className="mt-2.5 space-y-1.5 border-t border-white/15 pt-2.5 text-[11px] leading-snug">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-white/65">{pricingLabel}</dt>
                <dd className="text-right font-semibold text-white">
                  {pricingAmount}
                  <span className="font-normal text-white/70">{pricingPeriod}</span>
                </dd>
              </div>
              {updatedOn ? (
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-white/65">Last updated</dt>
                  <dd className="text-right font-medium text-white/90">{updatedOn}</dd>
                </div>
              ) : null}
              {publishedOn ? (
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-white/65">Published</dt>
                  <dd className="text-right font-medium text-white/90">{publishedOn}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>

        <div className="mt-4 border-t border-white/15 pt-2.5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-white/75 sm:text-xs">
            {reviewer ? (
              <p className="flex items-center gap-1.5">
                <UserCircle2 className="h-3.5 w-3.5 shrink-0 text-white/60" aria-hidden />
                <span>
                  <strong className="font-medium text-white/90">{reviewer}</strong>
                  {reviewerRole ? ` · ${reviewerRole}` : ''}
                </span>
              </p>
            ) : null}
            <p className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-white/60" aria-hidden />
              <span>Independent editorial review</span>
            </p>
            {updatedOn ? (
              <p className="flex items-center gap-1.5">
                <FileClock className="h-3.5 w-3.5 shrink-0 text-white/60" aria-hidden />
                <span>Updated {updatedOn}</span>
              </p>
            ) : null}
            {publishedOn ? (
              <p className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 shrink-0 text-white/60" aria-hidden />
                <span>Published {publishedOn}</span>
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
