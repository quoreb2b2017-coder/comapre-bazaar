'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { HOME_CATEGORIES, HERO_SEARCH_ITEMS } from '@/data/homeCategories'
import { HomeCategoryCard } from '@/components/ui/HomeCategoryCard'
import { HomeSearchBar } from '@/components/ui/HomeSearchBar'
import { NewsletterSubscribeForm } from '@/components/ui/NewsletterSubscribeForm'
import { fadeUp, staggerContainer } from '@/lib/homeMotion'

export function HomeHeroSection() {
  const reduceMotion = useReducedMotion()

  return (
    <header className="border-b border-gray-100 bg-white px-4 py-8 sm:px-6 sm:py-9 lg:px-10 lg:py-10">
      <motion.div
        className="mx-auto max-w-6xl lg:max-w-7xl"
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        variants={staggerContainer}
      >
        <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_minmax(220px,280px)] lg:items-start lg:gap-6">
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
              Side-by-side comparisons, pricing breakdowns, and unbiased shortlists - built for US small businesses.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="lg:justify-self-end lg:w-full lg:max-w-[280px]">
            <HomeSearchBar items={HERO_SEARCH_ITEMS} variant="hero" />
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3"
          variants={staggerContainer}
        >
          {HOME_CATEGORIES.map((cat) => (
            <motion.div key={cat.href} variants={fadeUp}>
              <HomeCategoryCard
                href={cat.href}
                quotesHref={cat.quotesHref}
                icon={cat.icon}
                shortTitle={cat.shortTitle}
                vendors={cat.vendors}
                title={cat.title}
                blurb={cat.blurb}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp}>
          <NewsletterSubscribeForm sourceSlug="homepage" variant="hero" />
        </motion.div>
      </motion.div>
    </header>
  )
}
