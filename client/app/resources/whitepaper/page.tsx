import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { fetchPublishedWhitePapers } from '@/lib/whitePaperCms'
import { WhitePaperCard } from '@/components/whitepaper/WhitePaperCard'
import { BarChart2, ShieldCheck, Download } from 'lucide-react'
import { WhitePaperSearch } from '@/components/whitepaper/WhitePaperSearch'

export const revalidate = 120

export const metadata: Metadata = buildMetadata({
  title: 'Software Whitepapers & Research Reports',
  description:
    'Free B2B software whitepapers and research reports from Compare Bazaar. Download guides on CRM, payroll, AI, and operations.',
  canonical: '/resources/whitepaper',
})

export default async function WhitepaperIndexPage() {
  const papers = await fetchPublishedWhitePapers()

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <div className="border-b border-gray-200 bg-gradient-to-b from-[#f8f9fc] to-white">
        <div className="mx-auto max-w-[1140px] px-4 pb-14 pt-6 sm:px-5 sm:pb-16 sm:pt-8 lg:px-6">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Resources', href: '/resources' },
              { label: 'Whitepapers' },
            ]}
            className="mb-10 justify-center text-sm"
          />

          <div className="flex flex-col items-center text-center">
            <span className="mb-4 inline-block rounded-full border border-[#1D4ED8]/20 bg-[#1D4ED8]/5 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#1D4ED8]">
              Compare Bazaar · Research Library
            </span>

            <h1 className="max-w-3xl font-serif text-[2rem] font-normal leading-[1.1] tracking-tight text-navy sm:text-[2.625rem] lg:text-[3rem]">
              Whitepapers &amp; Research Reports
            </h1>

            <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.75] text-gray-500">
              Structured research, vendor scorecards, and implementation frameworks independently
              produced for procurement teams, IT leaders, and business operators making high-stakes
              software decisions.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 w-full max-w-2xl">
              {([
                { icon: BarChart2, label: 'Vendor Scorecards', sub: 'Side-by-side criteria breakdowns' },
                { icon: ShieldCheck, label: 'Independent Research', sub: 'No sponsored conclusions' },
                { icon: Download, label: 'Free to Download', sub: 'No paywall, no subscription' },
              ] as const).map(({ icon: Icon, label, sub }) => (
                <div key={label} className="rounded-lg border border-gray-200 bg-white px-4 py-4 text-center shadow-sm">
                  <div className="mb-2 flex justify-center">
                    <Icon size={18} className="text-[#1D4ED8]" strokeWidth={1.5} />
                  </div>
                  <p className="text-[12px] font-semibold text-navy">{label}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-gray-400">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Library grid ── */}
      <div className="mx-auto max-w-[1140px] px-4 py-12 sm:px-5 sm:py-14 lg:px-6">
        {papers.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#e0e0e0] px-6 py-16 text-center">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">Coming Soon</p>
            <p className="font-serif text-xl text-navy">New reports are in production</p>
            <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-gray-500">
              Our editorial team publishes new whitepapers regularly. In the meantime, explore our{' '}
              <Link href="/blog" className="font-medium text-[#1D4ED8] underline underline-offset-2 hover:text-[#1e40af]">
                buying guides
              </Link>{' '}
              and vendor comparisons.
            </p>
          </div>
        ) : (
          <WhitePaperSearch papers={papers} />
        )}
      </div>
    </main>
  )
}
