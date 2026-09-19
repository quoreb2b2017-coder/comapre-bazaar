import { blogRssResponseHeaders, buildBlogRssXml } from '@/lib/blogRssFeed'

export const revalidate = 300

export async function GET() {
  const xml = await buildBlogRssXml()
  return new Response(xml, { headers: blogRssResponseHeaders() })
}
