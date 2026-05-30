import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ComparisonPageData } from '@/types'
import {
  SITE_URL,
  buildMetadata,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildJsonLdGraph,
  buildSoftwareAppSchema,
} from '@/lib/seo'
import { ComparisonPageTemplate } from '@/components/comparison/ComparisonPageTemplate'

interface ComparisonRouteProps {
  data: ComparisonPageData | undefined
}

export function buildComparisonMetadata(data: ComparisonPageData): Metadata {
  return buildMetadata({
    title: data.title,
    description: data.metaDescription,
    canonical: data.canonical,
    openGraphType: 'article',
  })
}

export function ComparisonRoute({ data }: ComparisonRouteProps) {
  if (!data) notFound()

  const pageUrl = `${SITE_URL}${data.canonical}`
  const structuredData: object[] = [buildBreadcrumbSchema(data.breadcrumbs)]

  if (data.faqs.length > 0) {
    const faqSchema = buildFaqSchema(data.faqs, pageUrl)
    if (faqSchema) structuredData.push(faqSchema)
  }

  structuredData.push(
    ...buildSoftwareAppSchema(
      data.products.map((p) => ({
        name: p.name,
        description: p.tagline,
        ratingValue: p.score,
        reviewCount: p.reviewCount,
        price: p.pricingAmount.replace(/[^0-9.]/g, '') || '0',
      }))
    )
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLdGraph(structuredData)) }}
      />
      <ComparisonPageTemplate data={data} />
    </>
  )
}
