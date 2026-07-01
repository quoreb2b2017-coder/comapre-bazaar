import type { MetadataRoute } from 'next'

// CONFLICTS FIXED
// ─────────────────────────────────────────────────────────────────────────────
// Previous version disallowed paths that are simultaneously present in
// sitemap.ts — Google flags this as contradictory and ignores the sitemap
// entry. Rule: never disallow a URL you also include in the sitemap.
//
// Decision tree applied to every disallowed path:
//
//  Path                          | In sitemap? | Decision
//  ─────────────────────────────────────────────────────
//  /*/get-free-quote(s)          | YES (0.3)   | Remove from disallow → allow crawl
//  /advertise                    | YES (0.4)   | Remove from disallow → allow crawl
//  /do-not-sell                  | YES (0.1)   | Remove from disallow → allow crawl
//  /limit-the-use                | YES (0.1)   | Remove from disallow → allow crawl
//  /contact-us/careers           | NO          | Keep disallowed ✓
//  /cookie-preferences           | NO          | Keep disallowed ✓
//  /search                       | NO          | Keep disallowed ✓
//  /api/                         | NO          | Keep disallowed ✓
//  /_next/                       | NO          | Keep disallowed ✓
// ─────────────────────────────────────────────────────────────────────────────


export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',                // internal API routes — never index
          '/_next/',              // Next.js build assets — never index
          '/contact-us/careers',  // utility/duplicate of /careers
          '/cookie-preferences',  // UI-only overlay, no content
          '/search',              // internal search results — thin content
        ],
      },

      // ── AI training crawlers ───────────────────────────────────────────────
      // These bots respect robots.txt. Block if you don't want your editorial
      // content used for LLM training without compensation. Remove these three
      // blocks if you want AI visibility (citations in ChatGPT, Perplexity etc).
      {
        userAgent: 'GPTBot',    // OpenAI
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web', // Anthropic
        disallow: '/',
      },
      {
        userAgent: 'CCBot',     // Common Crawl / AI training datasets
        disallow: '/',
      },
    ],

    sitemap: 'https://www.compare-bazaar.com/sitemap.xml',

    // Declares the canonical hostname. Recognised by Yandex; ignored by Google
    // but harmless. Helps on multi-domain setups where both www and non-www
    // are reachable.
    host: 'www.compare-bazaar.com',
  }
}