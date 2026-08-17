'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import type { HomeCategory } from '@/data/homeCategories'

const ROTATE_MS = 2800
const MAGNIFIER_HEIGHT = 104
// Lens center within hero-magnifier.png (298×330) — upper-right of the asset
const LENS_CENTER_X_RATIO = 0.71
const LENS_CENTER_Y_RATIO = 0.27

const EXCLUDED_SHORT_TITLES = new Set([
  'Sales CRM',
  'Call Center',
  'Project Management',
  'Website Building',
])

const COMPACT_LABELS: Record<string, string> = {
  'VoIP & UCaaS': 'VoIP',
  'HR Software': 'HR',
  'Employee Management': 'Employee',
  'Fleet Software': 'Fleet',
  'Email Marketing': 'Email',
}

function pickRandomIndex(current: number, total: number) {
  if (total <= 1) return 0
  let next = current
  while (next === current) {
    next = Math.floor(Math.random() * total)
  }
  return next
}

function TagButton({
  label,
  selected,
  labelRef,
  onSelect,
}: {
  label: string
  selected: boolean
  labelRef: (el: HTMLSpanElement | null) => void
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="relative flex w-full items-center justify-center py-1.5"
    >
      <span
        ref={labelRef}
        className={[
          'inline-block origin-center transition-all duration-300 ease-out',
          selected
            ? 'z-20 scale-110 text-[15px] font-bold text-[#F58220] sm:text-base'
            : 'z-0 scale-100 text-[13px] font-semibold text-navy/80 sm:text-[14px]',
        ].join(' ')}
      >
        {label}
      </span>
    </button>
  )
}

export function HomeHeroMagnifierVisual({ categories }: { categories: HomeCategory[] }) {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([])

  const searchCategories = useMemo(
    () => categories.filter((category) => !EXCLUDED_SHORT_TITLES.has(category.shortTitle)),
    [categories]
  )

  const [activeIndex, setActiveIndex] = useState(0)
  const [lensPoint, setLensPoint] = useState({ x: 0, y: 0 })
  const [ready, setReady] = useState(false)

  const count = searchCategories.length
  const magnifierWidth = Math.round(MAGNIFIER_HEIGHT * (298 / 330))

  const measureLens = useCallback(() => {
    const stage = stageRef.current
    const label = labelRefs.current[activeIndex]
    if (!stage || !label) return

    const sRect = stage.getBoundingClientRect()
    const tRect = label.getBoundingClientRect()

    setLensPoint({
      x: tRect.left - sRect.left + tRect.width / 2,
      y: tRect.top - sRect.top + tRect.height / 2,
    })
  }, [activeIndex])

  useLayoutEffect(() => {
    measureLens()
    setReady(true)

    const stage = stageRef.current
    if (!stage) return

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(measureLens)
    })
    observer.observe(stage)
    window.addEventListener('resize', measureLens)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measureLens)
    }
  }, [measureLens])

  useLayoutEffect(() => {
    measureLens()
    const raf = requestAnimationFrame(measureLens)
    const afterScale = window.setTimeout(measureLens, 320)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(afterScale)
    }
  }, [activeIndex, measureLens])

  useEffect(() => {
    if (activeIndex >= count) {
      setActiveIndex(0)
    }
  }, [activeIndex, count])

  useEffect(() => {
    if (count > 1) {
      setActiveIndex(Math.floor(Math.random() * count))
    }
  }, [count])

  useEffect(() => {
    if (reduceMotion || count < 2) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => pickRandomIndex(current, count))
    }, ROTATE_MS)

    return () => window.clearInterval(timer)
  }, [count, reduceMotion])

  const selectTag = useCallback(
    (index: number, href: string) => {
      setActiveIndex(index)
      router.push(href)
    },
    [router]
  )

  if (!searchCategories.length) return null

  const magnifierX = lensPoint.x - magnifierWidth * LENS_CENTER_X_RATIO
  const magnifierY = lensPoint.y - MAGNIFIER_HEIGHT * LENS_CENTER_Y_RATIO
  const lensOriginX = `${LENS_CENTER_X_RATIO * 100}%`
  const lensOriginY = `${LENS_CENTER_Y_RATIO * 100}%`

  return (
    <div className="bg-white px-4 pb-8 pt-4 sm:px-5">
      <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F58220]">
        Search software
      </p>
      <p className="mb-3 text-[13px] text-slate-600">Tap a category — the lens follows the shortlist.</p>

      <div ref={stageRef} className="relative">
        <motion.div
          initial={false}
          animate={{
            x: magnifierX,
            y: magnifierY,
            rotate: 5,
            scale: 1.02,
            opacity: ready ? 1 : 0,
          }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: 'spring', stiffness: 120, damping: 18 }
          }
          style={{ transformOrigin: `${lensOriginX} ${lensOriginY}` }}
            className="pointer-events-none absolute left-0 top-0 z-30 overflow-hidden"
            aria-hidden="true"
          >
            <Image
              src="/images/hero-magnifier.png"
              alt=""
              width={298}
              height={330}
              style={{ height: MAGNIFIER_HEIGHT, width: 'auto' }}
              className="block [mask-image:linear-gradient(to_bottom,black_54%,transparent_92%)] [-webkit-mask-image:linear-gradient(to_bottom,black_54%,transparent_92%)]"
              priority
            />
          </motion.div>

        <div className="relative z-20 grid grid-cols-3 gap-x-2 gap-y-2 pb-6 pt-6">
          {searchCategories.map((category, index) => {
            const label = COMPACT_LABELS[category.shortTitle] || category.shortTitle
            return (
              <TagButton
                key={category.href}
                label={label}
                selected={index === activeIndex}
                labelRef={(el) => {
                  labelRefs.current[index] = el
                }}
                onSelect={() => selectTag(index, category.href)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
