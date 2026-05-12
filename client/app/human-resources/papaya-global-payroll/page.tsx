import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, XCircle, Globe, Shield, Zap, BarChart3, Star } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { getComparisonPageBySlug } from '@/data/comparisons'

export const metadata: Metadata = buildMetadata({
  title: 'Papaya Global HR & Payroll Software Review (2026) | Compare Bazaar',
  description:
    'Papaya Global is a leading enterprise global payroll and workforce management platform. Hire and pay in 160+ countries with automated compliance, EOR, and real-time workforce analytics.',
  canonical: '/human-resources/papaya-global-payroll',
})

const data = getComparisonPageBySlug('papaya-global-payroll')!

const MODULES = [
  { id: 'papaya-global-payroll', color: 'from-[#1e1b4b] to-[#4f46e5]', icon: Globe, highlight: 'Global Payroll' },
  { id: 'papaya-eor', color: 'from-[#064e3b] to-[#059669]', icon: Shield, highlight: 'Employer of Record' },
  { id: 'papaya-contractor', color: 'from-[#7c2d12] to-[#ea580c]', icon: Zap, highlight: 'Contractor Management' },
  { id: 'papaya-workforce', color: 'from-[#0c4a6e] to-[#0284c7]', icon: BarChart3, highlight: 'Workforce OS' },
]

const STATS = [
  { label: 'Countries covered', value: '160+' },
  { label: 'Enterprise clients', value: '700+' },
  { label: 'Expert score', value: '4.6/5' },
  { label: 'User reviews', value: '5,800+' },
]

const INTEGRATIONS = [
  'SAP', 'Workday', 'Oracle HCM', 'NetSuite',
  'BambooHR', 'Greenhouse', 'Lever', 'ADP',
  'QuickBooks', 'Xero', 'Slack', 'Okta',
]

