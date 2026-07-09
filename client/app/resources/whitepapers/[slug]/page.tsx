import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { whitePaperDisplayTitle, whitePaperFullDescription } from '@/lib/whitePaperDisplay'
import { buildWhitePaperShareMetadata, SITE_URL } from '@/lib/seo'
import {
  whitePaperAuthorName,
  whitePaperOfferedBy,
  whitePaperOgImageUrl,
} from '@/lib/whitePaperMeta'
import { fetchPublishedWhitePapers, fetchWhitePaperBySlug } from '@/lib/whitePaperCms'
import { WhitePaperInsideExplorer } from '@/components/whitepaper/WhitePaperInsideExplorer'

export const revalidate = 120

type PageProps = { params: { slug: string } }

export async function generateStaticParams() {
  const papers = await fetchPublishedWhitePapers()
  return papers.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const paper = await fetchWhitePaperBySlug(params.slug)
  if (!paper) return { title: 'Whitepaper not found' }

  const title = whitePaperDisplayTitle(paper.title, paper.metaTitle || paper.seoTitle || paper.title)
  const description = paper.metaDescription || paper.description

  return buildWhitePaperShareMetadata({
    title: paper.ogTitle || title,
    description: paper.ogDescription || description,
    canonicalPath: `/resources/whitepapers/${paper.slug}`,
    publishedAt: paper.publishedAt,
    keywords: paper.metaKeywords,
    authorName: whitePaperAuthorName(paper.metadata),
    ogImageUrl: whitePaperOgImageUrl(paper.thumbnailUrl),
  })
}

export default async function WhitepaperDetailPage({ params }: PageProps) {
  const paper = await fetchWhitePaperBySlug(params.slug)
  if (!paper) notFound()

  const headline = whitePaperDisplayTitle(paper.title, paper.seoTitle)
  const offeredBy = whitePaperOfferedBy(paper.metadata)
  const author = whitePaperAuthorName(paper.metadata)
  const pageUrl = `${SITE_URL}/resources/whitepapers/${paper.slug}`
  const coverImage = whitePaperOgImageUrl(paper.thumbnailUrl)

  const fullDescription = whitePaperFullDescription({
    insideOverview: paper.insideOverview,
    description: paper.description,
    metaDescription: paper.metaDescription,
    structuredSeoContent: paper.structuredSeoContent,
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description: paper.metaDescription || paper.description,
    url: pageUrl,
    image: coverImage,
    datePublished: paper.publishedAt,
    author: {
      '@type': 'Person',
      name: author,
      url: `${SITE_URL}/editorial-process`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Compare Bazaar',
      url: SITE_URL,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      url: pageUrl,
    },
  }

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div>
        <div className="mx-auto max-w-[1140px] px-4 py-4 sm:px-5 lg:px-6">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Resources', href: '/resources' },
              { label: 'Whitepapers', href: '/resources/whitepapers' },
              { label: headline.length > 40 ? `${headline.slice(0, 40)}…` : headline },
            ]}
            className="text-sm"
          />
        </div>
      </div>

      <div className="mx-auto max-w-[1140px] px-4 py-7 sm:px-5 sm:py-8 lg:px-6">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[minmax(0,400px)_minmax(0,1fr)] xl:gap-12">
          <div className="mx-auto w-full max-w-[280px] shrink-0 sm:max-w-[320px] lg:mx-0 lg:max-w-none">
            <div className="relative aspect-[4/5] w-full bg-[#f4f4f4] p-2">
              <Image
                src={paper.thumbnailUrl}
                alt={headline}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 280px, 400px"
                priority
              />
            </div>

            <div className="mt-6 space-y-1.5 border-t border-gray-200 pt-5 text-left text-[13px] text-[#333] lg:mt-8">
              <p>
                <span className="text-gray-500">Offered free by: </span>
                <span className="font-semibold">{offeredBy}</span>
              </p>
              <p>
                <span className="text-gray-500">See all resources from: </span>
                <Link
                  href="/resources/whitepapers"
                  className="font-semibold text-cb-orange hover:text-cb-orange-hover hover:underline"
                >
                  {author}
                </Link>
              </p>
            </div>

            <Link
              href="/resources/whitepapers"
              className="mt-5 inline-block text-left text-xs font-medium text-gray-500 hover:text-navy hover:underline lg:mt-6"
            >
              ← Back to all whitepapers
            </Link>
          </div>

          <div className="min-w-0 max-w-[640px] text-left">
            <p className="text-xs text-gray-500">Request your free whitepaper:</p>

            <h1 className="mt-1.5 font-serif text-[1.25rem] font-normal leading-[1.25] tracking-tight text-[#1a1a1a] sm:text-[1.375rem] lg:text-[1.5rem]">
              {headline}
            </h1>

            {fullDescription && !paper.insideOverview?.trim() ? (
              <p className="mt-4 text-sm leading-relaxed text-gray-600">{fullDescription}</p>
            ) : null}

            <Link
              href={`/resources/whitepapers/${paper.slug}/download`}
              className="mt-4 inline-block bg-cb-orange px-6 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-cb-orange-hover"
            >
              Download now
            </Link>
          </div>
        </div>

        <WhitePaperInsideExplorer
          slug={paper.slug}
          overview={paper.insideOverview || fullDescription}
          sections={paper.insideSections}
          points={paper.insidePoints}
          className="mt-8 border-t border-gray-200 pt-8 lg:mt-10"
        />
      </div>
    </main>
  )
}
