import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { ResourceSectionLibrary } from '@/components/resources/ResourceSectionLibrary'

export const revalidate = 120

export const metadata: Metadata = buildMetadata({
  title: 'Case studies',
  description: 'Implementation and customer stories from Compare Bazaar.',
  canonical: '/resources/case-studies',
})

export default function CaseStudiesPage() {
  return (
    <ResourceSectionLibrary
      type="case_study"
      title="Case studies"
      description="Customer and implementation stories from real software rollouts, written for buyers who need to see how a stack actually lands."
      emptyTitle="Case studies are in production"
      emptyBody="Nothing is published in Case studies yet. In the meantime, browse"
    />
  )
}
