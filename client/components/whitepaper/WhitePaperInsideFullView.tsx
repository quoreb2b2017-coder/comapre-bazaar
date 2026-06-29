'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cleanDisplayText } from '@/lib/cleanDisplayText'
import {
  resolveWhitePaperInsideSections,
  type WhitePaperInsideSectionItem,
} from '@/components/whitepaper/WhitePaperInsideSection'
import {
  sectionDetailParagraphs,
  sectionDisplayTitle,
  WhitePaperInsideList,
} from '@/components/whitepaper/WhitePaperInsideList'
import {
  WhitePaperTestimonials,
  type WhitePaperTestimonial,
} from '@/components/whitepaper/WhitePaperTestimonials'

type Props = {
  overview?: string
  sections?: WhitePaperInsideSectionItem[]
  points?: string[]
  testimonials?: WhitePaperTestimonial[]
  testimonialsHeading?: string
  thumbnailUrl?: string
  thumbnailAlt?: string
  offeredBy?: string
}

export function WhitePaperInsideFullView({
  overview = '',
  sections,
  points = [],
  testimonials = [],
  testimonialsHeading,
  thumbnailUrl,
  thumbnailAlt = 'Whitepaper cover',
  offeredBy = 'Compare Bazaar',
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0)

  const items = resolveWhitePaperInsideSections(sections, points)
  const overviewText = cleanDisplayText(String(overview || '').trim())
  const active = items[activeIndex] ?? items[0]

  if (!items.length || !active) return null

  const detailParagraphs = sectionDetailParagraphs(active)
  const pagesLabel = String(active.pages || '').trim()

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="w-full shrink-0">
          {thumbnailUrl ? (
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[340px] bg-[#f4f4f4] p-2 lg:mx-0 lg:max-w-none">
              <Image
                src={thumbnailUrl}
                alt={thumbnailAlt}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 340px, 360px"
                priority
              />
            </div>
          ) : null}

          <WhitePaperInsideList
            items={items}
            variant="selectable"
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
            summaryClamp="two"
            teaserMaxChars={120}
            density="comfortable"
            className={thumbnailUrl ? 'mt-5' : ''}
          />
        </div>

        <div className="min-w-0 lg:pt-1" role="tabpanel">
          {overviewText ? (
            <p className="text-[15px] leading-[1.75] text-gray-600 sm:text-base">{overviewText}</p>
          ) : null}

          <div className={overviewText ? 'mt-5 border-t border-gray-100 pt-5' : ''}>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-xl font-semibold tracking-tight text-navy sm:text-2xl">
                {sectionDisplayTitle(active)}
              </h2>
              {pagesLabel ? (
                <span className="text-sm font-medium text-gray-400">{pagesLabel}</span>
              ) : null}
            </div>

            <div className="mt-3 space-y-3">
              {detailParagraphs.map((paragraph, index) => (
                <p
                  key={`${activeIndex}-detail-${index}`}
                  className="text-[16px] leading-[1.75] text-gray-700 sm:text-[17px]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <p className="mt-6 border-t border-gray-100 pt-4 text-sm text-gray-500">
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
