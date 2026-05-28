import type { ComparisonTableData, Product } from '@/types'

/** Minimal server → client payload (no FAQs, tables, or long intro copy). */
export type ComparePagePayload = {
  slug: string
  canonical: string
  lastReviewed: string
  breadcrumbs: { label: string; href?: string }[]
  products: Product[]
  /** Category comparison grid — used for official price / feature alignment. */
  officialTable: ComparisonTableData
}
