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
import { parseHighlightQuestions, type HighlightQuestion } from '@/lib/highlightQuestions'
import { WhitePaperInsideExplorer } from '@/components/whitepaper/WhitePaperInsideExplorer'

type PaperPreview = {
  slug: string
  title: string
  seoTitle?: string
  description?: string
  thumbnailUrl: string
  metadata?: { offeredBy?: string }
  highlightQuestions?: HighlightQuestion[]
  insideOverview?: string
  insideSections?: { title: string; summary: string; body?: string; pages?: string }[]
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
  const detailHref = `/resources/whitepapers/${paper.slug}`
  const formQuestions: HighlightQuestion[] = parseHighlightQuestions(paper.highlightQuestions)

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
            highlightAnswers: formQuestions.map((item, index) => ({
              question: item.question,
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
      <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6">
        <Link
          href="/resources/whitepapers"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-cb-orange"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Back to all whitepapers
        </Link>

        <div className="mt-3 grid lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:gap-x-10 xl:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-8 lg:row-span-1 lg:self-start">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[240px] overflow-hidden rounded-md bg-[#f4f6fb] p-2 lg:mx-0 lg:max-w-none">
              <Image
                src={paper.thumbnailUrl}
                alt={headline}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 280px, 400px"
                priority
              />
            </div>
            <p className="mt-3 text-xs font-medium uppercase tracking-wider text-gray-500">Free whitepaper</p>
            <h1 className="mt-1 font-serif text-lg leading-snug text-navy lg:text-xl">{headline}</h1>
            <p className="mt-1 text-sm text-gray-600">
              Offered by <span className="text-navy">{offeredBy}</span>
            </p>
            {paper.description ? (
              <p className="mt-3 hidden text-sm leading-relaxed text-gray-600 lg:block">
                {cleanDisplayText(paper.description)}
              </p>
            ) : null}
          </div>

          {/* Form column */}
          <div className="min-w-0 lg:pl-4 xl:pl-8">
            <div className={formPanelClass}>
            {step === 'email' && (
              <section>
                <FormHeader
                  title="Download this whitepaper"
                  description={`Enter your work email. We will use it only to deliver your PDF and related resources from ${offeredBy}.`}
                />

                <form onSubmit={onEmailSubmit} className="mt-3">
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
                    <p className="mt-1 text-[11px] leading-snug text-gray-500">
                      Company email only. Not Gmail, Yahoo, Outlook, or other personal addresses.
                    </p>
                  {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
                  <div className="mt-4">
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
              <section>
                <FormHeader
                  title="Download this whitepaper"
                  description={`A few more details to deliver your PDF from ${offeredBy}.`}
                />

                <form onSubmit={onProfileSubmit} className="mt-3">
                  <Field label="Work email" required htmlFor="wp-email-readonly">
                    <input
                      id="wp-email-readonly"
                      type="email"
                      readOnly
                      value={email}
                      className={`${inputClass} bg-gray-50 text-gray-600`}
                    />
                  </Field>

                  <fieldset className="mt-3 border-0 p-0">
                    <legend className={sectionLegendClass}>Contact information</legend>
                    <div className={formStack}>
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

                  <fieldset className="mt-3 border-0 p-0">
                    <legend className={sectionLegendClass}>Company address</legend>
                    <div className={formStack}>
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

                  <label className="mt-3 flex items-start gap-2.5 text-[13px] leading-snug text-gray-600">
                    <input
                      type="checkbox"
                      checked={form.marketingConsent}
                      onChange={(e) => setField('marketingConsent', e.target.checked)}
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-cb-orange"
                    />
                    <span>
                      I agree to receive relevant updates from {offeredBy}. You may unsubscribe at any time.
                    </span>
                  </label>

                  {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

                  <div className="mt-3">
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
              <section>
                <CheckCircle2 className="h-9 w-9 text-green-600" aria-hidden />
                <h2 className="mt-3 text-base font-semibold text-navy">Download started</h2>
                <p className="mt-1.5 text-[13px] leading-snug text-gray-600">
                  Your PDF should save automatically. If it did not, use the button below.
                </p>
                <button
                  type="button"
                  onClick={() => triggerPdfDownload(downloadUrl)}
                  className={`mt-4 ${btnPrimary}`}
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" aria-hidden />
                    Download PDF again
                  </span>
                </button>
                <p className="mt-4 text-sm">
                  <Link href={detailHref} className="font-medium text-cb-orange hover:underline">
                    Return to whitepaper
                  </Link>
                </p>
              </section>
            )}
            </div>

            <WhitePaperInsideExplorer
              slug={paper.slug}
              overview={paper.insideOverview || paper.description || ''}
              sections={paper.insideSections}
              points={paper.insidePoints}
              compact
              className="mt-4"
            />
          </div>
        </div>
      </div>
    </main>
  )
}

/** One field per row */
const formStack = 'flex flex-col gap-1.5'

const formPanelClass = 'max-w-md lg:max-w-lg'

const sectionLegendClass = 'mb-1 block text-[13px] font-semibold text-navy'

const inputClass =
  'block h-8 w-full min-w-0 rounded-md border border-gray-200 bg-white px-2.5 text-[13px] leading-none text-navy transition-colors outline-none placeholder:text-gray-400 focus:border-cb-orange focus:outline-none focus:ring-0'

const btnPrimary =
  'inline-flex min-w-[180px] items-center justify-center rounded-md bg-cb-orange px-6 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-cb-orange-hover disabled:cursor-not-allowed disabled:opacity-60'

function FormHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cb-orange">Free download</p>
      <h2 className="mt-1 text-base font-semibold text-navy">{title}</h2>
      <p className="mt-1 text-[13px] leading-snug text-gray-600">{description}</p>
    </div>
  )
}

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
      <label htmlFor={htmlFor} className="mb-0.5 block text-xs font-medium text-gray-600">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </label>
      {children}
    </div>
  )
}
