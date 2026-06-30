import Link from 'next/link'
import type { TocItem } from '@/types'

interface SidebarProps {
  tocItems: TocItem[]
  ctaTitle: string
  ctaBody: string
  ctaSlug: string
  vendorCount?: number
  lastReviewed?: string
}

export function ComparisonSidebar({
  tocItems,
  ctaTitle,
  ctaBody,
  ctaSlug,
  vendorCount,
  lastReviewed,
}: SidebarProps) {
  return (
    <aside className="overflow-hidden border border-gray-200 bg-white" aria-label="Page navigation">
      {(vendorCount != null || lastReviewed) && (
        <div className="grid grid-cols-2 gap-px border-b border-gray-200 bg-gray-200">
          {vendorCount != null ? (
            <div className="bg-[#FAFBFD] px-4 py-2.5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-gray-400">Compared</p>
              <p className="mt-0.5 text-sm font-semibold tabular-nums text-navy">{vendorCount}</p>
            </div>
          ) : null}
          {lastReviewed ? (
            <div className="bg-white px-4 py-2.5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-gray-400">Verified</p>
              <p className="mt-0.5 text-sm font-semibold text-navy">{lastReviewed}</p>
            </div>
          ) : null}
        </div>
      )}

      <nav className="border-b border-gray-200 px-5 py-3.5">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">On this page</h3>
        <ol className="mt-2.5 space-y-2">
          {tocItems.map((item, i) => (
            <li key={item.anchor} className="flex items-baseline gap-2.5">
              <span className="w-4 shrink-0 font-serif text-xs tabular-nums text-gray-300">{i + 1}</span>
              <a
                href={`#${item.anchor}`}
                className="text-[13px] leading-snug text-gray-600 transition-colors hover:text-cb-orange"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="border-b border-gray-200 bg-[#FFFBF7] px-5 py-4">
        <h4 className="font-serif text-[15px] leading-snug text-navy">{ctaTitle}</h4>
        <p className="mt-1.5 text-[13px] leading-relaxed text-gray-600">{ctaBody}</p>
        <Link
          href={ctaSlug}
          className="mt-3 flex w-full items-center justify-center rounded-md bg-cb-orange px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-cb-orange-hover"
        >
          Get free quotes →
        </Link>
      </div>

      <div className="px-5 py-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
          Editorial standard
        </p>
        <ul className="mt-2.5 space-y-1.5 text-[12px] leading-snug text-gray-600">
          <li className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cb-orange" aria-hidden />
            Independent — no pay-to-rank
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cb-orange" aria-hidden />
            Hands-on testing by named experts
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cb-orange" aria-hidden />
            Pricing re-verified every 90 days
          </li>
        </ul>
        <Link
          href="/editorial-process"
          className="mt-3 inline-block text-[12px] font-semibold text-cb-orange hover:text-cb-orange-hover"
        >
          Methodology →
        </Link>
      </div>
    </aside>
  )
}
