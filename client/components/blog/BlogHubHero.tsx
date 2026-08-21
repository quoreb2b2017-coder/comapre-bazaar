import Link from 'next/link'
import { ArrowLeft, BookOpen, Layers, Sparkles } from 'lucide-react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { BLOG_PAGE_SHELL } from '@/lib/blogLayout'
import type { BlogTopicEntry, UnifiedBlogCard } from '@/lib/blogCms'
import { BlogLibraryHeroVisual } from '@/components/blog/BlogLibraryHeroVisual'
import { BlogTopicHeroExtras } from '@/components/blog/BlogTopicHeroExtras'

type Props = {
  activeTopicLabel: string | null
  posts: UnifiedBlogCard[]
  allPosts: UnifiedBlogCard[]
  topics: BlogTopicEntry[]
  isTopicView: boolean
}

export function BlogHubHero({ activeTopicLabel, posts, allPosts, topics, isTopicView }: Props) {
  const guideCount = isTopicView ? posts.length : allPosts.length
  const topicCount = topics.length

  return (
    <section className="relative overflow-hidden border-b border-slate-200/80 bg-white">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0B2A6F] via-[#F58220] to-[#0B2A6F]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-12 h-64 w-64 rounded-full bg-[#F58220]/[0.06] blur-3xl"
        aria-hidden
      />

      <div className={`${BLOG_PAGE_SHELL} relative py-5 sm:py-6`}>
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
          className="mb-4 text-sm"
        />

        <div className="lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] lg:items-stretch lg:gap-8">
          {/* Copy */}
          <div className="relative z-10 flex flex-col justify-center py-1 lg:py-2">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.4]"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, transparent 60%, rgba(245,130,32,0.04) 100%)',
              }}
              aria-hidden
            />
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#F58220]/20 bg-[#FFF7EF] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#F58220]">
              <BookOpen className="h-3 w-3" strokeWidth={2.25} aria-hidden />
              Compare Bazaar · Editorial
            </span>

            <h1 className="mt-3 font-serif text-[1.85rem] font-normal leading-[1.12] tracking-tight text-navy sm:text-[2.15rem] lg:text-[2.35rem]">
              {activeTopicLabel ?? (
                <>
                  Business software
                  <span className="block text-[#F58220]">blogs</span>
                </>
              )}
            </h1>

            {activeTopicLabel ? (
              <BlogTopicHeroExtras label={activeTopicLabel} count={posts.length} />
            ) : (
              <>
                <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-slate-600 sm:text-[15.5px]">
                  Independent research for growing teams - structured criteria, clear trade-offs, and
                  practical shortlists you can act on today.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-[12px] font-semibold text-navy">
                    <Layers className="h-3.5 w-3.5 text-[#F58220]" aria-hidden />
                    {guideCount} blogs
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-[12px] font-semibold text-navy">
                    <Sparkles className="h-3.5 w-3.5 text-[#F58220]" aria-hidden />
                    {topicCount} topics
                  </span>
                </div>

                {topics.length > 0 ? (
                  <div className="mt-5 hidden flex-wrap gap-2 sm:flex">
                    {topics.slice(0, 4).map((topic) => (
                      <Link
                        key={topic.slug}
                        href={`/blog?topic=${encodeURIComponent(topic.slug)}#blog-articles`}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-600 transition hover:border-[#F58220]/40 hover:bg-[#FFFAF5] hover:text-navy"
                      >
                        {topic.label}
                      </Link>
                    ))}
                  </div>
                ) : null}

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <a
                    href="#blog-articles"
                    className="inline-flex items-center justify-center rounded-lg bg-navy px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#0a2560]"
                  >
                    Browse all blogs
                  </a>
                  <Link
                    href="/technology/get-free-quotes"
                    className="text-[13px] font-semibold text-[#F58220] underline decoration-[#F58220]/30 underline-offset-4 hover:decoration-[#F58220]"
                  >
                    Get free quotes →
                  </Link>
                </div>
              </>
            )}

            {activeTopicLabel ? (
              <Link
                href="/blog"
                className="mt-5 inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold text-[#F58220] transition hover:text-[#D97706] lg:hidden"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                All topics
              </Link>
            ) : null}
          </div>

          {/* Visual panel - fills right side, no dead gap */}
          <div className="relative mt-6 lg:mt-0 lg:pl-2">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 80% 20%, rgba(245,130,32,0.12) 0%, transparent 45%), radial-gradient(circle at 20% 80%, rgba(11,42,111,0.06) 0%, transparent 40%)',
              }}
              aria-hidden
            />
            <div className="relative mx-auto w-full max-w-[380px] lg:max-w-none lg:pt-2">
              <BlogLibraryHeroVisual posts={isTopicView ? posts : allPosts} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
