import { getComparisonPageBySlug } from '@/data/comparisons'
import { buildComparisonMetadata, ComparisonRoute } from '@/components/comparison/ComparisonRoute'
import { BusinessPhoneSystemPopup } from '@/components/EmailMarketingPopup'
import type { Metadata } from 'next'

const data = getComparisonPageBySlug('business-phone-systems')
export const metadata: Metadata = buildComparisonMetadata(data!)
export default function Page() {
  return (
    <>
      <ComparisonRoute data={data} />
      <BusinessPhoneSystemPopup />
    </>
  )
}
