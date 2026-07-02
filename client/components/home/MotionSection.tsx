import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'section' | 'div'
}

export function MotionSection({ children, className, as = 'section' }: Props) {
  const Tag = as
  return <Tag className={className}>{children}</Tag>
}
