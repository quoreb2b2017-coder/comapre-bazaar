'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ComparisonPageData } from '@/types'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { AuthorBar } from '@/components/ui/AuthorBar'
import { fadeUp, staggerContainer } from '@/lib/homeMotion'

type ComparisonPageHeroProps = {
  data: ComparisonPageData
  vendorCount: number
}

export function ComparisonPageHero({ data, vendorCount }: ComparisonPageHeroProps) {
  const reduceMotion = useReducedMotion()

  return (
    <header className="relative border-b border-gray-200 bg-white">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgba(245,130,32,0.05),transparent_55%)]"
        aria-hidden
      />
      <motion.div
        className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8"
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div variants={fadeUp}>
          <Breadcrumb items={data.breadcrumbs} className="mb-4 text-sm" />
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center rounded-full border border-cb-orange/20 bg-cb-orange/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cb-orange">
            Independent review
          </span>
          <span className="text-[12px] text-gray-500">Last verified {data.lastReviewed}</span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="mt-3 max-w-4xl font-serif text-[1.65rem] font-normal leading-[1.2] tracking-tight text-navy sm:text-[2rem] lg:text-[2.125rem]"
        >
          {data.h1}
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-3 max-w-3xl text-[15px] leading-[1.7] text-gray-600">
          {data.intro}
        </motion.p>

        <motion.dl
          variants={fadeUp}
          className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-100 pt-4 text-[13px]"
        >
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
              Vendors compared
            </dt>
            <dd className="mt-0.5 font-semibold tabular-nums text-navy">{vendorCount}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
              Scoring criteria
            </dt>
            <dd className="mt-0.5 font-semibold text-navy">12 factors</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
              Methodology
            </dt>
            <dd className="mt-0.5 font-semibold text-navy">Hands-on testing</dd>
          </div>
        </motion.dl>

        <motion.div variants={fadeUp}>
          <AuthorBar author={data.author} reviewer={data.reviewer} lastReviewed={data.lastReviewed} />
        </motion.div>
      </motion.div>
    </header>
  )
}
