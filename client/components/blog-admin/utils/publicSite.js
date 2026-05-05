/** Homepage URL after admin logout (same origin in dev; optional absolute URL in prod). */
export function getPublicSiteHomeUrl() {
  const raw =
    typeof process !== 'undefined' && process.env.NEXT_PUBLIC_PUBLIC_SITE_URL
      ? String(process.env.NEXT_PUBLIC_PUBLIC_SITE_URL).trim().replace(/\/$/, '')
      : ''
  if (raw) return `${raw}/`
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/`
  }
  return '/'
}
