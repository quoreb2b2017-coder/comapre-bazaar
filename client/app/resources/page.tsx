import type { Metadata } from 'next'
import Link from 'next/link'
import {
  BookOpen,
  FileText,
  ClipboardCheck,
  LayoutGrid,
  ArrowRight,
  Briefcase,
  Rocket,
  ShieldCheck,
} from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata: Metadata = buildMetadata({
  title: 'Resources',
  description:
    'Guides, whitepapers, and methodology from Compare Bazaar for teams evaluating CRM, payroll, HR, marketing, and ops software.',
  canonical: '/resources',
})

const FEATURED = [
  {
    title: 'Blog',
    description:
      'How-to guides, category breakdowns, and practical tips from editors who test tools against the same framework we publish.',
    href: '/blog',
    cta: 'Browse articles',
    icon: BookOpen,
    chip: 'Updated regularly',
    accent:
      'border-amber-200/80 bg-gradient-to-br from-amber-50/90 via-white to-orange-50/70 hover:border-amber-300/90',
    iconBg: 'bg-[#FFF4E8] text-[#C2410C]',
    decoration: 'from-[#F58220]/15 via-transparent to-transparent',
  },
  {
    title: 'Whitepapers',
    description:
      'Longer research-style downloads on topics that matter at procurement time: pricing traps, integration scope, and rollout risks.',
    href: '/resources/whitepaper',
    cta: 'View whitepapers',
    icon: FileText,
    chip: 'Downloadable PDFs',
    accent:
      'border-slate-200/90 bg-gradient-to-br from-slate-50/95 via-white to-[#E8EEF8]/60 hover:border-navy/15',
    iconBg: 'bg-navy/[0.08] text-navy',
    decoration: 'from-navy/[0.08] via-transparent to-transparent',
  },
] as const

const ALSO_HELPFUL = [
  {
    label: 'Editorial process',
    description: 'Our 12-point scoring model and independence rules',
    href: '/editorial-process',
    icon: ClipboardCheck,
  },
  {
    label: 'Browse all software',
    description: 'Jump straight into comparisons by category',
    href: '/browse-all-software',
    icon: LayoutGrid,
  },
  {
    label: 'Business planning',
    description: 'Templates and guidance for growth-stage buyers',
    href: '/business-planning',
    icon: Briefcase,
  },
  {
    label: 'Start a business',
    description: 'Software stacks we recommend for new operators',
    href: '/start-a-business',
    icon: Rocket,
  },
] as const

export default function ResourcesPage() {
  return (
    <main className="relative min-h-[72vh] overflow-hidden bg-gradient-to-b from-[#FFFBF7] via-white to-[#F4F6FB]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_85%_70%_at_50%_-8%,rgba(245,130,32,0.14),transparent_65%)]"
        aria-hidden
      />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <Breadcrumb
          items={[{ label: 'Home', href: '/' }, { label: 'Resources' }]}
          className="mb-8"
        />

        <header className="mb-11 sm:mb-14 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9C4302] shadow-sm backdrop-blur-sm mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F58220]" aria-hidden />
            Resources
          </div>
          <h1 className="font-serif text-[2rem] sm:text-[2.65rem] leading-[1.08] font-semibold text-navy tracking-tight mb-5">
            Straight answers for teams buying business software
          </h1>
          <p className="text-[17px] sm:text-lg text-gray-600 leading-relaxed max-w-[52ch]">
            Long-form stories on the blog, deeper downloads as whitepapers, and our published methodology
            when you need to show stakeholders how Compare Bazaar stays independent.
          </p>
        </header>

        <section aria-labelledby="featured-resources-heading" className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <h2
                id="featured-resources-heading"
                className="text-lg font-semibold text-navy tracking-tight"
              >
                Start here
              </h2>
              <p className="text-sm text-gray-500 mt-1 max-w-xl">
                Pick the format that fits how much time you have right now.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">
            {FEATURED.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative block overflow-hidden rounded-2xl border p-6 sm:p-8 shadow-[0_22px_56px_-34px_rgba(15,31,61,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_64px_-32px_rgba(15,31,61,0.52)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2 ${item.accent}`}
                >
                  <div
                    className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br ${item.decoration} blur-2xl opacity-90`}
                    aria-hidden
                  />
                  <div className="relative flex flex-col h-full min-h-[220px]">
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${item.iconBg} shadow-sm`}
                        aria-hidden
                      >
                        <Icon className="h-7 w-7" strokeWidth={2} />
                      </div>
                      <span className="shrink-0 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-gray-600 ring-1 ring-gray-200/80 shadow-sm">
                        {item.chip}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-[1.35rem] font-semibold text-navy tracking-tight mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-[15px] text-gray-600 leading-relaxed mb-8 flex-1">
                      {item.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#C2410C] group-hover:text-[#9C4302]">
                      {item.cta}
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden
                      />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        <section
          aria-labelledby="more-resources-heading"
          className="rounded-2xl border border-gray-200/90 bg-white/90 p-6 sm:p-9 shadow-[0_18px_48px_-28px_rgba(15,31,61,0.2)] backdrop-blur-sm"
        >
          <h2
            id="more-resources-heading"
            className="text-lg sm:text-xl font-semibold text-navy tracking-tight mb-2"
          >
            Also helpful
          </h2>
          <p className="text-sm text-gray-500 mb-7 max-w-2xl leading-relaxed">
            Shortcuts to methodology and planning pages we link from comparisons across the site.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {ALSO_HELPFUL.map(({ label, description, href, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex gap-4 rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50/90 to-white p-4 sm:p-5 transition-all hover:border-[#F6D1AF] hover:shadow-md hover:shadow-orange-900/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#C2410C] shadow-sm ring-1 ring-gray-100 transition-colors group-hover:bg-[#FFF8F2] group-hover:ring-amber-200/60">
                    <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-2">
                      <span className="block text-sm font-semibold text-navy leading-snug">{label}</span>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-[#F58220]"
                        aria-hidden
                      />
                    </span>
                    <span className="block text-xs text-gray-500 mt-1.5 leading-snug">{description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-dashed border-gray-200 bg-[#FAFBFD] px-4 py-4 sm:px-5">
            <div className="flex gap-3 min-w-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#16A34A] shadow-sm ring-1 ring-gray-100">
                <ShieldCheck className="h-5 w-5" strokeWidth={2} aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-navy">Independent rankings</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Vendors cannot pay for a better score in our editorial tables. Sponsored placements are
                  labelled separately.
                </p>
              </div>
            </div>
            <Link
              href="/editorial-process"
              className="sm:ml-auto shrink-0 inline-flex items-center justify-center rounded-lg bg-[#F58220] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#EC7416] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2"
            >
              Read our process
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
