import Link from 'next/link'
import { BadgeCheck, ClipboardCheck, FileText, Quote, Scale, Search } from 'lucide-react'
import { HOME_CATEGORIES } from '@/data/homeCategories'
import { HomeFaqSection } from '@/components/ui/HomeFaqSection'
import { HomeBlogSection } from '@/components/home/HomeBlogSection'
import { HomeRankedPicks } from '@/components/home/HomeRankedPicks'
import type { UnifiedBlogCard } from '@/lib/blogCms'

type Faq = { q: string; a: string }

const FLOW = [
  { n: '1', icon: Search, title: 'Browse a category', body: 'Pick the software type you are buying.' },
  { n: '2', icon: Scale, title: 'Compare side by side', body: 'See scores, pricing, and fit in one table.' },
  { n: '3', icon: Quote, title: 'Get free quotes', body: 'Hear from matched vendors — no obligation.' },
]

const METHOD = [
  {
    num: '01',
    title: 'Hands-on testing',
    body: 'Experts open real accounts, run live workflows, and score 12+ criteria.',
    icon: ClipboardCheck,
  },
  {
    num: '02',
    title: 'Verified pricing',
    body: 'We confirm list prices with vendors, flag hidden fees, and date every figure.',
    icon: BadgeCheck,
  },
  {
    num: '03',
    title: 'Independent scoring',
    body: 'Rankings follow a weighted scorecard. Vendors cannot pay for position.',
    icon: Scale,
  },
]

const STATS = [
  { num: '50K+', label: 'Buyers helped' },
  { num: '40+', label: 'Platforms reviewed' },
  { num: '12', label: 'Scoring criteria' },
  { num: '100%', label: 'Independent editorial' },
]

const EDITORS = [
  { initials: 'SK', name: 'Sarah Kim', role: 'CRM & Sales Tech' },
  { initials: 'MR', name: 'Marcus Rivera', role: 'Payroll & HR' },
  { initials: 'PW', name: 'Priya Winters', role: 'Marketing Tech' },
  { initials: 'JL', name: 'James Liu', role: 'Business Technology' },
]

