'use client'

import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { HOME_CATEGORIES } from '@/data/homeCategories'
import { HomeCategoryCard } from '@/components/ui/HomeCategoryCard'
import { HomeHeroMagnifierVisual } from '@/components/home/HomeHeroMagnifierVisual'
import { NewsletterSubscribeForm } from '@/components/ui/NewsletterSubscribeForm'

const TRUST = ['50K+ buyers helped', '40+ platforms reviewed', '12 scoring criteria', '100% independent']

export function HomeHeroSection() {
  return (
    <header className="bg-[#F7F8FB]">
      <div className="relative overflow-hidden bg-[#0B2A6F]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(245,130,32,0.22),transparent_34%),radial-gradient(circle_at_8%_90%,rgba(255,255,255,0.07),transparent_32%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,white,transparent_88%)]"
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-12 lg:px-10 lg:pt-14">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:gap-12">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F58220]">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                Independent B2B research
              </p>
              <h1 className="max-w-xl font-serif text-[2.1rem] leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.15rem]">
                Find the right software before the vendor call.
              </h1>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/70 sm:text-base">
                Side-by-side comparisons, dated pricing, and unbiased shortlists — built for US small
                businesses.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#browse-categories"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#F58220] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#e07418]"
                >
                  Browse categories <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href={HOME_CATEGORIES[0]?.quotesHref || '/technology/get-free-quotes'}
                  className="inline-flex items-center rounded-lg border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
                >
                  Get free quotes
                </Link>
              </div>

              <ul className="mt-7 flex flex-wrap gap-2">
                {TRUST.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[12px] text-white/75"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/15 bg-white shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)] lg:justify-self-end lg:w-full">
              <HomeHeroMagnifierVisual categories={HOME_CATEGORIES} />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-10 max-w-7xl px-4 pb-10 sm:-mt-12 sm:px-6 sm:pb-12 lg:px-10">
        <div
          id="browse-categories"
          className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_-28px_rgba(15,31,61,0.35)] sm:p-7"
        >
          <div className="mb-6 text-center">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F58220]">
              Browse by category
            </p>
            <h2 className="font-serif text-xl tracking-tight text-navy sm:text-2xl">
              Compare the tools buyers ask about most
            </h2>
            <Link
              href="/browse-all-software"
              className="mt-2 inline-block text-sm font-semibold text-navy hover:text-[#F58220]"
            >
              See all software →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {HOME_CATEGORIES.map((cat) => (
              <div key={cat.href} className="min-w-0">
                <HomeCategoryCard
                  href={cat.href}
                  quotesHref={cat.quotesHref}
                  icon={cat.icon}
                  shortTitle={cat.shortTitle}
                  vendors={cat.vendors}
                  title={cat.title}
                  cardTagline={cat.cardTagline}
                  variant="panel"
                />
              </div>
            ))}
          </div>

          <NewsletterSubscribeForm sourceSlug="homepage" variant="hero" />
        </div>
      </div>
    </header>
  )
}
