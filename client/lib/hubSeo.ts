import { hubs } from '@/lib/content-map'

/** Map a comparison hub canonical path to its content-map hub slug. */
export function hubSlugForCanonical(canonical: string): string | null {
  const normalized = canonical.startsWith('/') ? canonical : `/${canonical}`
  const match = hubs.find((hub) => hub.path === normalized)
  if (match) return match.slug

  // Live HR comparison hub (indexed slug differs from blueprint target path).
  if (normalized === '/human-resources/best-employee-management-software') return 'hr'

  return null
}

/** Parse editorial "last reviewed" labels into YYYY-MM-DD for schema stamps. */
export function parseReviewDateToIso(raw: string): string {
  const parsed = new Date(raw)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10)
  }
  return new Date().toISOString().slice(0, 10)
}
