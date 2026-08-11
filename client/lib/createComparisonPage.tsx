import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { ComponentType } from 'react'
import { loadComparisonPage } from '@/lib/comparisonPageCms'
import { resolveComparisonPageCoverUrl } from '@/lib/comparisonPageCovers'
import { buildComparisonMetadata, ComparisonRoute } from '@/components/comparison/ComparisonRoute'

export const COMPARISON_PAGE_REVALIDATE = 120

type ComparisonPageOptions = {
  slug: string
  Popup?: ComponentType
}

export function createComparisonPageHandlers({ slug, Popup }: ComparisonPageOptions) {
  async function generateMetadata(): Promise<Metadata> {
    const data = await loadComparisonPage(slug)
    if (!data) notFound()
    return buildComparisonMetadata(data)
  }

  async function Page() {
    const data = await loadComparisonPage(slug)
    if (!data) notFound()
    const heroCoverUrl =
      data.heroCoverUrl?.trim() || (await resolveComparisonPageCoverUrl(data))
    return (
      <>
        <ComparisonRoute data={data} heroCoverUrl={heroCoverUrl} />
        {Popup ? <Popup /> : null}
      </>
    )
  }

  return { generateMetadata, Page }
}
