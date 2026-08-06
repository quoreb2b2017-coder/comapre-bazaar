'use client'

import { QuoteLandingFormCard } from '@/components/quotes/QuoteLandingFormCard'
import { QUOTE_LANDING_FORMS, type QuoteLandingFormKey } from '@/lib/quoteLandingFormRegistry'

export function QuoteLandingHeroForm({ formKey }: { formKey: QuoteLandingFormKey }) {
  const { title, icon, Form } = QUOTE_LANDING_FORMS[formKey]

  return (
    <div id="quote-form" className="quote-hero-form-col">
      <QuoteLandingFormCard title={title} icon={icon}>
        <Form />
      </QuoteLandingFormCard>
    </div>
  )
}
