'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { HOME_CATEGORIES } from '@/data/homeCategories'
import { HomeCategoryCard } from '@/components/ui/HomeCategoryCard'
import { HomeHeroMagnifierVisual } from '@/components/home/HomeHeroMagnifierVisual'
import { NewsletterSubscribeForm } from '@/components/ui/NewsletterSubscribeForm'
import { fadeUp, staggerContainer } from '@/lib/homeMotion'

export function HomeHeroSection() {
  const reduceMotion = useReducedMotion()

  return (
    <header className="border-b border-gray-100 bg-white">
      <motion.div
        className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-9 lg:max-w-7xl lg:px-10 lg:py-10"
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        variants={staggerContainer}
      >
        <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_minmax(300px,380px)] lg:items-start lg:gap-6">
          <motion.div variants={fadeUp}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#F58220]">
              Independent B2B Software Research
            </p>
            <div className="mb-3 flex gap-2" aria-hidden="true">
              <span className="block h-1 w-2 rounded-full bg-[#F58220]" />
              <span className="block h-1 w-12 rounded-full bg-[#F58220]" />
            </div>
            <h1 className="mb-2 max-w-2xl text-2xl tracking-tight text-navy sm:text-3xl lg:text-4xl">
              Find the right software before the vendor call.
            </h1>
            <div className="mb-3 h-1 w-16 rounded-full bg-[#F58220]" aria-hidden="true" />
            <p className="max-w-xl text-sm text-gray-600 sm:text-base">
              Side-by-side comparisons, pricing breakdowns, and unbiased shortlists - built for US
              small businesses.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="overflow-visible lg:justify-self-end lg:w-full lg:max-w-[380px]">
            <HomeHeroMagnifierVisual categories={HOME_CATEGORIES} />
          </motion.div>
        </div>

        <motion.div variants={fadeUp} className="mb-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Browse by category
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-3 lg:gap-5">
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
                variant="navy"
              />
            </div>
          ))}
        </div>

        <motion.div variants={fadeUp} className="mt-8">
          <NewsletterSubscribeForm sourceSlug="homepage" variant="hero" />
        </motion.div>
      </motion.div>
    </header>
  )
}
