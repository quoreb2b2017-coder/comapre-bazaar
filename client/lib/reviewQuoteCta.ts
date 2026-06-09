import { comparisonPages } from '@/data/comparisons'
import { isWhitelistedVendor } from '@/lib/activeFullReviews'

export type ReviewQuoteCta = {
  href: string
  title: string
  body: string
  buttonLabel: string
}

const FALLBACK_HREF = '/technology/get-free-quotes'

/** Path + query for review-sourced vendor quote landings (no hash). */
export function buildReviewVendorQuotePath(
  reviewSlug: string,
  reviewName: string,
  categoryPath: string
): string | null {
  const page = comparisonPages.find((p) => p.canonical === categoryPath)
  const baseHref = page?.ctaSlug
  if (!baseHref) return null
  const root = baseHref.split('#')[0].replace(/\/$/, '')
  const params = new URLSearchParams({
    ref: 'review',
    product: reviewSlug,
    vendor: reviewName.trim(),
  })
  return `${root}?${params.toString()}`
}

function quoteHref(base: string, reviewSlug: string, reviewName: string): string {
  const root = base.split('#')[0].replace(/\/$/, '')
  const params = new URLSearchParams({
    ref: 'review',
    product: reviewSlug,
    vendor: reviewName.trim(),
  })
  return `${root}?${params.toString()}#quote-form`
}

export function getReviewQuoteCta(
  reviewSlug: string,
  reviewName: string,
  categoryPath: string
): ReviewQuoteCta {
  const page = comparisonPages.find((p) => p.canonical === categoryPath)
  const baseHref = page?.ctaSlug || FALLBACK_HREF
  const href = quoteHref(baseHref, reviewSlug, reviewName)
  const name = reviewName.trim()

  if (isWhitelistedVendor(reviewSlug, reviewName)) {
    return {
      href,
      title: `Get free ${name} quotes`,
      body: cleanBody(
        `Share your team size and requirements. We match you with ${name} and comparable vendors, usually within one business day.`
      ),
      buttonLabel: 'Get Free Quotes',
    }
  }

  const title = page?.ctaTitle ? cleanBody(page.ctaTitle) : `Compare ${name} with similar tools`

  const body = page?.ctaBody
    ? cleanBody(page.ctaBody)
    : cleanBody(
        `Evaluating ${name}? Use our free quote form to compare pricing, features, and fit with alternatives in the same category.`
      )

  return {
    href,
    title,
    body,
    buttonLabel: 'Get Free Quotes',
  }
}

function cleanBody(text: string): string {
  return String(text || '')
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/,\s*,/g, ',')
    .trim()
}
