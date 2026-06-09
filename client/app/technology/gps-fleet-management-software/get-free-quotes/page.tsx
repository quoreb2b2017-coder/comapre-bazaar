import type { Metadata } from 'next'
import { buildQuotePageHeading, buildQuotePageMetadata } from '@/lib/pageMetaDescriptions'
import QuoteFormClient from './QuoteFormClient'

type PageProps = {
  searchParams: { vendor?: string | string[] }
}

export function generateMetadata({ searchParams }: PageProps): Metadata {
  return buildQuotePageMetadata('technology/gps-fleet-management-software/get-free-quotes', searchParams)
}

export default function Page({ searchParams }: PageProps) {
  const heading = buildQuotePageHeading('technology/gps-fleet-management-software/get-free-quotes', searchParams)
  return <QuoteFormClient heading={heading} />
}
