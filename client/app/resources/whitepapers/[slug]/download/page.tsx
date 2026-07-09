import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchPublishedWhitePapers, fetchWhitePaperBySlug } from '@/lib/whitePaperCms'
import { WhitePaperDownloadGate } from '@/components/whitepaper/WhitePaperDownloadGate'

export const revalidate = 120

type PageProps = { params: { slug: string } }

export async function generateStaticParams() {
  const papers = await fetchPublishedWhitePapers()
  return papers.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return { robots: { index: false, follow: false } }
}

export default async function WhitepaperDownloadPage({ params }: PageProps) {
  const paper = await fetchWhitePaperBySlug(params.slug)
  if (!paper) notFound()

  return <WhitePaperDownloadGate paper={paper} />
}
