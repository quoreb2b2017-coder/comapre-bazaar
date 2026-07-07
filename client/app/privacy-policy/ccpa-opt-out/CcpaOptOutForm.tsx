'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import { CheckCircle2, Loader2, ShieldCheck } from 'lucide-react'

type FormState = {
  firstName: string
  lastName: string
  email: string
  areaCode: string
  phoneNumber: string
  companyName: string
  doNotSell: boolean
}

const emptyForm = (): FormState => ({
  firstName: '',
  lastName: '',
  email: '',
  areaCode: '',
  phoneNumber: '',
  companyName: '',
  doNotSell: false,
})

const fieldClass =
  'ccpa-field w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-[#C5D4EE] focus:border-navy focus:ring-2 focus:ring-navy/10'
const fieldErrClass = 'border-red-400 bg-red-50/60 focus:border-red-500 focus:ring-red-500/10'
const labelClass = 'ccpa-label'
const hintClass = 'ccpa-hint'
const errClass = 'ccpa-err'

function FieldGroup({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor?: string
  children: ReactNode
}) {
  return (
    <div className="ccpa-field-group">
      {htmlFor ? (
        <label htmlFor={htmlFor} className={labelClass}>
          {label}<span className="text-red-500 ml-0.5 normal-case">*</span>
        </label>
      ) : (
        <p className={labelClass}>
          {label}<span className="text-red-500 ml-0.5 normal-case">*</span>
        </p>
      )}
      {children}
    </div>
  )
}

export function CcpaOptOutForm() {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.firstName.trim()) next.firstName = 'Required.'
    if (!form.lastName.trim()) next.lastName = 'Required.'
    if (!form.email.trim()) next.email = 'Required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Invalid email.'
    if (!form.areaCode.trim()) next.areaCode = 'Required.'
    if (!form.phoneNumber.trim()) next.phoneNumber = 'Required.'
    if (!form.companyName.trim()) next.companyName = 'Required.'
    if (!form.doNotSell) next.doNotSell = 'Please confirm.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError('')
    if (!validate()) return

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
    if (!accessKey) {
      setSubmitError('Form submission is not configured. Please email privacy@compare-bazaar.com.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          subject: 'California – Do Not Sell My Info Request',
          from_name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email.trim(),
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          phone: `(${form.areaCode.trim()}) ${form.phoneNumber.trim()}`,
          company_name: form.companyName.trim(),
          do_not_sell_confirmed: 'Yes',
          form_source: 'Privacy Policy > CCPA Opt-Out',
        }),
      })

      const result = await response.json()
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Submission failed')
      }

      setIsSubmitted(true)
      setForm(emptyForm())
      setErrors({})
    } catch (error) {
      console.error('CCPA opt-out submit failed:', error)
      setSubmitError('Could not submit right now. Please try again or email privacy@compare-bazaar.com.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="ccpa-success">
        <div className="relative mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-green-200 bg-green-50">
          <CheckCircle2 className="h-6 w-6 text-green-600" aria-hidden />
        </div>
        <h3 className="font-serif text-xl text-navy mb-1.5">Request received</h3>
        <p className="text-sm text-gray-600 leading-snug">
          We will process your California privacy request within 15 business days.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="ccpa-form">
      <div className="ccpa-form-header">
        <div className="ccpa-form-header-icon" aria-hidden>
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <div className="ccpa-form-header-text">
          <p className="ccpa-form-header-title">CCPA / CPRA Request</p>
          <p className="ccpa-form-header-sub">Opt out of sale or sharing of personal information.</p>
        </div>
      </div>

      <div className="ccpa-form-body">
        <div className="ccpa-rows">
          <FieldGroup label="Name">
            <div className="ccpa-pair">
              <div>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setField('firstName', e.target.value)}
                  placeholder="First Name"
                  className={`${fieldClass} ${errors.firstName ? fieldErrClass : ''}`}
                  autoComplete="given-name"
                />
                <p className={hintClass}>First Name</p>
                {errors.firstName ? <p className={errClass}>{errors.firstName}</p> : null}
              </div>
              <div>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setField('lastName', e.target.value)}
                  placeholder="Last Name"
                  className={`${fieldClass} ${errors.lastName ? fieldErrClass : ''}`}
                  autoComplete="family-name"
                />
                <p className={hintClass}>Last Name</p>
                {errors.lastName ? <p className={errClass}>{errors.lastName}</p> : null}
              </div>
            </div>
          </FieldGroup>

          <FieldGroup label="Phone Number">
            <div className="ccpa-pair ccpa-pair--phone">
              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.areaCode}
                  onChange={(e) => setField('areaCode', e.target.value.replace(/\D/g, '').slice(0, 3))}
                  className={`${fieldClass} ${errors.areaCode ? fieldErrClass : ''}`}
                  autoComplete="tel-area-code"
                  placeholder="Area Code"
                />
                <p className={hintClass}>Area Code</p>
                {errors.areaCode ? <p className={errClass}>{errors.areaCode}</p> : null}
              </div>
              <div>
                <input
                  type="text"
                  inputMode="tel"
                  value={form.phoneNumber}
                  onChange={(e) => setField('phoneNumber', e.target.value)}
                  className={`${fieldClass} ${errors.phoneNumber ? fieldErrClass : ''}`}
                  autoComplete="tel-national"
                  placeholder="Phone Number"
                />
                <p className={hintClass}>Phone Number</p>
                {errors.phoneNumber ? <p className={errClass}>{errors.phoneNumber}</p> : null}
              </div>
            </div>
          </FieldGroup>

          <div className="ccpa-pair-row">
            <FieldGroup label="E-mail" htmlFor="ccpa-email">
              <input
                id="ccpa-email"
                type="email"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                placeholder="ex: myname@example.com"
                className={`${fieldClass} ${errors.email ? fieldErrClass : ''}`}
                autoComplete="email"
              />
              {errors.email ? <p className={errClass}>{errors.email}</p> : null}
            </FieldGroup>

            <FieldGroup label="Company Name" htmlFor="ccpa-company">
              <input
                id="ccpa-company"
                type="text"
                value={form.companyName}
                onChange={(e) => setField('companyName', e.target.value)}
                placeholder="Company Name"
                className={`${fieldClass} ${errors.companyName ? fieldErrClass : ''}`}
                autoComplete="organization"
              />
              {errors.companyName ? <p className={errClass}>{errors.companyName}</p> : null}
            </FieldGroup>
          </div>
        </div>

        <label
          className={`ccpa-checkbox-inline ${
            errors.doNotSell ? 'ccpa-checkbox-inline--error' : form.doNotSell ? 'ccpa-checkbox-inline--checked' : ''
          }`}
        >
          <input
            type="checkbox"
            checked={form.doNotSell}
            onChange={(e) => setField('doNotSell', e.target.checked)}
            className="ccpa-checkbox"
          />
          <span>
            <span className="text-red-500">*</span> Please do not sell my personal information
          </span>
        </label>
        {errors.doNotSell ? <p className={errClass}>{errors.doNotSell}</p> : null}

        {submitError ? <p className="ccpa-form-error">{submitError}</p> : null}

        <div className="ccpa-submit-wrap">
          <button type="submit" disabled={isSubmitting} className="ccpa-submit">
            <span className="ccpa-submit-inner">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Submitting…
                </>
              ) : (
                'Submit'
              )}
            </span>
          </button>
        </div>
      </div>
    </form>
  )
}
