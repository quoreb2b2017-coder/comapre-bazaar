import type { UnifiedBlogCard } from '@/lib/blogCms'
import { BlogHomePreviewCard } from '@/components/blog/BlogListingCards'

type BlogRelatedCardsProps = {
  posts: UnifiedBlogCard[]
  heading: string
  eyebrow?: string
}

export function BlogRelatedCards({
  posts,
  heading,
  eyebrow = 'Further reading',
}: BlogRelatedCardsProps) {
  if (posts.length === 0) return null

  return (
    <section aria-labelledby="related-blog-heading">
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
        {eyebrow}
      </p>
      <h2
        id="related-blog-heading"
        className="mb-5 font-serif text-[1.35rem] leading-tight tracking-tight text-navy"
      >
        {heading}
      </h2>
      <ul className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug} className="flex">
            <BlogHomePreviewCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  )
}
