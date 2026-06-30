import Link from 'next/link'
import type { Author } from '@/types'

interface AuthorBarProps {
  author: Author
  reviewer: string
  lastReviewed: string
}

export function AuthorBar({ author, reviewer, lastReviewed }: AuthorBarProps) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2.5 border-t border-gray-200 pt-4">
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy/5 text-sm font-semibold text-navy"
          aria-hidden
        >
          {author.initials}
        </div>
        <div>
          <p className="text-sm font-semibold leading-none text-navy">{author.name}</p>
          <p className="mt-1 text-xs text-gray-500">{author.credential}</p>
        </div>
      </div>

      <p className="text-[13px] text-gray-500">
        <span className="text-gray-600">Last reviewed</span> {lastReviewed}
        <span className="mx-2 text-gray-300">·</span>
        <span className="text-gray-600">Fact-checked by</span> {reviewer}
      </p>

      <Link
        href="/editorial-process"
        className="text-[12px] font-semibold text-cb-orange transition-colors hover:text-cb-orange-hover sm:ml-auto"
      >
        How we test →
      </Link>
    </div>
  )
}
