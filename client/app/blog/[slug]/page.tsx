import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { buildBlogPostingJsonLd, buildBlogShareMetadata, buildMetadata, formatShareDescription } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { blogPosts } from '@/data/blogPosts'
import {
  fetchPublishedBlogBySlug,
  loadUnifiedRelated,
  plainBlogExcerpt,
  splitCmsHeroFromBody,
  stripGradientForSlug,
  type CmsBlogDetail,
} from '@/lib/blogCms'
import { BlogViewCounter } from '@/components/blog/BlogViewCounter'
import { BlogSubscribeBox } from '@/components/blog/BlogSubscribeBox'

type Props = { params: { slug: string } }

export const dynamicParams = true

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

function isoDate(d: string | Date | undefined | null) {
  if (d == null || d === '') return undefined
  const t = new Date(d).getTime()
  return Number.isNaN(t) ? undefined : new Date(d).toISOString()
}

function decodeEntities(s: string) {
  return String(s || '')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
}

function slugifyHeading(s: string) {
  return decodeEntities(s)
    .toLowerCase()
    .replace(/<[^>]*>/g, ' ')
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function addHeadingAnchors(html: string): { html: string; toc: Array<{ id: string; label: string }> } {
  const used = new Set<string>()
  const toc: Array<{ id: string; label: string }> = []
  const out = String(html || '').replace(/<h([2-4])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_m, level, attrs, inner) => {
    const label = decodeEntities(String(inner || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim())
    if (!label) return `<h${level}${attrs}>${inner}</h${level}>`
    const existingId = String(attrs || '').match(/\sid\s*=\s*["']([^"']+)["']/i)?.[1]
    let id = existingId || slugifyHeading(label) || `section-${toc.length + 1}`
    if (used.has(id)) {
      let i = 2
      while (used.has(`${id}-${i}`)) i += 1
      id = `${id}-${i}`
    }
    used.add(id)
    toc.push({ id, label })
    const attrsWithoutId = String(attrs || '').replace(/\sid\s*=\s*["'][^"']+["']/i, '')
    return `<h${level}${attrsWithoutId} id="${id}">${inner}</h${level}>`
  })
  return { html: out, toc }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cms = await fetchPublishedBlogBySlug(params.slug)
  if (cms) {
    const headline = (cms.metaTitle && cms.metaTitle.trim()) || cms.title
    const rawDesc = cms.metaDescription || cms.excerpt || formatShareDescription(cms.content?.slice(0, 600))
    const kw = [...new Set([...(cms.keywords || []), ...(cms.tags || [])])].slice(0, 24)
    return buildBlogShareMetadata({
      title: headline,
      description: rawDesc,
      canonicalPath: `/blog/${cms.slug}`,
      publishedAt: cms.publishedAt ?? cms.approvedAt ?? undefined,
      modifiedAt: cms.updatedAt ?? cms.publishedAt ?? cms.approvedAt,
      section: (cms.tags && cms.tags[0]) || cms.topic,
      keywords: kw.length ? kw : undefined,
      authorName: 'Compare Bazaar Editorial',
    })
  }
  const post = blogPosts.find((item) => item.slug === params.slug)
  if (!post) {
    return buildMetadata({
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
      canonical: '/blog',
    })
  }
  return buildBlogShareMetadata({
    title: post.title,
    description: post.excerpt,
    canonicalPath: `/blog/${post.slug}`,
    publishedAt: post.publishedAt,
    section: post.category,
    keywords: [post.category],
    authorName: post.authorName,
  })
}

function RelatedBlock({
  related,
}: {
  related: Awaited<ReturnType<typeof loadUnifiedRelated>>
}) {
  if (related.length === 0) return null
  return (
    <section className="mt-16 w-full border-t border-gray-100 pt-12">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-400">Further reading</p>
      <h3 className="mb-8 font-serif text-[1.5rem] leading-tight tracking-tight text-navy">More from the blog</h3>
      <ul className="divide-y divide-gray-100">
        {related.map((item, i) => (
          <li key={item.slug} className="py-9 first:pt-1">
            <article className="flex gap-6 sm:gap-8">
              <span
                className="hidden w-8 shrink-0 pt-0.5 text-right font-serif text-xl tabular-nums text-gray-200 sm:block"
                aria-hidden
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1 border-l-2 border-gray-100 pl-5 sm:pl-6">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  {item.category}
                  <span className="mx-2 font-normal tracking-normal text-gray-300">/</span>
                  {item.readTime}
                </p>
                <h4 className="mb-2.5 font-serif text-[1.125rem] leading-snug tracking-tight text-navy sm:text-xl">
                  <Link href={`/blog/${item.slug}`} className="transition-colors hover:text-brand">
                    {item.title}
                  </Link>
                </h4>
                {item.excerpt ? (
                  <p className="line-clamp-2 text-[15px] leading-relaxed text-gray-600">
                    {plainBlogExcerpt(item.excerpt, 160)}
                  </p>
                ) : null}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}

function BlogTitlesRail({ currentSlug, toc }: { currentSlug: string; toc: Array<{ id: string; label: string }> }) {
  const rows = toc.slice(0, 14)
  return (
    <aside className="space-y-8 border-gray-200 lg:sticky lg:top-24 lg:border-l lg:pl-9 xl:pl-10">
      <div>
        <h3 className="mb-4 border-b border-gray-100 pb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
          On this page
        </h3>
        <nav aria-label="Table of contents">
          <ul className="border-l border-gray-200">
            {rows.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-[13px] leading-snug text-gray-600 transition-colors hover:border-brand/50 hover:text-navy"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <BlogSubscribeBox slug={currentSlug} compact variant="editorial" />
    </aside>
  )
}

async function CmsBlogArticle({ cms }: { cms: CmsBlogDetail }) {
  const { stripFrom, stripTo } = stripGradientForSlug(cms.slug)
  const category = (cms.tags && cms.tags[0]) || cms.topic || 'Editorial'
  const readLabel =
    typeof cms.readingTime === 'number' && cms.readingTime > 0 ? `${cms.readingTime} min read` : '8 min read'
  const publishedRaw = cms.publishedAt ? new Date(cms.publishedAt) : new Date()
  const publishedLabel = publishedRaw.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const related = await loadUnifiedRelated(cms.slug, 3)
  const headline = (cms.metaTitle && cms.metaTitle.trim()) || cms.title
  const { heroHtml, bodyHtml } = splitCmsHeroFromBody(cms.content)
  const hasHeroBanner = heroHtml != null
  const sourceBodyHtml = hasHeroBanner ? bodyHtml : cms.content
  const { html: anchoredBodyHtml, toc } = addHeadingAnchors(sourceBodyHtml)
  const articleSchema = buildBlogPostingJsonLd({
    headline,
    description: cms.metaDescription || cms.excerpt || formatShareDescription(cms.content?.slice(0, 800)),
    path: `/blog/${cms.slug}`,
    datePublished: isoDate(cms.publishedAt ?? cms.approvedAt),
    dateModified: isoDate(cms.updatedAt ?? cms.publishedAt ?? cms.approvedAt),
    keywords: [...new Set([...(cms.keywords || []), ...(cms.tags || [])])].slice(0, 24),
  })

  const metaRow = (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-gray-500">
      <span className="font-medium text-navy">{category}</span>
      <span className="text-gray-300">·</span>
      <span>{readLabel}</span>
      <span className="text-gray-300">·</span>
      <time dateTime={publishedRaw.toISOString()}>{publishedLabel}</time>
      <span className="text-gray-300">·</span>
      <span>Compare Bazaar Editorial</span>
      <BlogViewCounter slug={cms.slug} initialCount={typeof cms.viewCount === 'number' ? cms.viewCount : 0} />
    </div>
  )

  /** Shell = hero card outer width; body uses same horizontal inset as hero inner (AI uses padding ~1.75rem sides) */
  const shellClass = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10'
  const measureClass = 'w-full max-w-none'
  /** Matches Claude hero banner inline horizontal padding so body lines up with card copy */
  const bodyInsetClass = hasHeroBanner ? 'px-7 sm:px-8' : ''

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-white">
      <div className={`${shellClass} flex flex-col gap-6 pb-14 pt-10 sm:gap-7 sm:pb-16 sm:pt-12`}>
        <JsonLd schema={articleSchema} />

        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: hasHeroBanner ? headline : cms.title },
          ]}
          className="shrink-0"
        />

        {!hasHeroBanner ? (
          <header className={`${measureClass} border-b border-gray-200 pb-10`}>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-gray-400">
              Compare Bazaar · Editorial
            </p>
            <div
              className="mb-7 h-[3px] w-14"
              style={{ background: `linear-gradient(90deg, ${stripFrom}, ${stripTo})` }}
              aria-hidden
            />
            <h1 className="mb-5 font-serif text-[2rem] leading-[1.1] tracking-tight text-navy sm:text-[2.5rem] lg:text-[2.75rem]">
              {cms.title}
            </h1>
            {cms.excerpt ? (
              <p className="mb-8 max-w-[52ch] text-[17px] leading-[1.7] text-gray-600">
                {plainBlogExcerpt(cms.excerpt, 280)}
              </p>
            ) : null}
            {metaRow}
          </header>
        ) : (
          <div className={`${measureClass} ${bodyInsetClass}`}>{metaRow}</div>
        )}

        {hasHeroBanner && heroHtml ? (
          <div className="w-full min-w-0">
            <div className="blog-cms-html max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: heroHtml }} />
          </div>
        ) : null}

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,48rem)_minmax(220px,300px)] lg:items-stretch lg:gap-14 xl:gap-16">
          <article className={`${measureClass} ${bodyInsetClass} flex min-w-0 flex-col`}>
            <div
              className={`blog-cms-html prose prose-lg max-w-none text-gray-700 prose-headings:scroll-mt-28 prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-navy prose-h2:mt-12 prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-3 prose-h2:text-[1.35rem] prose-h3:text-[1.2rem] prose-p:text-[17px] prose-p:leading-[1.7] prose-li:marker:text-gray-300${hasHeroBanner ? ' blog-cms-after-hero' : ''}`}
              dangerouslySetInnerHTML={{ __html: anchoredBodyHtml }}
            />

            <section className="mt-16 border-t border-gray-100 pt-10">
              <div className="border-l-2 border-brand/35 pl-5 sm:pl-6">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                  About this publication
                </p>
                <p className="mb-1 font-medium text-navy">Compare Bazaar Editorial</p>
                <p className="max-w-[52ch] text-[15px] leading-relaxed text-gray-600">
                  Independent software comparisons and buying guides for growing businesses.
                </p>
              </div>
            </section>

            <RelatedBlock related={related} />

            <nav className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm" aria-label="Article footer">
              <Link
                href="/blog"
                className="font-medium text-navy underline decoration-gray-300 underline-offset-4 hover:text-brand hover:decoration-brand"
              >
                ← All articles
              </Link>
              <Link
                href="/marketing"
                className="font-medium text-gray-600 underline decoration-gray-300 underline-offset-4 hover:text-brand hover:decoration-brand"
              >
                Software categories
              </Link>
            </nav>
          </article>
          <div className="h-full">
            <BlogTitlesRail currentSlug={cms.slug} toc={toc} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default async function BlogPostPage({ params }: Props) {
  const cms = await fetchPublishedBlogBySlug(params.slug)
  if (cms) return <CmsBlogArticle cms={cms} />

  const post = blogPosts.find((item) => item.slug === params.slug)
  if (!post) notFound()

  const relatedPosts = await loadUnifiedRelated(post.slug, 3)

  const publishedLabel = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const headingMap = [
    'Why this matters',
    'How to evaluate your options',
    'Where most teams make mistakes',
    'Practical recommendation',
    'Implementation checklist',
    'Final decision framework',
  ]

  const sections = post.content.map((para, idx) => ({
    id: `section-${idx + 1}`,
    heading: headingMap[idx] ?? `Key consideration ${idx + 1}`,
    body: para,
  }))
  const toc = sections.map((s) => ({ id: s.id, label: s.heading }))

  const legacyArticleSchema = buildBlogPostingJsonLd({
    headline: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    datePublished: isoDate(post.publishedAt),
    keywords: [post.category],
  })

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:px-10">
        <JsonLd schema={legacyArticleSchema} />
        <div className="flex flex-col gap-6 sm:gap-7">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: post.title },
            ]}
          />

          <header className="mx-auto w-full max-w-3xl border-b border-gray-200 pb-10">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-gray-400">
              Compare Bazaar · Editorial
            </p>
            <div
              className="mb-7 h-[3px] w-14"
              style={{ background: `linear-gradient(90deg, ${post.stripFrom}, ${post.stripTo})` }}
              aria-hidden
            />
            <h1 className="mb-5 font-serif text-[2rem] leading-[1.1] tracking-tight text-navy sm:text-[2.5rem] lg:text-[2.75rem]">
              {post.title}
            </h1>
            <p className="mb-8 text-[17px] leading-[1.7] text-gray-600">{post.excerpt}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-gray-500">
              <span className="font-medium text-navy">{post.category}</span>
              <span className="text-gray-300">·</span>
              <span>{post.readTime}</span>
              <span className="text-gray-300">·</span>
              <span>Published {publishedLabel}</span>
              <span className="text-gray-300">·</span>
              <span>{post.authorName}</span>
            </div>
          </header>

          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,48rem)_minmax(220px,300px)] lg:items-stretch lg:gap-14 xl:gap-16">
            <article className="mx-auto min-w-0 w-full max-w-3xl lg:mx-0 lg:max-w-none">
              <section className="mb-14 border-b border-gray-100 pb-10">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">Summary</p>
                <h2 className="mb-5 font-serif text-xl text-navy">Key takeaways</h2>
                <ul className="space-y-4 text-[15px] leading-[1.65] text-gray-700">
                  {post.content.slice(0, 3).map((point) => (
                    <li key={point} className="border-l-2 border-gray-200 pl-4">
                      {point}
                    </li>
                  ))}
                </ul>
              </section>

              <div className="prose prose-lg max-w-none text-gray-700 prose-headings:scroll-mt-28 prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-navy prose-h2:mt-12 prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-3 prose-h2:text-[1.35rem] prose-p:text-[17px] prose-p:leading-[1.7]">
                {sections.map((section) => (
                  <section key={section.id} id={section.id} className="mb-14 last:mb-0">
                    <h2 className="mb-5 font-serif text-[1.45rem] leading-tight tracking-tight">{section.heading}</h2>
                    <p className="text-[17px] leading-[1.7] text-gray-700">{section.body}</p>
                  </section>
                ))}
              </div>

              <BlogSubscribeBox slug={post.slug} variant="editorial" />

              <section className="mt-16 border-t border-gray-100 pt-10">
                <div className="border-l-2 border-brand/35 pl-5 sm:pl-6">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">About the author</p>
                  <p className="mb-1 font-medium text-navy">{post.authorName}</p>
                  <p className="mb-3 text-[13px] text-gray-500">{post.authorRole}</p>
                  <p className="max-w-[52ch] text-[15px] leading-relaxed text-gray-600">{post.authorBio}</p>
                </div>
              </section>

              <RelatedBlock related={relatedPosts} />

              <nav className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm" aria-label="Article footer">
                <Link
                  href="/blog"
                  className="font-medium text-navy underline decoration-gray-300 underline-offset-4 hover:text-brand hover:decoration-brand"
                >
                  ← All articles
                </Link>
                <Link
                  href="/marketing"
                  className="font-medium text-gray-600 underline decoration-gray-300 underline-offset-4 hover:text-brand hover:decoration-brand"
                >
                  Software categories
                </Link>
              </nav>
            </article>

            <div className="h-full">
              <BlogTitlesRail currentSlug={post.slug} toc={toc} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
