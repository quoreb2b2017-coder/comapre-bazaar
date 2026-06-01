'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Tag } from 'lucide-react'

type BlogTopicFilterBandProps = {
  label: string
  slug: string
  count: number
  accentFrom: string
  accentTo: string
}

export function BlogTopicFilterBand({ label, slug, count, accentFrom, accentTo }: BlogTopicFilterBandProps) {
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
      className="sticky top-[4.5rem] z-30 mb-10 overflow-hidden rounded-xl border border-gray-200/90 bg-white/95 shadow-[0_8px_30px_-12px_rgba(11,42,111,0.18)] backdrop-blur-md sm:top-20"
      role="status"
      aria-live="polite"
    >
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${accentFrom}, ${accentTo})` }}
        aria-hidden
      />
      <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
        <div className="flex min-w-0 items-start gap-3 sm:items-center">
          <span
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy/[0.06] text-navy sm:mt-0"
            aria-hidden
          >
            <Tag className="h-[18px] w-[18px] stroke-[1.75]" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
              Viewing topic
            </p>
            <p className="mt-0.5 truncate font-serif text-xl tracking-tight text-navy sm:text-[1.35rem]">
              {label}
            </p>
            <p className="mt-1 text-[13px] text-gray-500">
              {count} article{count === 1 ? '' : 's'} · scroll below to read
            </p>
          </div>
        </div>
        <Link
          href="/blog"
          className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-navy transition-colors hover:border-brand/40 hover:bg-brand/[0.04] hover:text-brand sm:self-center"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          All topics
        </Link>
      </div>
    </div>
  )
}
