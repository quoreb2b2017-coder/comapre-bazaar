import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata, buildItemListSchema, buildFaqSchema, SITE_URL } from '@/lib/seo'
import { HOME_CATEGORIES } from '@/data/homeCategories'
import { HomeHeroSection } from '@/components/home/HomeHeroSection'
import { MotionSection } from '@/components/home/MotionSection'
import { HomeFaqSection } from '@/components/ui/HomeFaqSection'
import { loadUnifiedBlogIndex } from '@/lib/blogCms'
import { BlogHomePreviewCard } from '@/components/blog/BlogListingCards'

export const metadata: Metadata = buildMetadata({
  title: 'Best Business Software Comparisons & Reviews 2026',
  description:
    'Independent reviews, side by side pricing, and ranked picks across CRM, payroll, HR, email marketing, and more. Trusted by 50,000 business buyers.',
  canonical: '/',
  ogTitle: 'Best Business Software Comparisons & Reviews 2026 | Compare Bazaar',
  ogUrl: 'https://www.compare-bazaar.com',
})

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

const ADDITIONAL_RESOURCES = [
  { href: '/technology/get-free-quotes', label: 'All Software Quotes' },
  { href: '/business-planning', label: 'Business Planning' },
  { href: '/start-a-business', label: 'Start a Business' },
  { href: '/resources/whitepaper', label: 'Whitepaper' },
  { href: '/contact-us/careers', label: 'Careers' },
  { href: '/advertise', label: 'Advertise' },
  { href: '/limit-the-use', label: 'Limit the Use' },
  { href: '/copyright-policy', label: 'Copyright Policy' },
]

const itemListSchema = buildItemListSchema(
  'Business Software Categories',
  HOME_CATEGORIES.map((c) => ({ name: c.title, href: c.href, description: c.desc }))
)

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

      <div className="bg-gradient-to-r from-[#071a57] via-[#0a246d] to-[#071a57] text-white/85 text-center py-2 px-4">
        <p className="text-xs sm:text-sm">
          Reviewed by <strong className="text-white">independent experts</strong> ·
          No paid placements in rankings ·{' '}
          <strong className="text-white">Updated monthly</strong> · Trusted by 50,000+ business buyers
        </p>
      </div>

      <HomeHeroSection />

      <div className="border-b border-gray-100 bg-white py-3 px-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2.5 px-1">
          <span className="rounded bg-[#F58220] px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
            How we review
          </span>
          <p className="text-sm text-gray-600">
            Every comparison is based on hands-on testing, pricing verification, and structured scoring
            across 12+ criteria, never influenced by vendor payments.{' '}
            <Link href="/editorial-process" className="font-semibold text-navy underline underline-offset-2 hover:text-[#F58220]">
              Read our editorial process →
            </Link>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-12 sm:space-y-20 sm:px-6 sm:py-14">

        <MotionSection className="border-t border-gray-100 pt-10 sm:pt-12" aria-labelledby="how-heading">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#F58220]">Our methodology</p>
          <h2 id="how-heading" className="mb-2 text-2xl tracking-tight text-navy sm:text-3xl">
            How we independently review and rank software
          </h2>
          <p className="mb-8 max-w-lg text-sm text-gray-500 sm:text-base">
            Our reviews are never pay-to-play. Here&apos;s exactly how we evaluate each platform.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
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
              <div key={num} className="border-t border-gray-200 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:first:border-l-0 sm:first:pl-0">
                <p className="mb-2 font-serif text-3xl leading-none text-[#F58220]">{num}</p>
                <h3 className="mb-1.5 text-base font-semibold text-navy sm:text-lg">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{body}</p>
              </div>
            ))}
          </div>
          <Link href="/editorial-process" className="mt-6 inline-block text-sm font-semibold text-navy underline underline-offset-2 hover:text-[#F58220]">
            Read our full editorial process →
          </Link>
        </MotionSection>

        {recentBlogPosts.length > 0 ? (
          <MotionSection aria-labelledby="blog-preview-heading" delay={0.05}>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand">Buying guides</p>
                <h2 id="blog-preview-heading" className="text-2xl tracking-tight text-navy sm:text-3xl">
                  Latest from our blog
                </h2>
                <p className="mt-1.5 max-w-xl text-sm text-gray-500">
                  Deep dives on payroll, VoIP, CRM, and more, with the same scoring mindset as our comparison hubs.
                </p>
              </div>
              <Link href="/blog" className="shrink-0 text-sm font-semibold text-brand hover:underline">
                View all articles →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {recentBlogPosts.map((post, index) => (
                <BlogHomePreviewCard key={post.slug} post={post} priority={index === 0} />
              ))}
            </div>
          </MotionSection>
        ) : null}

        <MotionSection aria-labelledby="team-heading" className="border-t border-gray-100 pt-10 sm:pt-12" delay={0.05}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#F58220]">Our editorial team</p>
          <h2 id="team-heading" className="mb-2 text-2xl tracking-tight text-navy sm:text-3xl">
            Reviews written by verified software experts
          </h2>
          <p className="mb-8 max-w-lg text-sm text-gray-500 sm:text-base">
            Our writers combine hands-on industry experience with structured review frameworks.
          </p>
          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
            {TEAM.map(({ initials, name, role, exp }) => (
              <div key={name} className="text-center">
                <div
                  className="mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-sm font-semibold text-navy"
                  aria-hidden="true"
                >
                  {initials}
                </div>
                <h4 className="text-sm font-semibold text-navy">{name}</h4>
                <p className="mt-1 text-xs font-medium text-gray-600">{role}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-400">{exp}</p>
              </div>
            ))}
          </div>
        </MotionSection>

        <MotionSection
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#071a57] via-[#0b2f88] to-[#09236b] p-7 text-center text-white sm:p-10"
          aria-label="Trust statistics"
          delay={0.05}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(255,255,255,0.14),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.1),transparent_40%)]" />
          <div className="relative">
            <h2 className="mb-2 text-2xl tracking-tight sm:text-3xl">Trusted by thousands of business buyers</h2>
            <p className="mx-auto mb-8 max-w-lg text-sm text-white/70 sm:text-base">
              Our comparison guides help B2B decision-makers cut through vendor marketing and make confident software choices.
            </p>
            <div className="flex flex-wrap justify-center gap-8 sm:gap-10">
              {[
                { num: '50K+', label: 'Business buyers helped' },
                { num: '40+', label: 'Platforms reviewed' },
                { num: '12', label: 'Scoring criteria per platform' },
                { num: '100%', label: 'Independent editorial' },
              ].map(({ num, label }) => (
                <div key={label} className="min-w-[120px]">
                  <p className="font-serif text-4xl leading-none text-accent sm:text-5xl">{num}</p>
                  <p className="mt-1.5 text-xs text-white/60 sm:text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </MotionSection>

        <MotionSection delay={0.05}>
          <HomeFaqSection faqs={FAQS} />
        </MotionSection>

        <MotionSection className="border-t border-gray-100 pt-8 sm:pt-10" aria-label="Additional resources" delay={0.05}>
          <h2 className="mb-1 text-lg tracking-tight text-navy sm:text-xl">Additional Resources</h2>
          <p className="mb-3 text-sm text-gray-500">
            Policy pages, planning resources, and company information.
          </p>
          <nav className="flex flex-wrap gap-x-4 gap-y-2">
            {ADDITIONAL_RESOURCES.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-gray-600 transition-colors hover:text-[#F58220]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </MotionSection>

      </div>
    </>
  )
}
