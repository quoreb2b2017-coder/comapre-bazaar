/** Public site publisher label (no individual editor names). */
export const PUBLIC_PUBLISHER_NAME = 'Compare Bazaar'

/** Parent / niche publisher line for public footers. */
export const NICHE_PUBLISHER_LINE = 'Published by Quore B2B Marketing.'

/** Use for JSON-LD when a person name must not appear publicly. */
export function publicSchemaAuthor() {
  return { name: PUBLIC_PUBLISHER_NAME, url: 'https://www.compare-bazaar.com' }
}
