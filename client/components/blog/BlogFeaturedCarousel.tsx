'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Clock, Star } from 'lucide-react'
import type { UnifiedBlogCard } from '@/lib/blogCms'
import { BlogCoverImage } from '@/components/blog/BlogCoverImage'
import { BlogTopicLink } from '@/components/blog/BlogTopicLink'

function FeaturedSlide({ post }: { post: UnifiedBlogCard }) {
  const dateLabel = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <article className="group min-w-full">
      <div className="grid overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_12px_40px_-20px_rgba(11,42,111,0.2)] sm:grid-cols-[minmax(0,1.15fr)_minmax(240px,0.85fr)]">
        <div className="relative flex min-w-0 flex-col justify-center px-5 py-6 sm:px-7 sm:py-8">
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#F58220] to-[#0B2A6F]" aria-hidden />

          <p className="mb-2 inline-flex w-fit items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#F58220]">
            <Star className="h-3 w-3 fill-[#F58220]/20" aria-hidden />
            Latest blog
          </p>

          <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500">
            <BlogTopicLink category={post.category} className="font-medium text-slate-600" />
            <span className="text-slate-300">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3 opacity-70" aria-hidden />
              {post.readTime}
            </span>
            <span className="text-slate-300">·</span>
            <time dateTime={post.publishedAt}>{dateLabel}</time>
          </div>

          <h2 className="mb-3 max-w-[32ch] font-serif text-[1.4rem] leading-[1.18] tracking-tight text-navy sm:text-[1.6rem]">
            <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-[#F58220]">
              {post.title}
            </Link>
          </h2>

          {post.excerpt ? (
            <p className="mb-5 line-clamp-3 max-w-[48ch] text-[14px] leading-relaxed text-slate-600">{post.excerpt}</p>
          ) : null}

          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#0a245f] hover:shadow-md"
          >
            Read full guide
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="relative min-h-[200px] overflow-hidden border-t border-slate-100 sm:min-h-[280px] sm:border-l sm:border-t-0"
          aria-label={post.title}
        >
          <BlogCoverImage
            src={post.coverUrl}
            alt={post.title}
            coverInput={{ slug: post.slug, title: post.title, tags: [post.category] }}
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, 380px"
            priority
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100"
            aria-hidden
          />
        </Link>
      </div>
    </article>
  )
}

type BlogFeaturedCarouselProps = {
  posts: UnifiedBlogCard[]
  sectionLabel?: string
  intervalMs?: number
}

export function BlogFeaturedCarousel({
  posts,
  sectionLabel = 'Featured',
  intervalMs = 6000,
}: BlogFeaturedCarouselProps) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = posts.length

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
    }, intervalMs)
    return () => window.clearInterval(timer)
  }, [count, intervalMs, paused])

  if (count === 0) return null

  return (
    <section
      aria-roledescription="carousel"
      aria-label={sectionLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false)
      }}
    >
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Editor&apos;s pick</p>
          <h2 className="mt-0.5 font-serif text-[1.2rem] tracking-tight text-navy sm:text-[1.3rem]">{sectionLabel}</h2>
        </div>
        {count > 1 ? (
          <div className="flex items-center gap-3">
            <p className="text-[11px] tabular-nums text-slate-400">
              {active + 1} / {count}
            </p>
            <div className="flex gap-1.5" role="tablist" aria-label="Featured articles">
              {posts.map((post, i) => (
                <button
                  key={post.slug}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Show article ${i + 1}: ${post.title}`}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === active ? 'w-6 bg-[#F58220]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {posts.map((post) => (
            <div key={post.slug} className="w-full shrink-0" aria-hidden={post.slug !== posts[active]?.slug}>
              <FeaturedSlide post={post} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
