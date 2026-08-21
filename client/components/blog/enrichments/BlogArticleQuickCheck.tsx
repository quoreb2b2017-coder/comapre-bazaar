'use client'

import { useCallback, useEffect, useState } from 'react'
import { ArrowRight, Check, ChevronDown, RotateCcw, Sparkles } from 'lucide-react'
import type { ArticleEnrichment } from '@/lib/blogArticleEnrichments'
import { blogChecklistStorageKey } from '@/lib/blogQuoteMatch'
import { useBlogQuoteOptional } from '@/components/blog/BlogQuoteProvider'

type Props = {
  enrichment: Extract<ArticleEnrichment, { type: 'checklist' }>
  slug: string
}

export function BlogArticleQuickCheck({ enrichment, slug }: Props) {
  const quoteCtx = useBlogQuoteOptional()
  const { title, items } = enrichment

  const [checked, setChecked] = useState<Set<number>>(new Set())
  const [expanded, setExpanded] = useState<number | null>(0)
  const [justCompleted, setJustCompleted] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  const storageKey = blogChecklistStorageKey(slug)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw) as number[]
        if (Array.isArray(parsed)) setChecked(new Set(parsed))
      }
    } catch {
      /* ignore */
    }
    setHydrated(true)
  }, [storageKey])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(storageKey, JSON.stringify([...checked]))
    } catch {
      /* ignore */
    }
  }, [checked, hydrated, storageKey])

  const done = checked.size
  const total = items.length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const allDone = done === total && total > 0

  useEffect(() => {
    if (allDone && !justCompleted) {
      setJustCompleted(true)
    }
  }, [allDone, justCompleted])

  const toggle = useCallback((i: number) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
    setExpanded(i)
  }, [])

  const markAll = () => {
    setChecked(new Set(items.map((_, i) => i)))
    setJustCompleted(true)
  }

  const reset = () => {
    setChecked(new Set())
    setExpanded(0)
    setJustCompleted(false)
    try {
      localStorage.removeItem(storageKey)
    } catch {
      /* ignore */
    }
  }

  const openQuotes = () => {
    if (quoteCtx?.match.kind) {
      quoteCtx.openQuotePopup()
      return
    }
    if (quoteCtx?.match.href) {
      window.location.href = quoteCtx.match.href
    }
  }

  return (
    <section className="blog-article-enrichment blog-article-checklist not-prose" aria-label={title}>
      <div className="mb-5 border-b border-slate-100 pb-4">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F58220]">
              Your action plan
            </p>
            <h3 className="font-serif text-lg font-semibold text-navy">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">
              Tap each step to mark done - progress saves automatically
            </p>
          </div>
          <div className="flex gap-2">
            {done < total ? (
              <button
                type="button"
                onClick={markAll}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy transition hover:border-[#F58220]/40 hover:bg-[#FFFAF5]"
              >
                Mark all done
              </button>
            ) : (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300"
              >
                <RotateCcw className="h-3 w-3" aria-hidden />
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#F58220] to-[#0B2A6F] transition-all duration-500 ease-out"
              style={{ width: `${pct}%` }}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Checklist progress"
            />
          </div>
          <span className="shrink-0 text-sm font-bold tabular-nums text-navy">
            {done}/{total}
          </span>
        </div>
      </div>

      <ul className="space-y-2">
        {items.map((item, i) => {
          const isChecked = checked.has(i)
          const isExpanded = expanded === i
          return (
            <li key={item.label}>
              <div
                className={[
                  'overflow-hidden rounded-xl border transition-all duration-200',
                  isChecked
                    ? 'border-emerald-200/80 bg-emerald-50/40 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300',
                ].join(' ')}
              >
                <div className="flex items-stretch">
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    className="flex flex-1 items-start gap-3 px-3.5 py-3.5 text-left sm:px-4"
                    aria-pressed={isChecked}
                  >
                    <span
                      className={[
                        'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200',
                        isChecked
                          ? 'scale-100 border-emerald-500 bg-emerald-500 text-white'
                          : 'border-slate-300 bg-white hover:border-[#F58220]',
                      ].join(' ')}
                      aria-hidden
                    >
                      {isChecked ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span
                          className={`text-sm font-semibold ${isChecked ? 'text-emerald-900 line-through decoration-emerald-400/60' : 'text-navy'}`}
                        >
                          {item.label}
                        </span>
                        {item.priority === 'high' ? (
                          <span className="rounded bg-[#F58220]/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#D97706]">
                            Key
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block text-sm leading-snug text-slate-500">{item.detail}</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpanded(isExpanded ? null : i)}
                    className="flex shrink-0 items-center border-l border-slate-100 px-3 text-slate-400 transition hover:bg-slate-50 hover:text-navy"
                    aria-expanded={isExpanded}
                    aria-label={isExpanded ? 'Collapse steps' : 'Expand action steps'}
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      aria-hidden
                    />
                  </button>
                </div>

                {isExpanded && item.steps && item.steps.length > 0 ? (
                  <div className="border-t border-slate-100/80 bg-slate-50/50 px-4 py-3">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Do this now
                    </p>
                    <ol className="space-y-1.5">
                      {item.steps.map((step, si) => (
                        <li key={step} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy/8 text-[10px] font-bold text-navy">
                            {si + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>

      <div
        className={[
          'mt-5 rounded-xl border p-4 transition-all duration-300',
          allDone
            ? 'border-[#F58220]/30 bg-gradient-to-r from-[#FFFAF5] to-white shadow-sm'
            : 'border-slate-200 bg-slate-50/60',
        ].join(' ')}
      >
        {allDone ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Sparkles className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-navy">Checklist complete - ready for quotes?</p>
                <p className="text-xs text-slate-500">
                  Compare {quoteCtx?.match.categoryLabel ?? 'vendors'} matched to this blog
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={openQuotes}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#F58220] to-[#ec7416] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
            >
              {quoteCtx?.match.label ?? 'Get Free Quotes'}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-navy">{total - done} steps left</span> - complete the checklist
              to unlock vendor matching
            </p>
            {quoteCtx?.match.kind ? (
              <button
                type="button"
                onClick={openQuotes}
                className="text-sm font-semibold text-[#F58220] underline decoration-[#F58220]/30 underline-offset-4 hover:decoration-[#F58220]"
              >
                Skip to quotes →
              </button>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}
