'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { comparisonPages } from '@/data/comparisons'
import { ProductLogo } from '@/components/comparison/ProductLogo'
import type { Product } from '@/types'

const ROTATE_MS = 3000

const SLIDES = [
  { canonical: '/marketing/best-crm-software', heading: 'Best CRM software this year', label: 'CRM' },
  { canonical: '/human-resources/best-payroll-software', heading: 'Best payroll software this year', label: 'Payroll' },
  { canonical: '/technology/business-phone-systems', heading: 'Best VoIP systems this year', label: 'VoIP' },
  { canonical: '/technology/gps-fleet-management-software', heading: 'Best fleet software this year', label: 'Fleet' },
  { canonical: '/marketing/best-email-marketing-services', heading: 'Best email marketing this year', label: 'Email' },
  { canonical: '/sales/best-project-management-software', heading: 'Best project management this year', label: 'Projects' },
] as const

function ranked(products: Product[], limit: number) {
  return [...products]
    .sort((a, b) => parseFloat(b.score) - parseFloat(a.score) || b.reviewCount - a.reviewCount)
    .slice(0, limit)
}

function ScoreMeter({ score }: { score: string }) {
  const value = Math.min(5, Math.max(0, parseFloat(score) || 0))
  const pct = (value / 5) * 100
  return (
    <div className="min-w-[108px]">
      <div className="mb-1 flex items-baseline gap-1">
        <span className="font-serif text-lg leading-none text-navy">{score}</span>
        <span className="text-[10px] text-slate-400">/ 5</span>
      </div>
      <div className="h-px overflow-hidden bg-slate-200">
        <div className="h-full bg-[#F58220]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

const slides = SLIDES.map((slide) => {
  const page = comparisonPages.find((p) => p.canonical === slide.canonical)
  if (!page) return null
  return {
    ...slide,
    lastReviewed: page.lastReviewed,
    rows: ranked(page.products, 5),
  }
}).filter(Boolean) as {
  canonical: string
  heading: string
  label: string
  lastReviewed: string
  rows: Product[]
}[]

export function HomeRotatingRankings() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || slides.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, ROTATE_MS)
    return () => window.clearInterval(timer)
  }, [paused])

  const slide = slides[index]
  if (!slide) return null

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="mb-6 text-center">
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#F58220]">
          2026 rankings
        </p>
        <h2 className="font-serif text-2xl tracking-tight text-navy sm:text-[2rem]">{slide.heading}</h2>
        <p className="mt-1.5 text-[13px] text-slate-500">
          Expert scores on features, pricing, and ease of use · Updated {slide.lastReviewed}
        </p>
        <Link
          href={slide.canonical}
          className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[13px] font-semibold text-navy shadow-sm hover:border-[#F58220] hover:text-[#F58220]"
        >
          Full {slide.label} comparison <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_48px_-28px_rgba(11,42,111,0.35)]">
        <div className="flex items-center justify-between bg-[#0B2A6F] px-5 py-3">
          <p className="text-[13px] font-semibold text-white">{slide.label} shortlist</p>
          <p className="text-[11px] text-white/55">{slide.rows.length} platforms ranked</p>
        </div>

        <div className="hidden grid-cols-[40px_minmax(0,1fr)_120px_140px_auto] gap-4 border-b border-slate-100 bg-slate-50/80 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 md:grid">
          <span>#</span>
          <span>Platform</span>
          <span>Score</span>
          <span>From</span>
          <span className="text-right"> </span>
        </div>

        {slide.rows.map((product, i) => {
          const rank = i + 1
          const isTop = rank === 1
          return (
            <div
              key={`${slide.canonical}-${product.id}`}
              className={`grid grid-cols-1 items-center gap-3 border-t border-slate-100 px-5 py-3.5 md:grid-cols-[40px_minmax(0,1fr)_120px_140px_auto] md:gap-4 ${
                isTop ? 'bg-[#FFF8F1]' : 'bg-white hover:bg-slate-50/80'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-8 font-serif text-lg tabular-nums ${
                    isTop ? 'text-[#F58220]' : 'text-slate-300'
                  }`}
                >
                  {String(rank).padStart(2, '0')}
                </span>
                {isTop ? (
                  <span className="rounded-sm bg-[#F58220] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white md:hidden">
                    Top
                  </span>
                ) : null}
              </div>

              <div className="flex min-w-0 items-center gap-3">
                <ProductLogo product={product} size="sm" highlighted={isTop} />
                <div className="min-w-0">
                  <p className="flex items-center gap-2 truncate font-semibold text-navy">
                    {product.name}
                    {isTop ? (
                      <span className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-[#F58220] md:inline">
                        Editor's pick
                      </span>
                    ) : null}
                  </p>
                  <p className="truncate text-[12px] text-slate-500">{product.tagline}</p>
                </div>
              </div>

              <ScoreMeter score={product.score} />

              <p className="text-sm text-slate-600">
                <span className="font-semibold text-navy">{product.pricingAmount}</span>
                <span className="block text-[11px] text-slate-400 sm:inline sm:pl-1">{product.pricingPeriod}</span>
              </p>

              <div className="md:text-right">
                <Link
                  href={slide.canonical}
                  className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12px] font-semibold ${
                    isTop
                      ? 'bg-[#F58220] text-white hover:bg-[#e07418]'
                      : 'border border-slate-200 text-navy hover:border-[#F58220] hover:text-[#F58220]'
                  }`}
                >
                  Compare
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-5 flex justify-center gap-1.5">
        {slides.map((item, i) => (
          <button
            key={item.canonical}
            type="button"
            aria-label={`Show ${item.label} rankings`}
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all ${
              i === index ? 'w-7 bg-[#F58220]' : 'w-3 bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
