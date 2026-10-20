import Link from 'next/link'
import { BarChart2, Briefcase, Download, ListChecks, Mic, PlayCircle, TrendingUp, Users } from 'lucide-react'
import { WhitePaperSearch } from '@/components/whitepaper/WhitePaperSearch'
import { WhitePaperLibraryHeroVisual } from '@/components/whitepaper/WhitePaperLibraryHeroVisual'
import { fetchPublishedWhitePapers } from '@/lib/whitePaperCms.server'
import { whitePaperResourceType } from '@/lib/whitePaperResourceType'
import type { WhitePaperResourceType } from '@/lib/whitePaperTaxonomy'
import { ResourceHero, ResourcePageShell, type ResourcePillar } from '@/components/resources/ResourceHero'

const PILLARS: Record<'report' | 'case_study' | 'webinar', readonly ResourcePillar[]> = {
  report: [
    { icon: BarChart2, label: 'Benchmarks', sub: 'Side-by-side numbers for shortlist decisions.' },
    { icon: TrendingUp, label: 'Trend data', sub: 'What changed in pricing, adoption, and scope.' },
    { icon: Download, label: 'Free to download', sub: 'Full PDF access with no paywall.' },
  ],
  case_study: [
    { icon: Briefcase, label: 'Real rollouts', sub: 'How teams actually implemented the software.' },
    { icon: Users, label: 'Buyer context', sub: 'Company size, stack, and the problem they solved.' },
    { icon: ListChecks, label: 'Outcomes', sub: 'What changed after go-live, in plain terms.' },
  ],
  webinar: [
    { icon: PlayCircle, label: 'On demand', sub: 'Watch the session when your team is free.' },
    { icon: Mic, label: 'Expert sessions', sub: 'Editors and operators, not a vendor pitch.' },
    { icon: ListChecks, label: 'Takeaways', sub: 'A short list you can use in the next meeting.' },
  ],
}

type Props = {
  type: Extract<WhitePaperResourceType, 'report' | 'case_study' | 'webinar'>
  title: string
  description: string
  emptyTitle: string
  emptyBody: string
}

export async function ResourceSectionLibrary({ type, title, description, emptyTitle, emptyBody }: Props) {
  const papers = await fetchPublishedWhitePapers()
  const items = papers.filter((paper) => whitePaperResourceType(paper.metadata) === type)

  return (
    <ResourcePageShell>
      <ResourceHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Resources', href: '/resources' },
          { label: title },
        ]}
        title={title}
        description={description}
        pillars={PILLARS[type]}
        visual={<WhitePaperLibraryHeroVisual papers={items} />}
      />
      <div className="relative mx-auto max-w-[1140px] px-4 py-10 sm:px-5 sm:py-12 lg:px-6 lg:py-14">
        {items.length === 0 ? (
          <div className="overflow-hidden rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-12 shadow-sm sm:px-10">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">Coming soon</p>
            <p className="font-serif text-xl text-navy">{emptyTitle}</p>
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-gray-500">
              {emptyBody}{' '}
              <Link
                href="/resources/whitepapers?type=whitepaper"
                className="font-medium text-[#1D4ED8] underline underline-offset-2 hover:text-[#1e40af]"
              >
                white papers
              </Link>{' '}
              or the{' '}
              <Link href="/blog" className="font-medium text-[#1D4ED8] underline underline-offset-2 hover:text-[#1e40af]">
                blog
              </Link>
              .
            </p>
          </div>
        ) : (
          <WhitePaperSearch papers={items} hideTypeFilter />
        )}
      </div>
    </ResourcePageShell>
  )
}
