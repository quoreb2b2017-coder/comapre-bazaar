/** Vendors with live outbound links + quote CTAs on their review pages. */
const WHITELISTED_REVIEW_SLUGS = new Set([
  'adp-review',
  'buddy-punch-review',
  'gusto-review',
  'nextiva-review',
  'deel-eor-review',
  'deel-contractor-review',
  'deel-payroll-review',
  'deel-hr-review',
  'deel-us-payroll-review',
  'papaya-global-payroll-review',
  'papaya-eor-review',
  'papaya-contractor-review',
  'papaya-workforce-review',
  'software-advice-review',
])

const WHITELISTED_NAME_PREFIXES = [
  'adp',
  'buddy punch',
  'deel',
  'gusto',
  'nextiva',
  'papaya',
  'software advice',
]

export function isWhitelistedVendor(reviewSlug: string, productName?: string): boolean {
  if (WHITELISTED_REVIEW_SLUGS.has(reviewSlug)) return true
  const name = String(productName || '').trim().toLowerCase()
  if (!name) return false
  return WHITELISTED_NAME_PREFIXES.some((prefix) => name === prefix || name.startsWith(`${prefix} `))
}

/** @deprecated use isWhitelistedVendor */
export const isActiveFullReview = isWhitelistedVendor

export function fullReviewHref(reviewSlug: string): string {
  return `/reviews/${reviewSlug}`
}
