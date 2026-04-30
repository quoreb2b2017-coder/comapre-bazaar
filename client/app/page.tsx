import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata, buildItemListSchema } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { HomeSearchBar } from '@/components/ui/HomeSearchBar'
import { HomeFaqSection } from '@/components/ui/HomeFaqSection'
import {
  ClipboardIcon,
  HandshakeIcon,
  MailIcon,
  PhoneIcon,
  UsersIcon,
  WalletIcon,
} from '@/components/ui/icons'

export const metadata: Metadata = buildMetadata({
  title: 'Best Business Software Comparisons & Reviews 2026 | Compare Bazaar',
  description:
    'Compare the best CRM, payroll, email marketing, and HR software for your business. Independent reviews, side-by-side pricing comparisons, and expert recommendations — updated for 2026.',
  canonical: '/',
})

const CATEGORIES = [
  {
    href: '/marketing/best-crm-software',
    icon: HandshakeIcon,
    title: 'Best CRM Software of 2026',
    desc: 'Compare HubSpot, Salesforce, Zoho, and 8 more on pipeline management, automation, and pricing.',
    count: '11 platforms reviewed',
  },
  {
    href: '/human-resources/best-payroll-software',
    icon: WalletIcon,
    title: 'Best Payroll Software for Small Business',
    desc: 'ADP, Gusto, OnPay, and Rippling compared on tax compliance, contractor support, and integrations.',
    count: '8 platforms reviewed',
  },
  {
    href: '/marketing/best-email-marketing-services',
    icon: MailIcon,
    title: 'Best Email Marketing Services',
    desc: 'Mailchimp, Klaviyo, ActiveCampaign ranked on deliverability, automation depth, and list pricing.',
    count: '9 platforms reviewed',
  },
  {
    href: '/human-resources',
    icon: UsersIcon,
    title: 'Best HR Software for 2026',
    desc: 'BambooHR, Rippling, Workday compared on onboarding, performance tools, and company size fit.',
    count: '7 platforms reviewed',
  },
  {
    href: '/sales/best-project-management-software',
    icon: ClipboardIcon,
    title: 'Best Project Management Software',
    desc: 'Monday.com, Asana, ClickUp, and Notion ranked on team size, flexibility, and workflow features.',
    count: '10 platforms reviewed',
  },
  {
    href: '/technology/business-phone-systems',
    icon: PhoneIcon,
    title: 'Best VoIP & Business Phone Systems',
    desc: 'RingCentral, Nextiva, and Ooma compared on call quality, mobile apps, and SMB pricing.',
    count: '6 platforms reviewed',
  },
]

const SOFTWARE_CATEGORIES = [
  { href: '/marketing', label: 'Marketing Hub' },
  { href: '/technology', label: 'Technology Hub' },
  { href: '/sales', label: 'Sales Hub' },
  { href: '/human-resources', label: 'HR Software Hub' },
]

const SEARCH_ITEMS = [
  ...SOFTWARE_CATEGORIES.map((item) => ({ href: item.href, label: item.label })),
  ...CATEGORIES.map((item) => ({ href: item.href, label: item.title })),
]

const TEAM = [
  { initials: 'SK', name: 'Sarah Kim', role: 'CRM & Sales Tech Editor', exp: 'Former Salesforce consultant · 9 yrs' },
  { initials: 'MR', name: 'Marcus Rivera', role: 'Payroll & HR Software Lead', exp: 'ex-ADP implementation · 11 yrs' },
  { initials: 'PW', name: 'Priya Winters', role: 'Marketing Tech Reviewer', exp: 'B2B SaaS marketing · 7 yrs' },
  { initials: 'JL', name: 'James Liu', role: 'Business Technology Editor', exp: 'IT procurement specialist · 8 yrs' },
]

const FAQS = [
  {
    q: 'How does Compare Bazaar make money?',
    a: 'Compare Bazaar earns affiliate commissions when readers purchase software through our links. This never affects our editorial rankings — sponsored placements are clearly marked "Advertisement."',
  },
  {
    q: 'How often are your software reviews updated?',
    a: 'Our high-traffic comparison pages are reviewed at least every 90 days, or immediately when a vendor makes major pricing or feature changes.',
  },
  {
    q: 'Can vendors pay to be ranked higher in your comparisons?',
    a: 'No. Organic rankings are determined entirely by our scoring methodology. Vendors can purchase clearly labelled "Featured Partner" placements displayed separately from editorial content.',
  },
  {
    q: 'What criteria do you use to score software?',
    a: 'We evaluate software across 12 standardised criteria including pricing, ease of use, core feature depth, customer support quality, integrations, mobile experience, and security.',
  },
]

const itemListSchema = buildItemListSchema(
  'Business Software Categories',
  CATEGORIES.map((c) => ({ name: c.title, href: c.href, description: c.desc }))
)

