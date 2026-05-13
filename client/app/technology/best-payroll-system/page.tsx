export const revalidate = 3600
import { getComparisonPageBySlug } from '@/data/comparisons'
import { buildComparisonMetadata, ComparisonRoute } from '@/components/comparison/ComparisonRoute'
import { PayrollPopup } from '@/components/EmailMarketingPopup'
import type { Metadata } from 'next'

const data = getComparisonPageBySlug('technology-payroll')
export const metadata: Metadata = {
  ...buildComparisonMetadata(data!),
  robots: { index: false, follow: true },
}
export default function Page() {
  return (
    <>
      <ComparisonRoute data={data} />
      <PayrollPopup />
    </>
  )
}
