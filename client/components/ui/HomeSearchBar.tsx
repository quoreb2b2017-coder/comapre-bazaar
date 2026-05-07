'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

interface SearchItem {
  href: string
  label: string
}

interface HomeSearchBarProps {
  items: SearchItem[]
}

export function HomeSearchBar({ items }: HomeSearchBarProps) {
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

  return (
    <form onSubmit={handleSearch} className="flex max-w-lg mx-auto bg-white rounded-xl overflow-hidden shadow-2xl mb-7">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search software categories (e.g. CRM, payroll...)"
        className="flex-1 px-5 py-4 text-sm text-gray-800 outline-none"
        aria-label="Search software categories"
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-[#1d4fd7] to-[#295fdd] hover:from-[#1948c7] hover:to-[#2455ca] text-white px-5 text-sm font-semibold transition-colors"
      >
        Search
      </button>
    </form>
  )
}
