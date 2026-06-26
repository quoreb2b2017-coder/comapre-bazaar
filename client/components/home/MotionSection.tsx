'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { easeOut } from '@/lib/homeMotion'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'section' | 'div'
}

export function MotionSection({ children, className, delay = 0, as = 'section' }: Props) {
  const reduceMotion = useReducedMotion()
  const Tag = motion[as]

  return (
    <Tag
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-48px' }}
      transition={{ duration: 0.55, delay, ease: easeOut }}
      className={className}
    >
      {children}
    </Tag>
  )
}
