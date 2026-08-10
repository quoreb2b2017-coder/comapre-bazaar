import { QUOTE_PAGE_REVALIDATE, createQuotePageHandlers } from '@/lib/createQuotePage'
import QuoteFormClient from './QuoteFormClient'

export const revalidate = QUOTE_PAGE_REVALIDATE

const { generateMetadata, Page } = createQuotePageHandlers(
  'technology/gps-fleet-management-software/get-free-quotes',
  QuoteFormClient
)

export { generateMetadata }
export default Page
