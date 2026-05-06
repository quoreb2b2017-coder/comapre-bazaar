import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata, buildItemListSchema } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { HomeSearchBar } from '@/components/ui/HomeSearchBar'
import { HomeFaqSection } from '@/components/ui/HomeFaqSection'
import { loadUnifiedBlogIndex } from '@/lib/blogCms'
import { BlogHomePreviewCard } from '@/components/blog/BlogListingCards'
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
    rating: '9.4/10',
  },
  {
    href: '/human-resources/best-payroll-software',
    icon: WalletIcon,
    title: 'Best Payroll Software for Small Business',
    desc: 'ADP, Gusto, OnPay, and Rippling compared on tax compliance, contractor support, and integrations.',
    count: '8 platforms reviewed',
    rating: '9.1/10',
  },
  {
    href: '/marketing/best-email-marketing-services',
    icon: MailIcon,
    title: 'Best Email Marketing Services',
    desc: 'Mailchimp, Klaviyo, ActiveCampaign ranked on deliverability, automation depth, and list pricing.',
    count: '9 platforms reviewed',
    rating: '8.9/10',
  },
  {
    href: '/human-resources',
    icon: UsersIcon,
    title: 'Best HR Software for 2026',
    desc: 'BambooHR, Rippling, Workday compared on onboarding, performance tools, and company size fit.',
    count: '7 platforms reviewed',
    rating: '8.8/10',
  },
  {
    href: '/sales/best-project-management-software',
    icon: ClipboardIcon,
    title: 'Best Project Management Software',
    desc: 'Monday.com, Asana, ClickUp, and Notion ranked on team size, flexibility, and workflow features.',
    count: '10 platforms reviewed',
    rating: '8.7/10',
  },
  {
    href: '/technology/business-phone-systems',
    icon: PhoneIcon,
    title: 'Best VoIP & Business Phone Systems',
    desc: 'RingCentral, Nextiva, and Ooma compared on call quality, mobile apps, and SMB pricing.',
    count: '6 platforms reviewed',
    rating: '8.6/10',
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

export default async function HomePage() {
  const recentBlogPosts = (await loadUnifiedBlogIndex()).slice(0, 3)

  return (
    <>
      <JsonLd schema={itemListSchema} />

      {/* Trust bar */}
      <div className="bg-gradient-to-r from-[#071a57] via-[#0a246d] to-[#071a57] text-white/85 text-center py-2.5 px-4 shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
        <p className="text-xs sm:text-sm">
          Reviewed by <strong className="text-white">independent experts</strong> ·
          No paid placements in rankings ·{' '}
          <strong className="text-white">Updated monthly</strong> · Trusted by 80,000+ business buyers
        </p>
      </div>

      {/* Hero */}
      <header className="bg-gradient-to-br from-[#F58220] via-[#f48930] to-[#ec7416] py-12 sm:py-16 lg:py-20 px-4 relative overflow-hidden [perspective:1400px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.25),transparent_45%),radial-gradient(circle_at_80%_85%,rgba(255,215,170,0.35),transparent_45%)]" />
        <div className="pointer-events-none absolute -left-20 top-8 h-52 w-52 rounded-full bg-white/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-6 h-44 w-44 rounded-full bg-[#ffd8b0]/35 blur-3xl" />
        <div className="max-w-7xl mx-auto relative">
          <div className="flex justify-center">
            <div className="text-center min-h-[640px] flex flex-col justify-center max-w-4xl [transform-style:preserve-3d]">
              <div className="mb-5 text-xs font-semibold uppercase tracking-wider text-white/95 [transform:translateZ(18px)]">
                Independent software reviews
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight mb-4 sm:mb-5 drop-shadow-[0_8px_22px_rgba(110,45,0,0.4)] [transform:translateZ(30px)]">
                Find the <em className="text-[#FCE7D0] not-italic">right</em> business software,{' '}
                <br className="hidden sm:block" />without the guesswork
              </h1>
              <p className="text-base sm:text-xl text-white/90 leading-relaxed mb-6 sm:mb-8 max-w-xl mx-auto [transform:translateZ(20px)]">
                Independent comparisons of CRM, payroll, HR, and marketing software — researched by
                experts, ranked on real criteria, updated for 2026.
              </p>

              <div className="cb-hero-tilt cb-hero-float relative mx-auto max-w-3xl rounded-[32px] border border-white/35 bg-white/12 p-1.5 shadow-[0_34px_75px_-30px_rgba(35,18,3,0.72)] backdrop-blur-md [transform-style:preserve-3d] [transform:translateZ(40px)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[32px] before:bg-[linear-gradient(140deg,rgba(255,255,255,0.28),transparent_40%,rgba(255,255,255,0.1))] before:opacity-80 after:pointer-events-none after:absolute after:-bottom-5 after:left-8 after:right-8 after:h-8 after:rounded-full after:bg-black/25 after:blur-xl">
                <div className="relative rounded-[26px] border border-white/30 bg-gradient-to-b from-white/22 to-white/10 p-5 sm:p-6 [transform:translateZ(20px)]">
                  <div className="pointer-events-none absolute -left-8 top-8 h-24 w-24 rounded-full bg-white/25 blur-2xl" />
                  <div className="pointer-events-none absolute -right-10 bottom-6 h-20 w-20 rounded-full bg-[#ffd7b3]/40 blur-2xl" />
                  <div className="[transform:translateZ(26px)]">
                    <HomeSearchBar items={SEARCH_ITEMS} />
                  </div>

                  <nav aria-label="Software categories" className="mt-3 flex flex-wrap justify-center gap-3 [transform:translateZ(16px)]">
                    {SOFTWARE_CATEGORIES.map((category) => (
                      <Link
                        key={category.href}
                        href={category.href}
                        className="bg-white/14 hover:bg-white/26 border border-white/30 text-white text-xs px-4 py-2 rounded-full shadow-[0_12px_24px_rgba(110,45,0,0.28)] backdrop-blur-[1.5px] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03]"
                      >
                        {category.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 [transform:translateZ(12px)]">
                    {[
                      { label: 'CRM', score: '9.4/10' },
                      { label: 'Payroll', score: '9.1/10' },
                      { label: 'Email', score: '8.9/10' },
                      { label: 'HR', score: '8.8/10' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl bg-white/18 px-3.5 py-2.5 text-center text-white border border-white/25 shadow-[0_14px_26px_-14px_rgba(0,0,0,0.72)] transition-transform duration-300 hover:[transform:translateZ(14px)]"
                      >
                        <p className="text-[11px] uppercase tracking-wider text-white/80">{item.label}</p>
                        <p className="mt-0.5 text-sm font-semibold">{item.score}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/10 to-transparent" />
      </header>

      {/* Methodology bar */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-b border-blue-200/80 py-3.5 px-4">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 space-y-24 sm:space-y-28">

        {/* Categories */}
        <section aria-labelledby="categories-heading">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand mb-2">
            Software Categories
          </p>
          <h2 id="categories-heading" className="text-3xl sm:text-4xl text-navy tracking-tight mb-2">
            Compare the best business software for 2026
          </h2>
          <p className="text-gray-500 mb-10 max-w-xl">
            From CRM to payroll, our experts test and rank the tools your business actually needs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group block bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(14,42,106,0.45)] hover:border-blue-200"
                aria-label={`${cat.title} — ${cat.count}`}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand scale-x-0 group-hover:scale-x-100 transition-transform origin-left" aria-hidden="true" />
                <div>
                  <div className="w-11 h-11 rounded-xl bg-brand-light text-[#F27F25] flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105" aria-hidden="true">
                    <cat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-2">{cat.title}</h3>
                    <p className="text-sm leading-relaxed mb-4 text-gray-500">{cat.desc}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{cat.count}</span>
                    <span className="text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1">
                      Rating: {cat.rating}
                    </span>
                  </div>
                  <span className="text-sm text-brand font-semibold">Compare →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* How we review */}
          <section className="bg-gradient-to-b from-gray-50 via-white to-white border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-[0_16px_36px_-24px_rgba(15,31,61,0.45)]" aria-labelledby="how-heading">
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
              <div key={num} className="rounded-2xl border border-gray-200/80 bg-white p-5 sm:p-6">
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

        {/* Editorial blog */}
        {recentBlogPosts.length > 0 ? (
          <section aria-labelledby="blog-preview-heading">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand">Buying guides</p>
                <h2 id="blog-preview-heading" className="text-3xl sm:text-4xl text-navy tracking-tight">
                  Latest from our blog
                </h2>
                <p className="mt-2 max-w-xl text-gray-500">
                  Deep dives on payroll, VoIP, CRM, and more—same scoring mindset as our comparison hubs.
                </p>
              </div>
              <Link
                href="/blog"
                className="shrink-0 text-sm font-semibold text-brand hover:underline"
              >
                View all articles →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {recentBlogPosts.map((post, index) => (
                <BlogHomePreviewCard key={post.slug} post={post} priority={index === 0} />
              ))}
            </div>
          </section>
        ) : null}

        {/* Expert team */}
        <section aria-labelledby="team-heading">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand mb-2">Our editorial team</p>
          <h2 id="team-heading" className="text-3xl sm:text-4xl text-navy tracking-tight mb-2">
            Reviews written by verified software experts
          </h2>
          <p className="text-gray-500 mb-8 max-w-lg">
            Our writers combine hands-on industry experience with structured review frameworks.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map(({ initials, name, role, exp }) => (
              <div key={name} className="bg-white border border-gray-200 rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-22px_rgba(15,31,61,0.5)]">
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
        <section className="relative overflow-hidden bg-gradient-to-br from-[#071a57] via-[#0b2f88] to-[#09236b] rounded-3xl p-8 sm:p-12 text-center text-white shadow-[0_28px_52px_-28px_rgba(8,20,60,0.8)]" aria-label="Trust statistics">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(255,255,255,0.14),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.1),transparent_40%)]" />
          <div className="relative">
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
              <div key={label} className="min-w-[130px]">
                <p className="font-serif text-5xl text-accent leading-none">{num}</p>
                <p className="text-sm text-white/60 mt-2">{label}</p>
              </div>
            ))}
          </div>
          </div>
        </section>

        {/* FAQ */}
        <HomeFaqSection faqs={FAQS} />

        <section className="bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-[0_14px_32px_-24px_rgba(15,31,61,0.5)]" aria-label="Additional resources">
          <h2 className="text-2xl sm:text-3xl text-navy tracking-tight mb-3">Additional Resources</h2>
          <p className="text-sm text-gray-600 mb-4">
            Explore policy pages, planning resources, and company information.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { href: '/technology/get-free-quotes', label: 'All Software Quotes' },
              { href: '/business-planning', label: 'Business Planning' },
              { href: '/start-a-business', label: 'Start a Business' },
              { href: '/resources/whitepaper', label: 'Whitepaper' },
              { href: '/contact-us/careers', label: 'Careers' },
              { href: '/advertise', label: 'Advertise' },
              { href: '/limit-the-use', label: 'Limit the Use' },
              { href: '/copyright-policy', label: 'Copyright Policy' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-brand border border-brand/30 px-3 py-2 rounded-lg hover:bg-brand-light transition-all duration-200 hover:-translate-y-0.5"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>

      </div>
    </>
  )
}
