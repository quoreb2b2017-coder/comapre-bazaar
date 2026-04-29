import type { MetadataRoute } from 'next'
import { comparisonPages } from '@/data/comparisons'
import { hubPages } from '@/data/hubs'

const BASE_URL = 'https://www.compare-bazaar.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/editorial-process`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/advertising-disclosure`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
  ]

  const hubRoutes: MetadataRoute.Sitemap = hubPages.map((hub) => ({
    url: `${BASE_URL}${hub.canonical}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const comparisonRoutes: MetadataRoute.Sitemap = comparisonPages.map((page) => ({
    url: `${BASE_URL}${page.canonical}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.95,
  }))

  return [...staticRoutes, ...hubRoutes, ...comparisonRoutes]
}
