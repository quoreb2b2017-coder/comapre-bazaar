import { blogRssResponseHeaders, buildBlogRssXml } from '@/lib/blogRssFeed'

/** Alias of /feed.xml for tools that look for /rss.xml */
export const revalidate = 300

export async function GET() {
  const xml = await buildBlogRssXml()
  return new Response(xml, { headers: blogRssResponseHeaders() })
}
