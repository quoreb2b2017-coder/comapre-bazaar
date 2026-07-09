export function whitePaperDescriptionPath(slug: string): string {
  const safe = String(slug || '').trim()
  if (!safe) return '/resources/whitepapers'
  return `/resources/whitepapers/${encodeURIComponent(safe)}/description`
}

export function reviewDescriptionPath(slug: string): string {
  return `/reviews/${slug}/description`
}
