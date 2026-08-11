import Link from 'next/link'
import type { TocItem } from '@/types'
import { ComparisonTableOfContents } from '@/components/comparison/ComparisonTableOfContents'

interface SidebarProps {
  tocItems: TocItem[]
  pagePath: string
  ctaTitle: string
  ctaBody: string
  ctaSlug: string
  vendorCount?: number
  lastReviewed?: string
}

export function ComparisonSidebar({
  tocItems,
  pagePath,
  ctaTitle,
  ctaBody,
  ctaSlug,
  vendorCount,
  lastReviewed,
}: SidebarProps) {
  return (
    <aside
      className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-lg shadow-navy/5"
      aria-label="Page navigation"
    >
      <ComparisonTableOfContents items={tocItems} pagePath={pagePath} />

      {(vendorCount != null || lastReviewed) && (
        <div className="grid grid-cols-2 gap-px border-t border-gray-100 bg-gray-100">
          {vendorCount != null ? (
            <div className="bg-gradient-to-br from-[#FAFBFD] to-white px-4 py-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400">Compared</p>
              <p className="mt-0.5 font-serif text-lg tabular-nums text-navy">{vendorCount}</p>
            </div>
          ) : null}
          {lastReviewed ? (
            <div className="bg-white px-4 py-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400">Verified</p>
              <p className="mt-0.5 text-sm font-semibold text-navy">{lastReviewed}</p>
            </div>
          ) : null}
        </div>
      )}

      <div id="get_free_quotes" className="scroll-mt-24 border-t border-gray-100 bg-gradient-to-br from-[#FFFBF7] via-white to-cb-orange/[0.06] px-5 py-6">
        <h4 className="font-serif text-[16px] leading-snug text-cb-orange">{ctaTitle}</h4>
        <p className="mt-3 text-[13px] leading-relaxed text-gray-600">{ctaBody}</p>
        <Link
          href={ctaSlug}
          className="mt-4 flex w-full items-center justify-center rounded-xl bg-cb-orange px-4 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-cb-orange/25 transition-all hover:bg-cb-orange-hover hover:shadow-lg"
        >
          Get free quotes →
        </Link>
      </div>

      <div className="border-t border-gray-100 px-5 py-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">Editorial standard</p>
        <ul className="mt-4 space-y-3 text-[12px] leading-snug text-gray-600">
          <li className="flex gap-2.5">
            <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[9px] text-emerald-600 ring-1 ring-emerald-200/80">
              ✓
            </span>
            Independent — no pay-to-rank
          </li>
          <li className="flex gap-2.5">
            <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[9px] text-emerald-600 ring-1 ring-emerald-200/80">
              ✓
            </span>
            Hands-on testing by named experts
          </li>
          <li className="flex gap-2.5">
            <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[9px] text-emerald-600 ring-1 ring-emerald-200/80">
              ✓
            </span>
            Pricing re-verified every 90 days
          </li>
        </ul>
        <Link
          href="/editorial-process"
          className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-cb-orange hover:text-cb-orange-hover"
        >
          Methodology →
        </Link>
      </div>
    </aside>
  )
}
