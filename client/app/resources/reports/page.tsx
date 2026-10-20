import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { ResourceSectionLibrary } from '@/components/resources/ResourceSectionLibrary'

export const revalidate = 120

export const metadata: Metadata = buildMetadata({
  title: 'Reports',
  description: 'Benchmark and trends reports from Compare Bazaar.',
  canonical: '/resources/reports',
})

export default function ReportsPage() {
  return (
    <ResourceSectionLibrary
      type="report"
      title="Reports"
      description="Benchmark and trends reports for teams comparing business software. Numbers you can take into a shortlist meeting."
      emptyTitle="Reports are in production"
      emptyBody="Nothing is published in Reports yet. The blog and white papers are ready while this section is in production."
    />
  )
}
