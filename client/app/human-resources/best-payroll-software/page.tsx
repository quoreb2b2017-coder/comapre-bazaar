import type { Metadata } from 'next'
import { getComparisonPageBySlug } from '@/data/comparisons'
import { buildComparisonMetadata, ComparisonRoute } from '@/components/comparison/ComparisonRoute'
import { PayrollPopup } from '@/components/EmailMarketingPopup'

const data = getComparisonPageBySlug('payroll-software')
export const metadata: Metadata = buildComparisonMetadata(data!)

export default function Page() {
  return (
    <>
      <ComparisonRoute data={data} />
      <PayrollPopup />
    </>
  )
}
