import Link from 'next/link'
import type { BlogTopicEntry } from '@/lib/blogCms'

type BlogTopicsSidebarProps = {
  topics: BlogTopicEntry[]
  activeTopicSlug?: string
}

export function BlogTopicsSidebar({ topics, activeTopicSlug }: BlogTopicsSidebarProps) {
  return (
    <div>
      <h3 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">Topics</h3>
      {topics.length > 0 ? (
        <ul className="mt-4 space-y-0.5">
          <li>
            <Link
              href="/blog"
              className={`block rounded-lg px-3 py-2.5 text-[14px] font-medium leading-snug transition-colors ${
                !activeTopicSlug
                  ? 'bg-white text-cb-orange shadow-sm ring-1 ring-gray-200/80'
                  : 'text-navy hover:bg-white/80 hover:text-cb-orange'
              }`}
            >
              All topics
            </Link>
          </li>
          {topics.map((topic) => {
            const active = activeTopicSlug === topic.slug
            return (
              <li key={topic.slug}>
                <Link
                  href={`/blog?topic=${encodeURIComponent(topic.slug)}#blog-articles`}
                  className={`block rounded-lg px-3 py-2.5 text-[14px] font-medium leading-snug transition-colors ${
                    active
                      ? 'bg-white text-cb-orange shadow-sm ring-1 ring-gray-200/80'
                      : 'text-navy hover:bg-white/80 hover:text-cb-orange'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {topic.label}
                </Link>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-gray-500">No topics yet.</p>
      )}
    </div>
  )
}
