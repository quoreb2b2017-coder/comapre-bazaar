'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Search } from 'lucide-react'

interface SearchItem {
  href: string
  label: string
  shortLabel?: string
}

interface HomeSearchBarProps {
  items: SearchItem[]
  variant?: 'default' | 'hero'
}

const COMPACT_TAG_LABELS: Record<string, string> = {
  'VoIP & UCaaS': 'VoIP',
  'HR Software': 'HR',
  'GPS Fleet': 'GPS',
  'Email Marketing': 'Email',
}

export function HomeSearchBar({ items, variant = 'default' }: HomeSearchBarProps) {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const normalizedItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        normalizedLabel: item.label.toLowerCase(),
      })),
    [items]
  )

  const quickTags = useMemo(
    () =>
      items.map((item) => {
        const base = item.shortLabel || item.label.split(' ')[0]
        return {
          href: item.href,
          label: COMPACT_TAG_LABELS[base] || base,
        }
      }),
    [items]
  )

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const value = query.trim().toLowerCase()
    if (!value) return

    const matchedItem =
      normalizedItems.find((item) => item.normalizedLabel.includes(value)) ||
      normalizedItems.find((item) =>
        value
          .split(/\s+/)
          .every((word) => item.normalizedLabel.includes(word))
      )

    if (matchedItem) {
      router.push(matchedItem.href)
      return
    }

    router.push('/marketing')
  }

  if (variant === 'hero') {
    return (
      <div className="rounded-xl border border-[#1e3a6a]/90 border-t-[3px] border-t-[#F58220] bg-[#0c2147] p-3.5 sm:p-4 shadow-[0_16px_36px_-18px_rgba(12,33,71,0.55)]">
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F58220]">
          Search software
        </p>

        <form onSubmit={handleSearch}>
          <div className="flex overflow-hidden rounded-lg border border-white/10 bg-white transition focus-within:border-[#F58220] focus-within:ring-2 focus-within:ring-[#F58220]/25">
            <div className="flex min-w-0 flex-1 items-center gap-2 pl-3">
              <Search className="h-3.5 w-3.5 shrink-0 text-[#F58220]/80" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. CRM, payroll, VoIP, HR, GPS fleet, email..."
                className="min-w-0 flex-1 bg-transparent py-2.5 text-[13px] text-[#0c2147] outline-none placeholder:text-gray-400"
                aria-label="Search software categories"
              />
            </div>
            <button
              type="submit"
              className="inline-flex shrink-0 items-center gap-1 bg-[#F58220] px-3.5 text-[13px] font-semibold text-white transition hover:bg-[#e67410]"
            >
              <span className="hidden sm:inline">Search</span>
              <ArrowRight className="h-3.5 w-3.5 sm:hidden" aria-hidden="true" />
            </button>
          </div>
        </form>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {quickTags.map((tag) => (
            <button
              key={tag.href}
              type="button"
              onClick={() => router.push(tag.href)}
              className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/85 transition hover:border-[#F58220] hover:bg-[#F58220]/20 hover:text-white"
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSearch} className="mx-auto mb-7 flex max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. CRM, payroll, VoIP, HR, GPS fleet, email..."
        className="flex-1 px-5 py-4 text-sm text-gray-800 outline-none"
        aria-label="Search software categories"
      />
      <button
        type="submit"
        className="bg-[#F58220] px-5 text-sm font-semibold text-white transition hover:bg-[#e67410]"
      >
        Search
      </button>
    </form>
  )
}
