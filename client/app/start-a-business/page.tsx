import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata: Metadata = buildMetadata({
  title: 'Start a Business: Software Planning Checklist',
  description:
    'A practical startup software checklist from Compare Bazaar covering CRM, payroll, communications, and operations tools.',
  canonical: '/start-a-business',
})

export default function StartABusinessPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Start a Business' }]} className="mb-6" />
      <h1 className="text-3xl sm:text-4xl text-navy tracking-tight mb-4">Start a Business: Software Checklist</h1>
      <p className="text-gray-600 leading-relaxed mb-4">
        Starting a company is easier when your software stack is planned early. Focus on tools that reduce manual
        work in sales, finance, communication, and hiring.
      </p>
      <p className="text-gray-600 leading-relaxed">
        For faster shortlisting, browse our hubs for CRM, payroll, HR, project management, and business phone systems.
      </p>
    </main>
  )
}
