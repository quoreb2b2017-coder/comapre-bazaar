import { EmailMarketingPopup } from '@/components/EmailMarketingPopup'
import { COMPARISON_PAGE_REVALIDATE, createComparisonPageHandlers } from '@/lib/createComparisonPage'

export const revalidate = COMPARISON_PAGE_REVALIDATE

const { generateMetadata, Page } = createComparisonPageHandlers({
  slug: 'email-marketing',
  Popup: EmailMarketingPopup,
})

export { generateMetadata }
export default Page
