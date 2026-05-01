import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const dynamic = 'force-static'
export const revalidate = 86400

export const metadata: Metadata = buildMetadata({
  title: 'Business Planning Resources',
  description:
    'Business planning resources from Compare Bazaar with software selection guidance for growth-focused teams.',
  canonical: '/business-planning',
})

export default function BusinessPlanningPage() {
  const planningPillars = [
    {
      title: 'Revenue Planning',
      body: 'Model your pipeline, lead sources, and sales conversion assumptions with a CRM-backed process.',
      href: '/sales/best-crm-software',
    },
    {
      title: 'Operations Planning',
      body: 'Use project management systems to map execution, ownership, and delivery timelines.',
      href: '/sales/best-project-management-software',
    },
    {
      title: 'People and Compliance Planning',
      body: 'Use payroll and employee platforms to reduce HR risk as hiring increases.',
      href: '/human-resources',
    },
    {
      title: 'Customer Communication Planning',
      body: 'Standardize customer call and support flows with business phone or call-center tools.',
      href: '/technology/business-phone-systems',
    },
  ]

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Business Planning' }]} className="mb-6" />
      <h1 className="text-3xl sm:text-4xl text-navy tracking-tight mb-4">Business Planning Resources</h1>
      <p className="text-gray-600 leading-relaxed mb-4">
        Effective planning includes choosing operational systems that support your goals across acquisition, delivery,
        retention, and reporting.
      </p>
      <p className="text-gray-600 leading-relaxed mb-8">
        Use Compare Bazaar comparison guides to evaluate software by pricing, feature depth, scalability, and usability.
      </p>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 mb-8">
        <h2 className="text-xl text-navy tracking-tight mb-3">Business planning framework (practical)</h2>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
          <li>Define goals: revenue targets, margin, hiring plan, and customer response SLAs.</li>
          <li>Map workflows: lead-to-close, onboarding, payroll, project delivery, and support.</li>
          <li>Select software: prioritize integrations, reporting quality, and predictable total cost.</li>
          <li>Run pilot: validate fit for 30-45 days before full rollout.</li>
        </ol>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {planningPillars.map((item) => (
          <article key={item.title} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h3 className="text-base font-semibold text-navy mb-1">{item.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">{item.body}</p>
            <Link href={item.href} className="text-sm font-semibold text-brand hover:underline">
              Open guide →
            </Link>
          </article>
        ))}
      </section>

      <section className="prose-editorial max-w-none">
        <h2>SEO-friendly planning topics we cover</h2>
        <p>
          Teams usually search terms like &ldquo;business planning software tools&rdquo;,
          &ldquo;startup operations software stack&rdquo;, and &ldquo;how to choose software for small business growth&rdquo;.
          Our planning resources are built to answer those intents clearly with actionable comparisons.
        </p>
        <h2>Need shortlisting help?</h2>
        <p>
          If you want faster vendor shortlisting, open the{' '}
          <Link href="/technology/get-free-quotes">All Software Quotes</Link> page and pick your category.
        </p>
      </section>
    </main>
  )
}
