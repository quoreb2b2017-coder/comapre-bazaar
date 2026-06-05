import { cleanDisplayText } from '@/lib/cleanDisplayText'

const DOMAIN = 'compare-bazaar.com'

/** Clean legacy whitepaper titles for public display (copyright/footer stripped). */
export function whitePaperDisplayTitle(title?: string, seoTitle?: string): string {
  let s = cleanDisplayText(String(seoTitle || title || ''))
  s = s
    .replace(/©\s*\d{4}[^|]*/gi, ' ')
    .replace(/\ball rights reserved\b/gi, ' ')
    .replace(/(?:https?:\/\/)?(?:www\.)?compare[-_\s]?bazaar(?:\.com)?/gi, DOMAIN)
    .replace(/\.\s*compare-bazaar\.?\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim()

  const core = s
    .replace(new RegExp(`^${DOMAIN}\\s*[-–—|:]\\s*`, 'i'), '')
    .replace(new RegExp(`^${DOMAIN}\\s+`, 'i'), '')
    .replace(new RegExp(DOMAIN, 'gi'), '')
    .trim()

  if (/compare-bazaar/i.test(String(seoTitle || title || '')) && core.length >= 12) {
    return `${DOMAIN} — ${core.replace(/\s+\.\s*$/, '')}`.slice(0, 180)
  }

  return s.replace(/\s+\.\s*$/, '').slice(0, 180)
}
