export const revalidate = 3600
import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, XCircle, Globe, Shield, Zap, Users, DollarSign, Star } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { FullReviewLink } from '@/components/reviews/FullReviewLink'
import { getComparisonPageBySlug } from '@/data/comparisons'

export const metadata: Metadata = buildMetadata({
  title: 'Deel HR & Payroll Software Review (2026)',
  description:
    'Deel is the leading global HR and payroll platform for 2026. Hire employees and contractors in 150+ countries with built-in EOR, compliance, and payroll automation.',
  canonical: '/human-resources/deel-hr-payroll',
})

const data = getComparisonPageBySlug('deel-hr-payroll')!

const MODULES = [
  {
    id: 'deel-eor',
    color: 'from-[#0f1f3d] to-[#1d4ed8]',
    accent: '#1d4ed8',
    icon: Globe,
    highlight: 'Employer of Record',
    countries: '150+',
    price: '$599/employee/mo',
  },
  {
    id: 'deel-contractor',
    color: 'from-[#065f46] to-[#10b981]',
    accent: '#10b981',
    icon: Users,
    highlight: 'Contractor Management',
    countries: '150+',
    price: 'Free / $49/contractor',
  },
  {
    id: 'deel-payroll',
    color: 'from-[#4c1d95] to-[#7c3aed]',
    accent: '#7c3aed',
    icon: DollarSign,
    highlight: 'Global Payroll',
    countries: '100+',
    price: 'Custom quote',
  },
  {
    id: 'deel-hr',
    color: 'from-[#0c4a6e] to-[#0ea5e9]',
    accent: '#0ea5e9',
    icon: Shield,
    highlight: 'Free HRIS',
    countries: 'All',
    price: 'Free',
  },
  {
    id: 'deel-us-payroll',
    color: 'from-[#7f1d1d] to-[#ef4444]',
    accent: '#ef4444',
    icon: Zap,
    highlight: 'US Payroll',
    countries: 'US',
    price: '$19/employee/mo',
  },
]

const STATS = [
  { label: 'Countries covered', value: '150+' },
  { label: 'Customers worldwide', value: '35,000+' },
  { label: 'Expert score', value: '4.7/5' },
  { label: 'User reviews', value: '8,400+' },
]

const INTEGRATIONS = [
  'QuickBooks', 'Xero', 'NetSuite', 'BambooHR',
  'Workday', 'Slack', 'Greenhouse', 'Lever',
  'Rippling', 'HiBob', 'Personio', 'Ashby',
]

