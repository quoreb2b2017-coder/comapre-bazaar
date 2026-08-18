'use client'

import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { HOME_CATEGORIES } from '@/data/homeCategories'
import { HomeHeroMagnifierVisual } from '@/components/home/HomeHeroMagnifierVisual'
import { NewsletterSubscribeForm } from '@/components/ui/NewsletterSubscribeForm'

const TRUST = ['50K+ buyers helped', '40+ platforms reviewed', '12 scoring criteria', '100% independent']

export function HomeHeroSection() {
  return (
    <header className="relative overflow-hidden bg-[#0B2A6F]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(245,130,32,0.22),transparent_34%),radial-gradient(circle_at_8%_90%,rgba(255,255,255,0.07),transparent_32%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,white,transparent_88%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 sm:pb-9 sm:pt-9 lg:px-10 lg:pt-10">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:gap-8">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F58220]">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                Independent B2B research
              </p>
              <h1 className="max-w-xl font-serif text-[2.1rem] leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.15rem]">
                Find the right software before the vendor call.
              </h1>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/70 sm:text-base">
                Side-by-side comparisons, dated pricing, and unbiased shortlists — built for US small
                businesses.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="#latest-blogs"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#F58220] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#e07418]"
                >
                  Latest guides <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href={HOME_CATEGORIES[0]?.quotesHref || '/technology/get-free-quotes'}
                  className="inline-flex items-center rounded-lg border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
                >
                  Get free quotes
                </Link>
              </div>

              <ul className="mt-4 flex flex-wrap gap-2">
                {TRUST.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[12px] text-white/75"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <NewsletterSubscribeForm sourceSlug="home-hero" variant="hero" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/15 bg-white shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)] lg:justify-self-end lg:w-full">
              <HomeHeroMagnifierVisual categories={HOME_CATEGORIES} />
            </div>
          </div>
        </div>
    </header>
  )
}
