// ─── Product / Comparison ────────────────────────────────────────────────────

export interface ProductBadge {
  variant: 'top' | 'free' | 'trial' | 'new'
  label: string
}

export interface Product {
  id: string
  logo: string           // 2-letter initials
  name: string
  tagline: string
  score: string          // e.g. "4.5"
  reviewCount: number
  badges: ProductBadge[]
  pros: string[]
  cons: string[]
  pricingLabel: string
  pricingAmount: string
  pricingPeriod: string
  vendorUrl: string      // real URL, not "#"
  reviewSlug: string
  isTopPick?: boolean
}

export interface TableRow {
  cells: string[]
}

export interface ComparisonTableData {
  headers: string[]
  rows: TableRow[]
}

export interface FaqItem {
  question: string
  answer: string
}

export interface Author {
  initials: string
  name: string
  credential: string
}

export interface TocItem {
  label: string
  anchor: string
}

// ─── Page Data ────────────────────────────────────────────────────────────────

export interface ComparisonPageData {
  slug: string
  title: string
  metaDescription: string
  canonical: string
  h1: string
  intro: string
  breadcrumbs: { label: string; href?: string }[]
  author: Author
  reviewer: string
  lastReviewed: string
  winnerSummary: string
  products: Product[]
  table: ComparisonTableData
  faqs: FaqItem[]
  tocItems: TocItem[]
  ctaTitle: string
  ctaBody: string
  ctaSlug: string
  faqSchemaItems?: FaqItem[]
  /** JSON-LD schema scripts to inject into <head> */
  schemas?: object[]
}

// ─── Hub Page ─────────────────────────────────────────────────────────────────

export interface HubCard {
  href: string
  icon: string
  title: string
  description: string
  meta: string
}

export interface HubPageData {
  slug: string
  title: string
  metaDescription: string
  canonical: string
  h1: string
  subtitle: string
  cards: HubCard[]
  breadcrumbs: { label: string; href?: string }[]
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  children?: { label: string; href: string; description?: string }[]
}
