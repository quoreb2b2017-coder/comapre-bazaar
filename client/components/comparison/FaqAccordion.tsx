'use client'

import { useState } from 'react'
import type { FaqItem } from '@/types'
import { cn } from '@/lib/utils'

interface FaqAccordionProps {
  items: FaqItem[]
}

function FaqItemComponent({ question, answer, index }: FaqItem & { index: number }) {
  const [open, setOpen] = useState(index === 0)

  return (
    <div className={cn('border-b border-gray-100 last:border-b-0', open && 'bg-[#FAFBFD]/60')}>
      <button
        type="button"
        className="flex w-full items-start gap-3 px-5 py-4 text-left transition-colors duration-200 hover:bg-[#FAFBFD] sm:px-6"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span
          className={cn(
            'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-serif text-xs tabular-nums',
            open ? 'bg-cb-orange text-white' : 'bg-gray-100 text-gray-400'
          )}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="min-w-0 flex-1 font-medium leading-snug text-navy">{question}</span>
        <span
          className={cn(
            'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200',
            open ? 'rotate-180 border-cb-orange/20 bg-cb-orange/10 text-cb-orange' : 'border-gray-200 text-gray-400'
          )}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {open ? (
        <p className="px-5 pb-5 pl-[3.75rem] text-sm leading-relaxed text-gray-600 sm:px-6 sm:pl-[4.75rem]">
          {answer}
        </p>
      ) : null}
    </div>
  )
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <div className="pb-1">
      {items.map((item, idx) => (
        <FaqItemComponent key={idx} {...item} index={idx} />
      ))}
    </div>
  )
}
