import type { Metadata } from 'next'
import EmployeeManagementGetQuotesForm from '@/app/technology/best-employee-management-software/get-free-quotes/QuoteFormClient'
import { buildQuotePageHeading, buildQuotePageMetadata } from '@/lib/pageMetaDescriptions'

type PageProps = {
  searchParams: { vendor?: string | string[] }
}

export function generateMetadata({ searchParams }: PageProps): Metadata {
  return buildQuotePageMetadata('human-resources/best-employee-management-software/get-free-quotes', searchParams)
}

export default function Page({ searchParams }: PageProps) {
  const heading = buildQuotePageHeading('human-resources/best-employee-management-software/get-free-quotes', searchParams)
  return <EmployeeManagementGetQuotesForm heading={heading} />
}
