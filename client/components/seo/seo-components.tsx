import Link from 'next/link'
import type { Metadata } from 'next'
import {
  primaryHubForPost,
  hubBySlug,
} from '@/lib/content-map'
import { loadRelatedBlogPostsForHub } from '@/lib/blogCms'
import { BlogRelatedCards } from '@/components/blog/BlogRelatedCards'

const SITE = 'https://www.compare-bazaar.com'

export function JsonLd({ graph }: { graph: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}

export function Breadcrumbs({ items }: { items: { name: string; url: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol style={{ display: 'flex', gap: 8, listStyle: 'none', padding: 0 }}>
        {items.map((item, i) => (
          <li key={item.url}>
            {i < items.length - 1 ? (
              <>
                <Link href={item.url}>{item.name}</Link>
                <span aria-hidden> › </span>
              </>
            ) : (
              <span aria-current="page">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function hasHubRelatedContent(hubSlug: string): boolean {
  return Boolean(hubBySlug[hubSlug])
}

export async function HubRelatedContent({ hubSlug }: { hubSlug: string }) {
  const hub = hubBySlug[hubSlug]
  if (!hub) return null

  const related = await loadRelatedBlogPostsForHub(hub, 3)
  if (related.length === 0) return null

  return (
    <BlogRelatedCards
      posts={related}
      eyebrow="Further reading"
      heading={`More ${hub.name} guides`}
    />
  )
}

export function PostRelatedContent({ postSlug }: { postSlug: string }) {
  const hub = primaryHubForPost(postSlug)
  if (!hub) return null
  return (
    <aside aria-labelledby="related-guides" className="my-8">
      <p id="related-guides" className="text-[15px] leading-relaxed text-slate-600">
        Ready to shortlist?{' '}
        <Link href={hub.path} className="font-semibold text-[#F58220] hover:text-[#D97706] hover:underline">
          Compare the {hub.name.toLowerCase()} we&apos;ve tested and priced
        </Link>
        .
      </p>
    </aside>
  )
}

export function VerificationStamp({ lastVerified }: { lastVerified: string }) {
  const d = new Date(lastVerified).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  return (
    <p>
      <strong>Pricing &amp; facts verified:</strong> {d} ·{' '}
      <Link href="/editorial-process">How we review</Link>
    </p>
  )
}

const YEAR = new Date().getFullYear()

export function hubMetadata(hubSlug: string): Metadata {
  const hub = hubBySlug[hubSlug]
  const url = `${SITE}${hub.path}`
  const title = `Best ${hub.name} ${YEAR}: Tools Compared & Priced`
  const description = `Independent ${hub.name.toLowerCase()} comparison for US SMBs — verified pricing, hands-on scoring across 12+ criteria, no pay-to-play rankings.`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', siteName: 'Compare Bazaar' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export function postMetadata(opts: {
  slug: string
  title: string
  description: string
  image?: string
}): Metadata {
  const url = `${SITE}/blog/${opts.slug}`
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      type: 'article',
      siteName: 'Compare Bazaar',
      ...(opts.image ? { images: [opts.image] } : {}),
    },
    twitter: { card: 'summary_large_image', title: opts.title, description: opts.description },
  }
}
