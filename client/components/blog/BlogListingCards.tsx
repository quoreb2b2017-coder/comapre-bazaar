import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import type { UnifiedBlogCard } from '@/lib/blogCms'
import { BlogCoverImage } from '@/components/blog/BlogCoverImage'
import { BlogTopicLink } from '@/components/blog/BlogTopicLink'

function formatCardDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Latest list — flat rows, dividers only (no card chrome). */
export function BlogGridCard({ post, index }: { post: UnifiedBlogCard; index?: number }) {
  const dateLabel = formatCardDate(post.publishedAt)
  const idxLabel = index != null ? String(index).padStart(2, '0') : null

  return (
    <article className="group py-5 first:pt-3 sm:py-6 sm:first:pt-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        {idxLabel != null ? (
          <span
            className="hidden w-7 shrink-0 pt-0.5 text-right font-serif text-xl tabular-nums leading-none text-gray-200 sm:block"
            aria-hidden
          >
            {idxLabel}
          </span>
        ) : null}

        <Link
          href={`/blog/${post.slug}`}
          className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-slate-100 sm:aspect-[4/3] sm:w-[168px] md:w-[192px]"
          aria-label={post.title}
        >
          <BlogCoverImage
            src={post.coverUrl}
            alt={post.title}
            coverInput={{ slug: post.slug, title: post.title, tags: [post.category] }}
            className="object-cover transition-opacity duration-300 group-hover:opacity-90"
            sizes="(max-width: 640px) 100vw, 192px"
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col sm:border-l sm:border-slate-200 sm:pl-5">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            <BlogTopicLink category={post.category} />
            <span className="mx-2 font-normal tracking-normal text-slate-300">/</span>
            <time className="font-normal tracking-normal text-slate-500" dateTime={post.publishedAt}>
              {dateLabel}
            </time>
          </p>

          <h3 className="mb-2 font-serif text-[1.15rem] leading-snug tracking-tight text-navy sm:text-[1.2rem]">
            <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-[#F58220]">
              {post.title}
            </Link>
          </h3>

          {post.excerpt ? (
            <p className="mb-2 line-clamp-2 text-[14px] leading-relaxed text-slate-600 sm:line-clamp-3">
              {post.excerpt}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3 opacity-60" aria-hidden />
              {post.readTime}
            </span>
            <Link
              href={`/blog/${post.slug}`}
              className="ml-auto text-[12px] font-semibold uppercase tracking-[0.12em] text-navy transition-colors hover:text-[#F58220] sm:ml-4"
            >
              Article →
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

/** Blog hub grid - editorial tile with hover lift */
export function BlogHomePreviewCard({ post, priority }: { post: UnifiedBlogCard; priority?: boolean }) {
  const dateLabel = formatCardDate(post.publishedAt)

  return (
    <article className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_2px_12px_-4px_rgba(11,42,111,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_32px_-12px_rgba(11,42,111,0.18)]">
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-slate-100">
        <BlogCoverImage
          src={post.coverUrl}
          alt={post.title}
          coverInput={{ slug: post.slug, title: post.title, tags: [post.category] }}
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent"
          aria-hidden
        />
        <span className="absolute bottom-2.5 left-3 rounded-md bg-white/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
          {post.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col px-4 py-4">
        <div className="mb-2.5 flex items-center justify-between gap-2 text-[10px] text-slate-400">
          <time dateTime={post.publishedAt}>{dateLabel}</time>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 font-medium text-slate-500">
            <Clock className="h-3 w-3" aria-hidden />
            {post.readTime}
          </span>
        </div>

        <Link href={`/blog/${post.slug}`} className="block flex-1">
          <h3 className="line-clamp-2 font-serif text-[1.05rem] leading-snug tracking-tight text-navy transition-colors group-hover:text-[#0B2A6F] sm:text-[1.08rem]">
            {post.title}
          </h3>
        </Link>

        {post.excerpt ? (
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-slate-600">{post.excerpt}</p>
        ) : null}

        <Link
          href={`/blog/${post.slug}`}
          className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-navy transition-colors group-hover:text-[#F58220]"
        >
          Read blog
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </div>
    </article>
  )
}
