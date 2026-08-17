import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import {
  getBlogTopics,
  loadUnifiedBlogIndex,
  resolveTopicFromSlug,
  topicToSlug,
} from '@/lib/blogCms'
import { BLOG_PAGE_SHELL } from '@/lib/blogLayout'
import { BlogHubHero } from '@/components/blog/BlogHubHero'
import { BlogFeaturedCarousel } from '@/components/blog/BlogFeaturedCarousel'
import { BlogHomePreviewCard } from '@/components/blog/BlogListingCards'
import { BlogSubscribeBox } from '@/components/blog/BlogSubscribeBox'
import { BlogTopicGuideIndex } from '@/components/blog/BlogTopicGuideIndex'
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
    return {
      robots: { index: false, follow: true },
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
  const isTopicView = Boolean(activeTopicLabel)
  const hubFeaturedPosts = isTopicView ? [] : posts.slice(0, Math.min(5, posts.length))
  const hubLatestPosts = isTopicView ? [] : posts.slice(hubFeaturedPosts.length)

  return (
    <main className="min-h-screen bg-[#F4F6FA]">
      <BlogHubHero
        activeTopicLabel={activeTopicLabel}
        posts={posts}
        allPosts={allPosts}
        topics={topics}
        isTopicView={isTopicView}
      />

      <BlogTopicsStrip topics={topics} activeTopicSlug={activeTopicSlug} />

      {/* Articles - single full-width column, no empty sidebar gap */}
      <div id="blog-articles" className={`${BLOG_PAGE_SHELL} py-6 sm:py-7`}>
        {!hasPosts ? (
          <div className="rounded-lg border border-slate-200 bg-white px-5 py-8 sm:px-6">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              {activeTopicLabel ? 'No articles in this topic' : 'Coming soon'}
            </p>
            <p className="font-serif text-xl text-navy sm:text-2xl">
              {activeTopicLabel ? 'Try another topic' : 'New guides in production'}
            </p>
            <p className="mt-2 max-w-md text-[14px] leading-relaxed text-slate-500">
              {activeTopicLabel
                ? 'We have not published guides under this topic yet. Browse all articles or pick a different category above.'
                : 'Our editorial team publishes new buying guides regularly.'}
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link
                href="/blog"
                className="text-sm font-semibold text-[#F58220] underline underline-offset-4 hover:text-[#D97706]"
              >
                {activeTopicLabel ? 'View all articles' : 'Back to home'}
              </Link>
              {!activeTopicLabel ? (
                <Link href="/resources/whitepapers" className="text-sm font-semibold text-navy hover:text-[#F58220]">
                  Browse whitepapers →
                </Link>
              ) : null}
            </div>
          </div>
        ) : isTopicView ? (
          <>
            <BlogTopicGuideIndex posts={posts} />
            <div className="mt-8">
              <BlogSubscribeBox slug="blog-index" variant="editorial" />
            </div>
          </>
        ) : (
          <>
            {hubFeaturedPosts.length > 0 ? (
              <BlogFeaturedCarousel posts={hubFeaturedPosts} sectionLabel="Featured guide" />
            ) : null}

            {hubLatestPosts.length > 0 ? (
              <section className={hubFeaturedPosts.length > 0 ? 'mt-8' : ''}>
                <div className="mb-5 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Latest articles
                    </p>
                    <h2 className="mt-0.5 font-serif text-[1.25rem] tracking-tight text-navy sm:text-[1.3rem]">
                      More from the desk
                    </h2>
                  </div>
                  <span className="hidden rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-500 shadow-sm sm:inline">
                    {hubLatestPosts.length} guides
                  </span>
                </div>
                <ul className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {hubLatestPosts.map((post, i) => (
                    <li key={post.slug} className="flex">
                      <BlogHomePreviewCard post={post} priority={i < 3} />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
              <BlogSubscribeBox slug="blog-index" variant="editorial" />
              <div className="relative">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Our standard
                </h3>
                <ul className="mt-4 space-y-3 text-[13px] leading-snug text-slate-600">
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F58220]" aria-hidden />
                    Structured criteria - not sponsored blurbs.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F58220]" aria-hidden />
                    Written for operators under time pressure.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F58220]" aria-hidden />
                    Clear trade-offs to disqualify vendors faster.
                  </li>
                </ul>
                <Link
                  href="/resources/whitepapers"
                  className="mt-4 inline-flex text-[12px] font-semibold text-[#F58220] hover:text-[#D97706]"
                >
                  Research library →
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
