import { comparisonPages } from '@/data/comparisons'

export type ReviewQuotePopupKind =
  | 'crm'
  | 'email-marketing'
  | 'website-building'
  | 'payroll'
  | 'business-phone'
  | 'gps-fleet'
  | 'employee-management'
  | 'call-center'
  | 'project-management'

export type ReviewQuotePopupConfig = {
  kind: ReviewQuotePopupKind
  title: string
}

function resolvePopupKind(ctaSlug: string, categoryPath: string): ReviewQuotePopupKind | null {
  const haystack = `${ctaSlug} ${categoryPath}`.toLowerCase()

  if (haystack.includes('crm-software') || haystack.includes('/crm')) return 'crm'
  if (haystack.includes('email-marketing')) return 'email-marketing'
  if (haystack.includes('website-building')) return 'website-building'
  if (haystack.includes('payroll')) return 'payroll'
  if (haystack.includes('business-phone')) return 'business-phone'
  if (haystack.includes('gps-fleet')) return 'gps-fleet'
  if (haystack.includes('employee-management')) return 'employee-management'
  if (haystack.includes('call-center')) return 'call-center'
  if (haystack.includes('project-management')) return 'project-management'

  return null
}

export function getReviewQuotePopup(
  categoryPath: string,
  reviewName: string
): ReviewQuotePopupConfig | null {
  const page = comparisonPages.find((p) => p.canonical === categoryPath)
  const ctaSlug = page?.ctaSlug || ''
  const kind = resolvePopupKind(ctaSlug, categoryPath)

  if (!kind) return null

  const name = reviewName.trim()
  return {
    kind,
    title: `Get free ${name} quotes`,
  }
}
