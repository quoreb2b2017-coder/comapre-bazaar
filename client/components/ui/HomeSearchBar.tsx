'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Search } from 'lucide-react'
import { heroBtn3d, heroInputRow, heroPanel3d, heroTag3d } from '@/lib/hero3dStyles'

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

const TYPING_EXAMPLES = ['CRM', 'payroll', 'VoIP', 'HR', 'GPS fleet', 'email marketing']

function useTypewriterPlaceholder(active: boolean) {
  const [text, setText] = useState('')

  useEffect(() => {
    if (!active) {
      setText('')
      return
    }

    let phraseIdx = 0
    let charIdx = 0
    let deleting = false
    let timeoutId = 0

    const tick = () => {
      const phrase = TYPING_EXAMPLES[phraseIdx]

      if (!deleting) {
        charIdx += 1
        setText(phrase.slice(0, charIdx))
        if (charIdx >= phrase.length) {
          deleting = true
          timeoutId = window.setTimeout(tick, 1600)
          return
        }
        timeoutId = window.setTimeout(tick, 85)
        return
      }

      charIdx -= 1
      setText(phrase.slice(0, charIdx))
      if (charIdx <= 0) {
        deleting = false
        phraseIdx = (phraseIdx + 1) % TYPING_EXAMPLES.length
      }
      timeoutId = window.setTimeout(tick, 45)
    }

    timeoutId = window.setTimeout(tick, 400)
    return () => window.clearTimeout(timeoutId)
  }, [active])

  return text
}

export function HomeSearchBar({ items, variant = 'default' }: HomeSearchBarProps) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const router = useRouter()
  const showTypewriter = variant === 'hero' && !query && !focused
  const typedExample = useTypewriterPlaceholder(showTypewriter)

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
      <div className={`p-3 sm:p-3.5 ${heroPanel3d}`}>
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F58220]">
          Search software
        </p>

        <form onSubmit={handleSearch}>
          <div className={heroInputRow}>
            <div className="flex min-w-0 flex-1 items-center gap-2 pl-3">
              <Search className="h-3.5 w-3.5 shrink-0 text-[#F58220]" aria-hidden="true" />
              <div className="relative min-w-0 flex-1">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="Search software categories"
                  className="w-full bg-transparent py-2 text-[13px] text-gray-800 outline-none placeholder:text-transparent"
                  aria-label="Search software categories"
                />
                {showTypewriter ? (
                  <span
                    className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-[13px] text-gray-400"
                    aria-hidden="true"
                  >
                    e.g. {typedExample}
                    <span className="ml-px inline-block w-[1px] animate-pulse bg-gray-400">&nbsp;</span>
                  </span>
                ) : null}
              </div>
            </div>
            <button
              type="submit"
              className={`inline-flex shrink-0 items-center gap-1 px-3 py-2 text-[13px] font-semibold text-white ${heroBtn3d}`}
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
              className={heroTag3d}
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
      <button type="submit" className={`px-5 text-sm font-semibold text-white ${heroBtn3d}`}>
        Search
      </button>
    </form>
  )
}
