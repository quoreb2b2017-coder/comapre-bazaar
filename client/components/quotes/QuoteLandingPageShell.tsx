'use client'

import type { ReactNode } from 'react'
import { quoteLandingPageCss } from '@/lib/quoteLandingPageCss'

export function QuoteLandingPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="quote-landing-page">
      <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: quoteLandingPageCss }} />
      {children}
    </div>
  )
}
