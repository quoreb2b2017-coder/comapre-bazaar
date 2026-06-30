'use client'

import Image from 'next/image'
import type { WhitePaperSidebarHighlight } from '@/lib/whitePaperDisplay'
import {
  WhitePaperInsideHeading,
  WhitePaperInsideList,
} from '@/components/whitepaper/WhitePaperInsideList'
import type { WhitePaperInsideSectionItem } from '@/components/whitepaper/whitePaperInsideTypes'
import {
  WhitePaperTestimonials,
  type WhitePaperTestimonial,
} from '@/components/whitepaper/WhitePaperTestimonials'

type Props = {
  overview?: string
  sidebarHighlights?: WhitePaperSidebarHighlight[]
  testimonials?: WhitePaperTestimonial[]
  testimonialsHeading?: string
  thumbnailUrl?: string
  thumbnailAlt?: string
  offeredBy?: string
}

function highlightsToSections(highlights: WhitePaperSidebarHighlight[]): WhitePaperInsideSectionItem[] {
  return highlights.map((item) => ({
    title: item.title,
    summary: item.text,
  }))
}

export function WhitePaperInsideFullView({
  overview = '',
  sidebarHighlights = [],
  testimonials = [],
  testimonialsHeading,
  thumbnailUrl,
  thumbnailAlt = 'Whitepaper cover',
  offeredBy = 'Compare Bazaar',
}: Props) {
  const highlights = sidebarHighlights.filter((item) => item.text)
  const overviewText = overview.trim()
  const sidebarItems = highlightsToSections(highlights)

  if (!overviewText && !sidebarItems.length) return null

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[minmax(0,300px)_minmax(0,1fr)] xl:gap-12">
        {/* Left — thumbnail + numbered section previews */}
        <aside className="w-full shrink-0 space-y-5 lg:sticky lg:top-8 lg:self-start">
          {thumbnailUrl ? (
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[260px] bg-[#f4f6fb] p-2 sm:max-w-[280px] lg:mx-0 lg:max-w-none">
              <Image
                src={thumbnailUrl}
                alt={thumbnailAlt}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 280px, 300px"
                priority
              />
            </div>
          ) : null}

          {sidebarItems.length > 0 ? (
            <div className={thumbnailUrl ? 'border-t border-gray-200 pt-5' : ''}>
              <WhitePaperInsideHeading sectionCount={sidebarItems.length} />
              <WhitePaperInsideList
                items={sidebarItems}
                variant="static"
                summaryClamp="two"
                leadSummaryClamp="three"
                teaserMaxChars={130}
                leadTeaserMaxChars={400}
                density="comfortable"
                showDividers
                className="mt-4"
              />
            </div>
          ) : null}
        </aside>

        {/* Right — full overview */}
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">Overview</p>
          <h2 className="mt-1.5 font-serif text-xl font-normal leading-snug text-navy sm:text-2xl">
            What you&apos;ll learn from this report
          </h2>

          {overviewText ? (
            <p className="mt-5 max-w-[65ch] text-[15px] leading-[1.85] text-gray-700 sm:text-base sm:leading-[1.9]">
              {overviewText}
            </p>
          ) : (
            <p className="mt-5 text-sm leading-relaxed text-gray-500">
              Download the PDF for the complete analysis, benchmarks, and implementation guidance.
            </p>
          )}

          <p className="mt-8 border-t border-gray-200 pt-4 text-sm text-gray-500">
            Summarized from this PDF · Offered free by{' '}
            <span className="font-semibold text-navy">{offeredBy}</span>
          </p>
        </div>
      </div>

      {testimonials.length > 0 ? (
        <WhitePaperTestimonials
          heading={testimonialsHeading}
          items={testimonials}
          layout="horizontal"
          className="border-t border-gray-200 pt-8"
        />
      ) : null}
    </div>
  )
}
