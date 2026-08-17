'use client'

import { useState } from 'react'
import type { ArticleEnrichment } from '@/lib/blogArticleEnrichments'

type Props = {
  enrichment: Extract<ArticleEnrichment, { type: 'stats' }>
}

export function BlogArticleStatGrid({ enrichment }: Props) {
  const [active, setActive] = useState(0)
  const { title, items } = enrichment

  return (
    <section className="blog-article-enrichment not-prose" aria-label={title}>
      <div className="mb-4 border-b border-slate-100 pb-4">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F58220]">
          Quick metrics
        </p>
        <h3 className="font-serif text-lg font-semibold text-navy">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">Tap a card to highlight - based on buyer research patterns</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {items.map((item, i) => {
          const isActive = active === i
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setActive(i)}
              className={[
                'rounded-lg border p-3.5 text-left transition-all sm:p-4',
                isActive
                  ? 'border-[#F58220]/50 bg-[#FFF7ED] shadow-sm ring-1 ring-[#F58220]/20'
                  : 'border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-white',
              ].join(' ')}
              aria-pressed={isActive}
            >
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{item.label}</p>
              <p className="mt-1 font-serif text-2xl font-semibold tabular-nums text-navy">{item.value}</p>
              <p className="mt-1 text-xs leading-snug text-slate-500">{item.hint}</p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
