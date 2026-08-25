import Link from 'next/link'
import { blogTopicHref } from '@/lib/blogTopicHubs'

type BlogTopicLinkProps = {
  category: string
  className?: string
}

/** Category label → canonical topic hub (or /blog). */
export function BlogTopicLink({ category, className = '' }: BlogTopicLinkProps) {
  return (
    <Link href={blogTopicHref(category)} className={`transition-colors hover:text-brand ${className}`}>
      {category}
    </Link>
  )
}
