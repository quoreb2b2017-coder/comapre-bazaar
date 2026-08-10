import { QUOTE_PAGE_REVALIDATE, createQuotePageHandlers } from '@/lib/createQuotePage'
import QuoteFormClient from './QuoteFormClient'

export const revalidate = QUOTE_PAGE_REVALIDATE

const { generateMetadata, Page } = createQuotePageHandlers(
  'technology/best-employee-management-software/get-free-quotes',
  QuoteFormClient
)

export { generateMetadata }
export default Page
