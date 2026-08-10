import { CRMPopup } from '@/components/EmailMarketingPopup'
import { COMPARISON_PAGE_REVALIDATE, createComparisonPageHandlers } from '@/lib/createComparisonPage'

export const revalidate = COMPARISON_PAGE_REVALIDATE

const { generateMetadata, Page } = createComparisonPageHandlers({
  slug: 'sales-crm',
  Popup: CRMPopup,
})

export { generateMetadata }
export default Page
