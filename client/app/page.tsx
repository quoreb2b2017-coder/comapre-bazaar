import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata, buildItemListSchema, buildFaqSchema, SITE_URL } from '@/lib/seo'
import { HomeCategoryCard } from '@/components/ui/HomeCategoryCard'
import { HomeFaqSection } from '@/components/ui/HomeFaqSection'
import { HomeSearchBar } from '@/components/ui/HomeSearchBar'
import { NewsletterSubscribeForm } from '@/components/ui/NewsletterSubscribeForm'
import { loadUnifiedBlogIndex } from '@/lib/blogCms'
import { BlogHomePreviewCard } from '@/components/blog/BlogListingCards'
import {
  HandshakeIcon,
  MailIcon,
  PhoneIcon,
  TruckIcon,
  UsersIcon,
  WalletIcon,
} from '@/components/ui/icons'

export const metadata: Metadata = buildMetadata({
  title: 'Best Business Software Comparisons & Reviews 2026',
  description:
    'Independent reviews, side by side pricing, and ranked picks across CRM, payroll, HR, email marketing, and more. Trusted by 80,000 business buyers.',
  canonical: '/',
  ogTitle: 'Best Business Software Comparisons & Reviews 2026 | Compare Bazaar',
  ogUrl: 'https://www.compare-bazaar.com',
})

const CATEGORIES = [
  {
    href: '/technology/business-phone-systems',
    quotesHref: '/technology/business-phone-systems/get-free-quotes',
    icon: PhoneIcon,
    shortTitle: 'VoIP & UCaaS',
    vendors: '6 vendors',
    title: 'Best VoIP & Business Phone Systems',
    desc: 'RingCentral, Nextiva, and Ooma compared on call quality, mobile apps, and SMB pricing.',
  },
  {
    href: '/human-resources/best-payroll-software',
    quotesHref: '/human-resources/best-payroll-software/get-free-quotes',
    icon: WalletIcon,
    shortTitle: 'Payroll',
    vendors: '8 vendors',
    title: 'Best Payroll Software for Small Business',
    desc: 'ADP, Gusto, OnPay, and Rippling compared on tax compliance, contractor support, and integrations.',
  },
  {
    href: '/human-resources',
    quotesHref: '/human-resources/best-employee-management-software/get-free-quotes',
    icon: UsersIcon,
    shortTitle: 'HR Software',
    vendors: '7 vendors',
    title: 'Best HR Software for 2026',
    desc: 'BambooHR, Rippling, Workday compared on onboarding, performance tools, and company size fit.',
  },
  {
    href: '/marketing/best-crm-software',
    quotesHref: '/marketing/best-crm-software/get-free-quote',
    icon: HandshakeIcon,
    shortTitle: 'CRM',
    vendors: '11 vendors',
    title: 'Best CRM Software of 2026',
    desc: 'Compare HubSpot, Salesforce, Zoho, and 8 more on pipeline management, automation, and pricing.',
  },
  {
    href: '/technology/gps-fleet-management-software',
    quotesHref: '/technology/gps-fleet-management-software/get-free-quotes',
    icon: TruckIcon,
    shortTitle: 'GPS Fleet',
    vendors: '7 vendors',
    title: 'Best GPS Fleet Management Software',
    desc: 'Samsara, Motive, and Verizon Connect compared on tracking, safety, and fleet visibility.',
  },
  {
    href: '/marketing/best-email-marketing-services',
    quotesHref: '/marketing/best-email-marketing-services/get-free-quotes',
    icon: MailIcon,
    shortTitle: 'Email Marketing',
    vendors: '9 vendors',
    title: 'Best Email Marketing Services',
    desc: 'Mailchimp, Klaviyo, ActiveCampaign ranked on deliverability, automation depth, and list pricing.',
  },
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
    a: 'Compare Bazaar earns affiliate commissions when readers purchase software through our links. Some vendors also pay for clearly labeled sponsored placements. Neither of these arrangements influences our editorial rankings. Our scoring is based on hands on testing and structured criteria. You can read full details on our Advertising Disclosure page.',
  },
  {
    q: 'How often are your software reviews updated?',
    a: 'Most of our software reviews are updated monthly to reflect pricing changes, new features, and shifts in the competitive landscape. Pricing data is verified directly with vendors and dated on each review page so you can see how current the information is. Categories with faster moving markets like CRM and email marketing are reviewed more frequently.',
  },
  {
    q: 'Can vendors pay to be ranked higher in your comparisons?',
    a: 'No. Vendor payments have zero influence on rankings. Every platform is scored using a weighted methodology across 12 or more criteria such as features, pricing, ease of use, and integrations. Some vendors have affiliate relationships with us, but this does not affect score or position in any comparison. Sponsored placements are clearly labeled and kept separate from editorial rankings.',
  },
  {
    q: 'What criteria do you use to score software?',
    a: 'Every platform is evaluated across 12 or more criteria by a subject matter expert. Core criteria include ease of use, feature depth, pricing transparency, integration options, customer support quality, and scalability for different business sizes. Scoring is category specific. For example, payroll tools are judged on tax compliance and contractor support, while CRM tools are scored on pipeline management and automation. You can read our complete scoring framework on the Editorial Process page.',
  },
  {
    q: 'How do you verify software pricing?',
    a: 'We contact vendors directly to confirm pricing before publishing. All pricing data is clearly dated on each review so you know when it was last verified. We also flag hidden fees, per user charges, and contract requirements that may not be obvious from headline pricing.',
  },
]

