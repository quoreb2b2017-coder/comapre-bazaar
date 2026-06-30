import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import {
  getBlogTopics,
  loadUnifiedBlogIndex,
  resolveTopicFromSlug,
  topicToSlug,
} from '@/lib/blogCms'
import { BlogFeaturedCarousel } from '@/components/blog/BlogFeaturedCarousel'
import { BlogGridCard } from '@/components/blog/BlogListingCards'
import { BlogLibraryHeroVisual } from '@/components/blog/BlogLibraryHeroVisual'
import { BlogSubscribeBox } from '@/components/blog/BlogSubscribeBox'
import { BlogTopicFilterBand } from '@/components/blog/BlogTopicFilterBand'
import { BlogTopicsStrip } from '@/components/blog/BlogTopicsStrip'

export const revalidate = 120

type BlogPageProps = {
  searchParams?: { topic?: string | string[] }
}

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const titleBase = 'Business Software Buying Guides, Reviews & Tips 2026'
  const description =
    'Actionable business software buying guides from Compare Bazaar editors. CRM, payroll, marketing, HR, and operations software insights.'
  const rawTopic = searchParams?.topic
  const topicParam = Array.isArray(rawTopic) ? rawTopic[0] : rawTopic

  if (topicParam) {
    let allPosts: Awaited<ReturnType<typeof loadUnifiedBlogIndex>> = []
    try {
      allPosts = await loadUnifiedBlogIndex()
    } catch {
      allPosts = []
    }
    const topicLabel = resolveTopicFromSlug(topicParam, allPosts)
    if (topicLabel) {
      return buildMetadata({
        title: `${topicLabel} — Blog`,
        description: `Compare Bazaar guides and articles about ${topicLabel}.`,
        canonical: `/blog?topic=${encodeURIComponent(topicToSlug(topicLabel))}`,
      })
    }
  }

  return buildMetadata({
    title: titleBase,
    description,
    canonical: '/blog',
  })
}

