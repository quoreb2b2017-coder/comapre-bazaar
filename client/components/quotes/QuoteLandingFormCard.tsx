'use client'

import { ShieldCheck, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { QuoteFormEmbeddedContext } from '@/components/quotes/QuotePopupUi'

export function QuoteLandingFormCard({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon?: LucideIcon
  children: ReactNode
}) {
  return (
    <QuoteFormEmbeddedContext.Provider value={true}>
      <div className="fc quote-landing-form-card">
        <div className="ql-form-head">
          <div className="ql-form-head-inner">
            {Icon ? (
              <span className="ql-form-head-icon" aria-hidden>
                <Icon strokeWidth={1.85} />
              </span>
            ) : null}
            <div className="ql-form-head-copy">
              <p className="ql-form-kicker">Free quotes · No obligation</p>
              <h2 className="ql-form-title">{title}</h2>
            </div>
          </div>
        </div>
        <div className="quote-landing-form-body">{children}</div>
        <div className="ql-form-foot">
          <ShieldCheck className="ql-form-foot-ico" aria-hidden />
          <span>Secure submission · Independent matching</span>
        </div>
      </div>
    </QuoteFormEmbeddedContext.Provider>
  )
}
