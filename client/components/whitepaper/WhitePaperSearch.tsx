'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { whitePaperDisplayTitle } from '@/lib/whitePaperDisplay'
import {
  whitePaperResourceLabel,
  whitePaperResourceType,
  type WhitePaperResourceType,
} from '@/lib/whitePaperResourceType'
import { WhitePaperCard } from './WhitePaperCard'
import type { WhitePaperPublic } from '@/lib/whitePaperCms'

const FALLBACK_SEARCH_TERMS = ['GPS', 'payroll', 'CRM', 'HR software', 'fleet', 'SMB software']

function buildSearchRotatorTerms(papers: WhitePaperPublic[]): string[] {
  const seen = new Set<string>()
  const terms: string[] = []

  const add = (raw: string) => {
    const text = raw.replace(/\s+/g, ' ').trim()
    if (!text || text.length < 2 || text.length > 42) return
    const key = text.toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    terms.push(text)
  }

  for (const paper of papers) {
    add(String(paper.metadata?.category || ''))

    const title = whitePaperDisplayTitle(paper.title, paper.seoTitle)
    const topic = title
      .replace(/\b20\d{2}\b/g, '')
      .replace(/\bbest\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim()

    const short =
      topic.split(/\s+for\s+/i)[0]?.split(/\s+software\b/i)[0]?.trim() ||
      topic.split(/\s+/).slice(0, 3).join(' ')

    add(short)
  }

  return terms.length ? terms : FALLBACK_SEARCH_TERMS
}

function useTypewriterPlaceholder(phrases: string[], active: boolean) {
  const [text, setText] = useState('')

  useEffect(() => {
    if (!active || !phrases.length) {
      setText('')
      return
    }

    let phraseIdx = 0
    let charIdx = 0
    let deleting = false
    let timeoutId = 0

    const tick = () => {
      const phrase = phrases[phraseIdx % phrases.length]

      if (!deleting) {
        charIdx += 1
        setText(phrase.slice(0, charIdx))
        if (charIdx >= phrase.length) {
          deleting = true
          timeoutId = window.setTimeout(tick, 1800)
          return
        }
        timeoutId = window.setTimeout(tick, 70)
        return
      }

      charIdx -= 1
      setText(phrase.slice(0, charIdx))
      if (charIdx <= 0) {
        deleting = false
        phraseIdx = (phraseIdx + 1) % phrases.length
      }
      timeoutId = window.setTimeout(tick, 40)
    }

    timeoutId = window.setTimeout(tick, 350)
    return () => window.clearTimeout(timeoutId)
  }, [active, phrases])

  return text
}

export function WhitePaperSearch({ papers }: { papers: WhitePaperPublic[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [resourceType, setResourceType] = useState<'all' | WhitePaperResourceType>('all')
  const [focused, setFocused] = useState(false)

  const rotatorTerms = useMemo(() => buildSearchRotatorTerms(papers), [papers])
  const showRotator = !query && !focused
  const rotatingTerm = useTypewriterPlaceholder(rotatorTerms, showRotator)

  const categories = useMemo(() => {
    const values = new Set<string>()
    for (const paper of papers) {
      const label = paper.metadata?.category?.trim()
      if (label) values.add(label)
    }
    return Array.from(values).sort((a, b) => a.localeCompare(b))
  }, [papers])

  const showTypeFilter = useMemo(() => {
    let hasReport = false
    let hasWhitepaper = false
    for (const paper of papers) {
      if (whitePaperResourceType(paper.metadata) === 'report') hasReport = true
      else hasWhitepaper = true
    }
    return hasReport && hasWhitepaper
  }, [papers])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return papers.filter((paper) => {
      if (resourceType !== 'all' && whitePaperResourceType(paper.metadata) !== resourceType) {
        return false
      }
      if (category && paper.metadata?.category?.trim() !== category) return false
      if (!q) return true
      return [paper.title, paper.seoTitle, paper.description, paper.metadata?.category]
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [papers, query, category, resourceType])

  return (
    <section aria-labelledby="whitepaper-library-heading">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h2
            id="whitepaper-library-heading"
            className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400"
          >
            Browse the library
          </h2>
          <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-gray-500">
            Trusted by operations teams for decision-making. Each report is summarized from
            independent PDF research.
          </p>
        </div>

        <div className="relative w-full shrink-0 lg:w-80">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-gray-400"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search reports..."
            aria-label="Search whitepaper reports"
            className="relative w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3.5 text-[13px] text-gray-700 outline-none transition placeholder:text-transparent focus:border-[#1D4ED8]/30 focus:ring-2 focus:ring-[#1D4ED8]/8"
          />
          {showRotator ? (
            <span
              className="pointer-events-none absolute inset-y-0 left-10 right-3.5 flex items-center truncate text-[13px] font-medium text-cb-orange"
              aria-hidden
            >
              Search {rotatingTerm}
              <span className="ml-px inline-block w-px animate-pulse bg-cb-orange">&nbsp;</span>
            </span>
          ) : null}
        </div>
      </div>

      {showTypeFilter ? (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[11px] font-medium uppercase tracking-[0.12em] text-gray-400">
            Type
          </span>
          {(['all', 'whitepaper', 'report'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setResourceType(type)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
                resourceType === type
                  ? 'bg-navy text-white'
                  : 'bg-transparent text-gray-600 ring-1 ring-gray-200 hover:text-navy'
              }`}
            >
              {type === 'all' ? 'All' : whitePaperResourceLabel(type)}
            </button>
          ))}
        </div>
      ) : null}

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
          {(query || category || resourceType !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setCategory(null)
                setResourceType('all')
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
