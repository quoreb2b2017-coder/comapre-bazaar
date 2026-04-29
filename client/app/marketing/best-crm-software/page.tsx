import { getComparisonPageBySlug } from '@/data/comparisons'
import { buildComparisonMetadata, ComparisonRoute } from '@/components/comparison/ComparisonRoute'
import { CRMPopup } from '@/components/EmailMarketingPopup'
import type { Metadata } from 'next'

const data = getComparisonPageBySlug('crm-software')
export const metadata: Metadata = buildComparisonMetadata(data!)
export default function Page() {
  return (
    <>
      <ComparisonRoute data={data} />
      <CRMPopup />
    </>
  )
}
