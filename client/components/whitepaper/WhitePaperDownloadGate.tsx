'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2, ArrowLeft, CheckCircle2, Download } from 'lucide-react'
import { cleanDisplayText } from '@/lib/cleanDisplayText'
import { whitePaperDisplayTitle } from '@/lib/whitePaperDisplay'
import { whitePaperBackendBase } from '@/lib/whitePaperCms'
import { isWorkEmail, WORK_EMAIL_ERROR } from '@/lib/workEmail'
import { WhitePaperHighlightFormFields } from '@/components/whitepaper/WhitePaperHighlightFormFields'
import { WhitePaperInsideSection } from '@/components/whitepaper/WhitePaperInsideSection'
import { WhitePaperTestimonials } from '@/components/whitepaper/WhitePaperTestimonials'

type PaperPreview = {
  slug: string
  title: string
  seoTitle?: string
  description?: string
  thumbnailUrl: string
  metadata?: { offeredBy?: string }
  highlightQuestions?: string[]
  insideOverview?: string
  insideSections?: { title: string; summary: string; pages?: string }[]
  insidePoints?: string[]
  testimonialsHeading?: string
  testimonials?: {
    quote: string
    name: string
    initials: string
    role: string
    company: string
  }[]
}

type Step = 'email' | 'profile' | 'done'

function buildDownloadUrl(base: string, pathOrUrl: string): string {
  const raw = String(pathOrUrl || '').trim()
  if (!raw) return ''
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
  const origin = base.replace(/\/$/, '')
  return `${origin}${raw.startsWith('/') ? raw : `/${raw}`}`
}

function triggerPdfDownload(url: string) {
  const iframe = document.createElement('iframe')
  iframe.setAttribute('title', 'PDF download')
  iframe.style.cssText = 'position:fixed;width:0;height:0;border:0;opacity:0;pointer-events:none'
  iframe.src = url
  document.body.appendChild(iframe)
  window.setTimeout(() => iframe.remove(), 120000)
}

