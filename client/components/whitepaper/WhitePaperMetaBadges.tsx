import Link from 'next/link'
import {
  resolveWhitePaperVerticalSlug,
  whitePaperResourceLabel,
  whitePaperVerticalLabel,
  whitePaperVerticalPath,
} from '@/lib/whitePaperTaxonomy'
import { whitePaperResourceType } from '@/lib/whitePaperResourceType'
import type { WhitePaperPublic } from '@/lib/whitePaperCms'

type WhitePaperMetaBadgesProps = {
  paper: WhitePaperPublic
  linkVertical?: boolean
  className?: string
}

export function WhitePaperMetaBadges({
  paper,
  linkVertical = false,
  className = '',
}: WhitePaperMetaBadgesProps) {
  const resourceLabel = whitePaperResourceLabel(whitePaperResourceType(paper.metadata))
  const verticalLabel = whitePaperVerticalLabel(paper.metadata)
  const verticalPath = whitePaperVerticalPath(paper.metadata)
  const verticalSlug = resolveWhitePaperVerticalSlug(paper.metadata)

  if (!resourceLabel && !verticalLabel) return null

  return (
    <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${className}`}>
      <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-600">
        {resourceLabel}
      </span>
      {verticalLabel ? (
        linkVertical && verticalPath && verticalSlug ? (
          <Link
            href={verticalPath}
            className="inline-flex rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#1D4ED8] transition-colors hover:bg-[#E0E7FF]"
          >
            {verticalLabel}
          </Link>
        ) : (
          <span className="inline-flex rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#1D4ED8]">
            {verticalLabel}
          </span>
        )
      ) : null}
    </div>
  )
}
