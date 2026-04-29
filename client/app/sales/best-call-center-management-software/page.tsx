import type { Metadata } from 'next'
import { getComparisonPageBySlug } from '@/data/comparisons'
import { buildComparisonMetadata, ComparisonRoute } from '@/components/comparison/ComparisonRoute'
import { CallCenterPopup } from '@/components/EmailMarketingPopup'

const data = getComparisonPageBySlug('call-center')
export const metadata: Metadata = buildComparisonMetadata(data!)
export default function Page() {
  return (
    <>
      <ComparisonRoute data={data} />
      <CallCenterPopup />
    </>
  )
}
