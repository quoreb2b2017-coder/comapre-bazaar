import { ImageResponse } from 'next/og'
import { blogPosts } from '@/data/blogPosts'
import { fetchPublishedBlogBySlug, plainBlogExcerpt } from '@/lib/blogCms'

export const runtime = 'edge'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = String(searchParams.get('slug') || '').trim()

  const cms = slug ? await fetchPublishedBlogBySlug(slug) : null
  const fallback = slug ? blogPosts.find((p) => p.slug === slug) : null

  const title =
    (cms?.metaTitle && cms.metaTitle.trim()) ||
    cms?.title ||
    fallback?.title ||
    'Compare Bazaar | Business Software Comparisons'

  const excerpt = plainBlogExcerpt(
    cms?.excerpt || fallback?.excerpt || 'Independent software comparisons and buying guides for modern teams.',
    140
  )
  const category = (cms?.tags && cms.tags[0]) || cms?.topic || fallback?.category || 'Editorial'

  const image = new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background:
            'radial-gradient(circle at 0% 0%, #ffe5cc 0%, #fff4e8 30%, #ffffff 68%), linear-gradient(180deg, #ffffff 0%, #fffaf5 100%)',
          padding: '56px 64px',
          color: '#0f172a',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              borderRadius: 999,
              padding: '8px 16px',
              background: '#fff3e7',
              border: '1px solid #f3c79b',
              color: '#d86e1e',
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            Compare Bazaar
          </div>
          <div style={{ fontSize: 23, color: '#64748b' }}>{category}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.08, letterSpacing: -1.2 }}>
            {title.length > 78 ? `${title.slice(0, 77)}...` : title}
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.35, color: '#475569' }}>{excerpt}</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 24, color: '#64748b' }}>
            {slug ? `compare-bazaar.com/blog/${slug}` : 'compare-bazaar.com'}
          </div>
          <div
            style={{
              fontSize: 22,
              color: '#ffffff',
              background: '#f27f25',
              borderRadius: 999,
              padding: '8px 16px',
              fontWeight: 700,
            }}
          >
            Read More
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )

  return new Response(image.body, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=0, s-maxage=86400',
    },
    status: 200,
  })
}
