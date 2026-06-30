import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import type { UnifiedBlogCard } from '@/lib/blogCms'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Lead story on a topic hub — single spread, no carousel. */
export function BlogTopicLeadArticle({ post }: { post: UnifiedBlogCard }) {
  return (
    <article className="group border-b border-gray-200 pb-8 mb-8">
      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500">
        <span className="font-semibold uppercase tracking-[0.14em] text-cb-orange">Featured</span>
        <span className="text-gray-300">·</span>
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        <span className="text-gray-300">·</span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 opacity-60" aria-hidden />
          {post.readTime}
        </span>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
        <Link
          href={`/blog/${post.slug}`}
          className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-gray-100 lg:w-[50%] lg:max-w-[480px]"
          aria-label={post.title}
        >
          <Image
            src={post.coverUrl}
            alt={post.title}
            fill
            className="object-cover transition-opacity duration-300 group-hover:opacity-95"
            sizes="(max-width: 1024px) 100vw, 480px"
            priority
          />
        </Link>

        <div className="min-w-0 flex-1 lg:border-l lg:border-gray-200 lg:pl-8">
          <h2 className="font-serif text-[1.5rem] leading-[1.2] tracking-tight text-navy sm:text-[1.75rem]">
            <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-cb-orange">
              {post.title}
            </Link>
          </h2>

          {post.excerpt ? (
            <p className="mt-4 max-w-[56ch] text-[15px] leading-[1.72] text-gray-600">{post.excerpt}</p>
          ) : null}

          <Link
            href={`/blog/${post.slug}`}
            className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold text-navy underline decoration-gray-300 underline-offset-[4px] transition-colors hover:text-cb-orange hover:decoration-cb-orange/40"
          >
            Read the full guide
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  )
}

type BlogTopicGuideIndexProps = {
  posts: UnifiedBlogCard[]
}

/** Topic hub — lead article + numbered index (no cards, no carousel). */
export function BlogTopicGuideIndex({ posts }: BlogTopicGuideIndexProps) {
  if (posts.length === 0) return null

  const [lead, ...rest] = posts

  return (
    <div>
      <BlogTopicLeadArticle post={lead} />

      {rest.length > 0 ? (
        <div>
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            More in this topic
          </p>
          <ol className="divide-y divide-gray-200/90">
            {rest.map((post, i) => (
              <li key={post.slug}>
                <BlogTopicIndexRow post={post} index={i + 2} />
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  )
}

function BlogTopicIndexRow({ post, index }: { post: UnifiedBlogCard; index: number }) {
  const dateLabel = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <article className="group grid grid-cols-1 gap-4 py-6 sm:grid-cols-[2.5rem_1fr] sm:gap-6 sm:py-7">
      <span
        className="hidden font-serif text-xl tabular-nums leading-none text-gray-200 sm:block"
        aria-hidden
      >
        {String(index).padStart(2, '0')}
      </span>

      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:gap-5">
        <Link
          href={`/blog/${post.slug}`}
          className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-gray-100 sm:aspect-[4/3] sm:w-[140px] md:w-[168px]"
          aria-label={post.title}
        >
          <Image
            src={post.coverUrl}
            alt={post.title}
            fill
            className="object-cover transition-opacity group-hover:opacity-90"
            sizes="(max-width: 640px) 100vw, 168px"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <p className="mb-1.5 text-[11px] text-gray-500">
            <time dateTime={post.publishedAt}>{dateLabel}</time>
            <span className="mx-2 text-gray-300">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3 opacity-55" aria-hidden />
              {post.readTime}
            </span>
          </p>

          <h3 className="font-serif text-[1.125rem] leading-snug tracking-tight text-navy sm:text-[1.2rem]">
            <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-cb-orange">
              {post.title}
            </Link>
          </h3>

          {post.excerpt ? (
            <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-gray-600">{post.excerpt}</p>
          ) : null}

          <Link
            href={`/blog/${post.slug}`}
            className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-gray-600 transition-colors hover:text-cb-orange"
          >
            Continue reading
            <ArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  )
}
