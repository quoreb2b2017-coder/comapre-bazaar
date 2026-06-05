'use client'

import { useState } from 'react'
import type { ReviewInsideSection } from '@/lib/buildReviewInsideSections'
import type { WhitePaperTestimonial } from '@/components/whitepaper/WhitePaperTestimonials'
import { WhitePaperTestimonials } from '@/components/whitepaper/WhitePaperTestimonials'
import { reviewBodyClass, reviewSectionTitleClass } from '@/components/reviews/ReviewPageUi'

type Props = {
  reviewName: string
  logo: string
  score: string
  categoryBadge: string
  overview: string
  coverBackground: string
  sections: ReviewInsideSection[]
  testimonials: WhitePaperTestimonial[]
}

function CoverCard({
  reviewName,
  logo,
  score,
  categoryBadge,
  coverBackground,
}: Pick<Props, 'reviewName' | 'logo' | 'score' | 'categoryBadge' | 'coverBackground'>) {
  return (
    <div
      className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-gray-200/80 p-6 shadow-[0_12px_32px_-24px_rgba(15,31,61,0.35)]"
      style={{ background: coverBackground }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,transparent_45%,rgba(15,31,61,0.18)_100%)]" />
      <div className="relative flex h-full flex-col justify-between text-white">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75">{categoryBadge}</p>
          <div
            className="mt-4 inline-flex h-16 w-16 items-center justify-center rounded-xl border border-white/25 bg-white/15 text-lg font-bold backdrop-blur-sm"
            aria-hidden
          >
            {logo}
          </div>
          <h2 className="mt-4 text-xl font-semibold leading-tight tracking-tight">{reviewName}</h2>
          <p className="mt-1 text-sm text-white/80">Independent review · 2026</p>
        </div>
        <div className="rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 backdrop-blur-sm">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">Editorial score</p>
          <p className="mt-0.5 text-2xl font-semibold tabular-nums">{score}/5</p>
        </div>
      </div>
    </div>
  )
}

export function ReviewInsideFullView({
  reviewName,
  logo,
  score,
  categoryBadge,
  overview,
  coverBackground,
  sections,
  testimonials,
}: Props) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '')
  const active = sections.find((s) => s.id === activeId) ?? sections[0]

  if (!sections.length || !active) return null

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
      <div className="mx-auto w-full max-w-[280px] shrink-0 sm:max-w-[320px] lg:mx-0 lg:max-w-none">
        <CoverCard
          reviewName={reviewName}
          logo={logo}
          score={score}
          categoryBadge={categoryBadge}
          coverBackground={coverBackground}
        />

        <ol className="mt-5 space-y-2 lg:mt-6" role="tablist" aria-label="Review sections">
          {sections.map((item, index) => {
            const selected = item.id === active.id
            return (
              <li key={item.id}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveId(item.id)}
                  className={`w-full rounded-lg border px-3.5 py-3 text-left transition-colors ${
                    selected
                      ? 'border-cb-orange/40 bg-cb-orange/[0.06] shadow-[0_1px_2px_rgba(15,23,42,0.04)]'
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50/80'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[11px] font-bold tabular-nums ${
                        selected ? 'bg-cb-orange text-white' : 'bg-cb-orange/10 text-cb-orange'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold leading-snug text-navy">{item.title}</p>
                      <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-gray-600">{item.summary}</p>
                    </div>
                  </div>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="min-w-0" role="tabpanel">
        {overview ? (
          <p className="rounded-md border border-gray-100 bg-gray-50/80 px-3.5 py-3 text-[13px] leading-relaxed text-gray-600">
            {overview}
          </p>
        ) : null}

        <h2 className={`mt-5 ${reviewSectionTitleClass}`}>{active.title}</h2>

        {active.blocks?.length ? (
          <div className="mt-4 space-y-5">
            {active.blocks.map((block) => (
              <article key={block.title} className="border-t border-gray-100 pt-5 first:border-t-0 first:pt-0">
                <h3 className="text-[15px] font-semibold text-navy">{block.title}</h3>
                <p className={`mt-2 whitespace-pre-line ${reviewBodyClass}`}>{block.body}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className={`mt-4 whitespace-pre-line ${reviewBodyClass}`}>{active.body}</p>
        )}

        <p className="mt-6 border-t border-gray-100 pt-5 text-xs text-gray-500">
          Independent editorial review · <span className="font-semibold text-navy">Compare Bazaar</span>
        </p>
      </div>
      </div>

      {testimonials.length > 0 ? (
        <WhitePaperTestimonials
          heading="Trusted by buyers like you"
          items={testimonials}
          layout="horizontal"
          className="border-t border-gray-200 pt-8"
        />
      ) : null}
    </div>
  )
}
