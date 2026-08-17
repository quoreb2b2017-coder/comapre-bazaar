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
      <p className="mt-2 inline-flex items-center rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1 text-[12px] font-semibold text-navy">
        {count} published guide{count === 1 ? '' : 's'}
      </p>
      <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-slate-600">{topicIntro(label)}</p>
      <Link
        href="/blog"
        className="mt-4 hidden items-center gap-1.5 text-[13px] font-semibold text-[#F58220] transition-colors hover:text-[#D97706] lg:inline-flex"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        All topics
      </Link>
    </>
  )
}
