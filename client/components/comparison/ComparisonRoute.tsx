import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ComparisonPageData } from '@/types'
import { buildMetadata, buildBreadcrumbSchema, buildFaqSchema, buildSoftwareAppSchema } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
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
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={faqSchema} />
      {productSchemas.map((s, i) => (
        <JsonLd key={i} schema={s} />
      ))}
      <ComparisonPageTemplate data={data} />
    </>
  )
}
