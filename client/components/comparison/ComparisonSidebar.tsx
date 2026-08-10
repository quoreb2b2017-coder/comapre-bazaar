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
    <aside
      className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-lg shadow-navy/5"
      aria-label="Page navigation"
    >
      {(vendorCount != null || lastReviewed) && (
        <div className="grid grid-cols-2 gap-px bg-gray-100">
          {vendorCount != null ? (
            <div className="bg-gradient-to-br from-[#FAFBFD] to-white px-4 py-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400">Compared</p>
              <p className="mt-0.5 font-serif text-lg tabular-nums text-navy">{vendorCount}</p>
            </div>
          ) : null}
          {lastReviewed ? (
            <div className="bg-white px-4 py-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400">Verified</p>
              <p className="mt-0.5 text-sm font-semibold text-navy">{lastReviewed}</p>
            </div>
          ) : null}
        </div>
      )}

      <nav className="border-b border-gray-100 px-5 py-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">On this page</h3>
        <ol className="mt-3 space-y-2.5">
          {tocItems.map((item, i) => (
            <li key={item.anchor}>
              <a
                href={`#${item.anchor}`}
                className="group flex items-baseline gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-cb-orange/5"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 font-serif text-[10px] tabular-nums text-gray-400 group-hover:bg-cb-orange/10 group-hover:text-cb-orange">
                  {i + 1}
                </span>
                <span className="text-[13px] leading-snug text-gray-600 transition-colors group-hover:text-navy">
                  {item.label}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="border-b border-gray-100 bg-gradient-to-br from-[#FFFBF7] via-white to-cb-orange/[0.06] px-5 py-5">
        <h4 className="font-serif text-[16px] leading-snug text-navy">{ctaTitle}</h4>
        <p className="mt-2 text-[13px] leading-relaxed text-gray-600">{ctaBody}</p>
        <Link
          href={ctaSlug}
          className="mt-4 flex w-full items-center justify-center rounded-xl bg-cb-orange px-4 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-cb-orange/25 transition-all hover:bg-cb-orange-hover hover:shadow-lg"
        >
          Get free quotes →
        </Link>
      </div>

      <div className="px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">Editorial standard</p>
        <ul className="mt-3 space-y-2 text-[12px] leading-snug text-gray-600">
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
