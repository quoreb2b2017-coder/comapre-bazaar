import { QUOTE_PAGE_REVALIDATE, createQuotePageHandlers } from '@/lib/createQuotePage'
import EmployeeManagementGetQuotesForm from '@/app/technology/best-employee-management-software/get-free-quotes/QuoteFormClient'

export const revalidate = QUOTE_PAGE_REVALIDATE

const { generateMetadata, Page } = createQuotePageHandlers(
  'human-resources/best-employee-management-software/get-free-quotes',
  EmployeeManagementGetQuotesForm
)

export { generateMetadata }
export default Page
