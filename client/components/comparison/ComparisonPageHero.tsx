import type { ComparisonPageData } from '@/types'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { AuthorBar } from '@/components/ui/AuthorBar'

type ComparisonPageHeroProps = {
  data: ComparisonPageData
  vendorCount: number
}

export function ComparisonPageHero({ data, vendorCount }: ComparisonPageHeroProps) {
  return (
    <header className="relative overflow-hidden border-b border-navy/10">
      <div
        className="absolute inset-0 bg-[linear-gradient(165deg,#eef3fb_0%,#ffffff_42%,#fffaf5_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgba(11,42,111,0.07),transparent_55%),radial-gradient(ellipse_50%_45%_at_100%_10%,rgba(245,130,32,0.1),transparent_60%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(11,42,111,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(11,42,111,0.025)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.35),transparent_70%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        <Breadcrumb items={data.breadcrumbs} className="mb-5 text-sm" />

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-2 rounded-full border border-navy/10 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-navy shadow-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cb-orange shadow-[0_0_0_3px_rgba(245,130,32,0.22)]" />
            Independent review
          </span>
          <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-gray-500 ring-1 ring-gray-200/80">
            Last verified {data.lastReviewed}
          </span>
        </div>

        <h1 className="mt-4 max-w-4xl font-serif text-[1.75rem] font-normal leading-[1.15] tracking-tight text-navy sm:text-[2.125rem] lg:text-[2.5rem]">
          {data.h1}
        </h1>

        <p className="mt-4 max-w-3xl text-[15px] leading-[1.72] text-gray-600 sm:text-base">{data.intro}</p>

        <div className="mt-6 grid grid-cols-2 overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-md shadow-navy/5 sm:grid-cols-3 lg:max-w-2xl">
          <div className="border-b border-r border-gray-100 px-4 py-3.5 sm:border-b-0">
            <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">Vendors compared</dt>
            <dd className="mt-1 font-serif text-xl tabular-nums text-navy">{vendorCount}</dd>
          </div>
          <div className="border-b border-gray-100 px-4 py-3.5 sm:border-b-0 sm:border-r">
            <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">Scoring criteria</dt>
            <dd className="mt-1 font-serif text-xl text-navy">12 factors</dd>
          </div>
          <div className="col-span-2 border-t border-gray-100 px-4 py-3.5 sm:col-span-1 sm:border-t-0">
            <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">Methodology</dt>
            <dd className="mt-1 font-serif text-xl text-navy">Hands-on testing</dd>
          </div>
        </div>

        <AuthorBar lastReviewed={data.lastReviewed} />
      </div>
    </header>
  )
}
