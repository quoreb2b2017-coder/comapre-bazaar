'use client'

import { useState } from 'react'
import type { FaqItem } from '@/types'

interface FaqAccordionProps {
  items: FaqItem[]
}

function FaqItemComponent({ question, answer }: FaqItem) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="border border-gray-200 rounded-xl overflow-hidden"
      itemScope
      itemProp="mainEntity"
      itemType="https://schema.org/Question"
    >
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors font-medium text-navy text-[15px]"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span itemProp="name">{question}</span>
        <svg
          className={`w-5 h-5 flex-shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="px-5 pb-5 text-sm text-gray-600 leading-relaxed"
          itemScope
          itemProp="acceptedAnswer"
          itemType="https://schema.org/Answer"
        >
          <p itemProp="text">{answer}</p>
        </div>
      )}
    </div>
  )
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <div
      className="space-y-3"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      {items.map((item, idx) => (
        <FaqItemComponent key={idx} {...item} />
      ))}
    </div>
  )
}
