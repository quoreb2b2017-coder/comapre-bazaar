import { cleanDisplayText } from '@/lib/cleanDisplayText'
import {
  WhitePaperInsideHeading,
  WhitePaperInsideList,
} from '@/components/whitepaper/WhitePaperInsideList'
import {
  INSIDE_SECTIONS_MAX,
  type WhitePaperInsideSectionItem,
} from '@/components/whitepaper/whitePaperInsideTypes'

export { INSIDE_SECTIONS_MAX, type WhitePaperInsideSectionItem }

type Props = {
  overview?: string
  sections?: WhitePaperInsideSectionItem[]
  points?: string[]
  className?: string
}

export function resolveWhitePaperInsideSections(
  sections: WhitePaperInsideSectionItem[] | undefined,
  points: string[] | undefined
): WhitePaperInsideSectionItem[] {
  if (Array.isArray(sections) && sections.length) {
    return sections
      .filter((s) => s && (s.title || s.summary))
      .slice(0, INSIDE_SECTIONS_MAX)
      .map((s) => ({
        title: cleanDisplayText(String(s.title || '').trim()),
        summary: cleanDisplayText(String(s.summary || '').trim()),
        body: cleanDisplayText(String(s.body || s.summary || '').trim()),
        pages: cleanDisplayText(String(s.pages || '').trim()),
      }))
  }
  return (points || [])
    .map((p) => String(p || '').trim())
    .filter(Boolean)
    .slice(0, INSIDE_SECTIONS_MAX)
    .map((text) => ({ title: '', summary: cleanDisplayText(text) }))
}

export function WhitePaperInsideSection({ overview, sections, points = [], className = '' }: Props) {
  const items = resolveWhitePaperInsideSections(sections, points)
  const overviewText = cleanDisplayText(String(overview || '').trim())
  if (!overviewText && items.length === 0) return null

  return (
    <section className={`text-left ${className}`}>
      <WhitePaperInsideHeading sectionCount={items.length} className="border-t border-gray-200 pt-5" />

      {overviewText ? (
        <p className="mt-4 text-[13px] leading-relaxed text-gray-600">{overviewText}</p>
      ) : null}

      <WhitePaperInsideList items={items} className="mt-4" />
    </section>
  )
}
