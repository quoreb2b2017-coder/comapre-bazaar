'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Tag } from 'lucide-react'

type BlogTopicFilterBandProps = {
  label: string
  slug: string
  count: number
}

export function BlogTopicFilterBand({ label, slug, count }: BlogTopicFilterBandProps) {
  useEffect(() => {
    const target = document.getElementById('blog-articles')
    if (!target) return
    const timer = window.setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
    return () => window.clearTimeout(timer)
  }, [slug])

  return (
    <div
      className="sticky top-[4.5rem] z-30 mb-6 bg-white/95 sm:top-20"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <Tag className="h-4 w-4 shrink-0 text-cb-orange" strokeWidth={1.75} aria-hidden />
          <div className="min-w-0">
            <p className="truncate font-serif text-base tracking-tight text-navy sm:text-lg">
              {label}
            </p>
            <p className="text-[12px] text-gray-500">
              {count} article{count === 1 ? '' : 's'}
            </p>
          </div>
        </div>
        <Link
          href="/blog"
          className="inline-flex shrink-0 items-center gap-1.5 self-start text-[12px] font-semibold text-cb-orange hover:text-cb-orange-hover sm:self-center"
        >
          <ArrowLeft className="h-3 w-3" aria-hidden />
          All topics
        </Link>
      </div>
    </div>
  )
}
