import type { ReactNode } from 'react'

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
  as = 'div',
  id,
  'aria-labelledby': ariaLabelledby,
}: RevealProps) {
  const Tag = as
  return (
    <Tag id={id} aria-labelledby={ariaLabelledby} className={className}>
      {children}
    </Tag>
  )
}

type StaggerProps = {
  children: ReactNode
  className?: string
}

export function ComparisonStagger({ children, className }: StaggerProps) {
  return <div className={className}>{children}</div>
}

export function ComparisonStaggerItem({ children, className }: StaggerProps) {
  return <div className={className}>{children}</div>
}

export function ComparisonSidebarReveal({ children, className }: StaggerProps) {
  return <div className={className}>{children}</div>
}
