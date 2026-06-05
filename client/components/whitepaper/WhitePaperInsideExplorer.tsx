import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cleanDisplayText } from '@/lib/cleanDisplayText'
import { resolveWhitePaperInsideSections } from '@/components/whitepaper/WhitePaperInsideSection'
import {
  WhitePaperInsideHeading,
  WhitePaperInsideList,
} from '@/components/whitepaper/WhitePaperInsideList'
import { whitePaperDescriptionPath } from '@/lib/resourceDescriptionPaths'

const PREVIEW_SECTION_COUNT = 3
const PREVIEW_OVERVIEW_MAX = 140

type Props = {
  slug: string
  overview?: string
  sections?: Parameters<typeof resolveWhitePaperInsideSections>[0]
  points?: string[]
  compact?: boolean
  className?: string
}

export function WhitePaperInsideExplorer({
  slug,
  overview = '',
  sections,
  points = [],
  compact = false,
  className = '',
}: Props) {
  const items = resolveWhitePaperInsideSections(sections, points)
  const overviewText = cleanDisplayText(String(overview || '').trim())
  if (!overviewText && items.length === 0) return null

  const previewOverview =
    overviewText.length > PREVIEW_OVERVIEW_MAX
      ? `${overviewText.slice(0, PREVIEW_OVERVIEW_MAX - 1).replace(/\s+\S*$/, '').trim()}…`
      : overviewText

  const previewSections = items.slice(0, PREVIEW_SECTION_COUNT)
  const hiddenCount = Math.max(0, items.length - PREVIEW_SECTION_COUNT)

  return (
    <section className={`text-left ${className}`}>
      <WhitePaperInsideHeading
        sectionCount={items.length}
        className={compact ? '' : 'border-t border-gray-200 pt-5'}
      />

      {previewOverview ? (
        <p className={`text-[13px] leading-relaxed text-gray-600 ${compact ? 'mt-1.5' : 'mt-4'}`}>
          {previewOverview}
        </p>
      ) : null}

      <WhitePaperInsideList
        items={previewSections}
        summaryClamp="one"
        showDividers={!compact}
        className={compact ? 'mt-1.5' : 'mt-4'}
      />

      {hiddenCount > 0 ? (
        <p className="mt-2 text-xs text-gray-500">
          + {hiddenCount} more section{hiddenCount === 1 ? '' : 's'} in the full description
        </p>
      ) : null}

      <Link
        href={whitePaperDescriptionPath(slug)}
        className="mt-3 inline-flex items-center gap-2 rounded-md bg-cb-orange px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cb-orange-hover"
      >
        Read full description
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </section>
  )
}
