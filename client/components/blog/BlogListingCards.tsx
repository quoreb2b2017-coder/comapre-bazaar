import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import type { UnifiedBlogCard } from '@/lib/blogCms'
import { BlogTopicLink } from '@/components/blog/BlogTopicLink'

/** Latest list — flat rows, dividers only (no card chrome). */
export function BlogGridCard({ post, index }: { post: UnifiedBlogCard; index?: number }) {
  const dateLabel = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const idxLabel = index != null ? String(index).padStart(2, '0') : null

  return (
    <article className="group py-5 first:pt-3 sm:py-6 sm:first:pt-4">
      <div className="flex gap-4 sm:gap-5">
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
          className="relative aspect-square w-[72px] shrink-0 overflow-hidden bg-gray-100 sm:w-[84px]"
          aria-label={post.title}
        >
          <Image
            src={post.coverUrl}
            alt={post.title}
            fill
            className="object-cover transition-opacity duration-300 group-hover:opacity-90"
            sizes="84px"
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col border-l border-gray-200 pl-4 sm:pl-5">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
            <BlogTopicLink category={post.category} />
            <span className="mx-2 font-normal tracking-normal text-gray-300">/</span>
            <time className="font-normal tracking-normal text-gray-500" dateTime={post.publishedAt}>
              {dateLabel}
            </time>
          </p>

          <h3 className="mb-2 font-serif text-[1.15rem] leading-snug tracking-tight text-navy sm:text-[1.2rem]">
            <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-cb-orange">
              {post.title}
            </Link>
          </h3>

          {post.excerpt ? (
            <p className="mb-2 line-clamp-2 text-[14px] leading-relaxed text-gray-600 sm:line-clamp-3">
              {post.excerpt}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3 opacity-60" aria-hidden />
              {post.readTime}
            </span>
            <span className="text-gray-300">·</span>
            <span>{post.authorName}</span>
            <Link
              href={`/blog/${post.slug}`}
              className="ml-auto text-[12px] font-semibold uppercase tracking-[0.12em] text-navy transition-colors hover:text-cb-orange sm:ml-4"
            >
              Article →
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

/** Home preview — flat editorial row. */
export function BlogHomePreviewCard({ post, priority }: { post: UnifiedBlogCard; priority?: boolean }) {
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          <Image
            src={post.coverUrl}
            alt={post.title}
            fill
            priority={priority}
            className="object-cover transition-opacity duration-300 group-hover:opacity-95"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </Link>
      <div className="mt-4 border-l border-gray-200 pl-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
          {post.category}
          <span className="mx-2 font-normal text-gray-300">/</span>
          {post.readTime}
        </p>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-serif text-lg font-normal leading-snug tracking-tight text-navy transition-colors group-hover:text-cb-orange">
            {post.title}
          </h3>
        </Link>
        {post.excerpt ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>
        ) : null}
      </div>
    </article>
  )
}
