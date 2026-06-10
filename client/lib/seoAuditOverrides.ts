/** CSV audit overrides where dynamic product names differ from approved SEO copy. */

export type CompareSeoOverride = {
  /** Name used in meta description ("See how X compares…"). */
  metaName?: string
  /** Name used in page/OG title ("X Review and Pricing 2026"). */
  titleName?: string
}

/** Key: `${categorySlug}:${brandId}` */
export const COMPARE_SEO_OVERRIDES: Record<string, CompareSeoOverride> = {
  'papaya-global-payroll:papaya-global-payroll': {
    metaName: 'Global Payroll',
    titleName: 'Papaya Global Payroll',
  },
  'email-marketing:hubspot-email': {
    metaName: 'HubSpot Email',
    titleName: 'HubSpot',
  },
  'deel-hr-payroll:deel-us-payroll': {
    metaName: 'Deel US Payroll',
    titleName: 'Deel',
  },
}

/** Short vendor label for quote page titles when ?product= is present (OG / duplicate-title CSV). */
export const QUOTE_VENDOR_TITLE_PREFIX: Record<string, string> = {
  'freshdesk-cc-review': 'Freshdesk',
}

export function compareSeoKey(categorySlug: string, brandId: string): string {
  return `${categorySlug}:${brandId}`
}

export function resolveCompareSeoNames(
  categorySlug: string,
  brandId: string,
  productName: string
): { metaName: string; titleName: string } {
  const override = COMPARE_SEO_OVERRIDES[compareSeoKey(categorySlug, brandId)]
  return {
    metaName: override?.metaName ?? productName,
    titleName: override?.titleName ?? productName,
  }
}

export function resolveQuoteVendorTitlePrefix(
  productSlug: string | undefined,
  vendor: string
): string {
  if (productSlug && QUOTE_VENDOR_TITLE_PREFIX[productSlug]) {
    return QUOTE_VENDOR_TITLE_PREFIX[productSlug]
  }
  return vendor
}
