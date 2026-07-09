// app/sitemap.ts — canonical URLs only, real lastModified dates
import type { MetadataRoute } from "next";
import { pillars, hubs, posts } from "@/lib/content-map";

const SITE = "https://www.compare-bazaar.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/resources`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/resources/whitepapers`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/editorial-process`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE}/about`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE}/advertising-disclosure`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const pillarPages: MetadataRoute.Sitemap = pillars.map((p) => ({
    url: `${SITE}${p.path}`,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const hubPages: MetadataRoute.Sitemap = hubs.map((h) => ({
    url: `${SITE}${h.path}`,
    changeFrequency: "weekly", // money pages — verified pricing updates
    priority: 0.9,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE}/blog/${p.slug}`,
    lastModified: new Date(p.lastVerified),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...pillarPages, ...hubPages, ...postPages];
}
