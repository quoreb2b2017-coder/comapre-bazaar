export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, Globe, Shield, Star, XCircle } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { remoteOutboundUrl, REMOTE_GET_FREE_QUOTES_URL } from '@/lib/vendorOutboundUrls'

export const metadata: Metadata = buildMetadata({
  title: 'Remote Payroll Review 2026: Pricing, Pros, Cons & Comparison',
  description:
    'Remote payroll review for 2026: Global Payroll from $29/employee/mo, EOR $599, 100% owned entities in 90+ countries, no upfront deposits. Compared vs Deel, OnPay, and Gusto.',
  canonical: '/human-resources/remote-payroll',
})

const PRICING_ROWS = [
  ['HR Management', 'Free', 'Up to 12 direct employees, includes time off and time tracking'],
  ['Global Payroll', '$29/employee/mo', 'Plus quote-based implementation fee and recurring delivery fee'],
  ['Employer of Record', '$599/employee/mo', 'Annual billing (save 14%); $699 on monthly billing'],
  ['Contractor Management', '$29/contractor/mo', 'Plus tier at $99; Contractor of Record from $325'],
]

const DEEL_COMPARE = [
  ['EOR price (annual)', '$599/employee/mo', '$599/employee/mo'],
  ['Contractor management', '$29/contractor/mo', '$49/contractor/mo'],
  ['EOR coverage', '90+ countries', '150+ countries'],
  ['Entity model', '100% owned', 'Mix of owned and partner entities'],
  ['Deposits', 'None upfront', 'Quoted by country'],
]

const FAQS = [
  {
    q: 'How much does Remote payroll cost in 2026?',
    a: 'Global Payroll is $29 per employee per month plus quote-based implementation and delivery fees. EOR is $599 per employee per month on annual billing or $699 monthly. Contractor management is $29 per contractor per month, and the HR platform is free for up to 12 direct employees.',
  },
  {
    q: 'Does Remote require a deposit?',
    a: 'No upfront deposits are required for EOR hires. Remote collects reserve payments only in rare, high-risk circumstances, while competitors like Deel quote security deposits by country.',
  },
  {
    q: 'Is Remote cheaper than Deel?',
    a: 'On EOR the list prices match at $599. Remote is cheaper on contractors at $29 versus $49 and requires no deposits, while Deel offers broader country coverage.',
  },
  {
    q: 'Does Remote handle US payroll taxes?',
    a: 'Yes, Remote handles withholding and filings in every country where it runs payroll, including the US, though US-only teams will find better value in domestic-first platforms.',
  },
  {
    q: "What is Remote's startup discount?",
    a: 'Eligible early-stage startups get 15% off annual EOR and contractor plans for 12 months. Confirm current eligibility directly with Remote, as terms change over time.',
  },
]

const BEST_FOR = [
  'Companies hiring full-time employees in countries where they hold no legal entity',
  'Teams of 10 to 100 people spread across multiple jurisdictions',
  'Startups granting equity to international employees and contractors',
  'Finance teams that want deposit-free EOR to protect working capital',
]

const NOT_IDEAL = [
  'US-only businesses, where OnPay and Gusto deliver more for less',
  "Companies hiring in markets outside Remote's 90+ EOR countries",
  'Teams scaling past 100 employees that need enterprise payroll consolidation',
]

const FEATURES = [
  {
    title: 'Global Payroll',
    body: 'Run payroll across every country where you hold entities from a single dashboard, with local tax withholding, statutory filings, and employee payslip self-service handled per jurisdiction.',
  },
  {
    title: 'Employer of Record',
    body: 'Remote becomes the legal employer for hires in 90+ countries where you have no entity, covering compliant contracts, local payroll, benefits administration, and IP protection in the flat fee. Onboarding typically takes 3 to 5 business days.',
  },
  {
    title: 'Owned entities',
    body: "Remote directly owns all of its legal entities worldwide. There is no third-party partner between you and your employee's compliance chain, which means a cleaner audit trail, no risk of a partner entity failing, and consistent employment terms across countries.",
  },
  {
    title: 'No upfront deposits',
    body: 'Most EOR providers quote security deposits by country. Remote requires none, collecting reserve payments only in rare, high-risk circumstances. For a 10-person international team, that difference can keep six figures of working capital free.',
  },
  {
    title: 'Contractor Management',
    body: 'Compliant contracts and payments across 200+ jurisdictions at $29 per contractor per month, with a Fair Price Guarantee so you only pay for contractors actively working. Contractor of Record shifts classification risk to Remote from $325 per month.',
  },
  {
    title: 'Equity administration',
    body: 'Remote handles global stock option and equity grant administration end to end, a genuine differentiator for startups compensating international hires with equity.',
  },
]

