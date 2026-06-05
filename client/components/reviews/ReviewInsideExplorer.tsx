import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ReviewInsideSection } from '@/lib/buildReviewInsideSections'
import { reviewDescriptionPath } from '@/lib/resourceDescriptionPaths'

const PREVIEW_SECTION_COUNT = 3
const PREVIEW_OVERVIEW_MAX = 140

type ReviewInsideExplorerProps = {
  reviewSlug: string
  reviewName: string
  overview: string
  sections: ReviewInsideSection[]
}

export function ReviewInsideExplorer({
  reviewSlug,
  reviewName,
  overview,
  sections,
}: ReviewInsideExplorerProps) {
  if (!sections.length) return null

  const previewOverview =
    overview.length > PREVIEW_OVERVIEW_MAX
      ? `${overview.slice(0, PREVIEW_OVERVIEW_MAX - 1).replace(/\s+\S*$/, '').trim()}…`
      : overview

  const previewSections = sections.slice(0, PREVIEW_SECTION_COUNT)
  const hiddenCount = Math.max(0, sections.length - PREVIEW_SECTION_COUNT)
  const descriptionHref = reviewDescriptionPath(reviewSlug)

  return (
    <section className="border-b border-gray-200/75 py-7 sm:py-8">
      <div className="max-w-3xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">What&apos;s inside</p>
        <h3 className="mt-1.5 text-base font-semibold leading-snug text-navy">
          {sections.length} sections you can act on today
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
          Trusted by operations teams for decision-making. Summarized from our full review of {reviewName}.
        </p>

        {previewOverview ? (
          <p className="mt-4 rounded-md border border-gray-100 bg-gray-50/80 px-3.5 py-3 text-[13px] leading-relaxed text-gray-600">
            {previewOverview}
          </p>
        ) : null}

        <ol className="mt-4 space-y-2">
          {previewSections.map((item, index) => (
            <li
              key={item.id}
              className="rounded-lg border border-gray-100 bg-white px-3.5 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            >
              <div className="flex items-start gap-3">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-cb-orange/10 text-[11px] font-bold tabular-nums text-cb-orange">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold leading-snug text-navy">{item.title}</p>
                  <p className="mt-1 line-clamp-1 text-[12px] leading-relaxed text-gray-600">{item.summary}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        {hiddenCount > 0 ? (
          <p className="mt-2 text-xs text-gray-500">
            + {hiddenCount} more section{hiddenCount === 1 ? '' : 's'} in the full description
          </p>
        ) : null}

        <Link
          href={descriptionHref}
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-cb-orange px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cb-orange-hover"
        >
          Read full description
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  )
}
