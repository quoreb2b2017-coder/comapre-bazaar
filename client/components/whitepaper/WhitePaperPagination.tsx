'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE = 8

type Props = {
  currentPage: number
  totalItems: number
  onPageChange: (page: number) => void
  placement?: 'top' | 'bottom'
}

export { PAGE_SIZE as WHITEPAPER_PAGE_SIZE }

export function WhitePaperPagination({
  currentPage,
  totalItems,
  onPageChange,
  placement = 'bottom',
}: Props) {
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
  if (totalPages <= 1) return null

  const isTop = placement === 'top'

  return (
    <nav
      className={
        isTop
          ? 'mb-6 border-b border-gray-200/80 pb-5'
          : 'mt-10 border-t border-gray-200/80 pt-8'
      }
      aria-label={isTop ? 'Whitepaper library pagination (top)' : 'Whitepaper library pagination'}
    >
      <div className={`flex flex-wrap items-center gap-2 ${isTop ? 'justify-end' : 'justify-center'}`}>
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-navy transition-colors hover:border-[#1D4ED8]/30 hover:text-[#1D4ED8] disabled:cursor-not-allowed disabled:border-transparent disabled:text-gray-300"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Previous
          </button>

          <ul className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <li key={p}>
                <button
                  type="button"
                  onClick={() => onPageChange(p)}
                  aria-current={p === currentPage ? 'page' : undefined}
                  className={
                    p === currentPage
                      ? 'inline-flex min-w-[2.25rem] items-center justify-center rounded-lg bg-navy px-3 py-2 text-[13px] font-semibold text-white shadow-sm'
                      : 'inline-flex min-w-[2.25rem] items-center justify-center rounded-lg px-3 py-2 text-[13px] font-medium text-gray-600 transition-colors hover:bg-white hover:text-navy'
                  }
                >
                  {p}
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-[13px] font-semibold text-navy transition-colors hover:border-cb-orange/40 hover:text-cb-orange disabled:cursor-not-allowed disabled:border-transparent disabled:text-gray-300"
          >
            Next
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
      </div>
    </nav>
  )
}