export default function DeelHrPayrollPage() {
  const products = data.products

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumb items={data.breadcrumbs} className="mb-6" />

      {/* ── Hero ── */}
      <div className="rounded-3xl overflow-hidden mb-10"
        style={{ background: 'linear-gradient(135deg, #0f1f3d 0%, #1d4ed8 55%, #06b6d4 100%)' }}>
        <div className="relative px-8 py-12 sm:px-12">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full border border-white/10 -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-20 h-32 w-32 rounded-full border border-white/10" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="rounded-full bg-white/15 border border-white/25 px-3 py-1 text-xs font-semibold text-white">HR & Payroll Software</span>
              <span className="rounded-full bg-emerald-400/20 border border-emerald-400/40 px-3 py-1 text-xs font-semibold text-emerald-300">🏆 #1 Global HR Platform 2026</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3">
              Deel HR & Payroll
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mb-6">
              The all-in-one global HR platform. Hire, pay, and manage employees and contractors in 150+ countries — no local entity needed.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-center">
                  <p className="text-xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-white/70">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.deel.com/partners/affiliates/?pscd=get.deel.com&ps_partner_key=NWMzOGRkZGJmN2Zj&ps_xid=YgVSyo36Kc3Aim&gsxid=YgVSyo36Kc3Aim&gspk=NWMzOGRkZGJmN2Zj"
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="rounded-xl bg-white text-[#1d4ed8] font-bold px-6 py-3 text-sm hover:bg-blue-50 transition-colors"
              >
                Visit Deel →
              </a>
              <Link
                href="/human-resources/best-payroll-software/get-free-quotes"
                className="rounded-xl bg-white/15 border border-white/30 text-white font-semibold px-6 py-3 text-sm hover:bg-white/25 transition-colors"
              >
                Compare Payroll Quotes
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Module Cards ── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-navy tracking-tight mb-2">Deel product modules</h2>
        <p className="text-gray-500 text-sm mb-6">Each module solves a specific global HR challenge. Most teams use 2–3 together.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {products.map((product) => {
            const meta = MODULES.find((m) => m.id === product.id)
            const Icon = meta?.icon ?? Globe
            return (
              <article
                key={product.id}
                id={product.id}
                className="rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* card header */}
                <div className={`bg-gradient-to-r ${meta?.color ?? 'from-gray-700 to-gray-900'} px-5 py-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-white/80 uppercase tracking-wide">{meta?.highlight}</span>
                    </div>
                    {product.isTopPick && (
                      <span className="rounded-full bg-yellow-400/20 border border-yellow-400/40 px-2 py-0.5 text-xs font-bold text-yellow-300">🏆 Top Pick</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white">{product.name}</h3>
                  <p className="text-white/75 text-xs mt-1">{product.tagline}</p>
                </div>

                {/* score + price */}
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-[#F27F25] fill-[#F27F25]" />
                    <span className="font-bold text-navy">{product.score}/5</span>
                    <span className="text-xs text-gray-400">({product.reviewCount.toLocaleString()} reviews)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-navy">{product.pricingAmount}</span>
                    <span className="text-xs text-gray-400">{product.pricingPeriod}</span>
                  </div>
                </div>

                {/* pros/cons */}
                <div className="px-5 py-4 space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 mb-2">Pros</p>
                    <ul className="space-y-1.5">
                      {product.pros.slice(0, 3).map((pro) => (
                        <li key={pro} className="flex gap-2 text-xs text-gray-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-rose-500 mb-2">Cons</p>
                    <ul className="space-y-1.5">
                      {product.cons.slice(0, 2).map((con) => (
                        <li key={con} className="flex gap-2 text-xs text-gray-600">
                          <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* footer */}
                <div className="px-5 pb-4 flex gap-2">
                  <a
                    href={product.vendorUrl}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="flex-1 text-center rounded-xl bg-[#F27F25] hover:bg-[#e97a13] text-white text-xs font-bold py-2.5 transition-colors"
                  >
                    Visit {product.name.split(' ')[1] ?? 'Deel'} →
                  </a>
                  <FullReviewLink
                    reviewSlug={product.reviewSlug}
                    productName={product.name}
                    linkClassName="flex-1 text-center rounded-xl border border-[#F27F25] text-[#F27F25] hover:bg-orange-50 text-xs font-bold py-2.5 transition-colors"
                  />
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="mb-12" id="compare">
        <h2 className="text-2xl font-bold text-navy tracking-tight mb-5">Deel modules side by side</h2>
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0f1f3d] text-white">
                  {data.table.headers.map((h) => (
                    <th key={h} className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.table.rows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {row.cells.map((cell, j) => (
                      <td key={j} className={`py-3 px-4 ${j === 0 ? 'font-semibold text-navy' : 'text-gray-700'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Why Deel ── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-navy tracking-tight mb-5">Why teams choose Deel</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: Globe, title: '150+ countries', desc: 'Hire employees and contractors anywhere without setting up local legal entities. Deel handles compliance in every market.', color: 'text-blue-600 bg-blue-50 border-blue-200' },
            { icon: Shield, title: 'Built-in compliance', desc: 'Local employment contracts, tax filings, benefits, and IP protection are automated per country. No legal team required.', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
            { icon: Zap, title: 'Fast onboarding', desc: 'Onboard a new international employee in days, not months. Contractors can be paid within 24 hours of signing.', color: 'text-purple-600 bg-purple-50 border-purple-200' },
          ].map((item) => (
            <article key={item.title} className={`rounded-2xl border p-5 ${item.color}`}>
              <item.icon className="w-6 h-6 mb-3" />
              <h3 className="font-bold text-navy mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Integrations ── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-navy tracking-tight mb-2">Integrations</h2>
        <p className="text-gray-500 text-sm mb-5">Deel connects with 50+ tools across accounting, HRIS, and ATS platforms.</p>
        <div className="flex flex-wrap gap-2">
          {INTEGRATIONS.map((name) => (
            <span key={name} className="rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm text-gray-700 font-medium">
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="mb-12" id="faqs">
        <h2 className="text-2xl font-bold text-navy tracking-tight mb-5">Frequently asked questions</h2>
        <div className="space-y-4">
          {data.faqs.map((faq) => (
            <article key={faq.question} className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="font-semibold text-navy mb-2">{faq.question}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f1f3d 0%, #1d4ed8 60%, #06b6d4 100%)' }}>
        <div className="px-8 py-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Ready to hire globally with Deel?</h2>
          <p className="text-white/75 mb-6 max-w-xl mx-auto">
            Get a custom quote based on your team size and countries. Compare Deel with other payroll platforms before deciding.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://www.deel.com/partners/affiliates/?pscd=get.deel.com&ps_partner_key=NWMzOGRkZGJmN2Zj&ps_xid=YgVSyo36Kc3Aim&gsxid=YgVSyo36Kc3Aim&gspk=NWMzOGRkZGJmN2Zj"
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="rounded-xl bg-white text-[#1d4ed8] font-bold px-6 py-3 text-sm hover:bg-blue-50 transition-colors"
            >
              Get Deel Quote →
            </a>
            <Link
              href="/human-resources/best-payroll-software/get-free-quotes"
              className="rounded-xl bg-white/15 border border-white/30 text-white font-semibold px-6 py-3 text-sm hover:bg-white/25 transition-colors"
            >
              Compare All Payroll Tools
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
