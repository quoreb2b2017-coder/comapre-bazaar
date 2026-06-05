import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { buildMetadata } from '@/lib/seo'
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
  const title = paper.metaTitle || paper.seoTitle || paper.title
  return buildMetadata({
    title: `Download: ${title}`,
    description: `Download the free whitepaper: ${paper.metaDescription || paper.description}`,
    canonical: `/resources/whitepaper/${paper.slug}/download`,
    openGraphType: 'article',
  })
}

export default async function WhitepaperDownloadPage({ params }: PageProps) {
  const paper = await fetchWhitePaperBySlug(params.slug)
  if (!paper) notFound()

  return <WhitePaperDownloadGate paper={paper} />
}
