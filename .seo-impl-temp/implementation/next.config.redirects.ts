/**
 * Redirect layer — merge into your existing next.config.ts
 *
 * NOTE: host-level redirect for blogs.compare-bazaar.com works here ONLY if
 * the subdomain points at this same Next.js deployment (e.g. added as a
 * domain alias in Vercel). If the subdomain is hosted elsewhere, do the 301
 * at that host / DNS provider instead.
 */
import type { NextConfig } from "next";

const redirects: NextConfig["redirects"] = async () => [
  // ── 1. Subdomain consolidation: blogs.compare-bazaar.com/* → apex /blog/* ──
  {
    source: "/:path*",
    has: [{ type: "host", value: "blogs.compare-bazaar.com" }],
    destination: "https://www.compare-bazaar.com/blog/:path*",
    permanent: true, // 308/301
  },

  // ── 2. Strip timestamp suffixes from blog slugs ──
  // /blog/ai-agents-...-forever-1781539223390 → /blog/ai-agents-...-forever
  {
    source: "/blog/:slug(.*)-:ts(\\d{10,})",
    destination: "/blog/:slug",
    permanent: true,
  },

  // ── 3. Whitepaper path standardization (singular → plural) ──
  {
    source: "/resources/whitepaper",
    destination: "/resources/whitepapers",
    permanent: true,
  },
  {
    source: "/resources/whitepaper/:slug*",
    destination: "/resources/whitepapers/:slug*",
    permanent: true,
  },

  // ── 4. Legal-page duplication: pick one canonical CCPA URL ──
  {
    source: "/privacy-policy/ccpa-opt-out",
    destination: "/do-not-sell",
    permanent: true,
  },

  // ── 5. Stale-index map ──
  // Populate from GSC → Pages → "Indexed" export of old-structure URLs.
  // One entry per stale URL, pointing at nearest live canonical. Examples:
  ...staleIndexMap.map(({ from, to }) => ({
    source: from,
    destination: to,
    permanent: true,
  })),
];

/** Fill this from your Search Console export of old URL structures. */
const staleIndexMap: { from: string; to: string }[] = [
  // { from: "/crm-software",            to: "/marketing/best-crm-software" },
  // { from: "/payroll",                 to: "/human-resources/best-payroll-software" },
  // { from: "/blog/old-slug-variant",   to: "/blog/new-canonical-slug" },
];

const nextConfig: NextConfig = {
  redirects,
  // Force trailing-slash policy ONE way sitewide (pick and keep):
  trailingSlash: false,
};

export default nextConfig;
