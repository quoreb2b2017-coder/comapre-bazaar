import Link from 'next/link'
import { topicToSlug } from '@/lib/blogCms'

type BlogTopicLinkProps = {
  category: string
  className?: string
}

/** Category label → filtered blog index (scrolls to articles). */
export function BlogTopicLink({ category, className = '' }: BlogTopicLinkProps) {
  const slug = topicToSlug(category)
  return (
    <Link
      href={`/blog?topic=${encodeURIComponent(slug)}#blog-articles`}
      className={`transition-colors hover:text-brand ${className}`}
    >
      {category}
    </Link>
  )
}
