import {
  QUOTE_PAGE_CONFIGS,
  type QuotePageConfig,
  type QuotePageKey,
} from '@/lib/pageMetaDescriptions'
import { cmsBackendBase } from '@/lib/cmsBackendBase'

const REVALIDATE_SECONDS = 120

export async function fetchQuotePageConfig(pageKey: QuotePageKey): Promise<QuotePageConfig | null> {
  const base = cmsBackendBase()
  const url = `${base}/api/v1/blog-admin/public/quote-pages/${encodeURIComponent(pageKey)}`

  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
    })
    if (!res.ok) return null
    const json = await res.json()
    if (!json?.success || !json?.data) return null
    return json.data as QuotePageConfig
  } catch {
    return null
  }
}

/** CMS first, static config fallback */
export async function loadQuotePageConfig(pageKey: QuotePageKey): Promise<QuotePageConfig> {
  const cms = await fetchQuotePageConfig(pageKey)
  if (cms) return cms
  return QUOTE_PAGE_CONFIGS[pageKey]
}

export function quotePageKeys(): QuotePageKey[] {
  return Object.keys(QUOTE_PAGE_CONFIGS) as QuotePageKey[]
}

export function quotePageSeedPayload() {
  return quotePageKeys().map((pageKey) => ({
    pageKey,
    displayName: QUOTE_PAGE_CONFIGS[pageKey].baseH1,
    ...QUOTE_PAGE_CONFIGS[pageKey],
  }))
}