export default function HomePage() {
  return (
    <>
      <JsonLd schema={itemListSchema} />

      {/* Trust bar */}
      <div className="bg-navy text-white/80 text-center py-2.5 px-4">
        <p className="text-xs sm:text-sm">
          Reviewed by <strong className="text-white">independent experts</strong> ·
          No paid placements in rankings ·{' '}
          <strong className="text-white">Updated monthly</strong> · Trusted by 80,000+ business buyers
        </p>
      </div>

      {/* Hero */}
      <header className="bg-[#F58220] py-20 px-4 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center relative">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight mb-5 drop-shadow-[0_2px_10px_rgba(110,45,0,0.35)]">
            Find the <em className="text-[#FCE7D0] not-italic">right</em> business software,{' '}
            <br className="hidden sm:block" />without the guesswork
          </h1>
          <p className="text-lg sm:text-xl text-white/85 leading-relaxed mb-8 max-w-xl mx-auto">
            Independent comparisons of CRM, payroll, HR, and marketing software — researched by
            experts, ranked on real criteria, updated for 2026.
          </p>

          {/* Search bar */}
          <HomeSearchBar items={SEARCH_ITEMS} />

          {/* Quick links */}
          <nav aria-label="Software categories" className="flex flex-wrap justify-center gap-2">
            {SOFTWARE_CATEGORIES.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="bg-white/14 hover:bg-white/24 border border-white/30 text-white text-xs px-4 py-2 rounded-full shadow-[0_6px_16px_rgba(110,45,0,0.2)] backdrop-blur-[1px] transition-all"
              >
                {category.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Methodology bar */}
      <div className="bg-brand-light border-b border-blue-200 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
          <span className="bg-brand text-white text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wide">
            How we review
          </span>
          <p className="text-sm text-blue-800">
            Every comparison is based on hands-on testing, pricing verification, and structured scoring
            across 12+ criteria — never influenced by vendor payments.{' '}
            <Link href="/editorial-process" className="font-semibold underline">
              Read our editorial process →
            </Link>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-20">

        {/* Categories */}
        <section aria-labelledby="categories-heading">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-2">
            Software Categories
          </p>
          <h2 id="categories-heading" className="text-3xl sm:text-4xl text-navy tracking-tight mb-2">
            Compare the best business software for 2026
          </h2>
          <p className="text-gray-500 mb-10 max-w-xl">
            From CRM to payroll, our experts test and rank the tools your business actually needs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group block bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition-all relative overflow-hidden"
                aria-label={`${cat.title} — ${cat.count}`}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand scale-x-0 group-hover:scale-x-100 transition-transform origin-left" aria-hidden="true" />
                <div className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center text-[#F27F25] mb-4" aria-hidden="true">
                  <cat.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-navy mb-2">{cat.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{cat.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{cat.count}</span>
                  <span className="text-sm text-brand font-semibold">Compare →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* How we review */}
        <section className="bg-gray-50 border border-gray-200 rounded-3xl p-8 sm:p-12" aria-labelledby="how-heading">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-2">Our methodology</p>
          <h2 id="how-heading" className="text-3xl sm:text-4xl text-navy tracking-tight mb-2">
            How we independently review and rank software
          </h2>
          <p className="text-gray-500 mb-10 max-w-lg">
            Our reviews are never pay-to-play. Here&apos;s exactly how we evaluate each platform.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                title: 'Hands-on testing',
                body: 'Every platform is tested by a subject-matter expert using a structured protocol. We create real accounts, run real workflows, and score 12+ criteria.',
              },
              {
                num: '02',
                title: 'Verified pricing',
                body: 'We contact vendors directly to confirm pricing and flag hidden fees. All pricing data is dated — we note when prices were last confirmed.',
              },
              {
                num: '03',
                title: 'Independent scoring',
                body: 'Rankings are based on weighted scores across our criteria — vendors cannot pay to improve their ranking. Sponsored placements are always clearly labelled.',
              },
            ].map(({ num, title, body }) => (
              <div key={num}>
                <p className="font-serif text-5xl text-brand leading-none mb-3">{num}</p>
                <h3 className="font-semibold text-navy mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
          <Link href="/editorial-process" className="inline-block mt-8 text-sm text-brand font-semibold hover:underline">
            Read our full editorial process →
          </Link>
        </section>

        {/* Expert team */}
        <section aria-labelledby="team-heading">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-2">Our editorial team</p>
          <h2 id="team-heading" className="text-3xl sm:text-4xl text-navy tracking-tight mb-2">
            Reviews written by verified software experts
          </h2>
          <p className="text-gray-500 mb-8 max-w-lg">
            Our writers combine hands-on industry experience with structured review frameworks.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {TEAM.map(({ initials, name, role, exp }) => (
              <div key={name} className="bg-white border border-gray-200 rounded-2xl p-5 text-center">
                <div
                  className="w-14 h-14 rounded-full bg-brand-light flex items-center justify-center text-brand text-lg font-semibold mx-auto mb-3"
                  aria-hidden="true"
                >
                  {initials}
                </div>
                <h4 className="font-semibold text-navy text-sm">{name}</h4>
                <p className="text-xs text-brand font-medium mt-0.5">{role}</p>
                <p className="text-xs text-gray-400 mt-1">{exp}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust stats */}
        <section className="bg-navy rounded-3xl p-8 sm:p-12 text-center text-white" aria-label="Trust statistics">
          <h2 className="text-3xl sm:text-4xl tracking-tight mb-3">Trusted by thousands of business buyers</h2>
          <p className="text-white/70 max-w-lg mx-auto mb-10 text-base">
            Our comparison guides help B2B decision-makers cut through vendor marketing and make confident software choices.
          </p>
          <div className="flex flex-wrap justify-center gap-12">
            {[
              { num: '80K+', label: 'Monthly readers' },
              { num: '60+', label: 'Platforms reviewed' },
              { num: '12', label: 'Scoring criteria per platform' },
              { num: '100%', label: 'Independent editorial' },
            ].map(({ num, label }) => (
              <div key={label}>
                <p className="font-serif text-5xl text-accent leading-none">{num}</p>
                <p className="text-sm text-white/60 mt-2">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <HomeFaqSection faqs={FAQS} />

      </div>
    </>
  )
}
