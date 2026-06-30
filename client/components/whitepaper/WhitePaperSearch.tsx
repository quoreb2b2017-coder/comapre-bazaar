'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { WhitePaperCard } from './WhitePaperCard'
import type { WhitePaperPublic } from '@/lib/whitePaperCms'

export function WhitePaperSearch({ papers }: { papers: WhitePaperPublic[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    const values = new Set<string>()
    for (const paper of papers) {
      const label = paper.metadata?.category?.trim()
      if (label) values.add(label)
    }
    return Array.from(values).sort((a, b) => a.localeCompare(b))
  }, [papers])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return papers.filter((paper) => {
      if (category && paper.metadata?.category?.trim() !== category) return false
      if (!q) return true
      return [paper.title, paper.seoTitle, paper.description, paper.metadata?.category]
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [papers, query, category])

  const resultLabel =
    filtered.length === papers.length
      ? `${papers.length} report${papers.length === 1 ? '' : 's'}`
      : `${filtered.length} of ${papers.length} reports`

  return (
    <section aria-labelledby="whitepaper-library-heading">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
            Browse the library
          </p>
          <h2
            id="whitepaper-library-heading"
            className="mt-1.5 font-serif text-[1.375rem] font-normal tracking-tight text-navy sm:text-[1.5rem]"
          >
            {resultLabel}
          </h2>
          <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-gray-500">
            Trusted by operations teams for decision-making. Each report is summarized from
            independent PDF research.
          </p>
        </div>

        <div className="relative w-full shrink-0 lg:w-80">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reports..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3.5 text-[13px] text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#1D4ED8]/30 focus:ring-2 focus:ring-[#1D4ED8]/8"
          />
        </div>
      </div>

      {categories.length > 1 ? (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[11px] font-medium uppercase tracking-[0.12em] text-gray-400">
            Filter
          </span>
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
              category === null
                ? 'bg-navy text-white'
                : 'bg-transparent text-gray-600 ring-1 ring-gray-200 hover:text-navy'
            }`}
          >
            All
          </button>
          {categories.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setCategory(label)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
                category === label
                  ? 'bg-navy text-white'
                  : 'bg-transparent text-gray-600 ring-1 ring-gray-200 hover:text-navy'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="px-2 py-14 text-center">
          <p className="font-serif text-lg text-navy">No reports matched</p>
          <p className="mt-2 text-[13px] text-gray-500">
            Try a different keyword or clear your filters.
          </p>
          {(query || category) && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setCategory(null)
              }}
              className="mt-4 text-[13px] font-semibold text-[#1D4ED8] hover:text-[#1e40af]"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {filtered.map((paper) => (
            <li key={paper.slug} className="min-w-0">
              <WhitePaperCard paper={paper} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
