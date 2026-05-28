import {
  bestScoreIndex,
  getBottomLine,
  getMainPoints,
  getOfficialSnapshot,
  getShortWatchOuts,
  parseScore,
} from '@/components/comparison/compare/officialCompareData'
import type { ComparisonTableData, Product } from '@/types'

export type CompareCellValue = string | string[]

export type CompareTableRow =
  | { kind: 'section'; label: string; hint?: string }
  | {
      kind: 'data'
      label: string
      sublabel?: string
      values: CompareCellValue[]
      highlight?: boolean
      rich?: boolean
      variant?: 'default' | 'main' | 'watch' | 'score'
      bestIndex?: number
    }

export function buildComparisonRows(
  products: Product[],
  officialTable?: ComparisonTableData
): CompareTableRow[] {
  const snapshots = products.map((p) => getOfficialSnapshot(p, officialTable))
  const scoreBest = bestScoreIndex(products)

  const extraLabels = Array.from(
    new Set(snapshots.flatMap((s) => s.extraFacts.map((f) => f.label)))
  )

  const rows: CompareTableRow[] = [
    {
      kind: 'section',
      label: 'At a glance',
      hint: 'Official list prices & category benchmarks from our comparison guides',
    },
    {
      kind: 'data',
      label: 'Official starting price',
      sublabel: 'Vendor list / guide price',
      highlight: true,
      values: snapshots.map((s) => s.listPrice),
    },
    {
      kind: 'data',
      label: 'Free plan',
      sublabel: 'Per vendor & our review grid',
      values: snapshots.map((s) => s.freePlan),
    },
    {
      kind: 'data',
      label: 'Expert score',
      sublabel: 'Compare Bazaar rating',
      variant: 'score',
      bestIndex: scoreBest,
      values: products.map((p) => `${p.score} / 5`),
    },
    {
      kind: 'data',
      label: 'Best for',
      sublabel: 'Short fit summary',
      rich: true,
      values: snapshots.map((s) => s.bestForShort),
    },
    ...extraLabels.map((label) => ({
      kind: 'data' as const,
      label,
      sublabel: 'From comparison grid',
      values: products.map((p) => {
        const snap = getOfficialSnapshot(p, officialTable)
        return snap.extraFacts.find((f) => f.label === label)?.value ?? '—'
      }),
    })),
    {
      kind: 'section',
      label: 'Main points',
      hint: 'Top reasons teams choose each tool — short editorial summary',
    },
    {
      kind: 'data',
      label: 'Why teams pick it',
      sublabel: '3 key strengths',
      variant: 'main',
      rich: true,
      values: products.map((p) => getMainPoints(p)),
    },
    {
      kind: 'section',
      label: 'Short watch-outs',
      hint: 'Plan for these before you buy',
    },
    {
      kind: 'data',
      label: 'Limitations',
      sublabel: '1–2 things to weigh',
      variant: 'watch',
      rich: true,
      values: products.map((p) => getShortWatchOuts(p)),
    },
    {
      kind: 'section',
      label: 'Bottom line',
      hint: 'One-line takeaway per product',
    },
    {
      kind: 'data',
      label: 'Our take',
      sublabel: 'Score + fit + trade-off',
      rich: true,
      values: products.map((p, i) => getBottomLine(p, snapshots[i])),
    },
  ]

  return rows
}

export { parseScore }
