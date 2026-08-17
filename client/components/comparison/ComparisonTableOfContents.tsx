'use client'

import { useEffect, useState } from 'react'
import type { TocItem } from '@/types'
import { cn } from '@/lib/utils'

type ComparisonTableOfContentsProps = {
  items: TocItem[]
  pagePath: string
}

export function ComparisonTableOfContents({ items, pagePath }: ComparisonTableOfContentsProps) {
  const [activeAnchor, setActiveAnchor] = useState<string>('')

  useEffect(() => {
    if (!items.length) return

    const ids = items.map((item) => item.anchor)
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]?.target?.id) {
          setActiveAnchor(visible[0].target.id)
        }
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0, 0.1, 0.25, 0.5],
      }
    )

    for (const el of elements) observer.observe(el)

    return () => observer.disconnect()
  }, [items])

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '')
    if (!hash) return
    const el = document.getElementById(hash)
    if (el) {
      setActiveAnchor(hash)
      window.setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [items])

  if (!items.length) return null

  const basePath = pagePath.replace(/\/$/, '')

  return (
    <nav className="px-0 py-0" aria-label="Table of contents">
      <h3 className="font-serif text-[1.05rem] font-semibold text-cb-orange">Table of contents</h3>
      <ol className="mt-3 max-h-[min(420px,55vh)] space-y-1 overflow-y-auto pr-1 scroll-smooth">
        {items.map((item) => {
          const isActive = activeAnchor === item.anchor
          const href = `${basePath}#${item.anchor}`

          return (
            <li key={item.anchor}>
              <a
                href={href}
                onClick={() => setActiveAnchor(item.anchor)}
                className={cn(
                  'relative block rounded-lg py-2 pl-3 pr-2 text-[13px] leading-snug transition-colors sm:text-[14px]',
                  isActive
                    ? 'bg-cb-orange/[0.06] font-medium text-cb-orange before:absolute before:left-0 before:top-2.5 before:h-[calc(100%-1.25rem)] before:w-[3px] before:rounded-full before:bg-cb-orange'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-cb-orange'
                )}
              >
                {item.label}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
