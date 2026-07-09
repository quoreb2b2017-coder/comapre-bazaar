// app/robots.ts
// NOTE: never Disallow legacy/stale URLs here — Googlebot must be able to
// crawl them to discover the 301s. Blocking them freezes the stale index.
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/search"],
      },
    ],
    sitemap: "https://www.compare-bazaar.com/sitemap.xml",
    host: "https://www.compare-bazaar.com",
  };
}
