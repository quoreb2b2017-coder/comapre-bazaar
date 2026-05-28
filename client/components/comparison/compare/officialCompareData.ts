import type { ComparisonTableData, Product } from '@/types'

export type OfficialProductSnapshot = {
  listPrice: string
  freePlan: string
  bestForShort: string
  extraFacts: { label: string; value: string }[]
}

function normalizeName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function namesMatch(productName: string, tableName: string): boolean {
  const a = normalizeName(productName)
  const b = normalizeName(tableName)
  if (!a || !b) return false
  return a.includes(b) || b.includes(a) || a.split(' ')[0] === b.split(' ')[0]
}

export function findOfficialTableRow(
  product: Product,
  table?: ComparisonTableData
): string[] | null {
  if (!table?.rows?.length) return null
  const row = table.rows.find((r) => namesMatch(product.name, r.cells[0] ?? ''))
  return row?.cells ?? null
}

/** Editorial comparison grid + product card — aligned for display. */
export function getOfficialSnapshot(
  product: Product,
  table?: ComparisonTableData
): OfficialProductSnapshot {
  const cells = findOfficialTableRow(product, table)
  const headers = table?.headers ?? []

  const listPrice =
    cells?.[2]?.trim() ||
    `${product.pricingAmount}${product.pricingPeriod ? ` ${product.pricingPeriod}` : ''}`.trim()

  const freePlan =
    cells?.[3]?.trim() ||
    (product.badges.some((b) => b.variant === 'free')
      ? 'Yes'
      : product.badges.find((b) => b.variant === 'trial')?.label ?? 'No')

  const bestForShort = cells?.[cells.length - 1]?.trim() || product.tagline

  const extraFacts: { label: string; value: string }[] = []
  if (cells && headers.length > 0) {
    for (let i = 1; i < cells.length; i++) {
      const label = headers[i]?.trim()
      const value = cells[i]?.trim()
      if (!label || !value) continue
      if (i === 2 || i === 3) continue
      if (/^best\s*for$/i.test(label)) continue
      extraFacts.push({ label, value })
    }
  }

  return { listPrice, freePlan, bestForShort, extraFacts }
}

export function shortenText(text: string, max = 78): string {
  const t = text.trim()
  if (t.length <= max) return t
  const cut = t.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}

/** 3 punchy strengths from verified product data. */
export function getMainPoints(product: Product): string[] {
  return product.pros.slice(0, 3).map((p) => shortenText(p, 82))
}

/** 1–2 short limitations. */
export function getShortWatchOuts(product: Product): string[] {
  return product.cons.slice(0, 2).map((c) => shortenText(c, 72))
}

export function getBottomLine(product: Product, snapshot: OfficialProductSnapshot): string {
  const watch = product.cons[0] ? shortenText(product.cons[0], 56) : 'plan for tier upgrades'
  return shortenText(
    `${product.score}/5 · ${snapshot.bestForShort}. Pick it for ${shortenText(product.pros[0] ?? 'core features', 48).toLowerCase()}; watch ${watch.toLowerCase()}.`,
    140
  )
}

export function parseScore(value: string): number {
  const m = value.match(/(\d+(?:\.\d+)?)/)
  return m ? Number.parseFloat(m[1]) : 0
}

export function bestScoreIndex(products: Product[]): number {
  let best = 0
  let max = parseScore(products[0]?.score ?? '0')
  products.forEach((p, i) => {
    const s = parseScore(p.score)
    if (s > max) {
      max = s
      best = i
    }
  })
  return best
}
