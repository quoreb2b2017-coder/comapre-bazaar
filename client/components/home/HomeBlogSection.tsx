'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import type { UnifiedBlogCard } from '@/lib/blogCms'
import { BlogCoverImage } from '@/components/blog/BlogCoverImage'

const ROTATE_MS = 3000
const SIDE_HEADING = 'mb-3 h-4 text-[11px] font-semibold uppercase tracking-[0.18em]'

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function FeaturedArticle({
  post,
  dots,
}: {
  post: UnifiedBlogCard
  dots?: ReactNode
}) {
  return (
    <article className="relative h-full min-h-[24rem] overflow-hidden bg-slate-950 ring-1 ring-black/10 sm:min-h-[26rem] lg:min-h-[30rem]">
      <BlogCoverImage
        src={post.coverUrl}
        alt=""
        coverInput={{ slug: post.slug, title: post.title, tags: [post.category] }}
        priority
        className="object-cover object-top"
        sizes="(max-width: 1024px) 100vw, 60vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:px-6 sm:pb-5 sm:pt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F58220]">
          {post.category}
        </p>
        <h3 className="mt-1.5 line-clamp-2 font-serif text-[1.25rem] leading-snug tracking-tight text-white sm:text-[1.5rem]">
          <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-[#F58220]">
            {post.title}
          </Link>
        </h3>
        {post.excerpt ? (
          <p className="mt-2 line-clamp-2 max-w-2xl text-[13px] leading-relaxed text-white/75">
            {post.excerpt}
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="flex flex-wrap items-center gap-1.5 text-[12px] text-white/70">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {post.readTime}
            </span>
            <span className="text-white/35">·</span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </p>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-white transition-colors hover:text-[#F58220]"
          >
            Read blog <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {dots ? <div className="mt-3">{dots}</div> : null}
      </div>
    </article>
  )
}

export function HomeBlogSection({ posts }: { posts: UnifiedBlogCard[] }) {
  const items = posts.slice(0, 5)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = items.length

  const goTo = useCallback(
    (index: number) => {
      if (count <= 0) return
      setActive(((index % count) + count) % count)
    },
    [count],
  )

  useEffect(() => {
    if (count <= 1 || paused) return
    const timer = window.setInterval(() => {
      setActive((i) => (i + 1) % count)
    }, ROTATE_MS)
    return () => window.clearInterval(timer)
  }, [count, paused])

  if (count === 0) return null

  const featured = items[active]
  const sidePosts = items
    .map((post, index) => ({ post, index }))
    .filter(({ index }) => index !== active)
    .slice(0, 4)

  return (
    <section
      id="latest-blogs"
      className="relative overflow-hidden scroll-mt-24 border-b border-slate-200 bg-[#EEF2F8]"
      aria-labelledby="blog-preview-heading"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -right-24 -top-28 h-[22rem] w-[22rem] rounded-full bg-[#F58220]/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-[26rem] w-[26rem] rounded-full bg-[#0B2A6F]/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[90rem] px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
        <div className="mb-8 text-center">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F58220]">
            Latest blogs
          </p>
          <h2 id="blog-preview-heading" className="font-serif text-2xl tracking-tight text-navy sm:text-[2rem]">
            From the editorial desk
          </h2>
        </div>

        <div className="grid items-stretch gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(20rem,24rem)] lg:gap-6">
          <div
            className="flex min-h-0 min-w-0 flex-col"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <p className={`${SIDE_HEADING} hidden lg:block`} aria-hidden>
              &nbsp;
            </p>
            <div className="flex-1">
              <FeaturedArticle
                key={featured.slug}
                post={featured}
                dots={
                  count > 1 ? (
                    <div className="flex items-center gap-1.5" role="tablist" aria-label="Latest articles">
                      {items.map((post, i) => (
                        <button
                          key={post.slug}
                          type="button"
                          role="tab"
                          aria-selected={i === active}
                          aria-label={`Show article ${i + 1}: ${post.title}`}
                          onClick={() => goTo(i)}
                          className={`h-1.5 rounded-full transition-all ${
                            i === active ? 'w-6 bg-[#F58220]' : 'w-2.5 bg-white/40 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>
                  ) : null
                }
              />
            </div>
          </div>

          <div className="flex min-h-0 flex-col">
            <p className={`${SIDE_HEADING} text-navy`}>More latest</p>
            <ul className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-3">
              {sidePosts.map(({ post, index }, displayIndex) => (
                <li key={post.slug} className="min-h-0">
                  <button
                    type="button"
                    onClick={() => goTo(index)}
                    className="group relative block h-full min-h-[11rem] w-full overflow-hidden text-left ring-1 ring-black/10 transition duration-300 hover:ring-2 hover:ring-[#F58220]"
                  >
                    <BlogCoverImage
                      src={post.coverUrl}
                      alt={post.title}
                      coverInput={{ slug: post.slug, title: post.title, tags: [post.category] }}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                      sizes="240px"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
                    <span className="absolute left-2.5 top-2 font-serif text-[1.05rem] leading-none tabular-nums text-white/90">
                      {String(displayIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="absolute inset-x-0 bottom-0 px-2.5 pb-2.5">
                      <span className="block truncate text-[9px] font-semibold uppercase tracking-[0.14em] text-[#F58220]">
                        {post.category}
                      </span>
                      <span className="mt-0.5 block line-clamp-2 font-serif text-[13px] leading-snug text-white">
                        {post.title}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {count > 1 ? (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#0B2A6F] text-white shadow-sm transition hover:bg-[#123a8c]"
              aria-label="Previous blog"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#0B2A6F] text-white shadow-sm transition hover:bg-[#123a8c]"
              aria-label="Next blog"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
