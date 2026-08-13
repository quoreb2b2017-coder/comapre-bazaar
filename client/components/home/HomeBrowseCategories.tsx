'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { HOME_CATEGORIES, type HomeCategory } from '@/data/homeCategories'
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

function isOrangePillar(label: string) {
  return label === 'Sales' || label === 'Human Resources'
}

function categoriesFor(filter: PillarFilter): HomeCategory[] {
  if (filter === 'All') return HOME_CATEGORIES
  return HOME_CATEGORIES.filter((c) => pillarFor(c.href) === filter)
}

export function HomeBrowseCategories() {
  const [filter, setFilter] = useState<PillarFilter>('All')
  const reduceMotion = useReducedMotion()
  const items = categoriesFor(filter)
  const accentActive = isOrangePillar(filter)

  return (
    <section
      id="browse-categories"
      className="scroll-mt-24 border-t border-slate-200 bg-white"
      aria-labelledby="browse-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-7 lg:px-10">
        <div className="mb-4 text-center">
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

        {/* New pattern: pillar switcher + split directory rows */}
        <div className="lg:grid lg:grid-cols-[minmax(16rem,18rem)_minmax(0,1fr)] lg:items-start lg:gap-8">
          <aside className="mb-4 lg:mb-0 lg:border-r lg:border-slate-200 lg:pr-5">
            <div
              className="mb-4 flex gap-1 overflow-x-auto pb-1 lg:mb-0 lg:flex-col lg:items-stretch lg:gap-0.5 lg:overflow-visible lg:pb-0"
              role="tablist"
              aria-label="Software pillars"
            >
              {PILLAR_ORDER.map((label) => {
                const active = filter === label
                const orange = isOrangePillar(label)
                return (
                  <button
                    key={label}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(label)}
                    className={`shrink-0 rounded-md px-3 py-1.5 text-left text-[12px] font-semibold transition-colors lg:w-full ${
                      active
                        ? orange
                          ? 'bg-[#F58220] text-white'
                          : 'bg-[#0B2A6F] text-white'
                        : orange
                          ? 'text-[#F58220] hover:bg-[#FFF1E6]'
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

            {/* Subscribe sits directly under Human Resources */}
            <div className="mt-4 border-t border-dashed border-slate-200 pt-4 lg:mt-5">
              <NewsletterSubscribeForm sourceSlug="homepage" variant="hero" />
            </div>
          </aside>

          <div className="relative min-w-0">
            <p
              className={`pointer-events-none absolute -right-1 -top-3 select-none font-serif text-6xl leading-none opacity-[0.06] sm:text-7xl ${
                accentActive ? 'text-[#F58220]' : 'text-[#0B2A6F]'
              }`}
              aria-hidden
            >
              {filter === 'All' ? 'Browse' : filter === 'Human Resources' ? 'HR' : filter}
            </p>

            <AnimatePresence mode="wait">
              <motion.ul
                key={filter}
                role="tabpanel"
                initial={reduceMotion ? false : { opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="relative space-y-0"
              >
                {items.map((cat, i) => {
                  const Icon = cat.icon
                  return (
                    <li
                      key={cat.href}
                      className="group grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-b border-slate-100 py-2.5 last:border-b-0 hover:bg-slate-50/80 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-4"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8EEF8] text-[#0B2A6F] transition-colors group-hover:bg-[#FFF1E6] group-hover:text-[#F58220]">
                        <Icon className="h-4 w-4" aria-hidden={true} />
                      </span>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <Link
                            href={cat.href}
                            className="truncate text-[15px] font-semibold text-navy underline-offset-4 transition-colors group-hover:text-[#F58220] group-hover:underline"
                          >
                            {cat.title}
                          </Link>
                          <span className="text-[11px] text-slate-400">{cat.vendors}</span>
                        </div>
                        <p className="mt-0.5 truncate text-[12px] text-slate-500">{cat.cardTagline}</p>
                      </div>

                      <div className="col-span-2 flex items-center gap-3 sm:col-span-1 sm:justify-end">
                        <Link
                          href={cat.href}
                          className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0B2A6F] hover:text-[#F58220]"
                        >
                          Compare
                        </Link>
                        <Link
                          href={cat.quotesHref}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#F58220] hover:text-[#e07418]"
                        >
                          Quotes
                          <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                        </Link>
                        <span className="hidden font-serif text-lg tabular-nums text-slate-200 sm:inline" aria-hidden>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </li>
                  )
                })}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
