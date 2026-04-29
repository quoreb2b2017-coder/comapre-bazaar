import type { Metadata } from 'next'
import { getComparisonPageBySlug } from '@/data/comparisons'
import { buildComparisonMetadata, ComparisonRoute } from '@/components/comparison/ComparisonRoute'
import { CRMPopup } from '@/components/EmailMarketingPopup'

const data = getComparisonPageBySlug('sales-crm')
export const metadata: Metadata = buildComparisonMetadata(data!)
export default function Page() {
  return (
    <>
      <ComparisonRoute data={data} />
      <CRMPopup />
    </>
  )
}
