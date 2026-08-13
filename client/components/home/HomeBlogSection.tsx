import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import type { UnifiedBlogCard } from '@/lib/blogCms'

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function HomeBlogSection({ posts }: { posts: UnifiedBlogCard[] }) {
  const items = posts.slice(0, 3)
  if (items.length === 0) return null

  return (
    <div aria-labelledby="blog-preview-heading">
      <div className="mb-4 text-center">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F58220]">
          Editorial desk
        </p>
        <h2 id="blog-preview-heading" className="font-serif text-2xl tracking-tight text-navy sm:text-3xl">
          Latest from the blog
        </h2>
        <p className="mt-1 text-sm text-slate-500">Three current buying guides from our editors.</p>
        <Link
          href="/blog"
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-[#F58220]"
        >
          All articles <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {items.map((post, index) => (
          <article
            key={post.slug}
            className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_8px_24px_-16px_rgba(15,31,61,0.2)] transition-shadow hover:shadow-[0_16px_36px_-18px_rgba(15,31,61,0.28)]"
          >
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <Image
                  src={post.coverUrl}
                  alt={post.title}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute left-3 top-3 rounded bg-[#0B2A6F] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  {post.category}
                </span>
              </div>
            </Link>
            <div className="flex flex-1 flex-col p-4">
              <p className="mb-2 flex items-center gap-2 text-[12px] text-slate-400">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {post.readTime}
                <span className="text-slate-300">|</span>
                {formatDate(post.publishedAt)}
              </p>
              <Link href={`/blog/${post.slug}`}>
                <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-navy group-hover:text-[#F58220]">
                  {post.title}
                </h3>
              </Link>
              {post.excerpt ? (
                <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-slate-500">{post.excerpt}</p>
              ) : null}
              <Link
                href={`/blog/${post.slug}`}
                className="mt-auto inline-flex items-center gap-1 pt-4 text-[13px] font-semibold text-[#F58220]"
              >
                Read guide <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
