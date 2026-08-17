import type { BlogTopicEntry } from '@/lib/blogCms'
import { BLOG_PAGE_SHELL } from '@/lib/blogLayout'
import { BlogTopicsMarquee } from '@/components/blog/BlogTopicsMarquee'

type BlogTopicsStripProps = {
  topics: BlogTopicEntry[]
  activeTopicSlug?: string
}

export function BlogTopicsStrip({ topics, activeTopicSlug }: BlogTopicsStripProps) {
  if (topics.length === 0) return null

  return (
    <nav
      className="sticky top-0 z-20 border-y border-slate-200/80 bg-white/90 backdrop-blur-md"
      aria-label="Blog topics navigation"
    >
      <div className={`${BLOG_PAGE_SHELL} py-2.5 sm:py-3`}>
        <div className="flex items-end gap-4 sm:gap-5">
          <p className="shrink-0 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Topics
          </p>
          <BlogTopicsMarquee topics={topics} activeTopicSlug={activeTopicSlug} />
        </div>
      </div>
    </nav>
  )
}