export function HomePageBody({
  faqs,
  recentBlogPosts,
}: {
  faqs: Faq[]
  recentBlogPosts: UnifiedBlogCard[]
}) {
  return (
    <div className="bg-[#F7F8FB]">
      <section className="border-b border-slate-200 bg-white" aria-label="How Compare Bazaar works">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
          <div className="mb-7 text-center">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F58220]">How it works</p>
            <h2 className="font-serif text-2xl tracking-tight text-navy sm:text-3xl">
              Shortlist in three steps
            </h2>
          </div>
          <div className="grid grid-cols-1 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-[#F7F8FB] md:grid-cols-3 md:divide-x md:divide-y-0">
            {FLOW.map(({ n, icon: Icon, title, body }) => (
              <div key={n} className="flex gap-3 px-5 py-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B2A6F] font-serif text-lg text-white">
                  {n}
                </span>
                <div>
                  <p className="flex items-center gap-2 font-semibold text-navy">
                    <Icon className="h-4 w-4 text-[#F58220]" aria-hidden />
                    {title}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <HomeRankedPicks />
      </section>

      <section className="border-y border-slate-200 bg-white" aria-labelledby="how-heading">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
          <div className="mb-8 text-center">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F58220]">Methodology</p>
            <h2 id="how-heading" className="font-serif text-2xl tracking-tight text-navy sm:text-3xl">
              How we rank every platform
            </h2>
            <Link
              href="/editorial-process"
              className="mt-3 inline-block text-sm font-semibold text-navy hover:text-[#F58220]"
            >
              Full editorial process →
            </Link>
          </div>
          <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-[#F7F8FB] md:grid-cols-3">
            {METHOD.map(({ num, title, body, icon: Icon }, i) => (
              <article
                key={num}
                className={`p-6 ${i > 0 ? 'border-t border-slate-200 md:border-l md:border-t-0' : ''}`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200">
                    <Icon className="h-5 w-5 text-[#F58220]" aria-hidden />
                  </span>
                  <span className="font-serif text-3xl text-[#0B2A6F]/15">{num}</span>
                </div>
                <h3 className="mb-2 text-base font-semibold text-navy">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
          <HomeBlogSection posts={recentBlogPosts} />
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white" aria-labelledby="editors-heading">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-10">
          <div className="mb-8 text-center">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F58220]">
              Editorial team
            </p>
            <h2 id="editors-heading" className="font-serif text-2xl tracking-tight text-navy sm:text-3xl">
              Reviews written by software specialists
            </h2>
            <Link href="/about" className="mt-3 inline-block text-sm font-semibold text-navy hover:text-[#F58220]">
              About Compare Bazaar →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {EDITORS.map(({ initials, name, role }) => (
              <div key={name} className="rounded-xl border border-slate-200 bg-[#F7F8FB] px-4 py-5 text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#0B2A6F] text-[12px] font-bold text-white">
                  {initials}
                </div>
                <p className="text-sm font-semibold text-navy">{name}</p>
                <p className="mt-0.5 text-[12px] text-slate-500">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F7F8FB]" aria-label="Resources">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link
              href="/resources/whitepapers"
              className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-[#0B2A6F]/30"
            >
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8EEF8]">
                <FileText className="h-5 w-5 text-[#0B2A6F]" aria-hidden />
              </span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F58220]">Resources</span>
              <span className="mt-1 block font-semibold text-navy group-hover:text-[#F58220]">Whitepapers</span>
              <span className="mt-1 block text-sm text-slate-500">Deeper research for payroll, CRM, and VoIP teams.</span>
            </Link>
            <Link
              href="/editorial-process"
              className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-[#0B2A6F]/30"
            >
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFF1E6]">
                <BadgeCheck className="h-5 w-5 text-[#F58220]" aria-hidden />
              </span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F58220]">Trust</span>
              <span className="mt-1 block font-semibold text-navy group-hover:text-[#F58220]">Editorial process</span>
              <span className="mt-1 block text-sm text-slate-500">How we test, date pricing, and keep rankings independent.</span>
            </Link>
            <Link
              href="/advertising-disclosure"
              className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-[#0B2A6F]/30"
            >
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8EEF8]">
                <Scale className="h-5 w-5 text-[#0B2A6F]" aria-hidden />
              </span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F58220]">Disclosure</span>
              <span className="mt-1 block font-semibold text-navy group-hover:text-[#F58220]">How we get paid</span>
              <span className="mt-1 block text-sm text-slate-500">Affiliate commissions never change a score or rank.</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#0B2A6F]" aria-label="Trust statistics">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
          <div className="mb-7 text-center">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F58220]">By the numbers</p>
            <h2 className="font-serif text-2xl tracking-tight text-white sm:text-3xl">
              Built for buyers, not vendors
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map(({ num, label }) => (
              <div key={label} className="rounded-xl bg-white/10 px-4 py-5 text-center ring-1 ring-white/10">
                <p className="font-serif text-3xl leading-none text-[#F58220] sm:text-4xl">{num}</p>
                <p className="mt-2 text-[12px] text-white/65">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F7F8FB]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
          <HomeFaqSection faqs={faqs} />
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 sm:pb-16 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#0B2A6F] px-6 py-9 text-center sm:px-10">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#F58220]/20"
            aria-hidden
          />
          <p className="relative mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F58220]">
            Next step
          </p>
          <h2 className="relative font-serif text-2xl tracking-tight text-white sm:text-3xl">
            Compare first. Then get quotes.
          </h2>
          <p className="relative mx-auto mt-2 max-w-md text-sm text-white/65">
            Shortlist from independent rankings, then hear from matched vendors.
          </p>
          <div className="relative mt-5 flex flex-wrap justify-center gap-2.5">
            <Link
              href="/browse-all-software"
              className="rounded-lg border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/15"
            >
              Browse all software
            </Link>
            <Link
              href={HOME_CATEGORIES[0]?.quotesHref || '/technology/get-free-quotes'}
              className="rounded-lg bg-[#F58220] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#e07418]"
            >
              Get free quotes
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
