import type { Metadata } from 'next'
import Link from 'next/link'
import { Compass, ListChecks, Scale } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { WhitePaperLibraryHeroVisual } from '@/components/whitepaper/WhitePaperLibraryHeroVisual'
import { ResourceHero, ResourcePageShell } from '@/components/resources/ResourceHero'

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
        <div className="overflow-hidden rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-12 shadow-sm sm:px-10">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">Coming soon</p>
          <p className="font-serif text-xl text-navy">Guides are in production</p>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-gray-500">
            Nothing is published in Guides yet. In the meantime, read the{' '}
            <Link href="/blog" className="font-medium text-[#1D4ED8] underline underline-offset-2 hover:text-[#1e40af]">
              blog
            </Link>{' '}
            or browse{' '}
            <Link
              href="/resources/whitepapers?type=whitepaper"
              className="font-medium text-[#1D4ED8] underline underline-offset-2 hover:text-[#1e40af]"
            >
              white papers
            </Link>
            .
          </p>
        </div>
      </div>
    </ResourcePageShell>
  )
}
