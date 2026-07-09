import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import {
  whitePaperDisplayTitle,
  whitePaperMainOverview,
  whitePaperSidebarHighlights,
} from '@/lib/whitePaperDisplay'
import { buildWhitePaperShareMetadata } from '@/lib/seo'
import { whitePaperAuthorName, whitePaperOfferedBy, whitePaperOgImageUrl } from '@/lib/whitePaperMeta'
import { fetchPublishedWhitePapers, fetchWhitePaperBySlug } from '@/lib/whitePaperCms'
import { WhitePaperInsideFullView } from '@/components/whitepaper/WhitePaperInsideFullView'

export const revalidate = 120
export const dynamicParams = true

type PageProps = { params: { slug: string } }

export async function generateStaticParams() {
  const papers = await fetchPublishedWhitePapers()
  return papers.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const paper = await fetchWhitePaperBySlug(params.slug)
  if (!paper) return { title: 'Whitepaper description' }

  const title = whitePaperDisplayTitle(paper.title, paper.metaTitle || paper.seoTitle || paper.title)
  return buildWhitePaperShareMetadata({
    title: `Full description: ${title}`,
    description: paper.metaDescription || paper.description,
    canonicalPath: `/resources/whitepapers/${paper.slug}/description`,
    publishedAt: paper.publishedAt,
    keywords: paper.metaKeywords,
    authorName: whitePaperAuthorName(paper.metadata),
    ogImageUrl: whitePaperOgImageUrl(paper.thumbnailUrl),
  })
}

export default async function WhitepaperDescriptionPage({ params }: PageProps) {
  const paper = await fetchWhitePaperBySlug(params.slug)
  if (!paper) notFound()

  const headline = whitePaperDisplayTitle(paper.title, paper.seoTitle)
  const offeredBy = whitePaperOfferedBy(paper.metadata)
  const detailHref = `/resources/whitepapers/${paper.slug}`
  const downloadHref = `/resources/whitepapers/${paper.slug}/download`

  const overview = whitePaperMainOverview(paper)
  const sidebarHighlights = whitePaperSidebarHighlights(paper)

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1140px] px-4 py-4 sm:px-5 lg:px-6">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Resources', href: '/resources' },
            { label: 'Whitepapers', href: '/resources/whitepapers' },
            { label: headline.length > 32 ? `${headline.slice(0, 32)}…` : headline, href: detailHref },
            { label: 'Full description' },
          ]}
          className="text-sm"
        />
      </div>

      <div className="mx-auto max-w-[1140px] px-4 py-6 sm:px-5 sm:py-8 lg:px-6">
        <Link
          href={detailHref}
          className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-cb-orange"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to whitepaper
        </Link>

        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">Full description</p>
        <h1 className="mt-1.5 font-serif text-[1.25rem] font-normal leading-snug tracking-tight text-[#1a1a1a] sm:text-[1.375rem] lg:text-[1.5rem]">
          {headline}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Key highlights on the left · full overview on the right.
        </p>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <WhitePaperInsideFullView
            overview={overview}
            sidebarHighlights={sidebarHighlights}
            testimonials={paper.testimonials}
            testimonialsHeading={paper.testimonialsHeading}
            thumbnailUrl={paper.thumbnailUrl}
            thumbnailAlt={headline}
            offeredBy={offeredBy}
          />
        </div>

        <div className="mt-10 flex flex-wrap gap-3 border-t border-gray-200 pt-8">
          <Link
            href={downloadHref}
            className="inline-block bg-cb-orange px-6 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-cb-orange-hover"
          >
            Download now
          </Link>
          <Link
            href={detailHref}
            className="inline-block border border-gray-300 px-6 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-navy transition-colors hover:border-gray-400"
          >
            Whitepaper overview
          </Link>
        </div>
      </div>
    </main>
  )
}