const WHY = [
  { icon: Globe, title: '160+ countries', desc: 'Run payroll and hire employees or contractors in more countries than almost any other platform, with automated local compliance in every market.', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  { icon: BarChart3, title: 'Workforce intelligence', desc: 'Real-time global labor cost analytics, headcount planning, and CFO-level reporting — built into the same platform as payroll.', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { icon: Shield, title: 'Enterprise compliance', desc: 'Automated compliance engine updates with local law changes. Dedicated compliance specialists per country for regulated industries.', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
]

export default function PapayaGlobalPayrollPage() {
  const products = data.products

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumb items={data.breadcrumbs} className="mb-6" />

      {/* ── Hero ── */}
      <div className="rounded-3xl overflow-hidden mb-10"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 55%, #0ea5e9 100%)' }}>
        <div className="relative px-8 py-12 sm:px-12">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full border border-white/10 -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-20 h-32 w-32 rounded-full border border-white/10" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="rounded-full bg-white/15 border border-white/25 px-3 py-1 text-xs font-semibold text-white">Global HR & Payroll</span>
              <span className="rounded-full bg-indigo-400/20 border border-indigo-400/40 px-3 py-1 text-xs font-semibold text-indigo-200">🏆 #1 Enterprise Global Payroll 2026</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3">
              Papaya Global
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mb-6">
              The enterprise global payroll and workforce management platform. Automate payroll, EOR, and compliance in 160+ countries with real-time workforce analytics.
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
                href="https://www.papayaglobal.com/schedule-a-demo-partners/?pscd=get.papayaglobal.com&ps_partner_key=NWMzOGRkZGJmN2Zj&ps_xid=iQqEHkZ75A3aju&gsxid=iQqEHkZ75A3aju&gspk=NWMzOGRkZGJmN2Zj"
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
      <section className="mb-12" id="picks">
        <h2 className="text-2xl font-bold text-navy tracking-tight mb-2">Papaya Global product modules</h2>
        <p className="text-gray-500 text-sm mb-6">Each module addresses a specific global workforce challenge. Enterprise teams typically use all four together.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {products.map((product) => {
            const meta = MODULES.find((m) => m.id === product.id)
            const Icon = meta?.icon ?? Globe
            return (
              <article
                key={product.id}
                id={product.id}
                className="rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-shadow"
              >
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

                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-[#F27F25] fill-[#F27F25]" />
                    <span className="font-bold text-navy">{product.score}/5</span>
                    <span className="text-xs text-gray-400">({product.reviewCount.toLocaleString()} reviews)</span>
                  </div>
                  <span className="text-sm font-bold text-navy">{product.pricingAmount}</span>
                </div>

                <div className="px-5 py-4 grid grid-cols-2 gap-4">
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
                      {product.cons.map((con) => (
                        <li key={con} className="flex gap-2 text-xs text-gray-600">
                          <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="px-5 pb-4 flex gap-2">
                  <a
                    href={product.vendorUrl}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="flex-1 text-center rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold py-2.5 transition-colors"
                  >
                    Visit Papaya →
                  </a>
                  <Link
                    href={`/reviews/${product.reviewSlug}`}
                    className="flex-1 text-center rounded-xl border border-[#4f46e5] text-[#4f46e5] hover:bg-indigo-50 text-xs font-bold py-2.5 transition-colors"
                  >
                    Full Review
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="mb-12" id="compare">
        <h2 className="text-2xl font-bold text-navy tracking-tight mb-5">Papaya modules side by side</h2>
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1e1b4b] text-white">
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

      {/* ── Why Papaya ── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-navy tracking-tight mb-5">Why enterprises choose Papaya Global</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {WHY.map((item) => (
            <article key={item.title} className={`rounded-2xl border p-5 ${item.color}`}>
              <item.icon className="w-6 h-6 mb-3" />
              <h3 className="font-bold text-navy mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Papaya vs Deel ── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-navy tracking-tight mb-5">Papaya Global vs Deel</h2>
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-700">
                  <th className="text-left py-3 px-4 font-semibold">Feature</th>
                  <th className="text-left py-3 px-4 font-semibold text-indigo-700">Papaya Global</th>
                  <th className="text-left py-3 px-4 font-semibold text-blue-700">Deel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ['Countries', '160+', '150+'],
                  ['Best for', 'Enterprise (50+ employees)', 'Startups & scale-ups'],
                  ['Workforce analytics', '✓ Deep CFO-level', 'Basic'],
                  ['ERP integrations', 'SAP, Oracle, Workday', 'QuickBooks, Xero'],
                  ['Free HRIS', '✗', '✓ Free for all'],
                  ['Pricing model', 'Custom enterprise quote', 'Transparent + custom'],
                  ['Setup speed', 'Longer (enterprise config)', 'Faster (self-serve)'],
                ].map(([feature, papaya, deel], i) => (
                  <tr key={feature} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-3 px-4 font-medium text-gray-700">{feature}</td>
                    <td className="py-3 px-4 text-indigo-700 font-medium">{papaya}</td>
                    <td className="py-3 px-4 text-blue-700">{deel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Integrations ── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-navy tracking-tight mb-2">Enterprise integrations</h2>
        <p className="text-gray-500 text-sm mb-5">Papaya Global connects with leading ERP, HRIS, and ATS platforms used by enterprise teams.</p>
        <div className="flex flex-wrap gap-2">
          {INTEGRATIONS.map((name) => (
            <span key={name} className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm text-indigo-700 font-medium">
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
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 60%, #0ea5e9 100%)' }}>
        <div className="px-8 py-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Ready to automate global payroll with Papaya?</h2>
          <p className="text-white/75 mb-6 max-w-xl mx-auto">
            Get a custom enterprise quote based on your headcount and countries. Compare Papaya with other global payroll platforms before deciding.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://www.papayaglobal.com/schedule-a-demo-partners/?pscd=get.papayaglobal.com&ps_partner_key=NWMzOGRkZGJmN2Zj&ps_xid=iQqEHkZ75A3aju&gsxid=iQqEHkZ75A3aju&gspk=NWMzOGRkZGJmN2Zj"
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
