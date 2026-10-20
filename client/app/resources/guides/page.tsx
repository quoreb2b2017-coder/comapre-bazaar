import type { Metadata } from 'next'
import { Compass, ListChecks, Scale } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { WhitePaperLibraryHeroVisual } from '@/components/whitepaper/WhitePaperLibraryHeroVisual'
import { ResourceEmptyState, ResourceHero, ResourcePageShell } from '@/components/resources/ResourceHero'

export const metadata: Metadata = buildMetadata({
  title: 'Guides',
  description: 'Software comparison guides from Compare Bazaar. New guides are on the way.',
  canonical: '/resources/guides',
})

export default function GuidesPage() {
  return (
    <ResourcePageShell>
      <ResourceHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Resources', href: '/resources' },
          { label: 'Guides' },
        ]}
        title="Guides"
        description="Software comparison guides for teams choosing business software. Ranked criteria, trade-offs, and a shortlist you can defend."
        pillars={[
          { icon: Scale, label: 'Same criteria', sub: 'Every vendor scored on the framework we publish.' },
          { icon: ListChecks, label: 'Shortlists', sub: 'Who fits a small team, and who does not.' },
          { icon: Compass, label: 'Buyer first', sub: 'Written for the person signing the contract.' },
        ]}
        visual={<WhitePaperLibraryHeroVisual papers={[]} />}
      />
      <div className="relative mx-auto max-w-[1140px] px-4 py-10 sm:px-5 sm:py-12 lg:px-6 lg:py-14">
        <ResourceEmptyState
          title="Guides are in production"
          body="Nothing is published in Guides yet. The blog and white papers are ready while this section is in production."
        />
      </div>
    </ResourcePageShell>
  )
}
