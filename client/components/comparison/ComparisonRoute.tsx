import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ComparisonPageData } from '@/types'
import { SITE_URL, buildMetadata, buildBreadcrumbSchema, buildFaqSchema } from '@/lib/seo'
import { ComparisonPageTemplate } from '@/components/comparison/ComparisonPageTemplate'

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
  const breadcrumbSchema = buildBreadcrumbSchema(data.breadcrumbs)
  const faqSchema = data.faqs.length > 0 ? buildFaqSchema(data.faqs, pageUrl) : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      ) : null}
      <ComparisonPageTemplate data={data} />
    </>
  )
}
