'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import type { UnifiedBlogCard } from '@/lib/blogCms'
import { BlogTopicLink } from '@/components/blog/BlogTopicLink'

function FeaturedSlide({ post }: { post: UnifiedBlogCard }) {
  const dateLabel = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <article className="group min-w-full">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        <Link
          href={`/blog/${post.slug}`}
          className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-gray-100 sm:aspect-[16/10] sm:w-[42%] sm:max-w-[320px]"
          aria-label={post.title}
        >
          <Image
            src={post.coverUrl}
            alt={post.title}
            fill
            className="object-cover transition-opacity duration-500 group-hover:opacity-95"
            sizes="(max-width: 640px) 100vw, 320px"
            priority
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col sm:border-l sm:border-gray-200 sm:pl-5">
          <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500">
            <BlogTopicLink category={post.category} className="text-gray-600" />
            <span className="text-gray-300">·</span>
            <span className="inline-flex items-center gap-1 normal-case tracking-normal">
              <Clock className="h-3 w-3 opacity-65" aria-hidden />
              {post.readTime}
            </span>
            <span className="text-gray-300">·</span>
            <time className="font-normal normal-case tracking-normal text-gray-500" dateTime={post.publishedAt}>
              {dateLabel}
            </time>
          </div>

          <h2 className="mb-3 font-serif text-[1.4rem] leading-snug tracking-tight text-navy sm:text-[1.55rem]">
            <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-cb-orange">
              {post.title}
            </Link>
          </h2>

          {post.excerpt ? (
            <p className="mb-3 line-clamp-3 text-[14px] leading-relaxed text-gray-600">{post.excerpt}</p>
          ) : null}

          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-navy underline decoration-gray-300 underline-offset-2 transition-colors hover:text-cb-orange"
          >
            Read guide
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
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
      className="mb-8"
      aria-roledescription="carousel"
      aria-label={sectionLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false)
      }}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">{sectionLabel}</p>
        {count > 1 ? (
          <div className="flex items-center gap-2">
            <p className="text-[11px] tabular-nums text-gray-400">
              {active + 1}/{count}
            </p>
            <div className="flex gap-1" role="tablist" aria-label="Featured articles">
              {posts.map((post, i) => (
                <button
                  key={post.slug}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Show article ${i + 1}: ${post.title}`}
                  onClick={() => goTo(i)}
                  className={`h-1 rounded-full transition-all ${
                    i === active ? 'w-4 bg-cb-orange' : 'w-1 bg-gray-300 hover:bg-gray-400'
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
