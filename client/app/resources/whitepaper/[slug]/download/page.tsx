import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { buildWhitePaperShareMetadata } from '@/lib/seo'
import { whitePaperAuthorName, whitePaperOgImageUrl } from '@/lib/whitePaperMeta'
import { whitePaperDisplayTitle } from '@/lib/whitePaperDisplay'
import { fetchPublishedWhitePapers, fetchWhitePaperBySlug } from '@/lib/whitePaperCms'
import { WhitePaperDownloadGate } from '@/components/whitepaper/WhitePaperDownloadGate'

export const revalidate = 120

type PageProps = { params: { slug: string } }

export async function generateStaticParams() {
  const papers = await fetchPublishedWhitePapers()
  return papers.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const paper = await fetchWhitePaperBySlug(params.slug)
  if (!paper) return { title: 'Download whitepaper' }
  const title = whitePaperDisplayTitle(paper.title, paper.metaTitle || paper.seoTitle || paper.title)
  return buildWhitePaperShareMetadata({
    title: `Download: ${title}`,
    description: `Download the free whitepaper: ${paper.metaDescription || paper.description}`,
    canonicalPath: `/resources/whitepaper/${paper.slug}/download`,
    publishedAt: paper.publishedAt,
    keywords: paper.metaKeywords,
    authorName: whitePaperAuthorName(paper.metadata),
    ogImageUrl: whitePaperOgImageUrl(paper.thumbnailUrl),
  })
}

export default async function WhitepaperDownloadPage({ params }: PageProps) {
  const paper = await fetchWhitePaperBySlug(params.slug)
  if (!paper) notFound()

  return <WhitePaperDownloadGate paper={paper} />
}
