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
        className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-[#FAFBFD] sm:px-6"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="mt-0.5 w-6 shrink-0 font-serif text-sm tabular-nums text-gray-300">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="min-w-0 flex-1 font-medium leading-snug text-navy">{question}</span>
        <svg
          className={`mt-0.5 h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`overflow-hidden pl-[3.25rem] pr-5 text-sm leading-relaxed text-gray-600 transition-all duration-200 sm:pl-[4.5rem] sm:pr-6 ${
          open ? 'max-h-[600px] pb-5 opacity-100' : 'max-h-0 opacity-0 pb-0'
        }`}
      >
        <p>{answer}</p>
      </div>
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
