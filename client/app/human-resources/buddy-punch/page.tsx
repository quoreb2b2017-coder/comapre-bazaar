import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, XCircle, Clock, MapPin, DollarSign, Calendar, Star, Shield } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata: Metadata = buildMetadata({
  title: 'Buddy Punch Review (2026) — Time Tracking & Payroll',
  description:
    'Buddy Punch is the best time tracking and payroll platform for small businesses. GPS clock-in, scheduling, PTO management, and US payroll in one tool. 14-day free trial.',
  canonical: '/human-resources/buddy-punch',
})

const AFFILIATE_URL = 'https://buddypunch.com/?utm_medium=referral&utm_source=growsumo&utm_content=5c38dddbf7fc&utm_campaign=affiliate&pscd=try.buddypunch.com&ps_partner_key=NWMzOGRkZGJmN2Zj&ps_xid=tpuDCq8PiZfjny&gsxid=tpuDCq8PiZfjny&gspk=NWMzOGRkZGJmN2Zj'

const STATS = [
  { label: 'Starting price', value: '$4.49', sub: '/user/month' },
  { label: 'Free trial', value: '14 days', sub: 'No credit card' },
  { label: 'Expert score', value: '4.4/5', sub: '3,120+ reviews' },
  { label: 'Best for', value: 'SMBs', sub: 'Time tracking + payroll' },
]

const FEATURES = [
  {
    icon: Clock,
    title: 'Time Tracking',
    desc: 'Web, mobile, and kiosk clock-in with GPS verification, facial recognition, and IP restrictions to prevent buddy punching.',
    color: 'bg-violet-50 border-violet-200 text-violet-600',
  },
  {
    icon: MapPin,
    title: 'GPS Clock-In',
    desc: 'Track employee locations when they clock in and out. Set geofences to ensure staff are on-site before punching.',
    color: 'bg-blue-50 border-blue-200 text-blue-600',
  },
  {
    icon: DollarSign,
    title: 'Built-in Payroll',
    desc: 'Run US payroll directly from time tracking data. Automatic tax calculations, filings, and direct deposit included.',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-600',
  },
  {
    icon: Calendar,
    title: 'Scheduling & PTO',
    desc: 'Build employee schedules, manage shift swaps, and automate PTO accruals and approval workflows in one place.',
    color: 'bg-orange-50 border-orange-200 text-orange-600',
  },
]

const PROS = [
  'Simple time tracking with GPS and facial recognition',
  'Built-in payroll processing with automatic tax filing',
  'Easy scheduling and PTO management in one platform',
  'Clean mobile app for remote and field teams',
  'Transparent per-user pricing with no hidden fees',
]

const CONS = [
  'Best suited for small to mid-size teams',
  'Advanced reporting requires higher plan',
  'Payroll available in US only',
]

const PRICING = [
  {
    name: 'Starter',
    price: '$4.49',
    period: '/user/month',
    features: ['Time tracking', 'GPS clock-in', 'Basic reporting', 'Mobile app'],
    cta: 'Start Free Trial',
  },
  {
    name: 'Pro',
    price: '$5.99',
    period: '/user/month',
    features: ['Everything in Starter', 'Scheduling', 'PTO management', 'Integrations'],
    cta: 'Start Free Trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: '$10.99',
    period: '/user/month',
    features: ['Everything in Pro', 'Built-in payroll', 'Advanced reporting', 'Priority support'],
    cta: 'Start Free Trial',
  },
]

const SCORECARD = [
  { metric: 'Ease of use', score: 9.1 },
  { metric: 'Time tracking accuracy', score: 8.9 },
  { metric: 'Payroll automation', score: 8.4 },
  { metric: 'Mobile experience', score: 8.8 },
  { metric: 'Value for money', score: 9.0 },
]

