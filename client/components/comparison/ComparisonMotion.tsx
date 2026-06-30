'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { easeOut, fadeUp, staggerContainer } from '@/lib/homeMotion'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'article'
  id?: string
  'aria-labelledby'?: string
}

export function ComparisonReveal({
  children,
  className,
  delay = 0,
  as = 'div',
  id,
  'aria-labelledby': ariaLabelledby,
}: RevealProps) {
  const reduceMotion = useReducedMotion()
  const Tag = motion[as]

  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledby}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: easeOut }}
      className={className}
    >
      {children}
    </Tag>
  )
}

type StaggerProps = {
  children: ReactNode
  className?: string
}

export function ComparisonStagger({ children, className }: StaggerProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={{ once: true, margin: '-32px' }}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function ComparisonStaggerItem({ children, className }: StaggerProps) {
  return (
    <motion.div variants={fadeUp} className={className}>
      {children}
    </motion.div>
  )
}

export function ComparisonSidebarReveal({ children, className }: StaggerProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, x: 14 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-24px' }}
      transition={{ duration: 0.48, delay: 0.08, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export const comparisonPhaseMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.32, ease: easeOut },
} as const
