import type { Metadata } from 'next'
import { getComparisonPageBySlug } from '@/data/comparisons'
import { buildComparisonMetadata, ComparisonRoute } from '@/components/comparison/ComparisonRoute'
import { GPSFleetPopup } from '@/components/EmailMarketingPopup'

const data = getComparisonPageBySlug('gps-fleet-management')
export const metadata: Metadata = buildComparisonMetadata(data!)
export default function Page() {
  return (
    <>
      <ComparisonRoute data={data} />
      <GPSFleetPopup />
    </>
  )
}
