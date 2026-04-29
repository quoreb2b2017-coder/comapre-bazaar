'use client'

import { useState } from 'react'

interface HomeFaq {
  q: string
  a: string
}

interface HomeFaqSectionProps {
  faqs: HomeFaq[]
}

export function HomeFaqSection({ faqs }: HomeFaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section aria-labelledby="faq-heading" className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-stretch">
      <div className="lg:col-span-4 bg-gradient-to-br from-[#F78A2D] via-[#F27F25] to-[#E9720A] rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white shadow-[0_10px_28px_rgba(242,127,37,0.22)] flex flex-col">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85 mb-3">Need clarity?</p>
        <h2 id="faq-heading" className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-[1.02] mb-3">
          Frequently asked questions
        </h2>
        <p className="text-white/90 text-sm sm:text-[15px] leading-relaxed">
          Quick answers about pricing transparency, editorial policy, and how Compare Bazaar reviews software.
        </p>
        <div className="mt-5 sm:mt-auto pt-5 sm:pt-7 border-t border-white/30">
          <p className="text-[10px] uppercase tracking-[0.12em] text-white/80">Support</p>
          <p className="text-xs sm:text-sm mt-1.5 text-white">Need help? Contact our editorial team.</p>
        </div>
      </div>

      <div className="lg:col-span-8 space-y-2.5 sm:space-y-3.5" itemScope itemType="https://schema.org/FAQPage">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx
          return (
            <article
              key={faq.q}
              className={`border bg-white rounded-xl sm:rounded-2xl overflow-hidden transition-all ${
                isOpen ? 'border-[#F3C4A3] shadow-[0_10px_30px_rgba(0,0,0,0.06)]' : 'border-gray-200'
              }`}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <button
                type="button"
                className="w-full px-4 sm:px-6 py-3.5 sm:py-4.5 text-left flex items-center justify-between gap-3 sm:gap-4 hover:bg-[#fffaf6] transition-colors"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
              >
                <span itemProp="name" className="font-medium text-navy text-[15px] sm:text-[17px] leading-snug">
                  {faq.q}
                </span>
                <span
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center text-sm sm:text-base font-semibold transition-colors ${
                    isOpen ? 'border-[#F27F25] bg-[#FFF1E6] text-[#F27F25]' : 'border-gray-300 text-gray-500'
                  }`}
                  aria-hidden="true"
                >
                  {isOpen ? '-' : '+'}
                </span>
              </button>

              {isOpen && (
                <div
                  className="px-4 sm:px-6 pb-4 sm:pb-5 text-sm sm:text-[15px] text-gray-600 leading-relaxed border-t border-gray-100"
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <p itemProp="text">{faq.a}</p>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
