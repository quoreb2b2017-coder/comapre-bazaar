/** Readable view counts for blog UI (listings, article meta, admin). */
export function formatBlogViews(n: number): string {
  const x = Math.max(0, Math.floor(Number.isFinite(n) ? n : 0))
  if (x < 1000) return x.toLocaleString('en-US')
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(x)
}
