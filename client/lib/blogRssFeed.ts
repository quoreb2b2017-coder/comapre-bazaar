import { loadUnifiedBlogIndex, plainBlogExcerpt, type UnifiedBlogCard } from '@/lib/blogCms'
import { PUBLIC_PUBLISHER_NAME } from '@/lib/publicEditorDisplay'
import { defaultOgImageUrl, SITE_URL } from '@/lib/seo'

export const BLOG_RSS_PATH = '/feed.xml'
export const BLOG_RSS_URL = `${SITE_URL}${BLOG_RSS_PATH}`
/** Alias kept for tools that expect /rss.xml — same feed content. */
export const BLOG_RSS_ALIAS_PATH = '/rss.xml'

const FEED_TITLE = 'Compare Bazaar Blog'
const FEED_DESCRIPTION =
  'Independent business software comparisons, pricing notes, and buying guides from Compare Bazaar editors.'
/** Soft cap only for extreme growth; all current published posts fit well under this. */
const MAX_ITEMS = 500

function escapeXml(value: string): string {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function absoluteUrl(url: string | undefined | null): string {
  const raw = String(url || '').trim()
  if (!raw) return defaultOgImageUrl()
  if (/^https?:\/\//i.test(raw)) return raw
  return `${SITE_URL}${raw.startsWith('/') ? raw : `/${raw}`}`
}

function toRfc822(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return new Date().toUTCString()
  return d.toUTCString()
}

function guessImageMime(url: string): string {
  const lower = url.toLowerCase()
  if (lower.includes('.png')) return 'image/png'
  if (lower.includes('.webp')) return 'image/webp'
  if (lower.includes('.gif')) return 'image/gif'
  return 'image/jpeg'
}

function itemXml(post: UnifiedBlogCard): string {
  const link = `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`
  const summary = plainBlogExcerpt(post.excerpt, 280) || FEED_DESCRIPTION
  const image = absoluteUrl(post.coverUrl)
  const author = post.authorName || PUBLIC_PUBLISHER_NAME
  const category = post.category || 'Business Software'
  const guid = link

  return [
    '  <item>',
    `    <title>${escapeXml(post.title)}</title>`,
    `    <link>${escapeXml(link)}</link>`,
    `    <guid isPermaLink="true">${escapeXml(guid)}</guid>`,
    `    <pubDate>${toRfc822(post.publishedAt)}</pubDate>`,
    `    <dc:creator>${escapeXml(author)}</dc:creator>`,
    `    <author>${escapeXml(author)}</author>`,
    `    <category>${escapeXml(category)}</category>`,
    `    <description><![CDATA[${summary}]]></description>`,
    `    <content:encoded><![CDATA[<p>${summary}</p><p><a href="${link}">Read the full guide on Compare Bazaar</a></p>]]></content:encoded>`,
    `    <enclosure url="${escapeXml(image)}" type="${guessImageMime(image)}" length="0" />`,
    `    <media:content url="${escapeXml(image)}" medium="image" type="${guessImageMime(image)}" />`,
    `    <media:thumbnail url="${escapeXml(image)}" />`,
    '  </item>',
  ].join('\n')
}

/** Build RSS 2.0 XML for published Compare Bazaar blogs (LinkedIn / newsletter ready). */
export async function buildBlogRssXml(): Promise<string> {
  const posts = await loadUnifiedBlogIndex()
  const items = posts.slice(0, MAX_ITEMS)
  const lastBuild = items[0]?.publishedAt ? toRfc822(items[0].publishedAt) : new Date().toUTCString()

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0"',
    '  xmlns:atom="http://www.w3.org/2005/Atom"',
    '  xmlns:content="http://purl.org/rss/1.0/modules/content/"',
    '  xmlns:dc="http://purl.org/dc/elements/1.1/"',
    '  xmlns:media="http://search.yahoo.com/mrss/">',
    '  <channel>',
    `    <title>${escapeXml(FEED_TITLE)}</title>`,
    `    <link>${escapeXml(SITE_URL)}/blog</link>`,
    `    <description>${escapeXml(FEED_DESCRIPTION)}</description>`,
    '    <language>en-us</language>',
    `    <lastBuildDate>${lastBuild}</lastBuildDate>`,
    `    <managingEditor>${escapeXml(PUBLIC_PUBLISHER_NAME)}</managingEditor>`,
    `    <webMaster>${escapeXml(PUBLIC_PUBLISHER_NAME)}</webMaster>`,
    `    <atom:link href="${escapeXml(BLOG_RSS_URL)}" rel="self" type="application/rss+xml" />`,
    `    <image>`,
    `      <url>${escapeXml(absoluteUrl('/favicon-96.png'))}</url>`,
    `      <title>${escapeXml(FEED_TITLE)}</title>`,
    `      <link>${escapeXml(SITE_URL)}/blog</link>`,
    '    </image>',
    ...items.map(itemXml),
    '  </channel>',
    '</rss>',
  ].join('\n')
}

export function blogRssResponseHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/rss+xml; charset=utf-8',
    'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600',
  }
}
