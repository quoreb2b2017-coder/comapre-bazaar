import type { Metadata } from 'next'
import { buildQuotePageHeading, buildQuotePageMetadata, type QuoteSearchParams } from '@/lib/pageMetaDescriptions'
import QuoteFormClient from './QuoteFormClient'

type PageProps = {
  searchParams: QuoteSearchParams
}

export function generateMetadata({ searchParams }: PageProps): Metadata {
  return buildQuotePageMetadata('marketing/best-email-marketing-services/get-free-quotes', searchParams)
}

export default function Page({ searchParams }: PageProps) {
  const heading = buildQuotePageHeading('marketing/best-email-marketing-services/get-free-quotes', searchParams)
  return <QuoteFormClient heading={heading} />
}
