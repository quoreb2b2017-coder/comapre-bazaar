import type { Product } from '@/types'

/** Curated logos when auto-resolution returns a weak favicon. */
const LOGO_OVERRIDES: Record<string, string> = {
  hubspot: 'https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png',
}

export function extractVendorDomain(vendorUrl: string): string | null {
  try {
    const hostname = new URL(vendorUrl).hostname.replace(/^www\./i, '')
    return hostname || null
  } catch {
    return null
  }
}

/** Ordered logo sources — first loadable image wins in ProductLogo. */
export function getVendorLogoSources(product: Pick<Product, 'id' | 'vendorUrl' | 'logoUrl'>): string[] {
  const sources: string[] = []

  if (product.logoUrl?.trim()) {
    sources.push(product.logoUrl.trim())
  }

  const override = LOGO_OVERRIDES[product.id]
  if (override) {
    sources.push(override)
  }

  const domain = extractVendorDomain(product.vendorUrl)
  if (!domain) return sources

  const logoDevToken = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN?.trim()
  if (logoDevToken) {
    sources.push(`https://img.logo.dev/${domain}?token=${logoDevToken}&size=128&format=png`)
  }

  sources.push(`https://unavatar.io/${domain}?fallback=false`)
  sources.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`)

  return [...new Set(sources)]
}
