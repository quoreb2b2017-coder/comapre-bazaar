import type { WhitePaperInsideSectionItem } from '@/components/whitepaper/whitePaperInsideTypes'

export function sectionDisplayTitle(item: WhitePaperInsideSectionItem): string {
  return item.title || item.summary
}

export function sectionDisplaySummary(item: WhitePaperInsideSectionItem): string {
  if (item.title && item.summary && item.title !== item.summary) return item.summary
  return ''
}

export function sectionListPreview(item: WhitePaperInsideSectionItem): string {
  const body = String(item.body || '').trim()
  const summary = sectionDisplaySummary(item)
  if (body) return body
  return summary
}

export function sectionDisplayBody(item: WhitePaperInsideSectionItem): string {
  const body = String(item.body || '').trim()
  if (body && body !== item.summary) return body
  if (body) return body
  return sectionDisplaySummary(item) || item.title || item.summary
}

export function sectionDetailParagraphs(item: WhitePaperInsideSectionItem): string[] {
  const summary = sectionDisplaySummary(item)
  const body = String(item.body || '').trim()
  const paragraphs: string[] = []

  if (body.length > 160) {
    paragraphs.push(...body.split(/\n+/).map((p) => p.trim()).filter(Boolean))
    if (summary && !body.includes(summary.slice(0, Math.min(summary.length, 60)))) {
      paragraphs.unshift(summary)
    }
    return paragraphs
  }

  if (summary) paragraphs.push(summary)
  if (body && body !== summary) paragraphs.push(body)
  if (!paragraphs.length) {
    const fallback = sectionDisplayBody(item)
    if (fallback) paragraphs.push(fallback)
  }
  return paragraphs
}

type InsideListProps = {
  items: WhitePaperInsideSectionItem[]
  variant?: 'static' | 'selectable'
  activeIndex?: number
  onSelect?: (index: number) => void
  summaryClamp?: 'none' | 'one' | 'two'
  density?: 'compact' | 'comfortable'
  showDividers?: boolean
  className?: string
}

export function WhitePaperInsideList({
  items,
  variant = 'static',
  activeIndex = 0,
  onSelect,
  summaryClamp = 'none',
  density = 'compact',
  showDividers = true,
  className = '',
}: InsideListProps) {
  if (!items.length) return null

  const comfortable = density === 'comfortable'
  const titleClass = comfortable ? 'text-[15px] leading-snug' : 'text-[13px] leading-snug'
  const summaryTextClass = comfortable ? 'text-[14px] leading-relaxed' : 'text-[12px] leading-relaxed'
  const indexClass = comfortable ? 'text-xs' : 'text-[11px]'
  const listClass = showDividers ? 'divide-y divide-gray-100' : 'space-y-1'

  const summaryClass =
    summaryClamp === 'one'
      ? 'line-clamp-1'
      : summaryClamp === 'two'
        ? 'line-clamp-2'
        : ''

  return (
    <ol className={`${listClass} ${className}`.trim()} role={variant === 'selectable' ? 'tablist' : undefined}>
      {items.map((item, index) => {
        const title = sectionDisplayTitle(item)
        const preview = sectionListPreview(item)
        const selected = variant === 'selectable' && index === activeIndex

        const content = (
          <>
            <span className={`w-7 shrink-0 pt-0.5 font-semibold tabular-nums text-gray-400 ${indexClass}`}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`${titleClass} ${selected ? 'font-semibold text-navy' : 'font-medium text-navy'}`}>
                {title}
              </p>
              {preview ? (
                <p className={`mt-1.5 text-gray-600 ${summaryTextClass} ${summaryClass}`.trim()}>{preview}</p>
              ) : null}
            </div>
          </>
        )

        if (variant === 'selectable') {
          return (
            <li key={`section-${index}-${title.slice(0, 20)}`}>
              <button
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => onSelect?.(index)}
                className={`flex w-full gap-3 py-3 text-left transition-colors first:pt-0 last:pb-0 ${
                  selected ? 'border-l-2 border-cb-orange pl-3 -ml-0.5' : 'border-l-2 border-transparent pl-3 -ml-0.5 hover:text-navy'
                }`}
              >
                {content}
              </button>
            </li>
          )
        }

        return (
          <li key={`section-${index}-${title.slice(0, 20)}`} className="flex gap-3 py-3 first:pt-0 last:pb-0">
            {content}
          </li>
        )
      })}
    </ol>
  )
}

export function WhitePaperInsideHeading({
  sectionCount,
  className = '',
}: {
  sectionCount: number
  className?: string
}) {
  return (
    <div className={className}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">What&apos;s inside</p>
      <h3 className="mt-1.5 text-base font-semibold leading-snug text-navy">
        {sectionCount > 0
          ? `${sectionCount} sections of data you can act on today`
          : 'Key insights from this whitepaper'}
      </h3>
      <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
        Trusted by operations teams for decision-making. Summarized from this PDF.
      </p>
    </div>
  )
}
