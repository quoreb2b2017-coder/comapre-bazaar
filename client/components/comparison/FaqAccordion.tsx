'use client'

import { useState } from 'react'
import type { FaqItem } from '@/types'

interface FaqAccordionProps {
  items: FaqItem[]
}

function FaqItemComponent({ question, answer, index }: FaqItem & { index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        type="button"
        className="flex w-full items-start gap-3 px-5 py-3.5 text-left transition-colors duration-200 hover:bg-[#FAFBFD] sm:px-6"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="mt-0.5 w-6 shrink-0 font-serif text-sm tabular-nums text-gray-300">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="min-w-0 flex-1 font-medium leading-snug text-navy">{question}</span>
        <svg
          className={`mt-0.5 h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open ? (
        <div>
          <p className="px-5 pb-4 pl-[3.25rem] text-sm leading-relaxed text-gray-600 sm:px-6 sm:pl-[4.5rem]">
            {answer}
          </p>
        </div>
      ) : null}
    </div>
  )
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <div>
      {items.map((item, idx) => (
        <FaqItemComponent key={idx} {...item} index={idx} />
      ))}
    </div>
  )
}
