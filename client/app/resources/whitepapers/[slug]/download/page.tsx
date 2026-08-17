import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchWhitePaperBySlug } from '@/lib/whitePaperCms.server'
import { generateWhitePaperStaticParams } from '@/lib/whitePaperCms'
import { WhitePaperDownloadGate } from '@/components/whitepaper/WhitePaperDownloadGate'
import { whitePaperDisplayTitle } from '@/lib/whitePaperDisplay'
import { buildWhitePaperShareMetadata } from '@/lib/seo'
import { whitePaperOgImageUrl } from '@/lib/whitePaperMeta'
import { whitePaperResourceLabel } from '@/lib/whitePaperTaxonomy'
import { whitePaperResourceType } from '@/lib/whitePaperResourceType'

export const revalidate = 120
export const dynamicParams = true

type PageProps = { params: { slug: string } }

export function generateStaticParams() {
  return generateWhitePaperStaticParams()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const paper = await fetchWhitePaperBySlug(params.slug)
  if (!paper) return { robots: { index: false, follow: false } }

  const title = whitePaperDisplayTitle(paper.title, paper.metaTitle || paper.seoTitle || paper.title)
  const share = buildWhitePaperShareMetadata({
    title: paper.ogTitle || title,
    description: paper.ogDescription || paper.metaDescription || paper.description,
    canonicalPath: `/resources/whitepapers/${paper.slug}`,
    publishedAt: paper.publishedAt,
    keywords: paper.metaKeywords,
    ogImageUrl: whitePaperOgImageUrl(paper.thumbnailUrl, paper.slug),
    resourceLabel: whitePaperResourceLabel(whitePaperResourceType(paper.metadata)),
  })

  return {
    ...share,
    robots: { index: false, follow: false },
  }
}

export default async function WhitepaperDownloadPage({ params }: PageProps) {
  const paper = await fetchWhitePaperBySlug(params.slug)
  if (!paper) notFound()

  return <WhitePaperDownloadGate paper={paper} />
}
