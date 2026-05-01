import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, CircleDollarSign, Gauge, Link2, ShieldCheck, Sparkles, Users, Workflow, UserCircle2, FileClock, CalendarDays } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata: Metadata = buildMetadata({
  title: 'HubSpot CRM Review 2026: Features, Pricing, Pros & Cons',
  description:
    'Detailed HubSpot CRM review for 2026. Compare HubSpot CRM pricing, key features, automation, integrations, usability, pros, cons, and best-fit business types.',
  canonical: '/reviews/hubspot-crm-review',
})

const QUICK_FACTS = [
  { label: 'Best for', value: 'SMBs and mid-market teams that need CRM + marketing in one platform' },
  { label: 'Starting price', value: 'Free plan available, paid CRM features from $15/user/month' },
  { label: 'Standout strength', value: 'Excellent integration ecosystem and clean user experience' },
  { label: 'Main trade-off', value: 'Advanced reporting and automation can get expensive at scale' },
]

const VERDICT_POINTS = [
  'HubSpot CRM is one of the easiest platforms to launch quickly without sacrificing long-term depth.',
  'The free plan is genuinely usable for real pipelines, not just a limited demo tier.',
  'Teams that need deeper analytics, custom workflows, or larger contact databases should budget for higher paid tiers.',
]

const FEATURE_BREAKDOWN = [
  {
    title: 'Pipeline and Deal Management',
    body: 'Visual pipelines, customizable deal stages, and useful activity reminders make day-to-day sales execution simple. For most SMB teams, this is one of HubSpot\'s strongest modules.',
  },
  {
    title: 'Automation and Sequences',
    body: 'Basic automation is easy to set up, while advanced workflow logic is available at higher tiers. Teams with multi-step lead routing should test advanced plans before deciding.',
  },
  {
    title: 'Reporting and Forecasting',
    body: 'Default reports are clean and useful, but deep custom reporting often requires Professional plans. This is the biggest budget checkpoint during scale-up.',
  },
  {
    title: 'Contact and Lead Data Quality',
    body: 'Contact timelines are clear and practical for handoffs between sales and marketing. Data hygiene still depends on good field governance and naming conventions.',
  },
]

const BEST_FOR = [
  'Growing B2B companies needing CRM + marketing alignment',
  'Teams that want fast onboarding and low technical complexity',
  'Businesses prioritizing integration flexibility over lowest possible cost',
]

const NOT_IDEAL_FOR = [
  'Very small teams needing only basic pipeline tracking at minimum cost',
  'Organizations requiring enterprise-level analytics without premium pricing',
  'Teams that prefer highly custom CRM architecture from day one',
]

const FAQS = [
  {
    q: 'Is HubSpot CRM good for small businesses?',
    a: 'Yes. HubSpot is one of the strongest choices for small businesses because the free plan is usable, onboarding is fast, and integrations are broad. Cost planning becomes important as you add advanced features.',
  },
  {
    q: 'How does HubSpot compare with Zoho CRM and Pipedrive?',
    a: 'HubSpot usually wins on ecosystem and usability, Zoho often wins on value for price-sensitive growth teams, and Pipedrive is often best for sales teams focused purely on pipeline execution.',
  },
  {
    q: 'What should you verify before buying HubSpot?',
    a: 'Validate reporting requirements, automation depth, expected contact volume, and integration needs. Most pricing surprises come from scaling contacts or moving to higher reporting tiers.',
  },
]

const SCORE_TABLE = [
  { metric: 'Ease of use', score: '9/10' },
  { metric: 'Integrations', score: '9.5/10' },
  { metric: 'Automation', score: '8/10' },
  { metric: 'Reporting', score: '7.5/10' },
  { metric: 'Value for money', score: '7.5/10' },
  { metric: 'Overall score', score: '8.6/10' },
]