export default function BuddyPunchPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'HR Software', href: '/human-resources' },
          { label: 'Buddy Punch Review' },
        ]}
        className="mb-6"
      />

      {/* ── Hero ── */}
      <div
        className="rounded-3xl overflow-hidden mb-10"
        style={{ background: 'linear-gradient(135deg, #2e1065 0%, #7c3aed 55%, #a855f7 100%)' }}
      >
        <div className="relative px-8 py-12 sm:px-12">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full border border-white/10 -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-20 h-32 w-32 rounded-full border border-white/10" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="rounded-full bg-white/15 border border-white/25 px-3 py-1 text-xs font-semibold text-white">Time Tracking & Payroll</span>
              <span className="rounded-full bg-yellow-400/20 border border-yellow-400/40 px-3 py-1 text-xs font-semibold text-yellow-200">⭐ 4.4/5 Expert Score</span>
              <span className="rounded-full bg-emerald-400/20 border border-emerald-400/40 px-3 py-1 text-xs font-semibold text-emerald-200">14-Day Free Trial</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3">
              Buddy Punch
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mb-6">
              The all-in-one time tracking and payroll platform for small businesses. GPS clock-in, scheduling, PTO management, and US payroll — starting at $4.49/user/month.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-center">
                  <p className="text-xl font-bold text-white">{s.value}<span className="text-sm font-normal text-white/70">{s.sub}</span></p>
                  <p className="text-xs text-white/60">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={AFFILIATE_URL}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="rounded-xl bg-white text-violet-700 font-bold px-6 py-3 text-sm hover:bg-violet-50 transition-colors"
              >
                Start Free Trial →
              </a>
              <Link
                href="/human-resources/best-payroll-software/get-free-quotes"
                className="rounded-xl bg-white/15 border border-white/30 text-white font-semibold px-6 py-3 text-sm hover:bg-white/25 transition-colors"
              >
                Compare Payroll Tools
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-navy tracking-tight mb-2">What Buddy Punch does</h2>
        <p className="text-gray-500 text-sm mb-6">Four core modules that work together in one platform.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FEATURES.map((f) => (
            <article key={f.title} className={`rounded-2xl border p-5 ${f.color}`}>
              <f.icon className="w-6 h-6 mb-3" />
              <h3 className="font-bold text-navy mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Pros / Cons ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
        <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <h2 className="text-lg font-bold text-emerald-900 mb-3">Pros</h2>
          <ul className="space-y-2">
            {PROS.map((p) => (
              <li key={p} className="flex gap-2 text-sm text-emerald-900/90">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
          <h2 className="text-lg font-bold text-rose-900 mb-3">Cons</h2>
          <ul className="space-y-2">
            {CONS.map((c) => (
              <li key={c} className="flex gap-2 text-sm text-rose-900/90">
                <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </article>
      </section>

      {/* ── Scorecard ── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-navy tracking-tight mb-5">Expert scorecard</h2>
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full bg-violet-600 text-white text-2xl font-bold flex items-center justify-center shadow-lg">
              4.4
            </div>
            <div>
              <p className="font-bold text-navy text-lg">Overall Score</p>
              <div className="flex items-center gap-1 mt-1">
                {[1,2,3,4].map((i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 opacity-50" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Based on 3,120+ user reviews</p>
            </div>
          </div>
          <div className="space-y-4">
            {SCORECARD.map((item) => (
              <div key={item.metric}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{item.metric}</span>
                  <span className="font-semibold text-navy">{item.score}/10</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-violet-500"
                    style={{ width: `${item.score * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-navy tracking-tight mb-2">Pricing plans</h2>
        <p className="text-gray-500 text-sm mb-6">All plans include a 14-day free trial. No credit card required.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRICING.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-2xl border p-5 flex flex-col ${plan.highlight ? 'border-violet-400 bg-violet-50 shadow-lg' : 'border-gray-200 bg-white'}`}
            >
              {plan.highlight && (
                <span className="self-start rounded-full bg-violet-600 text-white text-xs font-bold px-3 py-1 mb-3">Most Popular</span>
              )}
              <h3 className="font-bold text-navy text-lg">{plan.name}</h3>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-bold text-navy">{plan.price}</span>
                <span className="text-sm text-gray-500">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={AFFILIATE_URL}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className={`block text-center rounded-xl font-bold text-sm py-2.5 transition-colors ${plan.highlight ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'border border-violet-600 text-violet-600 hover:bg-violet-50'}`}
              >
                {plan.cta}
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* ── Quick Verdict ── */}
      <section className="rounded-2xl border border-violet-200 bg-violet-50 p-6 mb-12">
        <div className="flex items-start gap-3 mb-3">
          <Shield className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
          <h2 className="text-xl font-bold text-navy">Quick Verdict</h2>
        </div>
        <div className="space-y-2">
          {[
            'Buddy Punch is one of the best time tracking and payroll tools for small businesses that need GPS clock-in, scheduling, and payroll in one affordable platform.',
            'The 14-day free trial lets you test all features before committing. Setup is fast — most teams are live within a day.',
            'At $4.49/user/month entry pricing, it delivers strong value for field teams, remote workers, and SMBs that want to eliminate manual timesheets.',
          ].map((point) => (
            <p key={point} className="flex gap-2 text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
              {point}
            </p>
          ))}
        </div>
      </section>

      {/* ── Best For / Not Ideal ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
        <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <h3 className="font-bold text-emerald-900 mb-3">Best For</h3>
          <ul className="space-y-2 text-sm text-emerald-900/90">
            {['Small businesses needing time tracking + payroll in one tool', 'Field and remote teams using GPS clock-in', 'Managers wanting simple scheduling and PTO management'].map((i) => (
              <li key={i} className="flex gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />{i}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="font-bold text-amber-900 mb-3">Not Ideal For</h3>
          <ul className="space-y-2 text-sm text-amber-900/90">
            {['Enterprises needing complex multi-country payroll', 'Teams outside the US needing payroll processing', 'Organizations needing deep HRIS workflow automation'].map((i) => (
              <li key={i} className="flex gap-2"><XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />{i}</li>
            ))}
          </ul>
        </article>
      </section>

      {/* ── FAQ ── */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-navy tracking-tight mb-5">Frequently asked questions</h2>
        <div className="space-y-4">
          {[
            { q: 'Does Buddy Punch include payroll?', a: 'Yes. Buddy Punch offers built-in US payroll processing with automatic tax filing as an add-on to the time tracking platform.' },
            { q: 'Is Buddy Punch good for remote teams?', a: 'Yes. The GPS clock-in, facial recognition, and mobile app make it a strong fit for remote and field teams that need accurate time tracking.' },
            { q: 'How much does Buddy Punch cost?', a: 'Plans start at $4.49/user/month for basic time tracking. The Pro plan with scheduling and PTO is $5.99/user/month. Payroll is available on the Enterprise plan at $10.99/user/month.' },
            { q: 'Does Buddy Punch have a free trial?', a: 'Yes. Buddy Punch offers a 14-day free trial with no credit card required. All features are available during the trial.' },
          ].map((faq) => (
            <article key={faq.q} className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="font-semibold text-navy mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2e1065 0%, #7c3aed 60%, #a855f7 100%)' }}
      >
        <div className="px-8 py-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Try Buddy Punch free for 14 days</h2>
          <p className="text-white/75 mb-6 max-w-xl mx-auto">
            No credit card required. Set up time tracking, scheduling, and payroll for your team in minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={AFFILIATE_URL}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="rounded-xl bg-white text-violet-700 font-bold px-6 py-3 text-sm hover:bg-violet-50 transition-colors"
            >
              Start Free Trial →
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
