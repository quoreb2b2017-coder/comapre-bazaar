import type { ReactNode } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'

/** Shared page shell — breadcrumb, hero, and article share the same horizontal frame. */
export const reviewHeroShellClass = 'mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8'

/** Reading column aligned with hero title (same left edge). */
export const reviewArticleClass = 'mx-auto w-full max-w-3xl pt-8 pb-4 sm:pt-10'

export const reviewSectionClass =
  'border-b border-gray-200/75 py-7 first:pt-0 last:border-b-0 last:pb-0 sm:py-8'
export const reviewSectionTitleClass = 'text-xl font-semibold tracking-tight text-navy sm:text-[1.35rem]'
export const reviewSectionLeadClass = 'mt-2.5 text-[15px] leading-relaxed text-gray-600'
export const reviewSubheadingClass = 'text-[15px] font-semibold text-navy'
export const reviewBodyClass = 'text-[15px] leading-relaxed text-gray-600'
export const reviewFactGridClass = 'mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-5'
export const reviewListClass = 'mt-3 space-y-2.5 text-sm leading-relaxed text-gray-700'

/** @deprecated use reviewArticleClass inside reviewHeroShellClass */
export const reviewMainClass = reviewArticleClass

type ReviewSectionProps = {
  title: string
  lead?: string
  children: ReactNode
  className?: string
}

export function ReviewSection({ title, lead, children, className = '' }: ReviewSectionProps) {
  return (
    <section className={`${reviewSectionClass} ${className}`.trim()}>
      <h2 className={reviewSectionTitleClass}>{title}</h2>
      {lead ? <p className={reviewSectionLeadClass}>{lead}</p> : null}
      {children}
    </section>
  )
}

type Signal = { label: string; value: string }

export function ReviewFactGrid({ items }: { items: Signal[] }) {
  return (
    <dl className={reviewFactGridClass}>
      {items.map((item) => (
        <div key={item.label} className="border-l-2 border-brand/20 pl-3.5">
          <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">{item.label}</dt>
          <dd className="mt-1 text-sm leading-relaxed text-gray-700">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function ReviewChecklist({
  title,
  items,
  iconClass = 'text-brand',
}: {
  title: string
  items: string[]
  iconClass?: string
}) {
  return (
    <div className="mt-6 border-t border-gray-100 pt-6">
      <h3 className={reviewSubheadingClass}>{title}</h3>
      <ul className={reviewListClass}>
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${iconClass}`} aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ReviewSnapshotSection({
  title,
  signals,
  checklistTitle,
  checklist,
  iconClass = 'text-brand',
}: {
  title: string
  signals: Signal[]
  checklistTitle: string
  checklist: string[]
  iconClass?: string
}) {
  return (
    <ReviewSection title={title}>
      <ReviewFactGrid items={signals} />
      <ReviewChecklist title={checklistTitle} items={checklist} iconClass={iconClass} />
    </ReviewSection>
  )
}

export function ReviewInsightStack({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="mt-4 divide-y divide-gray-100">
      {items.map((item) => (
        <article key={item.title} className="py-4 first:pt-0 last:pb-0">
          <h3 className={reviewSubheadingClass}>{item.title}</h3>
          <p className={`mt-1.5 ${reviewBodyClass}`}>{item.body}</p>
        </article>
      ))}
    </div>
  )
}

export function ReviewContentStack({ blocks }: { blocks: { title: ReactNode; body: string }[] }) {
  return (
    <div className="mt-4 divide-y divide-gray-100">
      {blocks.map((block, i) => (
        <article key={i} className="py-5 first:pt-0 last:pb-0">
          <h3 className={`${reviewSubheadingClass} flex items-center gap-2`}>{block.title}</h3>
          <p className={`mt-2 ${reviewBodyClass}`}>{block.body}</p>
        </article>
      ))}
    </div>
  )
}

export function ReviewProsConsSection({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <section className={`${reviewSectionClass} grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10`}>
      <div>
        <h2 className={reviewSubheadingClass}>Pros</h2>
        <ul className={reviewListClass}>
          {pros.map((pro) => (
            <li key={pro} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
              {pro}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className={reviewSubheadingClass}>Cons</h2>
        <ul className={reviewListClass}>
          {cons.map((con) => (
            <li key={con} className="flex gap-2">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" aria-hidden />
              {con}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function ReviewFitColumns({
  bestFor,
  notIdealFor,
}: {
  bestFor: string[]
  notIdealFor: string[]
}) {
  return (
    <section className={`${reviewSectionClass} grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10`}>
      <div>
        <h2 className={reviewSubheadingClass}>Best for</h2>
        <ul className={reviewListClass}>
          {bestFor.map((item) => (
            <li key={item} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className={reviewSubheadingClass}>Not ideal for</h2>
        <ul className={reviewListClass}>
          {notIdealFor.map((item) => (
            <li key={item} className="flex gap-2">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
