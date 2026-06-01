import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import {
  getBlogTopics,
  loadUnifiedBlogIndex,
  resolveTopicFromSlug,
  stripGradientForSlug,
  topicToSlug,
} from '@/lib/blogCms'
import { BlogFeaturedCard, BlogGridCard } from '@/components/blog/BlogListingCards'
import { BlogSubscribeBox } from '@/components/blog/BlogSubscribeBox'
import { BlogTopicFilterBand } from '@/components/blog/BlogTopicFilterBand'
import { BlogTopicsSidebar } from '@/components/blog/BlogTopicsSidebar'

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
  const featuredPost = posts[0]
  const latestPosts = posts.slice(1)
  const indexStrip = stripGradientForSlug('compare-bazaar-blog')
  const heroStrip =
    featuredPost != null
      ? { stripFrom: featuredPost.stripFrom, stripTo: featuredPost.stripTo }
      : indexStrip

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
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
          className="mb-10 sm:mb-12"
        />

        <section className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,48rem)_minmax(200px,260px)] lg:gap-14 xl:gap-16">
          <div className="min-w-0 w-full">
            <header className="mb-12 border-b border-gray-200 pb-10 sm:mb-14 sm:pb-12">
              <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
                <div className="min-w-0 flex-1">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-gray-400">
                    Compare Bazaar · Editorial
                  </p>
                  <div
                    className="mb-6 h-[3px] w-14 sm:w-16"
                    style={{ background: `linear-gradient(90deg, ${heroStrip.stripFrom}, ${heroStrip.stripTo})` }}
                    aria-hidden
                  />
                  <h1 className="font-serif text-[2.5rem] leading-[1.05] tracking-tight text-navy sm:text-[2.875rem] lg:text-[3.125rem]">
                    Blog
                  </h1>
                  {activeTopicLabel ? (
                    <p className="mt-5 inline-flex max-w-full flex-wrap items-center gap-2 text-[15px] text-gray-600">
                      <span className="text-gray-400">Topic</span>
                      <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 font-medium text-navy">
                        {activeTopicLabel}
                      </span>
                      <span className="text-gray-400">
                        · {posts.length} article{posts.length === 1 ? '' : 's'}
                      </span>
                    </p>
                  ) : null}
                  <p className="mt-6 max-w-[54ch] text-[17px] leading-[1.7] text-gray-600 sm:text-[1.125rem]">
                    {activeTopicLabel
                      ? 'Guides in this category are listed below. The topic bar stays visible as you scroll so you always know what you are browsing.'
                      : 'Independent buying guides for business software: structured research, clear trade-offs, and practical shortlists.'}
                  </p>
                </div>
                <div className="hidden max-w-[240px] shrink-0 border-l border-gray-200 pl-8 lg:block xl:pl-10">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">Reading guide</p>
                  <p className="mt-4 text-[13px] leading-[1.65] text-gray-600">
                    {activeTopicLabel
                      ? 'Browse every article in this topic below, or pick another topic in the column →'
                      : 'Start with the featured guide, then scan numbered articles below. Topics and publication standards are in the column →'}
                  </p>
                </div>
              </div>
            </header>

            {!hasPosts ? (
              <div className="border-t border-gray-100 py-16 text-center">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  {activeTopicLabel ? 'No articles in this topic' : 'No articles yet'}
                </p>
                <p className="mb-3 font-serif text-xl text-navy">
                  {activeTopicLabel ? 'Try another topic' : 'Coming soon'}
                </p>
                <p className="mx-auto mb-8 max-w-md text-[15px] leading-relaxed text-gray-600">
                  {activeTopicLabel
                    ? 'We have not published guides under this topic yet. Browse all articles or choose a different topic.'
                    : 'Publish from blog admin to show guides here.'}
                </p>
                <Link
                  href="/blog"
                  className="text-sm font-medium text-brand underline underline-offset-4 hover:text-brand-hover"
                >
                  {activeTopicLabel ? 'View all articles' : 'Return home'}
                </Link>
              </div>
            ) : (
              <div id="blog-articles" className="scroll-mt-24">
                {activeTopicLabel && activeTopicSlug ? (
                  <BlogTopicFilterBand
                    label={activeTopicLabel}
                    slug={activeTopicSlug}
                    count={posts.length}
                    accentFrom={heroStrip.stripFrom}
                    accentTo={heroStrip.stripTo}
                  />
                ) : null}

                {featuredPost ? (
                  <BlogFeaturedCard
                    post={featuredPost}
                    sectionLabel={activeTopicLabel ? 'Top in this topic' : 'Featured'}
                  />
                ) : null}

                {latestPosts.length > 0 ? (
                  <div>
                    <div className="mb-1 flex flex-col gap-3 border-b border-gray-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-400">
                          {activeTopicLabel ? 'All articles in topic' : 'Archive'}
                        </p>
                        <h2 className="font-serif text-[1.5rem] tracking-tight text-navy sm:text-[1.625rem]">
                          {activeTopicLabel ? activeTopicLabel : 'Latest articles'}
                        </h2>
                      </div>
                      <p className="max-w-[42ch] text-[14px] leading-relaxed text-gray-500">
                        {activeTopicLabel
                          ? `${latestPosts.length} more guide${latestPosts.length === 1 ? '' : 's'} in this topic.`
                          : 'Same criteria we use in product comparisons, written for teams choosing vendors under time pressure.'}
                      </p>
                    </div>
                    <ul className="divide-y divide-gray-100">
                      {latestPosts.map((post, i) => (
                        <li key={post.slug}>
                          <BlogGridCard post={post} index={i + 1} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <BlogSubscribeBox slug="blog-index" variant="editorial" />
              </div>
            )}
          </div>

          <aside className="space-y-12 border-gray-200 lg:sticky lg:top-28 lg:border-l lg:pl-9 xl:pl-10">
            <BlogTopicsSidebar topics={topics} activeTopicSlug={activeTopicSlug} />
            <div>
              <h3 className="mb-5 border-b border-gray-100 pb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                Our standard
              </h3>
              <ul className="space-y-5 text-[14px] leading-[1.65] text-gray-600">
                <li className="border-l-2 border-gray-200 pl-4 leading-snug">
                  Structured criteria and repeatable scoring, not sponsored blurbs.
                </li>
                <li className="border-l-2 border-gray-200 pl-4 leading-snug">
                  Written for operators making purchase decisions under time pressure.
                </li>
                <li className="border-l-2 border-gray-200 pl-4 leading-snug">
                  We foreground trade-offs so you can disqualify vendors faster.
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}
