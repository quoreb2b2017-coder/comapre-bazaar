import type { Metadata } from 'next'

export const SITE_URL = 'https://www.compare-bazaar.com'
const SITE_NAME = 'Compare Bazaar'

/** Default Open Graph / WhatsApp preview image (absolute URL). Override via NEXT_PUBLIC_OG_IMAGE_PATH or replace asset at /images/logo.png */
export function defaultOgImageUrl(): string {
  const path = process.env.NEXT_PUBLIC_OG_IMAGE_PATH || '/images/logo.png'
  if (path.startsWith('http')) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

/** Plain-text excerpt for meta / shares (HTML stripped, length capped). */
export function formatShareDescription(raw: string | undefined | null, maxLen = 158): string {
  const plain = String(raw || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!plain) return `${SITE_NAME} — software buying guides and comparisons.`
  return plain.length <= maxLen ? plain : `${plain.slice(0, maxLen - 1)}…`
}

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
  const ogImage = defaultOgImageUrl()
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
      locale: 'en_US',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  }
}

/** Rich previews for WhatsApp, LinkedIn, Facebook, Slack — article type + dates + large image. */
export function buildBlogShareMetadata(opts: {
  title: string
  description: string
  canonicalPath: string
  publishedAt?: string | Date | null
  modifiedAt?: string | Date | null
  section?: string
  keywords?: string[]
  authorName?: string
  ogImageUrl?: string
}): Metadata {
  const path = opts.canonicalPath.startsWith('/') ? opts.canonicalPath : `/${opts.canonicalPath}`
  const url = `${SITE_URL}${path}`
  const desc = formatShareDescription(opts.description)
  const imageUrl = opts.ogImageUrl || defaultOgImageUrl()
  const pub =
    opts.publishedAt != null && opts.publishedAt !== ''
      ? new Date(opts.publishedAt).toISOString()
      : undefined
  const mod =
    opts.modifiedAt != null && opts.modifiedAt !== ''
      ? new Date(opts.modifiedAt).toISOString()
      : pub
  const author = opts.authorName || SITE_NAME

  return {
    title: { absolute: `${opts.title} | Compare Bazaar Blog` },
    description: desc,
    keywords: opts.keywords?.length ? opts.keywords : undefined,
    alternates: { canonical: url },
    authors: [{ name: author, url: SITE_URL }],
    openGraph: {
      title: opts.title,
      description: desc,
      url,
      siteName: SITE_NAME,
      type: 'article',
      locale: 'en_US',
      publishedTime: pub,
      modifiedTime: mod,
      section: opts.section,
      tags: opts.keywords,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: opts.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: desc,
      images: [imageUrl],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  }
}

export function buildBlogPostingJsonLd(opts: {
  headline: string
  description: string
  path: string
  datePublished?: string
  dateModified?: string
  keywords?: string[]
}): object {
  const url = `${SITE_URL}${opts.path.startsWith('/') ? opts.path : `/${opts.path}`}`
  const logo = defaultOgImageUrl()
  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.headline,
    description: formatShareDescription(opts.description, 300),
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: [logo],
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: logo },
    },
  }
  if (opts.datePublished) base.datePublished = opts.datePublished
  if (opts.dateModified || opts.datePublished) {
    base.dateModified = opts.dateModified || opts.datePublished
  }
  if (opts.keywords?.length) base.keywords = opts.keywords.join(', ')
  return base
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
