import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ComparisonPageData } from '@/types'
import { buildMetadata, buildBreadcrumbSchema, buildFaqSchema, buildSoftwareAppSchema } from '@/lib/seo'
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

  const breadcrumbSchema = buildBreadcrumbSchema(data.breadcrumbs)
  const faqSchema = buildFaqSchema(data.faqs)
  const productSchemas = buildSoftwareAppSchema(
    data.products.map((p) => ({
      name: p.name,
      description: p.tagline,
      ratingValue: p.score,
      reviewCount: p.reviewCount,
      price: p.pricingAmount.replace(/[^0-9.]/g, '') || '0',
    }))
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {productSchemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <ComparisonPageTemplate data={data} />
    </>
  )
}
