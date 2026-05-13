// import type { MetadataRoute } from 'next'

// export default function robots(): MetadataRoute.Robots {
//   return {
//     rules: [
//       {
//         userAgent: '*',
//         allow: '/',
//         disallow: ['/api/', '/_next/'],
//       },
//     ],
//     sitemap: 'https://www.compare-bazaar.com/sitemap.xml',
//   }
// }
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/*/get-free-quote',      // block lead-gen forms
          '/*/get-free-quotes',
          '/contact-us/careers',    // block utility / duplicate pages
          '/advertise',
          '/do-not-sell',
          '/limit-the-use',
          '/cookie-preferences',
          '/search',                // block internal search results
        ],
      },
      {
        userAgent: 'GPTBot',        // optional: block OpenAI crawler
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web',    // optional: block Anthropic crawler
        disallow: '/',
      },
      {
        userAgent: 'CCBot',         // optional: block Common Crawl
        disallow: '/',
      },
    ],
    sitemap: 'https://www.compare-bazaar.com/sitemap.xml',
    host: 'www.compare-bazaar.com', // canonical host
  }
}