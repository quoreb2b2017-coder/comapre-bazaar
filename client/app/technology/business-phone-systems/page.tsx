import { BusinessPhoneSystemPopup } from '@/components/EmailMarketingPopup'
import { COMPARISON_PAGE_REVALIDATE, createComparisonPageHandlers } from '@/lib/createComparisonPage'

export const revalidate = COMPARISON_PAGE_REVALIDATE

const { generateMetadata, Page } = createComparisonPageHandlers({
  slug: 'business-phone-systems',
  Popup: BusinessPhoneSystemPopup,
})

export { generateMetadata }
export default Page
