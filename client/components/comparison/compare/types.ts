import type { Product } from '@/types'

/** Minimal server → client payload (no FAQs, tables, or long intro copy). */
export type ComparePagePayload = {
  slug: string
  canonical: string
  lastReviewed: string
  breadcrumbs: { label: string; href?: string }[]
  products: Product[]
}
