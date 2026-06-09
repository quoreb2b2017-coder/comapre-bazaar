import type { Metadata } from 'next'

export const SITE_URL = 'https://www.compare-bazaar.com'
const SITE_NAME = 'Compare Bazaar'

/** Default Open Graph / WhatsApp preview image (absolute URL). Override via NEXT_PUBLIC_OG_IMAGE_PATH or replace asset at /images/logo.png */
export function defaultOgImageUrl(): string {
  const path = process.env.NEXT_PUBLIC_OG_IMAGE_PATH || '/api/og'
  if (path.startsWith('http')) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

/** Plain-text excerpt for meta / shares (HTML stripped, length capped). */
export function formatShareDescription(raw: string | undefined | null, maxLen = 158): string {
  const plain = String(raw || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!plain) return `${SITE_NAME}: software buying guides and comparisons.`
  return plain.length <= maxLen ? plain : `${plain.slice(0, maxLen - 1)}…`
}

export function buildMetadata({
  title,
  description,
  canonical,
  openGraphType = 'website',
  ogTitle,
  ogUrl,
}: {
  title: string
  description: string
  canonical: string
  openGraphType?: 'website' | 'article'
  /** Full share title (defaults to page title with site suffix). */
  ogTitle?: string
  /** Absolute og:url including query strings when needed. */
  ogUrl?: string
}): Metadata {
  const pageUrl = canonical.startsWith('http') ? canonical : `${SITE_URL}${canonical}`
  const shareUrl = ogUrl ?? pageUrl
  const ogImage = defaultOgImageUrl()
  // Cap at 155 chars — Google truncates at ~155 (mobile: ~120)
  const truncatedDesc = description.length > 155 ? `${description.slice(0, 154)}…` : description
  // Use `absolute` to bypass the root layout template ('%s | Compare Bazaar').
  // Without this, pages that already contain the site name in their title string
  // would render "Title | Compare Bazaar | Compare Bazaar" in the <title> tag.
  const absoluteTitle = title.includes('| Compare Bazaar')
    ? title
    : `${title} | Compare Bazaar`
  const graphTitle = ogTitle ?? absoluteTitle

  return {
    title: { absolute: absoluteTitle },
    description: truncatedDesc,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: graphTitle,
      description: truncatedDesc,
      url: shareUrl,
      siteName: SITE_NAME,
      type: openGraphType,
      locale: 'en_US',
      images: [{
        url: ogImage,
        width: 1200,
        height: 630,
        // Alt should describe the image, not repeat the page title
        alt: `${SITE_NAME} — business software comparisons and expert reviews`,
        type: 'image/png',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@CompareBazaar',
      creator: '@CompareBazaar',
      title: graphTitle,
      description: truncatedDesc,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  }
}

/** Rich previews for WhatsApp, LinkedIn, Facebook, Slack (article type + dates + large image). */
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
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `Compare Bazaar — ${opts.title}`, type: 'image/png' }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@CompareBazaar',
      creator: '@CompareBazaar',
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

function plainTextForSchema(value: string): string {
  return String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Merge multiple schema objects into one graph (avoids duplicate-type issues in Search Console). */
export function buildJsonLdGraph(schemas: object[]): object {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas.map((schema) => {
      const { '@context': _removed, ...rest } = schema as Record<string, unknown>
      return rest
    }),
  }
}

/** JSON-LD FAQPage for Google rich results. Returns null if no valid Q&A pairs. */
export function buildFaqSchema(
  items: { question: string; answer: string }[],
  pageUrl?: string
): object | null {
  const mainEntity = items
    .map((faq) => ({
      question: plainTextForSchema(faq.question),
      answer: plainTextForSchema(faq.answer),
    }))
    .filter((faq) => faq.question.length > 0 && faq.answer.length > 0)
    .map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    }))

  if (mainEntity.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(pageUrl ? { '@id': `${pageUrl}#faq`, url: pageUrl } : {}),
    mainEntity,
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
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/favicon-96.png`,
      width: 96,
      height: 96,
    },
    description:
      'Compare Bazaar provides independent business software comparisons, pricing research, and expert buying guides for B2B decision-makers.',
    contactPoint: {
      '@type': 'ContactPoint',
      url: `${SITE_URL}/contact`,
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
