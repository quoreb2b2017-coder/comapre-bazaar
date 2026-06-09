import type { Metadata } from 'next'
import PayrollGetQuotesForm from '@/app/technology/best-payroll-system/get-free-quotes/QuoteFormClient'
import { buildQuotePageHeading, buildQuotePageMetadata, type QuoteSearchParams } from '@/lib/pageMetaDescriptions'

type PageProps = {
  searchParams: QuoteSearchParams
}

export function generateMetadata({ searchParams }: PageProps): Metadata {
  return buildQuotePageMetadata('human-resources/best-payroll-software/get-free-quotes', searchParams)
}

export default function Page({ searchParams }: PageProps) {
  const heading = buildQuotePageHeading('human-resources/best-payroll-software/get-free-quotes', searchParams)
  return <PayrollGetQuotesForm heading={heading} />
}
