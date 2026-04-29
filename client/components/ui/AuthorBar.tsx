import Link from 'next/link'
import type { Author } from '@/types'

interface AuthorBarProps {
  author: Author
  reviewer: string
  lastReviewed: string
}

export function AuthorBar({ author, reviewer, lastReviewed }: AuthorBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 py-4 border-t border-b border-gray-200 mt-4">
      {/* Author */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center text-brand text-sm font-semibold flex-shrink-0"
          aria-hidden="true"
        >
          {author.initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-navy leading-none">{author.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{author.credential}</p>
        </div>
      </div>

      <span className="text-gray-200 hidden sm:block">|</span>

      {/* Dates */}
      <p className="text-sm text-gray-400">
        <strong className="text-gray-600">Last reviewed:</strong> {lastReviewed}
        {' · '}
        <strong className="text-gray-600">Fact-checked by:</strong> {reviewer}
      </p>

      {/* Methodology pill */}
      <Link
        href="/editorial-process"
        className="ml-auto text-xs font-medium bg-brand-light text-brand px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
      >
        How we test →
      </Link>
    </div>
  )
}
