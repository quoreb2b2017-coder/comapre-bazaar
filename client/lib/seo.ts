import type { Metadata } from 'next'

const SITE_URL = 'https://www.compare-bazaar.com'
const SITE_NAME = 'Compare Bazaar'

export function buildMetadata({
  title,
  description,
  canonical,
  openGraphType = 'website',
}: {
  title: string
  description: string
  canonical: string
  openGraphType?: 'website' | 'article'
}): Metadata {
  const url = `${SITE_URL}${canonical}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: openGraphType,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  }
}

export function buildBreadcrumbSchema(
  items: { label: string; href?: string }[]
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items
      .filter((i) => i.href)
      .map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: item.label,
        item: `${SITE_URL}${item.href}`,
      })),
  }
}

export function buildFaqSchema(
  items: { question: string; answer: string }[]
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function buildItemListSchema(
  name: string,
  items: { name: string; href: string; description: string }[]
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
      description: item.description,
    })),
  }
}

export function buildSoftwareAppSchema(items: {
  name: string
  description: string
  ratingValue: string
  reviewCount: number
  price: string
}[]): object[] {
  return items.map((item) => ({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: item.name,
    applicationCategory: 'BusinessApplication',
    description: item.description,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: item.ratingValue,
      reviewCount: item.reviewCount,
      bestRating: '5',
    },
    offers: {
      '@type': 'Offer',
      price: item.price,
      priceCurrency: 'USD',
    },
  }))
}

export function buildOrganizationSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    description:
      'Compare Bazaar provides independent business software comparisons, pricing research, and expert buying guides for B2B decision-makers.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-332-231-0404',
      email: 'marketing@compare-bazaar.com',
      contactType: 'customer support',
    },
    sameAs: ['https://www.linkedin.com/company/comparebazaar/'],
  }
}

export function buildWebSiteSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}
