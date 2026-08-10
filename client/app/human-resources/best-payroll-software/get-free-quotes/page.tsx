import { QUOTE_PAGE_REVALIDATE, createQuotePageHandlers } from '@/lib/createQuotePage'
import PayrollGetQuotesForm from '@/app/technology/best-payroll-system/get-free-quotes/QuoteFormClient'

export const revalidate = QUOTE_PAGE_REVALIDATE

const { generateMetadata, Page } = createQuotePageHandlers(
  'human-resources/best-payroll-software/get-free-quotes',
  PayrollGetQuotesForm
)

export { generateMetadata }
export default Page
