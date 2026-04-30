import type { Metadata } from 'next'
import EmployeeManagementGetQuotesForm from '@/app/technology/best-employee-management-software/get-free-quotes/page'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Get Employee Management Software Quotes | Compare Bazaar',
  description:
    'Compare top employee management software providers. Get free quotes for onboarding, performance, and workforce analytics tools.',
  canonical: '/human-resources/best-employee-management-software/get-free-quotes',
})

export default function Page() {
  return <EmployeeManagementGetQuotesForm />
}
