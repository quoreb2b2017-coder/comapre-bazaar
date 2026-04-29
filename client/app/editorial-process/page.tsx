import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata: Metadata = buildMetadata({
  title: 'Our Editorial Process & Review Methodology | Compare Bazaar',
  description:
    'How Compare Bazaar independently tests and ranks business software — our 12-point scoring framework, team credentials, and independence commitment.',
  canonical: '/editorial-process',
})

const CRITERIA = [
  { title: 'Pricing & value', body: 'Starting price, price per user at 10/50/100 seats, hidden fees, and free trial availability.' },
  { title: 'Ease of use', body: 'Time-to-first-value in our hands-on test, UI clarity score, onboarding quality.' },
  { title: 'Core features', body: 'Whether the platform delivers on its primary category promise — e.g., pipeline management for a CRM.' },
  { title: 'Advanced features', body: 'Power-user capabilities: automation depth, reporting flexibility, AI features.' },
  { title: 'Customer support', body: 'Support channels, hours, response times tested directly by our team.' },
  { title: 'Integration ecosystem', body: 'Number and quality of native integrations with tools businesses actually use.' },
  { title: 'Mobile experience', body: 'iOS and Android app quality and feature parity with desktop.' },
  { title: 'Scalability', body: 'Whether the platform grows with you — pricing cliffs, feature limitations at scale.' },
  { title: 'Security & compliance', body: 'SOC 2, GDPR, SSO, role-based access, audit logs.' },
  { title: 'User reviews', body: 'Aggregated ratings from verified users on G2 and Capterra, weighted for recency.' },
  { title: 'Vendor transparency', body: 'Pricing clarity, honest trial terms, no dark patterns in onboarding.' },
  { title: 'Editorial consensus', body: "Agreement across our team's independent test scores before publishing." },
]

const TEAM = [
  { initials: 'SK', name: 'Sarah Kim', role: 'CRM & Sales Tech Editor', exp: 'Former Salesforce consultant · 9 yrs' },
  { initials: 'MR', name: 'Marcus Rivera', role: 'Payroll & HR Software Lead', exp: 'ex-ADP implementation · 11 yrs' },
  { initials: 'PW', name: 'Priya Winters', role: 'Marketing Tech Reviewer', exp: 'B2B SaaS marketing · 7 yrs' },
  { initials: 'JL', name: 'James Liu', role: 'Business Technology Editor', exp: 'IT procurement specialist · 8 yrs' },
]

export default function EditorialProcessPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb
        items={[{ label: 'Home', href: '/' }, { label: 'Editorial Process' }]}
        className="mb-6"
      />

      <h1 className="text-3xl sm:text-4xl lg:text-[40px] text-navy tracking-tight mb-4">
        Our editorial process &amp; review methodology
      </h1>
      <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-2xl">
        Every comparison on Compare Bazaar is produced by subject-matter experts who test software
        hands-on and score it against a published, 12-point framework. Here is exactly how we work.
      </p>

      <div className="prose-editorial">

        <h2>Our independence commitment</h2>
        <p>
          Compare Bazaar earns revenue through affiliate commissions when readers purchase software
          through our links, and through clearly labelled &ldquo;Featured Partner&rdquo; placements.
          Neither influences our editorial rankings. Vendors cannot pay to improve their position in
          our comparison tables. Sponsored placements are always marked &ldquo;Advertisement&rdquo;
          and appear separately from editorial content.
        </p>
        <p>
          Our editorial team operates independently of our commercial team. No reviewer sees
          affiliate commission data for the products they review.
        </p>

        <h2>Our 12-point scoring criteria</h2>
        <p>
          Each platform is independently scored by at least one subject-matter expert across these
          criteria. Scores are normalised to a 5-point scale and weighted based on category
          importance.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 not-prose">
          {CRITERIA.map(({ title, body }, i) => (
            <div key={title} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="font-serif text-3xl text-brand leading-none mb-2">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h4 className="font-semibold text-navy text-sm mb-1">{title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <h2>Our testing process</h2>

        <h3>1. Account creation and initial setup</h3>
        <p>
          Our reviewer creates a real account using our own business details — no vendor demo
          accounts. We document time-to-setup and any friction in the onboarding process.
        </p>

        <h3>2. Hands-on feature testing</h3>
        <p>
          We follow a structured test protocol for each category. For CRMs: we import a 500-contact
          list, build a pipeline, run an automation, and test reporting. For payroll tools: we run a
          complete payroll cycle including a mix of employees and contractors. All protocols are
          documented and version-controlled.
        </p>

        <h3>3. Pricing verification</h3>
        <p>
          We verify all pricing directly with vendors via their website, live chat, or sales call.
          We note the date pricing was confirmed and flag any discrepancies from published rates.
          Pricing is re-verified every 90 days.
        </p>

        <h3>4. Independent scoring</h3>
        <p>
          The reviewing editor scores each criterion independently before any discussion with the
          editorial lead. Scores are then reviewed for consistency against our rubric.
        </p>

        <h3>5. Cross-referencing with verified user reviews</h3>
        <p>
          We aggregate ratings from verified-user review platforms to cross-check our scores, with
          heavier weighting on reviews from the past 12 months.
        </p>

        <h2>Update policy</h2>
        <p>
          High-traffic comparison pages are reviewed and updated at least every 90 days. If a vendor
          makes major pricing, feature, or policy changes, we update the relevant page within 5
          business days. Every page displays a &ldquo;Last reviewed&rdquo; date.
        </p>

        <h2>Our editorial team</h2>
        <p>All reviews are written and edited by named experts with verifiable professional experience.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 mb-10">
        {TEAM.map(({ initials, name, role, exp }) => (
          <div key={name} className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-brand font-semibold mx-auto mb-2" aria-hidden="true">
              {initials}
            </div>
            <p className="font-semibold text-navy text-sm">{name}</p>
            <p className="text-xs text-brand mt-0.5">{role}</p>
            <p className="text-xs text-gray-400 mt-1">{exp}</p>
          </div>
        ))}
      </div>

      <div className="prose-editorial">
        <h2>Corrections policy</h2>
        <p>
          If you believe any information on Compare Bazaar is inaccurate, please{' '}
          <Link href="/contact">contact our editorial team</Link> with supporting evidence. We
          investigate and correct factual errors within 48 hours.
        </p>
      </div>
    </div>
  )
}
