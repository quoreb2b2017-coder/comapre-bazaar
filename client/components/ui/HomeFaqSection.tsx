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
    <section aria-labelledby="faq-heading">
      <div className="mb-7 text-center">
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F58220]">Need clarity?</p>
        <h2 id="faq-heading" className="font-serif text-2xl tracking-tight text-navy sm:text-3xl">
          Frequently asked questions
        </h2>
      </div>
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12">
      <div className="relative overflow-hidden rounded-2xl bg-[#0B2A6F] p-6 text-white sm:p-7 lg:col-span-4">
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#F58220]/20"
          aria-hidden
        />
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F58220]">Editorial policy</p>
        <p className="mb-3 font-serif text-2xl leading-tight tracking-tight">
          Independent rankings. Clear disclosures.
        </p>
        <p className="text-sm leading-relaxed text-white/70">
          How we make money, how often reviews update, and why vendors cannot buy a ranking.
        </p>
        <div className="mt-6 border-t border-white/15 pt-5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-white/45">Editorial</p>
          <p className="mt-1 text-sm text-white/80">Questions about a review? Contact our editorial team.</p>
        </div>
      </div>

      <div className="space-y-2.5 lg:col-span-8">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx
          return (
            <article
              key={faq.q}
              className={`overflow-hidden rounded-2xl border bg-white transition-all ${
                isOpen ? 'border-[#F3C4A3] shadow-[0_8px_24px_-12px_rgba(11,42,111,0.12)]' : 'border-[#E8E4DF]'
              }`}
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-[#F7F4EF]"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
              >
                <span className="text-[15px] font-medium leading-snug text-navy">{faq.q}</span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    isOpen ? 'bg-[#F58220] text-white' : 'bg-[#F7F4EF] text-slate-500'
                  }`}
                  aria-hidden="true"
                >
                  {isOpen ? '–' : '+'}
                </span>
              </button>

              <div
                className={`border-t border-[#E8E4DF] px-5 text-sm leading-relaxed text-slate-600 transition-all duration-200 ${
                  isOpen ? 'max-h-[600px] pb-4 pt-3 opacity-100' : 'max-h-0 overflow-hidden border-t-0 pb-0 pt-0 opacity-0'
                }`}
              >
                <p>{faq.a}</p>
              </div>
            </article>
          )
        })}
      </div>
      </div>
    </section>
  )
}
