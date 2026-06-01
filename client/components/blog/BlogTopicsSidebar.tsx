import Link from 'next/link'
import type { BlogTopicEntry } from '@/lib/blogCms'

type BlogTopicsSidebarProps = {
  topics: BlogTopicEntry[]
  activeTopicSlug?: string
}

export function BlogTopicsSidebar({ topics, activeTopicSlug }: BlogTopicsSidebarProps) {
  return (
    <div>
      <h3 className="mb-5 border-b border-gray-100 pb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
        Topics
      </h3>
      {topics.length > 0 ? (
        <ul className="space-y-1">
          <li>
            <Link
              href="/blog"
              className={`block border-l-2 py-2 pl-3 text-[15px] font-medium leading-snug transition-colors ${
                !activeTopicSlug
                  ? 'border-brand text-brand'
                  : 'border-gray-100 text-navy hover:border-gray-300 hover:text-brand'
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
                  className={`block border-l-2 py-2 pl-3 text-[15px] font-medium leading-snug transition-colors ${
                    active
                      ? 'border-brand text-brand'
                      : 'border-gray-100 text-navy hover:border-gray-300 hover:text-brand'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span>{topic.label}</span>
                  <span className="ml-1.5 text-[13px] font-normal text-gray-400">({topic.count})</span>
                </Link>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No topics yet.</p>
      )}
    </div>
  )
}
