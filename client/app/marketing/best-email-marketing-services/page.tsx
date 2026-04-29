import { getComparisonPageBySlug } from '@/data/comparisons'
import { buildComparisonMetadata, ComparisonRoute } from '@/components/comparison/ComparisonRoute'
import { EmailMarketingPopup } from '@/components/EmailMarketingPopup'
import type { Metadata } from 'next'

const data = getComparisonPageBySlug('email-marketing')
export const metadata: Metadata = buildComparisonMetadata(data!)
export default function Page() {
  return (
    <>
      <ComparisonRoute data={data} />
      <EmailMarketingPopup />
    </>
  )
}
