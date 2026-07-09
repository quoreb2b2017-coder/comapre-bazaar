import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ComparisonPageData } from '@/types'
import { SITE_URL, buildMetadata } from '@/lib/seo'
import { hubSlugForCanonical, parseReviewDateToIso } from '@/lib/hubSeo'
import { ComparisonPageTemplate } from '@/components/comparison/ComparisonPageTemplate'
import { JsonLd } from '@/components/seo/JsonLd'
import {
  breadcrumbGraph,
  buildGraph,
  comparisonHubGraph,
  faqGraph,
} from '@/lib/schema'

interface ComparisonRouteProps {
  data: ComparisonPageData | undefined
}

export function buildComparisonMetadata(data: ComparisonPageData): Metadata {
  const pageUrl = `${SITE_URL}${data.canonical}`
  return buildMetadata({
    title: data.title,
    description: data.metaDescription,
    canonical: data.canonical,
    openGraphType: 'website',
    ogTitle: `${data.title} | Compare Bazaar`,
    ogUrl: pageUrl,
  })
}

export function ComparisonRoute({ data }: ComparisonRouteProps) {
  if (!data) notFound()

  const pageUrl = `${SITE_URL}${data.canonical}`
  const hubSlug = hubSlugForCanonical(data.canonical)
  const lastVerified = parseReviewDateToIso(data.lastReviewed)

  const breadcrumbItems = data.breadcrumbs
    .filter((item) => item.href)
    .map((item) => ({
      name: item.label,
      url: `${SITE_URL}${item.href}`,
    }))

  const graphNodes: object[] = [
    breadcrumbGraph(breadcrumbItems),
    comparisonHubGraph({
      url: pageUrl,
      name: data.h1,
      description: data.metaDescription,
      vendors: data.products.map((product, index) => ({
        name: product.name,
        position: index + 1,
        url: product.reviewSlug ? `${SITE_URL}/reviews/${product.reviewSlug}` : undefined,
      })),
    }),
  ]

  if (data.faqs.length > 0) {
    graphNodes.push(
      faqGraph(
        data.faqs.map((faq) => ({
          q: faq.question,
          a: faq.answer,
        }))
      )
    )
  }

  return (
    <>
      <JsonLd schema={buildGraph(...graphNodes)} />
      <ComparisonPageTemplate data={data} hubSlug={hubSlug} lastVerified={lastVerified} />
    </>
  )
}
