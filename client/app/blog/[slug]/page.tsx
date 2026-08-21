import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { buildBlogShareMetadata, buildMetadata, formatShareDescription } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { PostRelatedContent } from '@/components/seo/seo-components'
import { lastVerifiedForPost, normalizeBlogSlug } from '@/lib/content-map'
import { blogPostingGraph, buildGraph } from '@/lib/schema'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { blogPosts } from '@/data/blogPosts'
import {
  fetchPublishedBlogBySlug,
  loadUnifiedBlogIndex,
  pickRelatedBlogPosts,
  plainBlogExcerpt,
  splitCmsHeroFromBody,
  parseCmsHeroBanner,
  type CmsBlogDetail,
  type UnifiedBlogCard,
} from '@/lib/blogCms'
import { resolveCoverUrlFromCms } from '@/lib/blogTopicCovers'
import { BLOG_PAGE_SHELL } from '@/lib/blogLayout'
import { publicSchemaAuthor } from '@/lib/publicEditorDisplay'
import { injectBlogAutoLinks } from '@/lib/blogAutoLink'
import { injectBlogBrandLogos } from '@/lib/blogBrandLogos'
import { injectBlogEmphasis } from '@/lib/blogEmphasis'
import { BlogSubscribeBox } from '@/components/blog/BlogSubscribeBox'
import { BlogArticleHero } from '@/components/blog/BlogArticleHero'
import { BlogArticleMeta } from '@/components/blog/BlogArticleMeta'
import { BlogArticleSidebar } from '@/components/blog/BlogArticleSidebar'
import { BlogArticleContent } from '@/components/blog/BlogArticleContent'
import { BlogArticleShell } from '@/components/blog/BlogArticleShell'
import { BlogRelatedCards } from '@/components/blog/BlogRelatedCards'
import { buildArticleContentChunks } from '@/lib/blogArticleEnrichments'

type Props = { params: { slug: string } }
const SITE_URL = 'https://www.compare-bazaar.com'

export const dynamicParams = true
export const revalidate = 120

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

