'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { WhitePaperCard } from './WhitePaperCard'
import type { WhitePaperPublic } from '@/lib/whitePaperCms'

export function WhitePaperSearch({ papers }: { papers: WhitePaperPublic[] }) {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? papers.filter((p) =>
        [p.title, p.seoTitle, p.description, p.metadata?.category]
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    : papers

  return (
    <>
      {/* Section header + search bar */}
      <div className="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-400">All Reports</p>
          <h2 className="font-serif text-[1.375rem] text-navy">
            {papers.length > 0 ? `${papers.length} Report${papers.length === 1 ? '' : 's'} Available` : 'Reports'}
          </h2>
        </div>
        <div className="relative w-full sm:w-64">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            strokeWidth={1.75}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reports..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-8 pr-3 text-[13px] text-gray-700 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-[#1D4ED8]/40 focus:ring-2 focus:ring-[#1D4ED8]/10"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#e0e0e0] px-6 py-14 text-center">
          <p className="font-serif text-lg text-navy">No reports matched</p>
          <p className="mt-2 text-[13px] text-gray-500">Try a different keyword or clear the search.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {filtered.map((paper) => (
            <li key={paper.slug} className="min-w-0">
              <WhitePaperCard paper={paper} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