export default async function BlogIndexPage({ searchParams }: BlogPageProps) {
  let allPosts: Awaited<ReturnType<typeof loadUnifiedBlogIndex>> = []
  try {
    allPosts = await loadUnifiedBlogIndex()
  } catch {
    allPosts = []
  }

  const rawTopic = searchParams?.topic
  const topicParam = Array.isArray(rawTopic) ? rawTopic[0] : rawTopic
  const activeTopicSlug = topicParam ? topicToSlug(topicParam) : undefined
  const activeTopicLabel = topicParam ? resolveTopicFromSlug(topicParam, allPosts) : null

  const posts = activeTopicLabel
    ? allPosts.filter((p) => p.category === activeTopicLabel)
    : allPosts

  const topics = getBlogTopics(allPosts)
  const hasPosts = posts.length > 0
  const featuredPosts = posts.slice(0, Math.min(5, posts.length))
  const latestPosts = posts.slice(featuredPosts.length)

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#F8F9FC]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[400px] bg-[radial-gradient(ellipse_88%_72%_at_50%_-10%,rgba(245,130,32,0.08),transparent_70%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,31,61,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,31,61,0.025)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,white,transparent_90%)]"
        aria-hidden
      />

      {/* Hero */}
      <div className="relative bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-[1140px] px-4 py-5 sm:px-5 sm:py-7 lg:px-6">
          <Breadcrumb
            items={
              activeTopicLabel
                ? [
                    { label: 'Home', href: '/' },
                    { label: 'Blog', href: '/blog' },
                    { label: activeTopicLabel },
                  ]
                : [{ label: 'Home', href: '/' }, { label: 'Blog' }]
            }
            className="mb-5 text-sm"
          />

          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(260px,360px)] lg:gap-12">
            <header className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cb-orange/20 bg-cb-orange/5 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-cb-orange">
                <BookOpen className="h-3 w-3" strokeWidth={2} aria-hidden />
                Compare Bazaar · Editorial
              </span>

              <h1 className="mt-4 font-serif text-[1.875rem] font-normal leading-tight tracking-tight text-navy sm:text-[2.25rem]">
                {activeTopicLabel ?? 'Blog'}
              </h1>

              {activeTopicLabel ? (
                <p className="mt-1 text-[13px] text-gray-500">
                  {posts.length} guide{posts.length === 1 ? '' : 's'} in this topic
                </p>
              ) : null}

              <p className="mt-3 max-w-[54ch] text-[15px] leading-relaxed text-gray-600">
                {activeTopicLabel
                  ? 'Curated buying guides — structured research, honest trade-offs, and practical shortlists.'
                  : 'Independent buying guides for business software: structured research, clear trade-offs, and practical shortlists.'}
              </p>
            </header>

            <div className="mx-auto w-full max-w-[360px] lg:mx-0 lg:max-w-none lg:justify-self-end">
              <BlogLibraryHeroVisual posts={allPosts} />
            </div>
          </div>
        </div>
      </div>

      <BlogTopicsStrip topics={topics} activeTopicSlug={activeTopicSlug} />

      {/* Articles */}
      <div className="relative mx-auto max-w-[1140px] px-4 py-8 sm:px-5 sm:py-10 lg:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(220px,260px)] lg:gap-12">
          <div className="min-w-0">
            {!hasPosts ? (
              <div className="overflow-hidden rounded-2xl border border-dashed border-gray-200 bg-white shadow-sm">
                <div className="grid grid-cols-1 items-center gap-6 px-6 py-12 sm:grid-cols-[1fr_minmax(200px,260px)] sm:px-10">
                  <div className="text-center sm:text-left">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                      {activeTopicLabel ? 'No articles in this topic' : 'Coming soon'}
                    </p>
                    <p className="font-serif text-2xl text-navy">
                      {activeTopicLabel ? 'Try another topic' : 'New guides in production'}
                    </p>
                    <p className="mt-3 max-w-md text-[15px] leading-relaxed text-gray-500">
                      {activeTopicLabel
                        ? 'We have not published guides under this topic yet. Browse all articles or pick a different category above.'
                        : 'Our editorial team publishes new buying guides regularly.'}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-4">
                      <Link
                        href="/blog"
                        className="inline-flex items-center text-sm font-semibold text-cb-orange underline underline-offset-4 hover:text-cb-orange-hover"
                      >
                        {activeTopicLabel ? 'View all articles' : 'Back to home'}
                      </Link>
                      {!activeTopicLabel ? (
                        <Link
                          href="/resources/whitepaper"
                          className="inline-flex items-center text-sm font-semibold text-navy hover:text-cb-orange"
                        >
                          Browse whitepapers →
                        </Link>
                      ) : null}
                    </div>
                  </div>
                  <div
                    className="mx-auto flex h-32 w-32 items-center justify-center rounded-2xl border border-gray-100 bg-[#FAFBFD] sm:mx-0"
                    aria-hidden
                  >
                    <BookOpen className="h-12 w-12 text-gray-200" strokeWidth={1} />
                  </div>
                </div>
              </div>
            ) : (
              <div id="blog-articles" className="scroll-mt-20">
                {activeTopicLabel && activeTopicSlug ? (
                  <BlogTopicFilterBand
                    label={activeTopicLabel}
                    slug={activeTopicSlug}
                    count={posts.length}
                  />
                ) : null}

                {featuredPosts.length > 0 ? (
                  <BlogFeaturedCarousel
                    posts={featuredPosts}
                    sectionLabel={activeTopicLabel ? 'Top in this topic' : 'Featured guide'}
                  />
                ) : null}

                {latestPosts.length > 0 ? (
                  <div className={featuredPosts.length > 0 ? 'border-t border-gray-200 pt-8' : ''}>
                    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                          {activeTopicLabel ? 'All in topic' : 'Latest articles'}
                        </p>
                        <h2 className="font-serif text-[1.35rem] font-normal tracking-tight text-navy sm:text-[1.4rem]">
                          {activeTopicLabel ? activeTopicLabel : 'More from the desk'}
                        </h2>
                      </div>
                    </div>
                    <ul className="divide-y divide-gray-200/80">
                      {latestPosts.map((post, i) => (
                        <li key={post.slug}>
                          <BlogGridCard post={post} index={i + 1} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="mt-10">
                  <BlogSubscribeBox slug="blog-index" variant="editorial" />
                </div>
              </div>
            )}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="border-t-2 border-cb-orange/50 pt-4">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Our standard
                </h3>
                <ul className="mt-3 space-y-2.5 text-[12px] leading-snug text-gray-600">
                  <li className="border-l border-cb-orange/40 pl-2.5">
                    Structured criteria — not sponsored blurbs.
                  </li>
                  <li className="border-l border-cb-orange/40 pl-2.5">
                    Written for operators under time pressure.
                  </li>
                  <li className="border-l border-cb-orange/40 pl-2.5">
                    Clear trade-offs to disqualify vendors faster.
                  </li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cb-orange">
                  Research library
                </p>
                <p className="mt-1 font-serif text-base leading-snug text-navy">
                  Free whitepapers &amp; reports
                </p>
                <Link
                  href="/resources/whitepaper"
                  className="mt-2 inline-flex items-center text-[12px] font-semibold text-cb-orange hover:text-cb-orange-hover"
                >
                  Browse →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
