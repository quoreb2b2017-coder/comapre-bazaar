import { WebsiteBuildingPopup } from '@/components/EmailMarketingPopup'
import { COMPARISON_PAGE_REVALIDATE, createComparisonPageHandlers } from '@/lib/createComparisonPage'

export const revalidate = COMPARISON_PAGE_REVALIDATE

const { generateMetadata, Page } = createComparisonPageHandlers({
  slug: 'website-builder',
  Popup: WebsiteBuildingPopup,
})

export { generateMetadata }
export default Page
