import type { QuoteLandingFormKey } from '@/lib/quoteLandingFormRegistry'

const SLUG_TO_FORM: Record<string, QuoteLandingFormKey> = {
  'crm-software': 'crm',
  'sales-crm': 'crm',
  'email-marketing': 'email-marketing',
  'website-builder': 'website-building',
  'payroll-software': 'payroll',
  'technology-payroll': 'payroll',
  'papaya-global-payroll': 'payroll',
  'deel-hr-payroll': 'payroll',
  'business-phone-systems': 'business-phone',
  'gps-fleet-management': 'gps-fleet',
  'employee-management': 'employee-management',
  'call-center': 'call-center',
  'project-management': 'project-management',
}

/** Map comparison page slug / CTA path to the embedded quote form. */
export function resolveComparisonQuoteFormKey(slug: string, ctaSlug?: string): QuoteLandingFormKey {
  if (SLUG_TO_FORM[slug]) return SLUG_TO_FORM[slug]

  const path = (ctaSlug || '').toLowerCase()
  if (path.includes('crm')) return 'crm'
  if (path.includes('payroll')) return 'payroll'
  if (path.includes('email-marketing') || path.includes('email')) return 'email-marketing'
  if (path.includes('website')) return 'website-building'
  if (path.includes('phone')) return 'business-phone'
  if (path.includes('gps') || path.includes('fleet')) return 'gps-fleet'
  if (path.includes('employee')) return 'employee-management'
  if (path.includes('call-center')) return 'call-center'
  if (path.includes('project')) return 'project-management'

  return 'crm'
}
