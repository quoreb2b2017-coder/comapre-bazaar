import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { topicIntro } from '@/lib/blogTopicCopy'

type BlogTopicHeroExtrasProps = {
  label: string
  count: number
}

export function BlogTopicHeroExtras({ label, count }: BlogTopicHeroExtrasProps) {
  return (
    <>
      <p className="mt-1 text-[13px] font-medium text-gray-500">
        {count} published guide{count === 1 ? '' : 's'}
      </p>
      <p className="mt-3 max-w-[54ch] text-[15px] leading-relaxed text-gray-600">{topicIntro(label)}</p>
      <Link
        href="/blog"
        className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-cb-orange transition-colors hover:text-cb-orange-hover"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        All topics
      </Link>
    </>
  )
}
