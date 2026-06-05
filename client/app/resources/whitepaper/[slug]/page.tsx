import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { cleanDisplayText } from '@/lib/cleanDisplayText'
import { buildMetadata, SITE_URL } from '@/lib/seo'
import { fetchPublishedWhitePapers, fetchWhitePaperBySlug } from '@/lib/whitePaperCms'
import { WhitePaperInsideSection } from '@/components/whitepaper/WhitePaperInsideSection'
import { WhitePaperTestimonials } from '@/components/whitepaper/WhitePaperTestimonials'

export const revalidate = 120

type PageProps = { params: { slug: string } }

export async function generateStaticParams() {
  const papers = await fetchPublishedWhitePapers()
  return papers.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const paper = await fetchWhitePaperBySlug(params.slug)
  if (!paper) return { title: 'Whitepaper not found' }

  const googleTitle = paper.metaTitle || paper.seoTitle || paper.title
  const googleDesc = paper.metaDescription || paper.description
  const ogTitle = paper.ogTitle || googleTitle
  const ogDesc = paper.ogDescription || googleDesc

  const base = buildMetadata({
    title: googleTitle,
    description: googleDesc,
    canonical: `/resources/whitepaper/${paper.slug}`,
    openGraphType: 'article',
  })

  return {
    ...base,
    keywords: paper.metaKeywords?.length ? paper.metaKeywords : undefined,
    openGraph: {
      ...base.openGraph,
      title: ogTitle,
      description: ogDesc,
    },
    twitter: {
      ...base.twitter,
      title: ogTitle,
      description: ogDesc,
    },
  }
}

export default async function WhitepaperDetailPage({ params }: PageProps) {
  const paper = await fetchWhitePaperBySlug(params.slug)
  if (!paper) notFound()

  const headline = paper.seoTitle || paper.title
  const offeredBy = paper.metadata?.offeredBy || 'Compare Bazaar'
  const author = paper.metadata?.author || offeredBy
  const pageUrl = `${SITE_URL}/resources/whitepaper/${paper.slug}`

  const introRaw = cleanDisplayText(paper.structuredSeoContent?.trim() || paper.description?.trim() || '')
  const intro =
    introRaw.length > 240
      ? `${introRaw.slice(0, 237).replace(/\s+\S*$/, '').trim()}…`
      : introRaw

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DigitalDocument',
    name: headline,
    description: paper.metaDescription || paper.description,
    url: pageUrl,
    image: paper.thumbnailUrl,
    datePublished: paper.publishedAt,
    author: { '@type': 'Organization', name: offeredBy },
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
              { label: 'Whitepapers', href: '/resources/whitepaper' },
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

            <WhitePaperInsideSection
              overview={paper.insideOverview || intro}
              sections={paper.insideSections}
              points={paper.insidePoints}
              className="mt-5 lg:mt-6"
            />

            <WhitePaperTestimonials
              heading={paper.testimonialsHeading}
              items={paper.testimonials}
              className="mt-5 lg:mt-6"
            />

            <div className="mt-6 space-y-1.5 border-t border-gray-200 pt-5 text-left text-[13px] text-[#333] lg:mt-8">
              <p>
                <span className="text-gray-500">Offered free by: </span>
                <span className="font-semibold">{offeredBy}</span>
              </p>
              <p>
                <span className="text-gray-500">See all resources from: </span>
                <Link
                  href="/resources/whitepaper"
                  className="font-semibold text-cb-orange hover:text-cb-orange-hover hover:underline"
                >
                  {author}
                </Link>
              </p>
            </div>

            <Link
              href="/resources/whitepaper"
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

            {intro && !paper.insideOverview?.trim() ? (
              <p className="mt-4 text-sm leading-relaxed text-gray-600">{intro}</p>
            ) : null}

            <Link
              href={`/resources/whitepaper/${paper.slug}/download`}
              className="mt-4 inline-block bg-cb-orange px-6 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-cb-orange-hover"
            >
              Download now
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
