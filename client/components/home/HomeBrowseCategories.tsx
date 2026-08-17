'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { HOME_CATEGORIES } from '@/data/homeCategories'
import { NewsletterSubscribeForm } from '@/components/ui/NewsletterSubscribeForm'

const PILLAR_ORDER = ['All', 'Technology', 'Marketing', 'Sales', 'Human Resources'] as const
type PillarFilter = (typeof PILLAR_ORDER)[number]

function pillarFor(href: string): Exclude<PillarFilter, 'All'> {
  if (href.startsWith('/technology')) return 'Technology'
  if (href.startsWith('/marketing')) return 'Marketing'
  if (href.startsWith('/sales')) return 'Sales'
  if (href.startsWith('/human-resources')) return 'Human Resources'
  return 'Technology'
}

function categoriesFor(filter: PillarFilter) {
  if (filter === 'All') return HOME_CATEGORIES
  return HOME_CATEGORIES.filter((c) => pillarFor(c.href) === filter)
}

export function HomeBrowseCategories() {
  const [filter, setFilter] = useState<PillarFilter>('All')
  const reduceMotion = useReducedMotion()
  const items = categoriesFor(filter)

  return (
    <section
      id="browse-categories"
      className="scroll-mt-24 border-t border-slate-200 bg-white"
      aria-labelledby="browse-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="mb-5 text-center">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#F58220]">
            Browse by category
          </p>
          <h2 id="browse-heading" className="font-serif text-2xl tracking-tight text-navy sm:text-[1.7rem]">
            Compare the tools buyers ask about most
          </h2>
          <Link
            href="/browse-all-software"
            className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0B2A6F] hover:text-[#F58220]"
          >
            See all software <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="lg:grid lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:items-start lg:gap-7">
          <aside className="mb-4 lg:mb-0">
            <div
              className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:pb-0"
              role="tablist"
              aria-label="Software pillars"
            >
              {PILLAR_ORDER.map((label) => {
                const active = filter === label
                return (
                  <button
                    key={label}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(label)}
                    className={`shrink-0 rounded-md px-3 py-1.5 text-left text-[13px] font-semibold transition-colors lg:w-full ${
                      active
                        ? 'bg-[#0B2A6F] text-white'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-navy'
                    }`}
                  >
                    {label === 'Human Resources' ? (
                      <>
                        <span className="lg:hidden">HR</span>
                        <span className="hidden lg:inline">Human Resources</span>
                      </>
                    ) : (
                      label
                    )}
                  </button>
                )
              })}
            </div>

            <div className="mt-5 hidden border-t border-slate-200 pt-4 lg:block">
              <NewsletterSubscribeForm sourceSlug="homepage" variant="hero" />
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-1.5 hidden items-center px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:grid sm:grid-cols-[1.75rem_minmax(0,1fr)_5.25rem_4.25rem_4rem_1.75rem] sm:gap-3">
              <span />
              <span>Category</span>
              <span className="text-right">Vendors</span>
              <span className="text-right">Compare</span>
              <span className="text-right">Quotes</span>
              <span />
            </div>

            <AnimatePresence mode="wait">
              <motion.ul
                key={filter}
                role="tabpanel"
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden rounded-lg border border-slate-200"
              >
                {items.map((cat, i) => {
                  const Icon = cat.icon
                  return (
                    <li
                      key={cat.href}
                      className="group grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-2.5 border-b border-slate-100 bg-white px-2.5 py-2 last:border-b-0 hover:bg-[#FAFBFD] sm:grid-cols-[1.75rem_minmax(0,1fr)_5.25rem_4.25rem_4rem_1.75rem] sm:gap-3 sm:px-3"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EEF2F8] text-[#0B2A6F] transition-colors group-hover:bg-[#FFF1E6] group-hover:text-[#F58220]">
                        <Icon className="h-3.5 w-3.5" aria-hidden={true} />
                      </span>

                      <Link
                        href={cat.href}
                        className="min-w-0 truncate text-[14px] font-semibold text-navy underline-offset-4 transition-colors group-hover:text-[#F58220] group-hover:underline"
                      >
                        {cat.title}
                      </Link>

                      <span className="hidden text-right text-[12px] tabular-nums text-slate-500 sm:block">
                        {cat.vendors.replace(' vendors', '')}
                      </span>

                      <Link
                        href={cat.href}
                        className="hidden text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0B2A6F] hover:text-[#F58220] sm:block"
                      >
                        Compare
                      </Link>
                      <Link
                        href={cat.quotesHref}
                        className="text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-[#F58220] hover:text-[#e07418]"
                      >
                        Quotes
                      </Link>
                      <span
                        className="hidden text-right font-serif text-[13px] tabular-nums text-slate-300 sm:block"
                        aria-hidden
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </li>
                  )
                })}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-5 border-t border-slate-200 pt-4 lg:hidden">
          <NewsletterSubscribeForm sourceSlug="homepage" variant="hero" />
        </div>
      </div>
    </section>
  )
}
