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

/** Lead story on a topic hub */
export function BlogTopicLeadArticle({ post }: { post: UnifiedBlogCard }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_8px_32px_-16px_rgba(11,42,111,0.15)]">
      <div className="mb-0 flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-slate-100 px-5 py-3 text-[11px] text-slate-500 sm:px-6">
        <span className="font-bold uppercase tracking-[0.14em] text-[#F58220]">Featured</span>
        <span className="text-slate-300">·</span>
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        <span className="text-slate-300">·</span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 opacity-60" aria-hidden />
          {post.readTime}
        </span>
      </div>

      <div className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-start lg:gap-8">
        <Link
          href={`/blog/${post.slug}`}
          className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 lg:w-[48%] lg:max-w-[480px]"
          aria-label={post.title}
        >
          <Image
            src={post.coverUrl}
            alt={post.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 100vw, 480px"
            priority
          />
        </Link>

        <div className="min-w-0 flex-1 lg:pt-1">
          <h2 className="font-serif text-[1.45rem] leading-[1.2] tracking-tight text-navy sm:text-[1.65rem]">
            <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-[#F58220]">
              {post.title}
            </Link>
          </h2>

          {post.excerpt ? (
            <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-slate-600">{post.excerpt}</p>
          ) : null}

          <Link
            href={`/blog/${post.slug}`}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#0a245f]"
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

export function BlogTopicGuideIndex({ posts }: BlogTopicGuideIndexProps) {
  if (posts.length === 0) return null

  const [lead, ...rest] = posts

  return (
    <div className="space-y-8">
      <BlogTopicLeadArticle post={lead} />

      {rest.length > 0 ? (
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            More in this topic
          </p>
          <ol className="grid grid-cols-1 gap-3">
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
    <article className="group grid grid-cols-1 gap-4 rounded-xl border border-slate-200/90 bg-white p-4 sm:grid-cols-[2.5rem_1fr] sm:gap-5">
      <span
        className="hidden font-serif text-xl tabular-nums leading-none text-slate-200 sm:block"
        aria-hidden
      >
        {String(index).padStart(2, '0')}
      </span>

      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:gap-5">
        <Link
          href={`/blog/${post.slug}`}
          className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:aspect-[4/3] sm:w-[140px] md:w-[168px]"
          aria-label={post.title}
        >
          <Image
            src={post.coverUrl}
            alt={post.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, 168px"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <p className="mb-1.5 text-[11px] text-slate-500">
            <time dateTime={post.publishedAt}>{dateLabel}</time>
            <span className="mx-2 text-slate-300">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3 opacity-55" aria-hidden />
              {post.readTime}
            </span>
          </p>

          <h3 className="font-serif text-[1.1rem] leading-snug tracking-tight text-navy sm:text-[1.15rem]">
            <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-[#F58220]">
              {post.title}
            </Link>
          </h3>

          {post.excerpt ? (
            <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-slate-600">{post.excerpt}</p>
          ) : null}

          <Link
            href={`/blog/${post.slug}`}
            className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-navy transition-colors hover:text-[#F58220]"
          >
            Continue reading
            <ArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  )
}
