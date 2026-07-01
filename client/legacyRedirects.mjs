/**
 * Legacy URL → canonical path (301). Shared by next.config.mjs and middleware.
 * Middleware matches case-insensitively so /Sales/… and /sales/… both resolve.
 */
export const LEGACY_REDIRECTS = [
  // ── Old PascalCase hub + category URLs (indexed legacy site) ───────────────
  { source: '/Sales/best-crm-software', destination: '/marketing/best-crm-software' },
  { source: '/Marketing/best-crm-software', destination: '/marketing/best-crm-software' },
  { source: '/Marketing/best-email-marketing-services', destination: '/marketing/best-email-marketing-services' },
  { source: '/Marketing/best-website-building-platform', destination: '/marketing/best-website-building-platform' },
  { source: '/Technology/business-phone-systems', destination: '/technology/business-phone-systems' },
  { source: '/Technology/best-employee-management-software', destination: '/human-resources/best-employee-management-software' },
  { source: '/Sales/best-call-center-management-software', destination: '/sales/best-call-center-management-software' },
  { source: '/Sales/best-project-management-software', destination: '/sales/best-project-management-software' },
  { source: '/Technology/gps-fleet-management-software', destination: '/technology/gps-fleet-management-software' },
  { source: '/Technology/best-payroll-system', destination: '/technology/best-payroll-system' },
  { source: '/Human-Resources/best-payroll-software', destination: '/human-resources/best-payroll-software' },
  { source: '/Human-Resources/best-employee-management-software', destination: '/human-resources/best-employee-management-software' },
  { source: '/Human-Resources/deel-hr-payroll', destination: '/human-resources/deel-hr-payroll' },
  { source: '/Human-Resources/papaya-global-payroll', destination: '/human-resources/papaya-global-payroll' },

  // ── Legacy slug-style URLs ─────────────────────────────────────────────────
  { source: '/BestCRMSoftware', destination: '/marketing/best-crm-software' },
  { source: '/bestcrmsoftware', destination: '/marketing/best-crm-software' },
  { source: '/BusinessPayroll', destination: '/human-resources/best-payroll-software' },

  // ── Lowercase canonical consolidations (duplicate content) ─────────────────
  { source: '/sales/best-crm-software', destination: '/marketing/best-crm-software' },
  {
    source: '/sales/best-crm-software/get-free-quotes',
    destination: '/marketing/best-crm-software/get-free-quotes',
  },
  {
    source: '/marketing/best-crm-software/get-free-quote',
    destination: '/marketing/best-crm-software/get-free-quotes',
  },
  {
    source: '/technology/best-employee-management-software',
    destination: '/human-resources/best-employee-management-software',
  },
  {
    source: '/technology/best-employee-management-software/get-free-quotes',
    destination: '/human-resources/best-employee-management-software/get-free-quotes',
  },

  // ── Legacy contact / resources paths ───────────────────────────────────────
  { source: '/Contact-us/About-us', destination: '/about' },
  { source: '/Contact-us/Contact', destination: '/contact' },
  { source: '/Resources/Blogs', destination: '/blog' },
  { source: '/Resources/software-comparison-methodology', destination: '/editorial-process' },
  { source: '/Resources/smb-software-pricing-report-2026', destination: '/resources/whitepaper' },
  { source: '/Resources/link-building-playbook', destination: '/resources/whitepaper' },

  // ── Misc legacy paths ──────────────────────────────────────────────────────
  { source: '/do-not-sell-my-info', destination: '/do-not-sell' },
  { source: '/accessibility-statement', destination: '/accessibility' },
  { source: '/marketing-solutions', destination: '/marketing' },
]

/** Case-insensitive legacy lookup for middleware. Skips when already at destination. */
export function resolveLegacyRedirect(pathname) {
  for (const { source, destination } of LEGACY_REDIRECTS) {
    const matches = pathname === source || pathname.toLowerCase() === source.toLowerCase()
    if (!matches) continue

    // Avoid loops: /marketing/best-crm-software must not match /Marketing/best-crm-software forever.
    if (pathname === destination || pathname.toLowerCase() === destination.toLowerCase()) {
      return null
    }

    return destination
  }
  return null
}