function buildBlogArticleSchema(opts: {
  slug: string
  headline: string
  description: string
  datePublished?: string
  dateModified?: string
}) {
  const normalizedSlug = normalizeBlogSlug(opts.slug)
  const verified = lastVerifiedForPost(opts.slug)
  const dateModified = verified
    ? new Date(verified).toISOString()
    : opts.dateModified || opts.datePublished

  return buildGraph(
    blogPostingGraph({
      url: `${SITE_URL}/blog/${normalizedSlug}`,
      headline: opts.headline,
      description: opts.description,
      image: `${SITE_URL}/api/og?slug=${encodeURIComponent(normalizedSlug)}`,
      datePublished: opts.datePublished || dateModified || new Date().toISOString(),
      dateModified: dateModified || opts.datePublished || new Date().toISOString(),
      author: publicSchemaAuthor(),
    })
  )
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

function toAbsoluteMediaUrl(raw: string): string {
  const v = String(raw || '').trim()
  if (!v) return ''
  if (v.startsWith('http://') || v.startsWith('https://')) return v
  if (v.startsWith('//')) return `https:${v}`
  return `${SITE_URL}${v.startsWith('/') ? v : `/${v}`}`
}

function extractHeroBannerImageUrl(html: string): string {
  const s = String(html || '')
  if (!s) return ''

  // Prefer explicit <img src="..."> inside CMS hero
  const imgMatch = s.match(/<img[^>]*\s+src=["']([^"']+)["'][^>]*>/i)
  if (imgMatch?.[1]) return toAbsoluteMediaUrl(imgMatch[1])

  // Fallback: inline CSS background-image:url(...)
  const bgMatch = s.match(/background(?:-image)?\s*:\s*url\((['"]?)([^'")]+)\1\)/i)
  if (bgMatch?.[2]) return toAbsoluteMediaUrl(bgMatch[2])

  return ''
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cms = await fetchPublishedBlogBySlug(params.slug)
  if (cms) {
    const headline = (cms.metaTitle && cms.metaTitle.trim()) || cms.title
    const rawDesc = cms.metaDescription || cms.excerpt || formatShareDescription(cms.content?.slice(0, 600))
    const kw = [...new Set([...(cms.keywords || []), ...(cms.tags || [])])].slice(0, 24)
    const thumbnailOg = resolveCoverUrlFromCms({
      slug: cms.slug,
      title: cms.title,
      topic: cms.topic,
      tags: cms.tags,
      keywords: cms.keywords,
      metaTitle: cms.metaTitle,
      metaDescription: cms.metaDescription,
      coverImageUrl: cms.coverImageUrl,
    })
    const bannerOg = extractHeroBannerImageUrl(cms.content)
    return buildBlogShareMetadata({
      title: headline,
      description: rawDesc,
      canonicalPath: `/blog/${cms.slug}`,
      ogImageUrl:
        thumbnailOg || bannerOg || `https://www.compare-bazaar.com/api/og?slug=${encodeURIComponent(cms.slug)}`,
      publishedAt: cms.publishedAt ?? cms.approvedAt ?? undefined,
      modifiedAt: cms.updatedAt ?? cms.publishedAt ?? cms.approvedAt,
      section: (cms.tags && cms.tags[0]) || cms.topic,
      keywords: kw.length ? kw : undefined,
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
  const thumbnailOg = resolveCoverUrlFromCms({
    slug: post.slug,
    title: post.title,
    topic: post.category,
  })
  return buildBlogShareMetadata({
    title: post.title,
    description: post.excerpt,
    canonicalPath: `/blog/${post.slug}`,
    ogImageUrl: thumbnailOg || `https://www.compare-bazaar.com/api/og?slug=${encodeURIComponent(post.slug)}`,
    publishedAt: post.publishedAt,
    section: post.category,
    keywords: [post.category],
  })
}

function RelatedBlock({ related, category }: { related: UnifiedBlogCard[]; category: string }) {
  if (related.length === 0) return null
  return (
    <div className="mt-10 border-t border-slate-200 pt-8">
      <BlogRelatedCards posts={related} heading={`More ${category} blogs`} />
    </div>
  )
}

const ARTICLE_PAGE_SHELL = BLOG_PAGE_SHELL
const ARTICLE_LAYOUT_GRID =
  'lg:grid lg:grid-cols-[minmax(0,1fr)_272px] lg:items-start lg:gap-x-6 xl:grid-cols-[minmax(0,1fr)_288px] xl:gap-x-8'
const ARTICLE_SIDEBAR_STICKY = 'blog-article-sidebar-sticky hidden lg:block w-full'

async function CmsBlogArticle({
  cms,
  allPosts,
}: {
  cms: CmsBlogDetail
  allPosts: Awaited<ReturnType<typeof loadUnifiedBlogIndex>>
}) {
  const category = (cms.tags && cms.tags[0]) || cms.topic || 'Editorial'
  const readLabel =
    typeof cms.readingTime === 'number' && cms.readingTime > 0 ? `${cms.readingTime} min read` : '8 min read'
  const publishedRaw = cms.publishedAt ? new Date(cms.publishedAt) : new Date()
  const related = pickRelatedBlogPosts(allPosts, {
    currentSlug: cms.slug,
    category,
    topic: cms.topic,
    tags: cms.tags,
    limit: 6,
  })
  const latestSidebar = pickRelatedBlogPosts(allPosts, {
    currentSlug: cms.slug,
    category,
    topic: cms.topic,
    tags: cms.tags,
    limit: 6,
  }).map((item) => ({ slug: item.slug, title: item.title }))
  const headline = (cms.metaTitle && cms.metaTitle.trim()) || cms.title
  const { heroHtml, bodyHtml } = splitCmsHeroFromBody(cms.content)
  const parsedHero = heroHtml ? parseCmsHeroBanner(heroHtml) : null
  const coverUrl = resolveCoverUrlFromCms({
    slug: cms.slug,
    title: cms.title,
    topic: cms.topic,
    tags: cms.tags,
    keywords: cms.keywords,
    metaTitle: cms.metaTitle,
    metaDescription: cms.metaDescription,
    coverImageUrl: cms.coverImageUrl,
  })
  const coverInput = {
    slug: cms.slug,
    title: cms.title,
    topic: cms.topic,
    tags: cms.tags,
    keywords: cms.keywords,
  }
  const hasHeroBanner = Boolean(parsedHero?.title || heroHtml)
  const sourceBodyHtml = heroHtml ? bodyHtml : cms.content
  const { html: anchoredBodyHtml, toc } = addHeadingAnchors(
    injectBlogBrandLogos(injectBlogEmphasis(injectBlogAutoLinks(sourceBodyHtml))),
  )
  const contentChunks = buildArticleContentChunks({
    html: anchoredBodyHtml,
    slug: cms.slug,
    topic: cms.topic,
    title: cms.title,
    tags: cms.tags,
  })
  const articleSchema = buildBlogArticleSchema({
    slug: cms.slug,
    headline,
    description: cms.metaDescription || cms.excerpt || formatShareDescription(cms.content?.slice(0, 800)),
    datePublished: isoDate(cms.publishedAt ?? cms.approvedAt),
    dateModified: isoDate(cms.updatedAt ?? cms.publishedAt ?? cms.approvedAt),
  })

  const shellClass = ARTICLE_PAGE_SHELL
  const articleProseClass =
    'blog-cms-html blog-article-prose prose prose-base max-w-none prose-headings:scroll-mt-28 prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-navy prose-h2:mt-10 prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-3 prose-h2:text-[1.375rem] prose-h3:text-[1.125rem] prose-p:my-0 prose-p:text-base prose-p:leading-[1.75] prose-li:text-base prose-li:marker:text-[#F58220]' +
    (hasHeroBanner ? ' blog-cms-after-hero' : '')

  return (
    <main className="min-h-screen w-full bg-[#F4F6FA]">
      <div className={`${shellClass} flex flex-col gap-3 pb-8 pt-5 sm:gap-4 sm:pb-10 sm:pt-6`}>
        <JsonLd schema={articleSchema} />

        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: hasHeroBanner ? headline : cms.title },
          ]}
          className="shrink-0"
        />

        <BlogArticleHero
          title={parsedHero?.title || cms.title}
          eyebrow={parsedHero?.eyebrow || category}
          subtitle={parsedHero?.subtitle || plainBlogExcerpt(cms.excerpt, 220)}
          pills={parsedHero?.pills}
          coverUrl={coverUrl}
          coverInput={coverInput}
        />

        <BlogArticleShell
          slug={cms.slug}
          topic={(cms.tags && cms.tags[0]) || cms.topic}
          tags={cms.tags}
          title={headline}
        >
        <div className={ARTICLE_LAYOUT_GRID}>
          <article className="min-w-0">
            <div className="blog-article-body">
              <BlogArticleMeta category={category} readTime={readLabel} publishedAt={publishedRaw} />

              <div className="mt-5">
                <BlogArticleContent
                  chunks={contentChunks}
                  proseClassName={articleProseClass}
                  articleMeta={{
                    slug: cms.slug,
                    topic: (cms.tags && cms.tags[0]) || cms.topic,
                    tags: cms.tags,
                    title: headline,
                  }}
                />
              </div>

              <div className="mt-6">
                <PostRelatedContent postSlug={normalizeBlogSlug(cms.slug)} />
              </div>

              <section className="mt-8 border-t border-slate-100 pt-6">
                <div className="max-w-[52ch] border-l-2 border-[#F58220]/40 pl-5">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    About this blog
                  </p>
                  <p className="text-[15px] leading-relaxed text-slate-600">
                    Independent software comparisons and blogs for growing businesses.
                  </p>
                </div>
              </section>

              <nav className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-slate-100 pt-6 text-sm" aria-label="Article footer">
                <Link
                  href="/blog"
                  className="font-medium text-navy underline decoration-slate-300 underline-offset-4 hover:text-brand hover:decoration-brand"
                >
                  ← All articles
                </Link>
                <Link
                  href="/marketing"
                  className="font-medium text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-brand hover:decoration-brand"
                >
                  Software categories
                </Link>
              </nav>
            </div>
          </article>

          <div className={`${ARTICLE_SIDEBAR_STICKY}`}>
            <BlogArticleSidebar
              currentSlug={cms.slug}
              currentTitle={headline}
              toc={toc}
              latest={latestSidebar}
              category={category}
              topic={(cms.tags && cms.tags[0]) || cms.topic}
              tags={cms.tags}
            />
          </div>
        </div>

        <div className="mt-4 lg:hidden">
          <BlogArticleSidebar
            currentSlug={cms.slug}
            currentTitle={headline}
            toc={toc}
            latest={latestSidebar}
            category={category}
            topic={(cms.tags && cms.tags[0]) || cms.topic}
            tags={cms.tags}
          />
        </div>
        </BlogArticleShell>

        <RelatedBlock related={related} category={category} />
      </div>
    </main>
  )
}

export default async function BlogPostPage({ params }: Props) {
  const [cms, allPosts] = await Promise.all([
    fetchPublishedBlogBySlug(params.slug),
    loadUnifiedBlogIndex(),
  ])
  if (cms) return <CmsBlogArticle cms={cms} allPosts={allPosts} />

  const post = blogPosts.find((item) => item.slug === params.slug)
  if (!post) notFound()

  const relatedPosts = pickRelatedBlogPosts(allPosts, {
    currentSlug: post.slug,
    category: post.category,
    topic: post.category,
    tags: [post.category],
    limit: 6,
  })
  const latestSidebar = pickRelatedBlogPosts(allPosts, {
    currentSlug: post.slug,
    category: post.category,
    topic: post.category,
    tags: [post.category],
    limit: 6,
  }).map((item) => ({ slug: item.slug, title: item.title }))

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
  const legacyHtml = injectBlogBrandLogos(
    injectBlogEmphasis(
      sections
        .map((s) => `<h2 id="${s.id}">${s.heading}</h2><p>${s.body.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`)
        .join(''),
    ),
  )
  const legacyContentChunks = buildArticleContentChunks({
    html: legacyHtml,
    slug: post.slug,
    topic: post.category,
    title: post.title,
    tags: [post.category],
  })
  const legacyProseClass =
    'blog-article-prose prose prose-base max-w-none prose-headings:scroll-mt-28 prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-navy prose-h2:mt-10 prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-3 prose-h2:text-[1.375rem] prose-p:my-0 prose-p:text-base prose-p:leading-[1.75] prose-li:text-base'

  const legacyArticleSchema = buildBlogArticleSchema({
    slug: post.slug,
    headline: post.title,
    description: post.excerpt,
    datePublished: isoDate(post.publishedAt),
  })

  return (
    <main className="min-h-screen w-full bg-[#F8F9FC]">
      <div className={`${ARTICLE_PAGE_SHELL} pb-8 pt-5 sm:pb-10 sm:pt-6`}>
        <JsonLd schema={legacyArticleSchema} />
        <div className="flex flex-col gap-4 sm:gap-5">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: post.title },
            ]}
          />

          <BlogArticleHero
            title={post.title}
            eyebrow={post.category}
            subtitle={post.excerpt}
            coverUrl={resolveCoverUrlFromCms({ slug: post.slug, title: post.title, topic: post.category })}
            coverInput={{ slug: post.slug, title: post.title, topic: post.category }}
          />

          <BlogArticleShell slug={post.slug} topic={post.category} tags={[post.category]} title={post.title}>
          <div className={ARTICLE_LAYOUT_GRID}>
            <article className="min-w-0">
              <div className="blog-article-body">
                <BlogArticleMeta
                  category={post.category}
                  readTime={post.readTime}
                  publishedAt={new Date(post.publishedAt)}
                />

                <section className="mt-5 mb-6 border-b border-slate-100 pb-6">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Summary</p>
                  <h2 className="mb-4 font-serif text-xl text-navy">Key takeaways</h2>
                  <ul className="space-y-3.5 text-[16px] leading-[1.7] text-slate-700">
                    {post.content.slice(0, 3).map((point) => (
                      <li key={point} className="border-l-2 border-[#F58220]/35 pl-4">
                        {point}
                      </li>
                    ))}
                  </ul>
                </section>

                <BlogArticleContent
                  chunks={legacyContentChunks}
                  proseClassName={legacyProseClass}
                  articleMeta={{ slug: post.slug, topic: post.category, tags: [post.category], title: post.title }}
                />

                <div className="mt-6">
                  <PostRelatedContent postSlug={normalizeBlogSlug(post.slug)} />
                </div>

                <div className="mt-6">
                  <BlogSubscribeBox slug={post.slug} variant="editorial" />
                </div>

                <nav className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-slate-100 pt-6 text-sm" aria-label="Article footer">
                  <Link
                    href="/blog"
                    className="font-medium text-navy underline decoration-slate-300 underline-offset-4 hover:text-brand hover:decoration-brand"
                  >
                    ← All articles
                  </Link>
                  <Link
                    href="/marketing"
                    className="font-medium text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-brand hover:decoration-brand"
                  >
                    Software categories
                  </Link>
                </nav>
              </div>
            </article>

            <div className={`${ARTICLE_SIDEBAR_STICKY}`}>
              <BlogArticleSidebar
                currentSlug={post.slug}
                currentTitle={post.title}
                toc={toc}
                latest={latestSidebar}
                category={post.category}
                topic={post.category}
                tags={[post.category]}
              />
            </div>
          </div>

          <div className="mt-6 lg:hidden">
            <BlogArticleSidebar
              currentSlug={post.slug}
              currentTitle={post.title}
              toc={toc}
              latest={latestSidebar}
              category={post.category}
              topic={post.category}
              tags={[post.category]}
            />
          </div>
          </BlogArticleShell>

          <RelatedBlock related={relatedPosts} category={post.category} />
        </div>
      </div>
    </main>
  )
}
