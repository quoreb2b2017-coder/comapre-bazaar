import { cleanDisplayText } from '@/lib/cleanDisplayText'

export type WhitePaperInsideSectionItem = {
  title: string
  summary: string
  pages?: string
}

type Props = {
  overview?: string
  sections?: WhitePaperInsideSectionItem[]
  points?: string[]
  className?: string
}

function resolveSections(
  sections: WhitePaperInsideSectionItem[] | undefined,
  points: string[] | undefined
): WhitePaperInsideSectionItem[] {
  if (Array.isArray(sections) && sections.length) {
    return sections
      .filter((s) => s && (s.title || s.summary))
      .slice(0, 6)
      .map((s) => ({
        title: cleanDisplayText(String(s.title || '').trim()),
        summary: cleanDisplayText(String(s.summary || '').trim()),
      }))
  }
  return (points || [])
    .map((p) => String(p || '').trim())
    .filter(Boolean)
    .slice(0, 6)
    .map((text) => ({ title: '', summary: cleanDisplayText(text) }))
}

export function WhitePaperInsideSection({ overview, sections, points = [], className = '' }: Props) {
  const items = resolveSections(sections, points)
  const overviewText = cleanDisplayText(String(overview || '').trim())
  if (!overviewText && items.length === 0) return null

  const sectionCount = items.length

  return (
    <section className={`text-left ${className}`}>
      <div className="border-t border-gray-200 pt-5">
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

      {overviewText ? (
        <p className="mt-4 rounded-md border border-gray-100 bg-gray-50/80 px-3.5 py-3 text-[13px] leading-relaxed text-gray-600">
          {overviewText}
        </p>
      ) : null}

      {items.length > 0 ? (
        <ol className="mt-4 space-y-2.5">
          {items.map((item, index) => {
            const title = item.title || item.summary
            const summary = item.title && item.summary && item.title !== item.summary ? item.summary : ''
            return (
              <li
                key={`${index}-${title.slice(0, 24)}`}
                className="rounded-lg border border-gray-100 bg-white px-3.5 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-cb-orange/10 text-[11px] font-bold tabular-nums text-cb-orange">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold leading-snug text-navy">{title}</p>
                    {summary ? (
                      <p className="mt-1.5 text-[12px] leading-relaxed text-gray-600">{summary}</p>
                    ) : null}
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      ) : null}
    </section>
  )
}
