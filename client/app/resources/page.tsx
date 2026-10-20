import type { Metadata } from 'next'
import Link from 'next/link'
import {
  BookOpen,
  FileText,
  Newspaper,
  ClipboardCheck,
  LayoutGrid,
  ArrowRight,
  Briefcase,
  Rocket,
  ShieldCheck,
  Layers,
  Library,
} from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { ResourceHero, ResourceHubVisual, ResourcePageShell } from '@/components/resources/ResourceHero'

export const metadata: Metadata = buildMetadata({
  title: 'Resources',
  description:
    'Guides, whitepapers, and methodology from Compare Bazaar for teams evaluating CRM, payroll, HR, marketing, and ops software.',
  canonical: '/resources',
})

const SECTIONS = [
  {
    title: 'Blogs',
    description: 'Articles, comparisons, and practical tips from the Compare Bazaar editors.',
    href: '/blog',
    cta: 'View blogs',
    icon: Newspaper,
    chip: 'Articles',
  },
  {
    title: 'White papers',
    description: 'Longer research PDFs on pricing, rollout, and vendor comparisons.',
    href: '/resources/whitepapers?type=whitepaper',
    cta: 'View white papers',
    icon: FileText,
    chip: 'PDFs',
  },
  {
    title: 'Reports',
    description: 'Benchmarks and trend reports for procurement teams.',
    href: '/resources/reports',
    cta: 'View reports',
    icon: ClipboardCheck,
    chip: 'Benchmarks',
  },
  {
    title: 'Case studies',
    description: 'Implementation stories from real software rollouts.',
    href: '/resources/case-studies',
    cta: 'View case studies',
    icon: Briefcase,
    chip: 'Stories',
  },
  {
    title: 'Guides',
    description: 'Software comparison guides. New guides will show here once they are published.',
    href: '/resources/guides',
    cta: 'View guides',
    icon: BookOpen,
    chip: 'Articles',
  },
  {
    title: 'Webinars',
    description: 'On-demand sessions and replays for buyers.',
    href: '/resources/webinars',
    cta: 'View webinars',
    icon: Rocket,
    chip: 'Sessions',
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
    <ResourcePageShell>
      <ResourceHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Resources' }]}
        eyebrow="Compare Bazaar · Resources"
        title="Resources"
        description="Independent research for software buyers. Open the format that matches the decision: an article, a PDF, a benchmark, or a session."
        pillars={[
          { icon: Library, label: 'One library', sub: 'Articles and downloads in the same place.' },
          { icon: Layers, label: 'By format', sub: 'Open only the type you came for.' },
          { icon: ShieldCheck, label: 'Independent', sub: 'Vendors do not buy a better score.' },
        ]}
        visual={<ResourceHubVisual />}
      />
      <div className="relative mx-auto max-w-[1140px] px-4 py-10 sm:px-5 sm:py-12 lg:px-6 lg:py-14">

        <section aria-labelledby="featured-resources-heading" className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <h2
                id="featured-resources-heading"
                className="font-serif text-2xl font-normal tracking-tight text-navy"
              >
                Choose a section
              </h2>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-500">
                Six formats. Each card opens only that list.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((item, index) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#F6D1AF] hover:shadow-[0_18px_40px_-28px_rgba(15,31,61,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-[#0B2A6F] via-[#F58220] to-[#0B2A6F] transition duration-300 group-hover:scale-x-100"
                    aria-hidden
                  />
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-serif text-[15px] tabular-nums text-[#F58220]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="rounded-full bg-[#F7F9FC] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1D4ED8]">
                      {item.chip}
                    </span>
                  </div>
                  <span className="mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B1F3D] text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-navy">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{item.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#C2410C] group-hover:text-[#9C4302]">
                    {item.cta}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                  </span>
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
            className="mb-2 font-serif text-2xl font-normal tracking-tight text-navy"
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
    </ResourcePageShell>
  )
}
