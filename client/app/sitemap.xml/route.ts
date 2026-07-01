import type { MetadataRoute } from 'next'
import { getSitemapEntries } from '@/lib/sitemapEntries'

export const revalidate = 3600

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function formatLastMod(value: MetadataRoute.Sitemap[number]['lastModified']): string | null {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}

function renderUrl(entry: MetadataRoute.Sitemap[number]): string {
  const lines = [`  <url>`, `    <loc>${escapeXml(entry.url)}</loc>`]

  const lastMod = formatLastMod(entry.lastModified)
  if (lastMod) lines.push(`    <lastmod>${lastMod}</lastmod>`)
  if (entry.changeFrequency) lines.push(`    <changefreq>${entry.changeFrequency}</changefreq>`)
  if (entry.priority != null) lines.push(`    <priority>${entry.priority}</priority>`)

  lines.push('  </url>')
  return lines.join('\n')
}

export async function GET() {
  const entries = await getSitemapEntries()
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(renderUrl),
    '</urlset>',
  ].join('\n')

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
