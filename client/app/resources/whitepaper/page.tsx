import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { fetchPublishedWhitePapers } from '@/lib/whitePaperCms'
import { WhitePaperSearch } from '@/components/whitepaper/WhitePaperSearch'
import { WhitePaperLibraryHeroVisual } from '@/components/whitepaper/WhitePaperLibraryHeroVisual'
import { BarChart2, BookOpen, Download, ShieldCheck } from 'lucide-react'

export const revalidate = 120

export const metadata: Metadata = buildMetadata({
  title: 'Software Whitepapers & Research Reports',
  description:
    'Free B2B software whitepapers and research reports from Compare Bazaar. Download guides on CRM, payroll, AI, and operations.',
  canonical: '/resources/whitepaper',
})

const LIBRARY_PILLARS = [
  {
    icon: BarChart2,
    label: 'Vendor scorecards',
    sub: 'Side-by-side criteria breakdowns for shortlist decisions.',
  },
  {
    icon: ShieldCheck,
    label: 'Independent research',
    sub: 'Benchmark data for decision-making, not vendor pitches.',
  },
  {
    icon: Download,
    label: 'Free to download',
    sub: 'Full PDF access with no paywall or subscription.',
  },
] as const

export default async function WhitepaperIndexPage() {
  const papers = await fetchPublishedWhitePapers()

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F8F9FC]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[620px] bg-[radial-gradient(ellipse_88%_72%_at_50%_-10%,rgba(29,78,216,0.09),transparent_70%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,31,61,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,31,61,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,white,transparent_85%)]"
        aria-hidden
      />

      {/* Hero */}
      <div className="relative border-b border-gray-200/80 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto max-w-[1140px] px-4 py-6 sm:px-5 sm:py-8 lg:px-6 lg:py-10">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Resources', href: '/resources' },
              { label: 'Whitepapers' },
            ]}
            className="mb-8 text-sm"
          />

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(300px,420px)] lg:gap-12 xl:gap-16">
            <header className="min-w-0">
              <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#1D4ED8]/12 bg-[#F5F8FF] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1D4ED8]">
                  <BookOpen className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                  Compare Bazaar · Research Library
                </span>
              </div>

              <h1 className="max-w-[16ch] font-serif text-[2rem] font-normal leading-[1.06] tracking-tight text-navy sm:text-[2.5rem] lg:text-[2.625rem]">
                Whitepapers &amp; Research Reports
              </h1>

              <p className="mt-5 max-w-[56ch] text-[16px] leading-[1.78] text-gray-600 sm:text-[17px]">
                Structured research, vendor scorecards, and implementation frameworks independently
                produced for procurement teams, IT leaders, and business operators making
                high-stakes software decisions.
              </p>

              <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
                {LIBRARY_PILLARS.map(({ icon: Icon, label, sub }) => (
                  <li
                    key={label}
                    className="rounded-xl border border-gray-200/80 bg-[#FAFBFD] px-4 py-3.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#1D4ED8] ring-1 ring-gray-200/80">
                        <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                      </span>
                      <span className="text-[13px] font-semibold leading-snug text-navy">{label}</span>
                    </div>
                    <p className="mt-2 text-[12px] leading-relaxed text-gray-500">{sub}</p>
                  </li>
                ))}
              </ul>
            </header>

            <div className="order-first lg:order-none lg:pb-6">
              <WhitePaperLibraryHeroVisual papers={papers} />
            </div>
          </div>
        </div>
      </div>

      {/* Catalog */}
      <div className="relative mx-auto max-w-[1140px] px-4 py-10 sm:px-5 sm:py-12 lg:px-6 lg:py-14">
        {papers.length === 0 ? (
          <div className="overflow-hidden rounded-2xl border border-dashed border-gray-200 bg-white shadow-sm">
            <div className="grid grid-cols-1 items-center gap-6 px-6 py-10 sm:grid-cols-[1fr_minmax(220px,280px)] sm:px-10">
              <div className="text-center sm:text-left">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Coming soon
                </p>
                <p className="font-serif text-xl text-navy">New reports are in production</p>
                <p className="mt-3 max-w-md text-[14px] leading-relaxed text-gray-500">
                  Our editorial team publishes new whitepapers regularly. In the meantime, explore our{' '}
                  <Link
                    href="/blog"
                    className="font-medium text-[#1D4ED8] underline underline-offset-2 hover:text-[#1e40af]"
                  >
                    buying guides
                  </Link>{' '}
                  and vendor comparisons.
                </p>
              </div>
              <WhitePaperLibraryHeroVisual papers={[]} />
            </div>
          </div>
        ) : (
          <WhitePaperSearch papers={papers} />
        )}
      </div>
    </main>
  )
}
