import Link from 'next/link'
import { BlogShareBar } from '@/components/blog/BlogShareBar'
import { BlogSubscribeBox } from '@/components/blog/BlogSubscribeBox'
import { topicToSlug } from '@/lib/blogCms'

type TocItem = { id: string; label: string }
type LatestItem = { slug: string; title: string }

type Props = {
  currentSlug: string
  currentTitle: string
  toc: TocItem[]
  latest: LatestItem[]
  category?: string
  topic?: string
  tags?: string[]
}

export function BlogArticleSidebar({ currentSlug, currentTitle, toc, latest, category, topic, tags }: Props) {
  const rows = toc.slice(0, 12)
  const latestRows = latest.slice(0, 6)
  const topicLabel = category || topic || tags?.[0] || 'this topic'
  const topicSlug = topicToSlug(topicLabel)
  const topicHref = topicSlug ? `/blog?topic=${encodeURIComponent(topicSlug)}#blog-articles` : '/blog#blog-articles'

  return (
    <aside aria-label="Article sidebar" className="w-full space-y-5">
      {rows.length > 0 ? (
        <div>
          <h3 className="mb-3 border-b border-slate-100 pb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            On this page
          </h3>
          <nav aria-label="Table of contents">
            <ul className="space-y-0.5 border-l border-slate-200">
              {rows.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="-ml-px block border-l-2 border-transparent py-1.5 pl-3.5 text-[13px] leading-snug text-slate-600 transition-colors hover:border-[#F58220]/60 hover:text-navy"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}

      {latestRows.length > 0 ? (
        <div>
          <h3 className="mb-3 border-b border-slate-100 pb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            Latest in {topicLabel}
          </h3>
          <ul className="space-y-1">
            {latestRows.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/blog/${item.slug}`}
                  className={`block rounded-md border-l-2 py-1.5 pl-3.5 text-[13px] leading-snug transition-colors ${
                    item.slug === currentSlug
                      ? 'border-[#F58220]/70 bg-[#FFFAF5] font-medium text-navy'
                      : 'border-transparent text-slate-600 hover:border-[#F58220]/40 hover:bg-slate-50 hover:text-navy'
                  }`}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={topicHref}
            className="mt-2.5 inline-block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#F58220] hover:text-[#D97706]"
          >
            All {topicLabel} guides →
          </Link>
        </div>
      ) : null}

      <BlogSubscribeBox slug={currentSlug} compact variant="editorial" />
      <BlogShareBar title={currentTitle} slug={currentSlug} topic={topic} tags={tags} />
    </aside>
  )
}
