import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BarChart2, Clock } from 'lucide-react'
import type { UnifiedBlogCard } from '@/lib/blogCms'
import { formatBlogViews } from '@/lib/formatBlogViews'

/** Lead story — editorial spread: flat plane, typographic hierarchy, accent rule (no card chrome). */
export function BlogFeaturedCard({ post }: { post: UnifiedBlogCard }) {
  const dateLabel = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <article className="group mb-16 border-b border-gray-200 pb-16 sm:mb-[4.5rem] sm:pb-[4.5rem]">
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gray-400">Featured</p>
        <p className="text-[13px] tabular-nums text-gray-500">
          <time dateTime={post.publishedAt}>{dateLabel}</time>
          <span className="mx-2 text-gray-300">·</span>
          {post.authorName}
        </p>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-0">
        <Link
          href={`/blog/${post.slug}`}
          className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-gray-100 lg:aspect-auto lg:w-[46%] lg:max-w-none lg:min-h-[min(100%,320px)]"
          aria-label={post.title}
        >
          <Image
            src={post.coverUrl}
            alt=""
            fill
            className="object-cover transition-[opacity,transform] duration-500 group-hover:scale-[1.02] group-hover:opacity-95"
            sizes="(max-width: 1024px) 100vw, 46vw"
            priority
          />
          <div
            className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-[0.12]"
            style={{
              background: `linear-gradient(160deg, ${post.stripFrom}, ${post.stripTo})`,
            }}
            aria-hidden
          />
        </Link>

        <div
          className="flex min-w-0 flex-1 flex-col border-gray-200 pl-0 pt-2 lg:border-l-[3px] lg:pl-10 lg:pt-0 xl:pl-12"
          style={{ borderLeftColor: post.stripFrom }}
        >
          <div className="mb-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] font-medium uppercase tracking-[0.14em] text-gray-500">
            <span className="text-navy">{post.category}</span>
            <span className="font-normal text-gray-300">·</span>
            <span className="inline-flex items-center gap-1.5 normal-case tracking-normal">
              <Clock className="h-3.5 w-3.5 opacity-65" aria-hidden />
              {post.readTime}
            </span>
            <span className="font-normal text-gray-300">·</span>
            <span className="inline-flex items-center gap-1 normal-case tracking-normal">
              <BarChart2 className="h-3.5 w-3.5 opacity-65" aria-hidden />
              {formatBlogViews(post.viewCount)} {post.viewCount === 1 ? 'view' : 'views'}
            </span>
          </div>

          <h2 className="mb-5 font-serif text-[1.75rem] leading-[1.15] tracking-tight text-navy sm:text-[2rem] lg:text-[2.125rem]">
            <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-brand">
              {post.title}
            </Link>
          </h2>

          {post.excerpt ? (
            <p className="mb-9 max-w-[52ch] text-[17px] leading-[1.7] text-gray-600 sm:text-[1.05rem]">{post.excerpt}</p>
          ) : null}

          <div className="mt-auto">
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-navy underline decoration-gray-300 decoration-1 underline-offset-[5px] transition-colors hover:text-brand hover:decoration-brand"
            >
              Read the full guide
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

/** Latest list — index, square art, typographic row (dividers only). */
export function BlogGridCard({ post, index }: { post: UnifiedBlogCard; index?: number }) {
  const dateLabel = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const idxLabel = index != null ? String(index).padStart(2, '0') : null

  return (
    <article className="group py-10 first:pt-5 sm:py-12 sm:first:pt-6">
      <div className="flex gap-5 sm:gap-8">
        {idxLabel != null ? (
          <span
            className="hidden w-8 shrink-0 pt-1 text-right font-serif text-2xl tabular-nums leading-none text-gray-200 sm:block"
            aria-hidden
          >
            {idxLabel}
          </span>
        ) : null}

        <Link
          href={`/blog/${post.slug}`}
          className="relative aspect-square w-[88px] shrink-0 overflow-hidden bg-gray-100 sm:w-[104px]"
          aria-label={post.title}
        >
          <Image
            src={post.coverUrl}
            alt=""
            fill
            className="object-cover transition-[opacity,transform] duration-300 group-hover:scale-[1.03] group-hover:opacity-92"
            sizes="104px"
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col border-l-2 border-gray-100 pl-5 sm:pl-6">
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            {post.category}
            <span className="mx-2 font-normal tracking-normal text-gray-300">/</span>
            <time className="font-normal tracking-normal text-gray-500" dateTime={post.publishedAt}>
              {dateLabel}
            </time>
          </p>

          <h3 className="mb-2.5 font-serif text-[1.25rem] leading-snug tracking-tight text-navy sm:text-[1.35rem]">
            <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-brand">
              {post.title}
            </Link>
          </h3>

          {post.excerpt ? (
            <p className="mb-4 line-clamp-2 text-[15px] leading-[1.65] text-gray-600 sm:line-clamp-3">{post.excerpt}</p>
          ) : null}

          <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3 opacity-60" aria-hidden />
              {post.readTime}
            </span>
            <span className="text-gray-300">·</span>
            <span className="inline-flex items-center gap-1">
              <BarChart2 className="h-3 w-3 opacity-60" aria-hidden />
              {formatBlogViews(post.viewCount)} {post.viewCount === 1 ? 'view' : 'views'}
            </span>
            <span className="text-gray-300">·</span>
            <span>{post.authorName}</span>
            <Link
              href={`/blog/${post.slug}`}
              className="ml-auto text-[12px] font-semibold uppercase tracking-[0.12em] text-navy transition-colors hover:text-brand sm:ml-4"
            >
              Article →
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

/** Home preview — same flat language as index. */
export function BlogHomePreviewCard({ post, priority }: { post: UnifiedBlogCard; priority?: boolean }) {
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          <Image
            src={post.coverUrl}
            alt=""
            fill
            priority={priority}
            className="object-cover transition-[opacity,transform] duration-300 group-hover:scale-[1.02] group-hover:opacity-95"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              background: `linear-gradient(135deg, ${post.stripFrom}, ${post.stripTo})`,
            }}
            aria-hidden
          />
        </div>
      </Link>
      <div className="mt-4 border-l-2 border-gray-200 pl-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
          {post.category}
          <span className="mx-2 font-normal text-gray-300">/</span>
          {post.readTime}
          <span className="mx-2 font-normal text-gray-300">/</span>
          <span className="inline-flex items-center gap-0.5 font-normal normal-case tracking-normal">
            <BarChart2 className="h-3 w-3 opacity-60" aria-hidden />
            {formatBlogViews(post.viewCount)} {post.viewCount === 1 ? 'view' : 'views'}
          </span>
        </p>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-serif text-lg font-normal leading-snug tracking-tight text-navy transition-colors group-hover:text-brand">
            {post.title}
          </h3>
        </Link>
        {post.excerpt ? <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">{post.excerpt}</p> : null}
      </div>
    </article>
  )
}
