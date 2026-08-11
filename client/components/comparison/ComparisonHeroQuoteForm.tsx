'use client'

import { QuoteLandingFormCard } from '@/components/quotes/QuoteLandingFormCard'
import { quoteLandingPageCss } from '@/lib/quoteLandingPageCss'
import { QUOTE_LANDING_FORMS, type QuoteLandingFormKey } from '@/lib/quoteLandingFormRegistry'

type ComparisonHeroQuoteFormProps = {
  formKey: QuoteLandingFormKey
  ctaTitle?: string
}

export function ComparisonHeroQuoteForm({ formKey, ctaTitle }: ComparisonHeroQuoteFormProps) {
  const config = QUOTE_LANDING_FORMS[formKey]
  const { title, icon, Form } = config
  const heading = ctaTitle?.trim() || title

  return (
    <div
      id="get_free_quotes"
      className="quote-landing-page comparison-hero-quote scroll-mt-24 w-full lg:max-w-[420px] lg:justify-self-end"
    >
      <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: quoteLandingPageCss }} />
      <div className="quote-hero-form-col">
        <QuoteLandingFormCard title={heading} icon={icon}>
          <Form />
        </QuoteLandingFormCard>
      </div>
    </div>
  )
}
