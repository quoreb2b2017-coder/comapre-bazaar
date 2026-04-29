import { getComparisonPageBySlug } from '@/data/comparisons'
import { buildComparisonMetadata, ComparisonRoute } from '@/components/comparison/ComparisonRoute'
import { ProjectManagementPopup } from '@/components/EmailMarketingPopup'
import type { Metadata } from 'next'

const data = getComparisonPageBySlug('project-management')
export const metadata: Metadata = buildComparisonMetadata(data!)
export default function Page() {
  return (
    <>
      <ComparisonRoute data={data} />
      <ProjectManagementPopup />
    </>
  )
}