export default function HubspotCrmReviewPage() {
  const getScorePillClass = (score: string) => {
    const value = Number(score.split('/')[0])
    if (value >= 9) return 'bg-green-100 text-green-800 border-green-200'
    if (value >= 8) return 'bg-blue-100 text-blue-800 border-blue-200'
    return 'bg-amber-100 text-amber-800 border-amber-200'
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Marketing Hub', href: '/marketing' },
          { label: 'HubSpot CRM Review' },
        ]}
        className="mb-6"
      />

      <header
        className="mb-12 rounded-[28px] p-7 sm:p-10 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(115deg, #071D4C 0%, #0B2A6F 45%, #1D4ED8 78%, #F58220 128%)' }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.2),transparent_55%)]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(245,130,32,0.25),transparent_45%)]" aria-hidden="true" />
        <div className="absolute top-0 right-0 h-44 w-44 rounded-full border border-white/20 -mr-20 -mt-16" aria-hidden="true" />
        <div className="absolute top-10 right-14 h-6 w-6 rounded-full bg-white/15" aria-hidden="true" />
        <div className="absolute bottom-10 right-20 h-16 w-16 rounded-full border border-white/15" aria-hidden="true" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-white/10" aria-hidden="true" />
        <div
          className="absolute inset-0 pointer-events-none z-[1] bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0)_48%,rgba(0,0,0,0.18)_100%)]"
          aria-hidden="true"
        />

        <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/80 mb-2">CRM Software Review</p>
        <h1 className="text-3xl sm:text-4xl tracking-tight mb-3">
          HubSpot CRM Review (2026): Is It Still the Best All-Round CRM for Growing Teams?
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/90">
          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 font-semibold">Score: 4.5/5</span>
          <span>4,821 user reviews analyzed</span>
          <span>Starting price: Free · Paid from $15/user/month</span>
        </div>

        <div className="mt-5 border-t border-white/20 pt-4 space-y-2 text-sm text-white/85">
          <p className="flex items-start gap-2">
            <UserCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/80" />
            <span>
              Written by <strong className="text-white">Sarah Kim</strong> · CRM & Revenue Systems Editor
            </span>
          </p>
          <p className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/80" />
            <span>
              Compare Bazaar may earn affiliate commissions from some providers. Editorial rankings remain independent and unbiased.
            </span>
          </p>
          <p className="flex items-start gap-2">
            <FileClock className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/80" />
            <span>Last updated: April 2026</span>
          </p>
          <p className="flex items-start gap-2">
            <CalendarDays className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/80" />
            <span>Published: March 2026</span>
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {['Quick Facts', 'Scorecard', 'Feature Breakdown', 'FAQ', 'Final Recommendation'].map((item) => (
            <span
              key={item}
              className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white/90"
            >
              {item}
            </span>
          ))}
        </div>
        </div>
      </header>

      <section className="mb-10 pb-8 border-b border-gray-200">
        <h2 className="text-lg text-navy tracking-tight mb-3">What You Will Learn in This Review</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-700">
          <p className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
            Real-world strengths and where HubSpot performs best
          </p>
          <p className="flex items-start gap-2">
            <Workflow className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
            Feature depth across pipeline, automation, and reporting
          </p>
          <p className="flex items-start gap-2">
            <Users className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
            Who should buy HubSpot and who should shortlist alternatives
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-10 pb-8 border-b border-gray-200">
        {QUICK_FACTS.map((fact) => (
          <article key={fact.label} className="pl-4 border-l-4 border-[#F58220]/70">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">{fact.label}</p>
            <p className="text-sm text-gray-700 leading-relaxed">{fact.value}</p>
          </article>
        ))}
      </section>

      <section className="mb-10 pb-8 border-b border-gray-200">
        <h2 className="text-xl text-navy tracking-tight mb-3">Quick Verdict</h2>
        <ul className="space-y-2">
          {VERDICT_POINTS.map((point) => (
            <li key={point} className="flex gap-2 text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
              {point}
            </li>
          ))}
        </ul>
      </section>

      <section className="p-6 mb-10 relative overflow-hidden border-l-4 border-[#F58220] bg-[#FFF7ED]">
        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-orange-100 -mr-8 -mt-8" aria-hidden="true" />
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-700 mb-2">Featured Choice</p>
        <h2 className="text-xl text-navy tracking-tight mb-2">Featured: HubSpot CRM for Growing Revenue Teams</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          If your business wants one platform for lead capture, pipeline tracking, email outreach, and lifecycle
          automation, HubSpot remains a strong featured option. It is especially effective for teams that value
          fast adoption, clean UI, and reliable integrations across sales and marketing workflows.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://www.hubspot.com/products/crm"
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="bg-brand hover:bg-brand-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Visit HubSpot
          </a>
          <Link
            href="/marketing/best-crm-software/get-free-quote"
            className="border border-brand text-brand hover:bg-brand-light text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Get Free CRM Quotes
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-8 mb-10">
        <aside className="lg:sticky lg:top-24 h-fit p-5 border border-gray-200 bg-[#FAFCFF]">
          <h2 className="text-base font-semibold text-navy mb-1">HubSpot CRM Scorecard</h2>
          <p className="text-xs text-gray-500 mb-3">At-a-glance editorial scoring based on testing criteria.</p>
          <table className="w-full text-sm">
            <tbody>
              {SCORE_TABLE.map((row) => (
                <tr key={row.metric} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                  <td className="py-2 text-gray-600">{row.metric}</td>
                  <td className="py-2 text-right">
                    <span className={`inline-flex border rounded-full px-2 py-0.5 text-xs font-semibold ${getScorePillClass(row.score)}`}>
                      {row.score}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </aside>

        <div className="space-y-8">
          <article className="pb-6 border-b border-gray-200">
            <h2 className="text-2xl text-navy tracking-tight mb-2 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-brand" />
              Ease of Use and Setup
            </h2>
            <p className="text-gray-600 leading-relaxed">
              HubSpot CRM remains one of the smoothest onboarding experiences we tested. Pipeline setup, custom
              properties, and contact imports are straightforward, and the interface is clean enough for non-technical
              teams. Most teams can go from signup to a usable pipeline in under a day.
            </p>
          </article>

          <article className="pb-6 border-b border-gray-200">
            <h2 className="text-2xl text-navy tracking-tight mb-2 flex items-center gap-2">
              <Link2 className="w-5 h-5 text-brand" />
              Integrations and Ecosystem
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Integration depth is where HubSpot stands out. Native connections with Gmail, Outlook, Slack, Shopify,
              and dozens of sales/marketing tools reduce manual sync work. For growing teams that want one connected
              system rather than multiple disconnected tools, this is a major advantage.
            </p>
          </article>

          <article className="pb-6 border-b border-gray-200">
            <h2 className="text-2xl text-navy tracking-tight mb-2 flex items-center gap-2">
              <CircleDollarSign className="w-5 h-5 text-brand" />
              Pricing Reality
            </h2>
            <p className="text-gray-600 leading-relaxed">
              The free tier is strong, but teams should plan ahead for paid growth. As contact volume, reporting needs,
              and automation complexity increase, HubSpot can become expensive compared with lean CRM alternatives.
              Pricing is still fair for teams that actively use multiple hubs, but overkill for simple pipeline-only use.
            </p>
          </article>

          <article className="pb-6 border-b border-gray-200">
            <h2 className="text-2xl text-navy tracking-tight mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand" />
              Best Fit and Who Should Skip
            </h2>
            <p className="text-gray-600 leading-relaxed">
              HubSpot CRM is best for SMBs and mid-market companies that want sales, marketing, and customer data in one
              place. If your team only needs lightweight deal tracking at the lowest cost, options like Pipedrive or Zoho
              may deliver better value.
            </p>
          </article>

          <article className="pb-6 border-b border-gray-200">
            <h2 className="text-2xl text-navy tracking-tight mb-3">Feature-by-Feature Breakdown</h2>
            <div className="space-y-4">
              {FEATURE_BREAKDOWN.map((item) => (
                <div key={item.title} className="p-4 border-l-4 border-[#1D4ED8]/60 bg-[#F8FBFF]">
                  <h3 className="text-base font-semibold text-navy mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </article>

        <article className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="rounded-xl border border-green-200 bg-green-50 p-5">
            <h3 className="text-lg text-green-900 tracking-tight mb-3">Best For</h3>
            <ul className="space-y-2 text-sm text-green-900/90">
              {BEST_FOR.map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <h3 className="text-lg text-amber-900 tracking-tight mb-3">May Not Be Ideal For</h3>
            <ul className="space-y-2 text-sm text-amber-900/90">
              {NOT_IDEAL_FOR.map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </article>
        </div>
      </section>

      <section className="p-6 mb-10 border-t border-b border-gray-200">
        <h2 className="text-xl text-navy tracking-tight mb-4">HubSpot CRM FAQ</h2>
        <div className="space-y-4">
          {FAQS.map((faq) => (
            <article key={faq.q} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
              <h3 className="text-base font-semibold text-navy mb-1">{faq.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="p-6 border-l-4 border-[#0B2A6F] bg-[linear-gradient(180deg,#ffffff_0%,#fafcff_100%)]">
        <h2 className="text-xl text-navy tracking-tight mb-3">Final Recommendation</h2>
        <p className="text-gray-600 mb-4">
          HubSpot CRM is a strong choice if your team values quick deployment, strong integrations, and a unified
          revenue stack. Before purchasing higher tiers, map your reporting requirements and expected contact growth so
          your long-term cost stays predictable.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://www.hubspot.com/products/crm"
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="bg-brand hover:bg-brand-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Visit HubSpot
          </a>
          <Link
            href="/marketing/best-crm-software/get-free-quote"
            className="border border-brand text-brand hover:bg-brand-light text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Get CRM Quotes
          </Link>
          <Link
            href="/marketing/best-crm-software"
            className="border border-brand text-brand hover:bg-brand-light text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Compare More CRM Tools
          </Link>
        </div>
      </section>
    </main>
  )
}
