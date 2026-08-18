'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import type { UnifiedBlogCard } from '@/lib/blogCms'
import { BlogCoverImage } from '@/components/blog/BlogCoverImage'

const ROTATE_MS = 3000

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
    <article className="grid h-full min-h-0 min-w-0 items-stretch gap-3 sm:grid-cols-[minmax(0,1.45fr)_minmax(0,0.7fr)] sm:gap-4">
      <Link
        href={`/blog/${post.slug}`}
        className="relative block aspect-[16/9] overflow-hidden bg-slate-100"
        aria-label={post.title}
      >
        <BlogCoverImage
          src={post.coverUrl}
          alt={post.title}
          coverInput={{ slug: post.slug, title: post.title, tags: [post.category] }}
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </Link>
      <div className="flex min-w-0 flex-col justify-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#F58220]">
          {post.category}
        </p>
        <h3 className="mt-1 line-clamp-2 font-serif text-[1.15rem] leading-snug tracking-tight text-navy sm:text-[1.28rem]">
          <Link href={`/blog/${post.slug}`} className="hover:text-[#F58220]">
            {post.title}
          </Link>
        </h3>
        {post.excerpt ? (
          <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-slate-600">{post.excerpt}</p>
        ) : null}
        <p className="mt-2 flex flex-wrap items-center gap-1.5 text-[12px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden />
            {post.readTime}
          </span>
          <span className="text-slate-300">·</span>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </p>
        <Link
          href={`/blog/${post.slug}`}
          className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-semibold text-navy hover:text-[#F58220]"
        >
          Read guide <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        {dots ? <div className="mt-2">{dots}</div> : null}
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

      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-10">
        <div className="mb-3 text-center">
          <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F58220]">
            Latest blogs
          </p>
          <h2 id="blog-preview-heading" className="font-serif text-xl tracking-tight text-navy sm:text-[1.65rem]">
            From the editorial desk
          </h2>
        </div>

        <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,380px)] lg:gap-5">
          <div
            className="min-h-0 min-w-0"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <FeaturedArticle
              key={featured.slug}
              post={featured}
              dots={
                count > 1 ? (
                  <div className="flex items-center gap-1.5" role="tablist" aria-label="Recent articles">
                    {items.map((post, i) => (
                      <button
                        key={post.slug}
                        type="button"
                        role="tab"
                        aria-selected={i === active}
                        aria-label={`Show article ${i + 1}: ${post.title}`}
                        onClick={() => goTo(i)}
                        className={`h-1.5 rounded-full transition-all ${
                          i === active ? 'w-6 bg-[#F58220]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                        }`}
                      />
                    ))}
                  </div>
                ) : null
              }
            />
          </div>

          <div className="flex min-h-0 flex-col">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Also recent
            </p>
            <ul className="grid min-h-[22rem] flex-1 grid-rows-3 gap-2.5 lg:min-h-0">
              {items
                .map((post, index) => ({ post, index }))
                .filter(({ index }) => index !== active)
                .slice(0, 3)
                .map(({ post, index }, displayIndex) => (
                  <li key={post.slug} className="min-h-0">
                    <button
                      type="button"
                      onClick={() => goTo(index)}
                      className="group relative block h-full w-full overflow-hidden text-left"
                    >
                      <BlogCoverImage
                        src={post.coverUrl}
                        alt={post.title}
                        coverInput={{ slug: post.slug, title: post.title, tags: [post.category] }}
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                        sizes="380px"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
                      <span className="absolute inset-x-0 bottom-0 flex items-end gap-2.5 px-3.5 pb-2.5 pt-10">
                        <span className="shrink-0 font-serif text-[14px] tabular-nums text-white/75">
                          {String(displayIndex + 1).padStart(2, '0')}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-[#F58220]">
                            {post.category}
                          </span>
                          <span className="mt-0.5 block line-clamp-2 font-serif text-[14px] leading-snug text-white">
                            {post.title}
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
