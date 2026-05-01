import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata: Metadata = buildMetadata({
  title: 'Start a Business: Software Planning Checklist',
  description:
    'A practical startup software checklist from Compare Bazaar covering CRM, payroll, communications, and operations tools.',
  canonical: '/start-a-business',
})

export default function StartABusinessPage() {
  const stackPriorities = [
    {
      title: 'Sales and lead tracking',
      body: 'Choose a CRM early so opportunities, follow-ups, and forecasting stay organized from day one.',
      href: '/marketing/best-crm-software',
    },
    {
      title: 'Payroll and compliance',
      body: 'Use payroll software with tax automation and clear filing workflows to reduce finance risk.',
      href: '/human-resources/best-payroll-software',
    },
    {
      title: 'Team operations and HR',
      body: 'Use employee management tools for onboarding, policies, and performance documentation as you scale.',
      href: '/human-resources/best-employee-management-software',
    },
    {
      title: 'Project execution',
      body: 'Use project management software to keep deadlines, ownership, and delivery plans visible.',
      href: '/sales/best-project-management-software',
    },
  ]

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Start a Business' }]} className="mb-6" />
      <h1 className="text-3xl sm:text-4xl text-navy tracking-tight mb-4">Start a Business: Software Checklist</h1>
      <p className="text-gray-600 leading-relaxed mb-4">
        Starting a company is easier when your software stack is planned early. Focus on tools that reduce manual
        work in sales, finance, communication, and hiring.
      </p>
      <p className="text-gray-600 leading-relaxed mb-8">
        For faster shortlisting, browse our hubs for CRM, payroll, HR, project management, and business phone systems.
      </p>

      <section className="rounded-2xl border border-gray-200 bg-gray-50 p-5 mb-8">
        <h2 className="text-xl text-navy tracking-tight mb-3">What to set up first (first 90 days)</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>Define your sales process and pipeline stages before buying a CRM.</li>
          <li>Set payroll cadence and tax ownership before your first hires.</li>
          <li>Create onboarding and role expectations for each new employee.</li>
          <li>Choose one collaboration + project workflow to avoid tool sprawl.</li>
        </ul>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {stackPriorities.map((item) => (
          <article key={item.title} className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="text-base font-semibold text-navy mb-1">{item.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">{item.body}</p>
            <Link href={item.href} className="text-sm font-semibold text-brand hover:underline">
              Compare options →
            </Link>
          </article>
        ))}
      </section>

      <section className="prose-editorial max-w-none">
        <h2>How this helps with startup SEO and operations</h2>
        <p>
          New businesses often search for phrases like &ldquo;best software to start a business&rdquo;,
          &ldquo;startup CRM and payroll tools&rdquo;, and &ldquo;small business operations stack&rdquo;.
          This checklist is designed around those real buyer intents so founders can shortlist faster and
          avoid expensive platform changes later.
        </p>
        <h2>Next step</h2>
        <p>
          If you want matched vendor options quickly, use our{' '}
          <Link href="/technology/get-free-quotes">All Software Quotes</Link> page and we will route you to
          the right category forms.
        </p>
      </section>
    </main>
  )
}
