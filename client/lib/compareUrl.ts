export function parseVsParam(vs: string | string[] | undefined): string[] {
  if (!vs) return []
  const raw = Array.isArray(vs) ? vs.join(',') : vs
  return [...new Set(raw.split(',').map((s) => s.trim()).filter(Boolean))]
}

export function buildCompareToggleHref(
  category: string,
  brandId: string,
  selectedIds: string[],
  productId: string
): string {
  const isSelected = selectedIds.includes(productId)
  const next = isSelected ? selectedIds.filter((id) => id !== productId) : [...selectedIds, productId]

  const params = new URLSearchParams()
  params.set('category', category)
  params.set('brand', brandId)
  if (next.length > 0) params.set('vs', next.join(','))

  return `/compare?${params.toString()}`
}

export function buildCompareClearHref(category: string, brandId: string): string {
  const params = new URLSearchParams()
  params.set('category', category)
  params.set('brand', brandId)
  return `/compare?${params.toString()}`
}
