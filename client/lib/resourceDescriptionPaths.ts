export function whitePaperDescriptionPath(slug: string): string {
  const safe = String(slug || '').trim()
  if (!safe) return '/resources/whitepaper'
  return `/resources/whitepaper/${encodeURIComponent(safe)}/description`
}

export function reviewDescriptionPath(slug: string): string {
  return `/reviews/${slug}/description`
}
