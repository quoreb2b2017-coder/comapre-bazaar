/**
 * SEO architecture redirects (301) — subdomain consolidation, slug hygiene,
 * whitepaper pluralization, and legal-page canonicalization.
 * Merged in next.config.mjs before legacy path redirects.
 */

/** Populate from GSC export of old URL structures when available. */
export const STALE_INDEX_REDIRECTS = [
  { source: '/home', destination: '/' },
  { source: '/about-us', destination: '/about' },
  { source: '/gps-fleet-management', destination: '/technology/gps-fleet-management-software' },
  { source: '/Resources/Whitepaper', destination: '/resources/whitepapers' },
  { source: '/Resources/Whitepaper/iot-implementation-guide', destination: '/resources/whitepapers' },
  { source: '/Resources/Whitepaper/blockchain-applications', destination: '/resources/whitepapers' },
  { source: '/Resources/Whitepaper/customer-experience-transformation', destination: '/resources/whitepapers' },
  { source: '/Resources/Whitepaper/:slug*', destination: '/resources/whitepapers/:slug*' },
  { source: '/resources/whitepaper/iot-implementation-guide', destination: '/resources/whitepapers' },
  { source: '/resources/whitepaper/blockchain-applications', destination: '/resources/whitepapers' },
  { source: '/resources/whitepaper/customer-experience-transformation', destination: '/resources/whitepapers' },
  { source: '/resources/whitepapers/iot-implementation-guide', destination: '/resources/whitepapers' },
  { source: '/resources/whitepapers/blockchain-applications', destination: '/resources/whitepapers' },
  { source: '/resources/whitepapers/customer-experience-transformation', destination: '/resources/whitepapers' },
  {
    source: '/blog/gusto-vs-adp-vs-paychex-which-payroll-platform-fits-your-headcount',
    destination: '/blog/gusto-vs-adp-vs-paychex-complete-comparison',
  },
  {
    source: '/blog/rippling-vs-deel-vs-remote-global-payroll-platforms-compared',
    destination: '/blog/rippling-vs-deel-vs-remote-global-payroll-compared',
  },
  {
    source: '/blog/what-is-email-marketing-complete-guide-2026',
    destination: '/marketing/best-email-marketing-services',
  },
  {
    source: '/blog/ai-agents-vs-traditional-software-why-2026-is-the-year-business-automation-changes-forever',
    destination: '/blog/ai-agents-vs-traditional-software-in-2026',
  },
  {
    source:
      '/blog/ai-agents-vs-traditional-software-why-2026-is-the-year-business-automation-changes-forever-1781539223390',
    destination: '/blog/ai-agents-vs-traditional-software-in-2026',
  },
  {
    source: '/blog/what-is-voip-the-complete-beginners-guide-for-2026',
    destination: '/blog/what-is-voip-a-complete-beginners-guide-for-2026',
  },
  {
    source: '/blog/ai-agent-pricing-decoded-a-2026-saas-buyers-guide',
    destination: '/blog?topic=ai-agents',
  },
  {
    source: '/blog/what-is-payroll-a-complete-guide-for-beginners',
    destination: '/human-resources/best-payroll-software',
  },
  {
    source: '/blog/best-crm-for-small-businesses-that-dont-want-to-pay-enterprise-prices',
    destination: '/blog/best-crm-software-for-small-business-2026',
  },
  {
    source: '/blog/hrms-software-with-payroll-andamp-attendance-in-india',
    destination: '/blog/best-hr-software-for-small-business-in-2026',
  },
  {
    source: '/blog/hrms-software-with-payroll-and-attendance-in-india',
    destination: '/blog/best-hr-software-for-small-business-in-2026',
  },
  {
    source: '/blog/best-payroll-software-for-small-businesses-2026-edition',
    destination: '/blog/best-payroll-software-for-small-business-2026',
  },
  {
    source: '/blog/crm-software-explained-features-benefits-andamp-use-cases',
    destination: '/blog/how-to-choose-the-right-crm-for-your-company',
  },
  {
    source: '/blog/crm-software-explained-features-benefits-and-use-cases',
    destination: '/blog/how-to-choose-the-right-crm-for-your-company',
  },
  {
    source: '/blog/salesforce-vs-hubspot-vs-zoho-which-crm-wins-for-mid-market',
    destination: '/blog/hubspot-vs-salesforce-which-crm-is-right-for-your-business-in-2026',
  },
]

export const SEO_REDIRECTS = [
  {
    source: '/:path*',
    has: [{ type: 'host', value: 'blogs.compare-bazaar.com' }],
    destination: 'https://www.compare-bazaar.com/blog/:path*',
    permanent: true,
  },
  // Exact GSC 404 remaps first so timestamped/legacy URLs are a single hop.
  ...STALE_INDEX_REDIRECTS.map(({ source, destination }) => ({
    source,
    destination,
    permanent: true,
  })),
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
]
