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

/** Short teaser for preview lists — never show full body copy. */
export function truncatePreviewText(text: string, maxChars = 120): string {
  const cleaned = String(text || '').replace(/\s+/g, ' ').trim()
  if (!cleaned) return ''
  if (cleaned.length <= maxChars) return cleaned
  return `${cleaned.slice(0, maxChars - 1).replace(/\s+\S*$/, '').trim()}…`
}

export function sectionPreviewTeaser(item: WhitePaperInsideSectionItem, maxChars = 120): string {
  const summary = sectionDisplaySummary(item)
  const rawSummary = String(item.summary || '').trim()
  const body = String(item.body || '').trim()

  let source = summary
  if (!source && rawSummary && rawSummary !== String(item.title || '').trim()) {
    source = rawSummary
  }
  if (!source && body) {
    const firstSentence = body.match(/^[^.!?]+[.!?]/)?.[0]?.trim() || body
    source = firstSentence
  }

  return truncatePreviewText(source, maxChars)
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
  summaryClamp?: 'none' | 'one' | 'two' | 'three'
  leadSummaryClamp?: 'none' | 'one' | 'two' | 'three'
  density?: 'compact' | 'comfortable'
  showDividers?: boolean
  className?: string
  teaserMaxChars?: number
  leadTeaserMaxChars?: number
}

export function WhitePaperInsideList({
  items,
  variant = 'static',
  activeIndex = 0,
  onSelect,
  summaryClamp = 'none',
  leadSummaryClamp,
  density = 'compact',
  showDividers = true,
  className = '',
  teaserMaxChars = 120,
  leadTeaserMaxChars,
}: InsideListProps) {
  if (!items.length) return null

  const comfortable = density === 'comfortable'
  const titleClass = comfortable ? 'text-[15px] leading-snug' : 'text-[13px] leading-snug'
  const summaryTextClass = comfortable ? 'text-[14px] leading-relaxed' : 'text-[12px] leading-relaxed'
  const indexClass = comfortable ? 'text-xs' : 'text-[11px]'
  const listClass = showDividers ? 'divide-y divide-gray-100' : 'space-y-1'

  const clampClass = (clamp: InsideListProps['summaryClamp']) =>
    clamp === 'one'
      ? 'line-clamp-1'
      : clamp === 'two'
        ? 'line-clamp-2'
        : clamp === 'three'
          ? 'line-clamp-3'
          : ''

  return (
    <ol className={`${listClass} ${className}`.trim()} role={variant === 'selectable' ? 'tablist' : undefined}>
      {items.map((item, index) => {
        const title = sectionDisplayTitle(item)
        const itemClamp = index === 0 && leadSummaryClamp ? leadSummaryClamp : summaryClamp
        const itemTeaserMax = index === 0 && leadTeaserMaxChars ? leadTeaserMaxChars : teaserMaxChars
        const preview =
          itemClamp === 'none' ? sectionListPreview(item) : sectionPreviewTeaser(item, itemTeaserMax)
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
                <p
                  className={`mt-1.5 overflow-hidden text-gray-600 ${summaryTextClass} ${clampClass(itemClamp)}`.trim()}
                >
                  {preview}
                </p>
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
  previewCount,
  className = '',
}: {
  sectionCount: number
  previewCount?: number
  className?: string
}) {
  const showing = previewCount ?? sectionCount
  const hasMore = sectionCount > showing

  return (
    <div className={className}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">What&apos;s inside</p>
      <h3 className="mt-1.5 text-base font-semibold leading-snug text-navy">
        {sectionCount > 0
          ? hasMore
            ? `Preview: ${showing} of ${sectionCount} sections`
            : `${sectionCount} sections of data you can act on today`
          : 'Key insights from this whitepaper'}
      </h3>
      <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
        Trusted by operations teams for decision-making. Summarized from this PDF.
      </p>
    </div>
  )
}
