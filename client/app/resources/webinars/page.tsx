import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { ResourceSectionLibrary } from '@/components/resources/ResourceSectionLibrary'

export const revalidate = 120

export const metadata: Metadata = buildMetadata({
  title: 'Webinars',
  description: 'Webinars and session replays from Compare Bazaar.',
  canonical: '/resources/webinars',
})

export default function WebinarsPage() {
  return (
    <ResourceSectionLibrary
      type="webinar"
      title="Webinars"
      description="On-demand sessions and replays for software buyers who want the discussion, not just the PDF."
      emptyTitle="Webinars are in production"
      emptyBody="Nothing is published in Webinars yet. The blog and white papers are ready while this section is in production."
    />
  )
}
