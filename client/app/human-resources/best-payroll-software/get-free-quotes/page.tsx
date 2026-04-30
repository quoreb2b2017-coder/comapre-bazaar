import type { Metadata } from 'next'
import PayrollGetQuotesForm from '@/app/technology/best-payroll-system/get-free-quotes/page'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Get Payroll Software Quotes | Compare Bazaar',
  description:
    'Get matched with top payroll software providers. Compare features, pricing, and compliance support for your business.',
  canonical: '/human-resources/best-payroll-software/get-free-quotes',
})

export default function Page() {
  return <PayrollGetQuotesForm />
}
