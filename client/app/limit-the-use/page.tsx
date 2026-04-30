import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata: Metadata = buildMetadata({
  title: 'Limit the Use of My Sensitive Personal Information',
  description:
    'Submit a request to limit the use and disclosure of sensitive personal information under applicable privacy laws.',
  canonical: '/limit-the-use',
})

export default function LimitTheUsePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Limit the Use' }]} className="mb-6" />
      <h1 className="text-3xl sm:text-4xl text-navy tracking-tight mb-4">
        Limit the Use of Sensitive Personal Information
      </h1>
      <p className="text-gray-600 leading-relaxed mb-4">
        You can request that we limit our use and disclosure of sensitive personal information to uses necessary for
        service delivery and legal compliance.
      </p>
      <p className="text-gray-600 leading-relaxed">
        Please submit your request through our <Link className="text-brand hover:underline" href="/do-not-sell">Do Not Sell / Privacy request page</Link>.
      </p>
    </main>
  )
}
