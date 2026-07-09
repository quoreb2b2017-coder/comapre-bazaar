/**
 * SEO architecture redirects (301) — subdomain consolidation, slug hygiene,
 * whitepaper pluralization, and legal-page canonicalization.
 * Merged in next.config.mjs before legacy path redirects.
 */

/** Populate from GSC export of old URL structures when available. */
export const STALE_INDEX_REDIRECTS = [
  // { source: '/crm-software', destination: '/marketing/best-crm-software' },
]

export const SEO_REDIRECTS = [
  {
    source: '/:path*',
    has: [{ type: 'host', value: 'blogs.compare-bazaar.com' }],
    destination: 'https://www.compare-bazaar.com/blog/:path*',
    permanent: true,
  },
  {
    source: '/blog/:slug(.*)-:ts(\\d{10,})',
    destination: '/blog/:slug',
    permanent: true,
  },
  {
    source: '/resources/whitepaper',
    destination: '/resources/whitepapers',
    permanent: true,
  },
  {
    source: '/resources/whitepaper/:slug*',
    destination: '/resources/whitepapers/:slug*',
    permanent: true,
  },
  {
    source: '/privacy-policy/ccpa-opt-out',
    destination: '/do-not-sell',
    permanent: true,
  },
  {
    source: '/do-not-sell-my-info',
    destination: '/do-not-sell',
    permanent: true,
  },
  ...STALE_INDEX_REDIRECTS.map(({ source, destination }) => ({
    source,
    destination,
    permanent: true,
  })),
]
