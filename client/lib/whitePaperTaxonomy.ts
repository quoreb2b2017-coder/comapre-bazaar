import { hubs } from '@/lib/content-map'

export type WhitePaperResourceType = 'whitepaper' | 'report' | 'case_study' | 'webinar'

/** Public-facing labels for software verticals (matches site comparison hubs). */
const VERTICAL_LABELS: Record<string, string> = {
  crm: 'Best CRM Software',
  'email-marketing': 'Best Email Marketing Services',
  'website-builders': 'Best Website Building Platform',
  voip: 'Best Business Phone Systems',
  'gps-fleet': 'Best Fleet Management Software',
  payroll: 'Best Payroll Software',
  hr: 'Best Employee Management Software',
  'call-center': 'Best Call Center Management Software',
  'project-management': 'Best Project Management Software',
}

export const WHITEPAPER_VERTICALS = hubs.map((hub) => ({
  slug: hub.slug,
  label: VERTICAL_LABELS[hub.slug] || `Best ${hub.name}`,
  path: hub.path,
}))

export const WHITEPAPER_RESOURCE_TYPES: {
  value: WhitePaperResourceType
  label: string
  description: string
}[] = [
  {
    value: 'whitepaper',
    label: 'White paper',
    description: 'Long-form research PDF for download',
  },
  {
    value: 'report',
    label: 'Report',
    description: 'Benchmark or trends report',
  },
  {
    value: 'case_study',
    label: 'Case study',
    description: 'Customer or implementation story',
  },
  {
    value: 'webinar',
    label: 'Webinar',
    description: 'On-demand or live session replay',
  },
]

const RESOURCE_TYPE_SET = new Set(WHITEPAPER_RESOURCE_TYPES.map((t) => t.value))

export function normalizeWhitePaperResourceType(
  value?: string | null,
  fallback: WhitePaperResourceType = 'whitepaper'
): WhitePaperResourceType {
  const v = String(value || fallback)
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
  if (v === 'case_study' || v === 'casestudy') return 'case_study'
  if (v === 'webinar') return 'webinar'
  if (v === 'report') return 'report'
  return 'whitepaper'
}

export function whitePaperResourceLabel(type: WhitePaperResourceType): string {
  return WHITEPAPER_RESOURCE_TYPES.find((t) => t.value === type)?.label || 'White paper'
}

export function whitePaperResourceLabelLower(type: WhitePaperResourceType): string {
  return whitePaperResourceLabel(type).toLowerCase()
}

export function whitePaperViewLabel(type: WhitePaperResourceType): string {
  return `View ${whitePaperResourceLabelLower(type)}`
}

export function whitePaperRequestLabel(type: WhitePaperResourceType): string {
  return `Request your free ${whitePaperResourceLabelLower(type)}:`
}

export function whitePaperFreeBadgeLabel(type: WhitePaperResourceType): string {
  return `Free ${whitePaperResourceLabelLower(type)}`
}

export function whitePaperDownloadFormTitle(type: WhitePaperResourceType): string {
  return `Download this ${whitePaperResourceLabelLower(type)}`
}

export function whitePaperLearnFromLabel(type: WhitePaperResourceType): string {
  return `What you'll learn from this ${whitePaperResourceLabelLower(type)}`
}

export function whitePaperKeyInsightsFallback(type: WhitePaperResourceType): string {
  return `Key insights from this ${whitePaperResourceLabelLower(type)}`
}

export function whitePaperBackToLibraryLabel(): string {
  return 'Back to library'
}

export function whitePaperBackToItemLabel(type: WhitePaperResourceType): string {
  return `Back to ${whitePaperResourceLabelLower(type)}`
}

export function whitePaperReturnToItemLabel(type: WhitePaperResourceType): string {
  return `Return to ${whitePaperResourceLabelLower(type)}`
}

export function whitePaperShareHeading(type: WhitePaperResourceType): string {
  return `Share this ${whitePaperResourceLabelLower(type)}`
}

export function whitePaperOgCtaLabel(type: WhitePaperResourceType): string {
  if (type === 'webinar') return 'Watch free webinar'
  return 'Download free PDF'
}

export function whitePaperFreePdfCTA(type: WhitePaperResourceType): string {
  if (type === 'webinar') return 'Free access →'
  return 'Free PDF →'
}

export function whitePaperOverviewCtaLabel(type: WhitePaperResourceType): string {
  return `${whitePaperResourceLabel(type)} overview`
}

export function normalizeWhitePaperVerticalSlug(value?: string | null): string {
  const raw = String(value || '').trim()
  if (!raw) return ''
  const slug = raw.toLowerCase().replace(/\s+/g, '-')
  if (WHITEPAPER_VERTICALS.some((v) => v.slug === slug)) return slug
  return raw
}

/** Resolve vertical slug from metadata (supports legacy free-text category). */
export function resolveWhitePaperVerticalSlug(
  metadata?: { vertical?: string; category?: string } | null
): string {
  const explicit = normalizeWhitePaperVerticalSlug(metadata?.vertical)
  if (explicit && WHITEPAPER_VERTICALS.some((v) => v.slug === explicit)) return explicit

  const cat = String(metadata?.category || '')
    .trim()
    .toLowerCase()
  if (!cat) return ''

  for (const item of WHITEPAPER_VERTICALS) {
    if (cat === item.slug || cat === item.label.toLowerCase()) return item.slug
  }

  const fuzzy: [RegExp, string][] = [
    [/\bcrm\b/, 'crm'],
    [/email\s*marketing/, 'email-marketing'],
    [/website/, 'website-builders'],
    [/phone|voip|ucaas/, 'voip'],
    [/fleet|gps|telematics/, 'gps-fleet'],
    [/payroll/, 'payroll'],
    [/\bhr\b|human resources|employee management/, 'hr'],
    [/call center|contact center/, 'call-center'],
    [/project management/, 'project-management'],
  ]

  for (const [re, slug] of fuzzy) {
    if (re.test(cat)) return slug
  }

  return ''
}

export function whitePaperVerticalLabel(
  metadata?: { vertical?: string; category?: string } | null
): string {
  const slug = resolveWhitePaperVerticalSlug(metadata)
  if (!slug) return String(metadata?.category || '').trim()
  return WHITEPAPER_VERTICALS.find((v) => v.slug === slug)?.label || slug
}

export function whitePaperVerticalPath(
  metadata?: { vertical?: string; category?: string } | null
): string | null {
  const slug = resolveWhitePaperVerticalSlug(metadata)
  if (!slug) return null
  return WHITEPAPER_VERTICALS.find((v) => v.slug === slug)?.path || null
}

export function isWhitePaperResourceType(value: string): value is WhitePaperResourceType {
  return RESOURCE_TYPE_SET.has(value as WhitePaperResourceType)
}