export default function RemotePayrollPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'HR Software', href: '/human-resources' },
          { label: 'Best Payroll Software', href: '/human-resources/best-payroll-software' },
          { label: 'Remote Payroll Review' },
        ]}
        className="mb-6"
      />

      <article className="prose prose-gray max-w-none prose-headings:font-serif prose-headings:text-navy prose-a:text-brand">
        <header className="not-prose mb-10 rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-sm">
          <div
            className="px-6 py-10 sm:px-10"
            style={{ background: 'linear-gradient(135deg, #0B2A6F 0%, #5B21B6 55%, #7C3AED 100%)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-2">
              Payroll Software Review · July 7, 2026
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
              Remote Payroll Review 2026: Pricing, Pros, Cons, and How It Compares
            </h1>
            <p className="text-white/85 text-sm sm:text-base mb-4">
              Last verified: July 7, 2026 · Reviewed by Marcus Williams, Payroll &amp; HR Software Analyst
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/25 px-3 py-1 text-sm font-semibold text-white">
                <Star className="w-4 h-4 fill-[#F58220] text-[#F58220]" />
                Our score: 4.5/5
              </span>
              <span className="rounded-full bg-[#F58220]/20 border border-[#F58220]/40 px-3 py-1 text-xs font-semibold text-orange-100">
                Best for global payroll with 100% owned entities
              </span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={remoteOutboundUrl({ content: 'review-hero' })}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="rounded-xl bg-[#F58220] hover:bg-[#e67412] text-white font-bold px-6 py-3 text-sm transition-colors"
              >
                Visit Remote →
              </a>
              <a
                href={REMOTE_GET_FREE_QUOTES_URL}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="rounded-xl bg-white/15 border border-white/30 text-white font-semibold px-6 py-3 text-sm hover:bg-white/25 transition-colors"
              >
                Get Free Quotes from Remote
              </a>
            </div>
          </div>
        </header>

        <h2>Quick Verdict</h2>
        <p>
          Remote is the strongest choice on our list for companies paying people in more than one country. Global Payroll runs $29 per employee per month, Employer of Record is $599 per employee per month on annual billing, and contractor management is $29 per contractor per month, all published openly on Remote&apos;s pricing page.
        </p>
        <p>
          What separates Remote from Deel and Papaya Global is structure rather than price. Remote owns 100% of its legal entities in 90+ countries and never relies on third-party partners to employ workers, and it requires no upfront deposits for EOR hires. The trade-offs: narrower country coverage than Deel, quote-based implementation and delivery fees on the Payroll product, and a value proposition that mostly disappears if your entire team is in the US.
        </p>
        <p>
          <strong>Bottom line:</strong> Choose Remote if you are hiring internationally and want clean compliance with predictable, deposit-free pricing. Choose OnPay or Gusto if your payroll is US-only.
        </p>

        <h2>What Is Remote?</h2>
        <p>
          Remote (Remote Technology, Inc.) was founded in 2019 and has grown into one of the three leading global employment platforms alongside Deel and Papaya Global. It serves over 400,000 clients and operates subsidiaries in more than 100 countries.
        </p>
        <p>
          The platform covers five connected products: a free HR management system, Global Payroll for companies with their own foreign entities, Employer of Record for hiring where you have no entity, Contractor Management, and global equity administration. Unlike most competitors, every product runs on legal infrastructure Remote owns outright.
        </p>

        <h2>Remote Pricing in 2026</h2>
        <p>Remote publishes its core pricing openly, which remains rare in the global payroll segment.</p>

        <div className="not-prose my-6 overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">Product</th>
                <th className="text-left py-3 px-4 font-semibold">Price</th>
                <th className="text-left py-3 px-4 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {PRICING_ROWS.map(([product, price, notes]) => (
                <tr key={product}>
                  <td className="py-3 px-4 font-medium text-navy">{product}</td>
                  <td className="py-3 px-4 text-gray-800 whitespace-nowrap">{price}</td>
                  <td className="py-3 px-4 text-gray-600">{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          <strong>Costs to budget beyond the headline rates:</strong> The $29 Global Payroll price excludes a one-time implementation fee to set up your entities and a recurring payroll delivery fee, both quote-based. FX conversion on cross-border payroll carries a spread of roughly 0.5 to 1% above mid-market rates, which is among the best in the industry but still adds $2,500 to $5,000 per year on $500K of international payroll. Supplemental benefits and visa support are priced separately.
        </p>
        <p>
          <strong>Discounts:</strong> Eligible early-stage startups get 15% off annual EOR and contractor plans for the first 12 months, bringing effective EOR pricing to roughly $509 per employee per month. Social purpose organizations qualify for a similar offer.
        </p>

        <h2>Key Features</h2>
        <div className="not-prose grid gap-4 sm:grid-cols-2 my-6">
          {FEATURES.map((item) => (
            <article key={item.title} className="rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="font-semibold text-navy text-sm mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
            </article>
          ))}
        </div>

        <h2>Remote vs Deel</h2>
        <p>Both list EOR at $599 per employee per month on annual billing, so the decision comes down to structure.</p>
        <div className="not-prose my-6 overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-semibold w-1/3" />
                <th className="text-left py-3 px-4 font-semibold text-violet-700">Remote</th>
                <th className="text-left py-3 px-4 font-semibold text-blue-700">Deel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {DEEL_COMPARE.map(([label, remote, deel]) => (
                <tr key={label}>
                  <td className="py-3 px-4 font-medium text-gray-700">{label}</td>
                  <td className="py-3 px-4 text-gray-800">{remote}</td>
                  <td className="py-3 px-4 text-gray-800">{deel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Remote wins on contractor cost, deposit policy, and compliance chain purity. Deel wins on raw coverage and a deeper add-on ecosystem. If your target markets fall inside Remote&apos;s 90+ EOR countries, Remote is the more capital-efficient pick.
        </p>

        <h2>Remote vs OnPay and Gusto</h2>
        <p>
          This comparison is simpler: if your team is entirely in the US, do not pay for global infrastructure. OnPay at $40 base plus $6 per person and Gusto from $49 plus $6 per person both handle multi-state US payroll, tax filing, and benefits for a fraction of the cost. Remote earns its price only when borders enter the picture.
        </p>

        <h2>Who Should Use Remote</h2>
        <ul className="not-prose space-y-2 my-4">
          {BEST_FOR.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>

        <h2>Who Should Look Elsewhere</h2>
        <ul className="not-prose space-y-2 my-4">
          {NOT_IDEAL.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-gray-700">
              <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>

        <h2>Frequently Asked Questions</h2>
        <div className="not-prose space-y-4 my-6">
          {FAQS.map((faq) => (
            <article key={faq.q} className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="font-semibold text-navy mb-2 text-base">{faq.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
            </article>
          ))}
        </div>

        <p className="text-sm text-gray-500 border-t border-gray-200 pt-6 not-prose">
          Pricing verified July 7, 2026 from{' '}
          <a
            href={remoteOutboundUrl({ path: '/pricing', content: 'pricing-citation' })}
            target="_blank"
            rel="sponsored noopener noreferrer"
          >
            remote.com/pricing
          </a>
          . Employer costs, salary, taxes, and currency conversion are excluded from listed platform fees. Compare Bazaar may earn a commission when you purchase through links on this page. This does not affect our scores or rankings.
        </p>
      </article>

      <section
        className="not-prose mt-12 rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0B2A6F 0%, #5B21B6 60%, #7C3AED 100%)' }}
      >
        <div className="px-8 py-10 text-center">
          <Globe className="w-8 h-8 text-white/80 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white mb-2">Ready to run global payroll with Remote?</h2>
          <p className="text-white/75 mb-6 max-w-xl mx-auto text-sm">
            See published pricing, explore EOR and contractor plans, or compare Remote with other payroll platforms on our list.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={remoteOutboundUrl({ content: 'review-footer-cta' })}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="rounded-xl bg-[#F58220] hover:bg-[#e67412] text-white font-bold px-6 py-3 text-sm transition-colors"
            >
              Visit Remote Website →
            </a>
            <Link
              href="/human-resources/best-payroll-software"
              className="rounded-xl bg-white/15 border border-white/30 text-white font-semibold px-6 py-3 text-sm hover:bg-white/25 transition-colors"
            >
              Back to Payroll Rankings
            </Link>
          </div>
        </div>
      </section>

      <p className="not-prose mt-6 flex items-center gap-2 text-xs text-gray-500">
        <Shield className="w-4 h-4" />
        Independent editorial review · Affiliate disclosure applies to outbound vendor links
      </p>
    </main>
  )
}
