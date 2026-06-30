import Link from 'next/link'
import type { BlogTopicEntry } from '@/lib/blogCms'

type BlogTopicsStripProps = {
  topics: BlogTopicEntry[]
  activeTopicSlug?: string
}

function topicLinkClass(active: boolean) {
  return [
    'shrink-0 whitespace-nowrap border-b-2 pb-2.5 pt-1 text-[13px] font-medium transition-colors',
    active
      ? 'border-cb-orange text-cb-orange'
      : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-navy',
  ].join(' ')
}

export function BlogTopicsStrip({ topics, activeTopicSlug }: BlogTopicsStripProps) {
  if (topics.length === 0) return null

  return (
    <nav
      className="relative border-t border-gray-200/60 bg-white/80 backdrop-blur-sm"
      aria-label="Blog topics"
    >
      <div className="mx-auto max-w-[1140px] px-4 sm:px-5 lg:px-6">
        <div className="flex items-end gap-4 py-2.5 sm:gap-6 sm:py-3">
          <p className="shrink-0 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
            Topics
          </p>

          <div className="relative min-w-0 flex-1">
            <div
              className="flex items-end gap-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="list"
            >
              <Link
                href="/blog"
                className={topicLinkClass(!activeTopicSlug)}
                aria-current={!activeTopicSlug ? 'page' : undefined}
                role="listitem"
              >
                All
              </Link>
              {topics.map((topic) => {
                const active = activeTopicSlug === topic.slug
                return (
                  <Link
                    key={topic.slug}
                    href={`/blog?topic=${encodeURIComponent(topic.slug)}#blog-articles`}
                    className={topicLinkClass(active)}
                    aria-current={active ? 'page' : undefined}
                    role="listitem"
                  >
                    {topic.label}
                  </Link>
                )
              })}
            </div>

            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white/95 to-transparent"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </nav>
  )
}