const itemListSchema = buildItemListSchema(
  'Business Software Categories',
  CATEGORIES.map((c) => ({ name: c.title, href: c.href, description: c.desc }))
)

const HERO_SEARCH_ITEMS = CATEGORIES.map((c) => ({
  href: c.href,
  label: `${c.shortTitle} ${c.title}`,
  shortLabel: c.shortTitle,
}))

const homeFaqSchema = buildFaqSchema(
  FAQS.map((f) => ({ question: f.q, answer: f.a })),
  SITE_URL
)

export default async function HomePage() {
  const recentBlogPosts = (await loadUnifiedBlogIndex()).slice(0, 3)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {homeFaqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }}
        />
      ) : null}

      {/* Trust bar */}
      <div className="bg-gradient-to-r from-[#071a57] via-[#0a246d] to-[#071a57] text-white/85 text-center py-2.5 px-4 shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
        <p className="text-xs sm:text-sm">
          Reviewed by <strong className="text-white">independent experts</strong> ·
          No paid placements in rankings ·{' '}
          <strong className="text-white">Updated monthly</strong> · Trusted by 80,000+ business buyers
        </p>
      </div>

      {/* Hero */}
      <header className="bg-white px-6 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20 xl:px-24 border-b border-gray-100">
        <div className="mx-auto max-w-6xl lg:max-w-7xl">
          <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_minmax(240px,300px)] lg:items-center lg:gap-8 xl:gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F58220] mb-3">
                Independent B2B Software Research
              </p>
              <div className="flex gap-2 mb-5" aria-hidden="true">
                <span className="block w-2 h-1.5 rounded-full bg-[#F58220]" />
                <span className="block w-14 h-1.5 rounded-full bg-[#F58220]" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl text-navy tracking-tight mb-3 max-w-3xl">
                Find the right software before the vendor call.
              </h1>
              <div className="w-20 h-1 rounded-full bg-[#F58220] mb-4" aria-hidden="true" />
              <p className="text-gray-600 max-w-2xl text-base sm:text-lg">
                Side-by-side comparisons, pricing breakdowns, and unbiased shortlists - built for US small businesses.
              </p>
            </div>

            <div className="lg:justify-self-end lg:w-full lg:max-w-[300px]">
              <HomeSearchBar items={HERO_SEARCH_ITEMS} variant="hero" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-3">
            {CATEGORIES.map((cat) => (
              <HomeCategoryCard
                key={cat.href}
                href={cat.href}
                quotesHref={cat.quotesHref}
                icon={cat.icon}
                shortTitle={cat.shortTitle}
                vendors={cat.vendors}
                title={cat.title}
              />
            ))}
          </div>

          <NewsletterSubscribeForm sourceSlug="homepage" variant="hero" />
        </div>
      </header>

      {/* Methodology bar */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-b border-blue-200/80 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3 rounded-2xl border border-blue-200/70 bg-white/75 px-4 py-3 shadow-[0_14px_30px_-24px_rgba(37,99,235,0.45)]">
          <span className="bg-brand text-white text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wide">
            How we review
          </span>
          <p className="text-sm text-blue-800">
            Every comparison is based on hands-on testing, pricing verification, and structured scoring
            across 12+ criteria, never influenced by vendor payments.{' '}
            <Link href="/editorial-process" className="font-semibold underline">
              Read our editorial process →
            </Link>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 space-y-24 sm:space-y-28">

        {/* How we review */}
        <section className="bg-gradient-to-b from-gray-50 via-white to-white border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-[0_20px_40px_-24px_rgba(15,31,61,0.5)]" aria-labelledby="how-heading">
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
                body: 'We contact vendors directly to confirm pricing and flag hidden fees. All pricing data is dated, we note when prices were last confirmed.',
              },
              {
                num: '03',
                title: 'Independent scoring',
                body: 'Rankings are based on weighted scores across our criteria, vendors cannot pay to improve their ranking. Sponsored placements are always clearly labelled.',
              },
            ].map(({ num, title, body }) => (
              <div key={num} className="rounded-2xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-[0_14px_30px_-24px_rgba(15,31,61,0.5)]">
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
                  Deep dives on payroll, VoIP, CRM, and more, with the same scoring mindset as our comparison hubs.
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
        <section aria-labelledby="team-heading" className="rounded-3xl border border-gray-200/80 bg-gradient-to-b from-white to-gray-50/60 p-6 sm:p-8 shadow-[0_18px_38px_-28px_rgba(15,31,61,0.45)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand mb-2">Our editorial team</p>
          <h2 id="team-heading" className="text-3xl sm:text-4xl text-navy tracking-tight mb-2">
            Reviews written by verified software experts
          </h2>
          <p className="text-gray-500 mb-8 max-w-lg">
            Our writers combine hands-on industry experience with structured review frameworks.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map(({ initials, name, role, exp }) => (
              <div key={name} className="bg-white border border-gray-200 rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_40px_-22px_rgba(15,31,61,0.5)]">
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
              { num: '80K+', label: 'Business buyers helped' },
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

        <section className="bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-[0_18px_36px_-24px_rgba(15,31,61,0.5)]" aria-label="Additional resources">
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
                className="text-sm text-brand border border-brand/30 bg-white px-3 py-2 rounded-lg hover:bg-brand-light transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_22px_-14px_rgba(14,42,106,0.35)]"
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
