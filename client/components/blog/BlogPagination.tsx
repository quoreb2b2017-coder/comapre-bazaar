import Link from 'next/link'

type Props = {
  currentPage: number
  totalPages: number
}

export function BlogPagination({ currentPage, totalPages }: Props) {
  if (totalPages <= 1) return null

  const hrefFor = (p: number) => (p <= 1 ? '/blog' : `/blog?page=${p}`)

  return (
    <nav
      className="mt-12 flex flex-wrap items-center justify-center gap-2 border-t border-gray-100 pt-10"
      aria-label="Blog pagination"
    >
      {currentPage > 1 ? (
        <Link
          href={hrefFor(currentPage - 1)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-brand hover:text-brand"
        >
          Previous
        </Link>
      ) : (
        <span className="rounded-lg border border-transparent px-4 py-2 text-sm text-gray-300">Previous</span>
      )}

      <ul className="flex flex-wrap items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <li key={p}>
            <Link
              href={hrefFor(p)}
              className={
                p === currentPage
                  ? 'inline-flex min-w-[2.25rem] justify-center rounded-lg bg-navy px-3 py-2 text-sm font-semibold text-white'
                  : 'inline-flex min-w-[2.25rem] justify-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-navy'
              }
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p}
            </Link>
          </li>
        ))}
      </ul>

      {currentPage < totalPages ? (
        <Link
          href={hrefFor(currentPage + 1)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-brand hover:text-brand"
        >
          Next
        </Link>
      ) : (
        <span className="rounded-lg border border-transparent px-4 py-2 text-sm text-gray-300">Next</span>
      )}
    </nav>
  )
}
