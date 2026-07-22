import Link from 'next/link'

interface AuthorBarProps {
  lastReviewed: string
}

/** Public comparison hero — editor/reviewer names hidden; last reviewed + methodology link only. */
export function AuthorBar({ lastReviewed }: AuthorBarProps) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2.5 border-t border-gray-200 pt-4">
      <p className="text-[13px] text-gray-500">
        <span className="text-gray-600">Last reviewed</span> {lastReviewed}
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