export function WhitePaperDownloadGate({ paper }: { paper: PaperPreview }) {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [downloadUrl, setDownloadUrl] = useState('')

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    jobTitle: '',
    workPhone: '',
    companyStreet: '',
    companySuite: '',
    companyPostal: '',
    companyCity: '',
    companyState: '',
    companyCountry: '',
    marketingConsent: false,
  })
  const [customAnswers, setCustomAnswers] = useState<string[]>([])

  const headline = whitePaperDisplayTitle(paper.title, paper.seoTitle)
  const offeredBy = paper.metadata?.offeredBy || 'Compare Bazaar'
  const base = whitePaperBackendBase()
  const detailHref = `/resources/whitepaper/${paper.slug}`
  const formQuestions = (paper.highlightQuestions || []).map((q) => String(q || '').trim()).filter(Boolean)

  useEffect(() => {
    setCustomAnswers((prev) => formQuestions.map((_, i) => prev[i] || ''))
  }, [paper.slug, paper.highlightQuestions])

  useEffect(() => {
    fetch(`${base}/api/v1/blog-admin/public/whitepapers/${encodeURIComponent(paper.slug)}/view`, {
      method: 'POST',
    }).catch(() => {})
  }, [base, paper.slug])

  const onEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const trimmed = email.trim()
    if (!isWorkEmail(trimmed)) {
      setError(WORK_EMAIL_ERROR)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(
        `${base}/api/v1/blog-admin/public/whitepapers/${encodeURIComponent(paper.slug)}/download-email`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        }
      )
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Failed to save email')
      setStep('profile')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const onProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(
        `${base}/api/v1/blog-admin/public/whitepapers/${encodeURIComponent(paper.slug)}/download-complete`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            ...form,
            highlightAnswers: formQuestions.map((question, index) => ({
              question,
              answer: customAnswers[index] || '',
            })),
          }),
        }
      )
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Failed to complete download')

      const path = json.data?.downloadUrl
      if (!path) throw new Error('PDF not available')

      const fullUrl = buildDownloadUrl(base, path)
      setDownloadUrl(fullUrl)
      setStep('done')
      triggerPdfDownload(fullUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const setField = (key: keyof typeof form, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            href={detailHref}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-cb-orange"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to whitepaper
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-12 xl:grid-cols-[minmax(0,400px)_1fr]">
          {/* Resource info — plain, no card */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[280px] lg:max-w-none">
              <Image
                src={paper.thumbnailUrl}
                alt={headline}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 280px, 400px"
                priority
              />
            </div>
            <p className="mt-6 text-xs font-medium uppercase tracking-wider text-gray-500">Free whitepaper</p>
            <h1 className="mt-2 font-serif text-xl leading-snug text-navy lg:text-2xl">{headline}</h1>
            <p className="mt-3 text-sm text-gray-600">
              Offered by <span className="text-navy">{offeredBy}</span>
            </p>
            {paper.description ? (
              <p className="mt-3 hidden text-sm leading-relaxed text-gray-600 lg:block">
                {cleanDisplayText(paper.description)}
              </p>
            ) : null}

            <div className="mt-6">
              <WhitePaperInsideSection
                overview={paper.insideOverview || ''}
                sections={paper.insideSections}
                points={paper.insidePoints}
              />
            </div>

            <WhitePaperTestimonials
              heading={paper.testimonialsHeading}
              items={paper.testimonials}
              className="mt-5 lg:mt-6"
            />
          </div>

          {/* Form column */}
          <div className="min-w-0 border-t border-gray-200 pt-8 lg:border-t-0 lg:pt-0">
            {step === 'email' && (
              <section className="mt-6">
                <h2 className="text-lg font-semibold text-navy">Download this whitepaper</h2>
                <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-gray-600">
                  Enter your work email. We will use it only to deliver your PDF and related resources from{' '}
                  {offeredBy}.
                </p>

                <form onSubmit={onEmailSubmit} className="mt-5">
                  <div className="max-w-xs sm:max-w-sm">
                    <Field label="Work email" required htmlFor="wp-email">
                      <input
                        id="wp-email"
                        type="email"
                        required
                        autoComplete="work email"
                        placeholder="you@yourcompany.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                      />
                    </Field>
                    <p className="mt-1.5 text-xs text-gray-500">
                      Company email only. Not Gmail, Yahoo, Outlook, or other personal addresses.
                    </p>
                  </div>
                  {error ? <p className="mt-3 max-w-sm text-sm text-red-600">{error}</p> : null}
                  <div className="mt-5">
                    <button type="submit" disabled={loading} className={btnPrimary}>
                      {loading ? (
                        <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                      ) : (
                        <span className="inline-flex items-center justify-center gap-2">
                          <Download className="h-4 w-4" aria-hidden />
                          Download Now
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </section>
            )}

            {step === 'profile' && (
              <section className="mt-6">
                <h2 className="text-lg font-semibold text-navy">Download this whitepaper</h2>
                <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-gray-600">
                  A few more details to deliver your PDF from {offeredBy}.
                </p>

                <form onSubmit={onProfileSubmit} className="mt-5 max-w-3xl">
                  <div className="max-w-xs sm:max-w-sm">
                    <Field label="Work email" required htmlFor="wp-email-readonly">
                      <input
                        id="wp-email-readonly"
                        type="email"
                        readOnly
                        value={email}
                        className={`${inputClass} bg-gray-50 text-gray-600`}
                      />
                    </Field>
                  </div>
                  <fieldset className="mt-6 border-0 p-0">
                    <legend className="mb-3 text-sm font-semibold text-navy">Contact information</legend>
                    <div className={formRowGrid}>
                      <Field label="First name" required htmlFor="wp-first">
                        <input
                          id="wp-first"
                          required
                          autoComplete="given-name"
                          value={form.firstName}
                          onChange={(e) => setField('firstName', e.target.value)}
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Last name" required htmlFor="wp-last">
                        <input
                          id="wp-last"
                          required
                          autoComplete="family-name"
                          value={form.lastName}
                          onChange={(e) => setField('lastName', e.target.value)}
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Job title" required htmlFor="wp-job">
                        <input
                          id="wp-job"
                          required
                          autoComplete="organization-title"
                          value={form.jobTitle}
                          onChange={(e) => setField('jobTitle', e.target.value)}
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Work phone" required htmlFor="wp-phone">
                        <input
                          id="wp-phone"
                          required
                          type="tel"
                          autoComplete="tel"
                          value={form.workPhone}
                          onChange={(e) => setField('workPhone', e.target.value)}
                          className={inputClass}
                        />
                      </Field>
                    </div>
                  </fieldset>

                  <fieldset className="mt-8 border-0 border-t border-gray-200 p-0 pt-8">
                    <legend className="mb-3 text-sm font-semibold text-navy">Company address</legend>
                    <div className={formRowGrid}>
                      <Field label="Street address" required htmlFor="wp-street">
                        <input
                          id="wp-street"
                          required
                          autoComplete="street-address"
                          value={form.companyStreet}
                          onChange={(e) => setField('companyStreet', e.target.value)}
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Suite / office" htmlFor="wp-suite">
                        <input
                          id="wp-suite"
                          value={form.companySuite}
                          onChange={(e) => setField('companySuite', e.target.value)}
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Postal / ZIP code" required htmlFor="wp-postal">
                        <input
                          id="wp-postal"
                          required
                          autoComplete="postal-code"
                          value={form.companyPostal}
                          onChange={(e) => setField('companyPostal', e.target.value)}
                          className={inputClass}
                        />
                      </Field>
                      <Field label="City" required htmlFor="wp-city">
                        <input
                          id="wp-city"
                          required
                          autoComplete="address-level2"
                          value={form.companyCity}
                          onChange={(e) => setField('companyCity', e.target.value)}
                          className={inputClass}
                        />
                      </Field>
                      <Field label="State / province" htmlFor="wp-state">
                        <input
                          id="wp-state"
                          autoComplete="address-level1"
                          value={form.companyState}
                          onChange={(e) => setField('companyState', e.target.value)}
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Country" required htmlFor="wp-country">
                        <input
                          id="wp-country"
                          required
                          autoComplete="country-name"
                          value={form.companyCountry}
                          onChange={(e) => setField('companyCountry', e.target.value)}
                          className={inputClass}
                        />
                      </Field>
                    </div>
                  </fieldset>

                  <WhitePaperHighlightFormFields
                    questions={formQuestions}
                    values={customAnswers}
                    onChange={(index, value) =>
                      setCustomAnswers((prev) => {
                        const next = [...prev]
                        next[index] = value
                        return next
                      })
                    }
                    inputClass={inputClass}
                  />

                  <label className="mt-6 flex max-w-3xl items-start gap-2.5 text-sm leading-relaxed text-gray-600">
                    <input
                      type="checkbox"
                      checked={form.marketingConsent}
                      onChange={(e) => setField('marketingConsent', e.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0 accent-cb-orange"
                    />
                    <span>
                      I agree to receive relevant updates from {offeredBy}. You may unsubscribe at any time.
                    </span>
                  </label>

                  {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <button type="submit" disabled={loading} className={btnPrimary}>
                      {loading ? (
                        <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                      ) : (
                        <span className="inline-flex items-center justify-center gap-2">
                          <Download className="h-4 w-4" aria-hidden />
                          Download PDF
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </section>
            )}

            {step === 'done' && downloadUrl && (
              <section className="mt-8 max-w-md">
                <CheckCircle2 className="h-10 w-10 text-green-600" aria-hidden />
                <h2 className="mt-4 text-lg font-semibold text-navy">Download started</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Your PDF should save automatically. If it did not, use the button below.
                </p>
                <button
                  type="button"
                  onClick={() => triggerPdfDownload(downloadUrl)}
                  className={`mt-6 ${btnPrimary}`}
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" aria-hidden />
                    Download PDF again
                  </span>
                </button>
                <p className="mt-6 text-sm">
                  <Link href={detailHref} className="font-medium text-cb-orange hover:underline">
                    Return to whitepaper
                  </Link>
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

/** Two fields per row from 480px; tighter vertical rhythm */
const formRowGrid =
  'grid grid-cols-1 gap-x-5 gap-y-4 min-[480px]:grid-cols-2 min-[480px]:gap-x-6 min-[480px]:gap-y-5'

const inputClass =
  'block w-full min-w-0 border border-gray-300 bg-white px-3 py-2.5 text-sm text-navy outline-none placeholder:text-gray-400 focus:border-cb-orange focus:outline-none focus:ring-1 focus:ring-cb-orange'

const btnPrimary =
  'inline-flex min-w-[200px] items-center justify-center bg-cb-orange px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-cb-orange-hover disabled:cursor-not-allowed disabled:opacity-60'

function Field({
  label,
  required,
  htmlFor,
  className = '',
  children,
}: {
  label: string
  required?: boolean
  htmlFor?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </label>
      {children}
    </div>
  )
}
