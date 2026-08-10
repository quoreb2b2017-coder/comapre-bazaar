import type { Metadata } from 'next'
import type { ComponentType } from 'react'
import type { QuoteSearchParams, QuotePageKey } from '@/lib/pageMetaDescriptions'
import { buildQuotePageHeadingAsync, buildQuotePageMetadataAsync } from '@/lib/pageMetaDescriptions'

export const QUOTE_PAGE_REVALIDATE = 120

export function createQuotePageHandlers(
  pageKey: QuotePageKey,
  QuoteForm: ComponentType<{ heading: string }>
) {
  async function generateMetadata({ searchParams }: { searchParams: QuoteSearchParams }): Promise<Metadata> {
    return buildQuotePageMetadataAsync(pageKey, searchParams)
  }

  async function Page({ searchParams }: { searchParams: QuoteSearchParams }) {
    const heading = await buildQuotePageHeadingAsync(pageKey, searchParams)
    return <QuoteForm heading={heading} />
  }

  return { generateMetadata, Page }
}
