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
import {
  WhitePaperConsentBlock,
  WhitePaperConsentFooter,
  resolveDownloadConsent,
  type DownloadConsentCopy,
} from '@/components/whitepaper/WhitePaperConsentBlock'
import { parseHighlightQuestions, type HighlightQuestion } from '@/lib/highlightQuestions'
import { WhitePaperInsideExplorer } from '@/components/whitepaper/WhitePaperInsideExplorer'
import { WhitePaperShareBar } from '@/components/whitepaper/WhitePaperShareBar'
import {
  whitePaperBackToLibraryLabel,
  whitePaperFreeBadgeLabel,
  whitePaperReturnToItemLabel,
  normalizeWhitePaperResourceType,
  type WhitePaperResourceType,
} from '@/lib/whitePaperTaxonomy'

type DownloadField = {
  label: string
  key: string
  inputType?: 'text' | 'tel' | 'email'
  required?: boolean
}

const DEFAULT_DOWNLOAD_FIELDS: DownloadField[] = [
  { label: 'Zip/Postal Code', key: 'companyPostal', inputType: 'text', required: true },
  { label: 'Phone', key: 'workPhone', inputType: 'tel', required: true },
]

type PaperPreview = {
  slug: string
  title: string
  seoTitle?: string
  description?: string
  thumbnailUrl: string
  metadata?: { offeredBy?: string; resourceType?: string }
  highlightQuestions?: HighlightQuestion[]
  downloadFormFields?: DownloadField[]
  downloadConsent?: DownloadConsentCopy
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

export function WhitePaperDownloadGate({
  paper,
  embedded = false,
}: {
  paper: PaperPreview
  /** Show only the gray form (used on the whitepaper page itself). */
  embedded?: boolean
}) {
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
  })
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [partnersAccepted, setPartnersAccepted] = useState(false)
  const [optOutCommunication, setOptOutCommunication] = useState(false)
  const [extraAccepted, setExtraAccepted] = useState<boolean[]>([])
  const [customAnswers, setCustomAnswers] = useState<string[]>([])

  const headline = whitePaperDisplayTitle(paper.title, paper.seoTitle)
  const offeredBy = paper.metadata?.offeredBy || 'Compare Bazaar'
  const resourceType: WhitePaperResourceType = normalizeWhitePaperResourceType(paper.metadata?.resourceType)
  const base = whitePaperBackendBase()
  const detailHref = `/resources/whitepapers/${paper.slug}`
  const formQuestions: HighlightQuestion[] = parseHighlightQuestions(paper.highlightQuestions)
  const downloadFields: DownloadField[] =
    Array.isArray(paper.downloadFormFields) && paper.downloadFormFields.length
      ? paper.downloadFormFields
      : DEFAULT_DOWNLOAD_FIELDS
  const consent = resolveDownloadConsent(paper.downloadConsent)

  useEffect(() => {
    setCustomAnswers((prev) => formQuestions.map((_, i) => prev[i] || ''))
  }, [paper.slug, paper.highlightQuestions])

  useEffect(() => {
    setExtraAccepted((consent.extra || []).map(() => false))
  }, [paper.slug, paper.downloadConsent])

  useEffect(() => {
    fetch(`${base}/api/v1/blog-admin/public/whitepapers/${encodeURIComponent(paper.slug)}/view`, {
      method: 'POST',
    }).catch(() => {})
  }, [base, paper.slug])

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if ((consent.showTerms && !termsAccepted) || (consent.showPartners && !partnersAccepted)) {
      setError('Please accept the required agreements to continue.')
      return
    }
    const missingExtra = (consent.extra || []).findIndex(
      (item, index) => item.required !== false && !extraAccepted[index]
    )
    if (missingExtra >= 0) {
      setError('Please accept the required agreements to continue.')
      return
    }
    const trimmed = email.trim()
    if (!isWorkEmail(trimmed)) {
      setError(WORK_EMAIL_ERROR)
      return
    }
    for (const field of downloadFields) {
      if (field.required && !String(form[field.key as keyof typeof form] || '').trim()) {
        setError(`${field.label} is required`)
        return
      }
    }
    for (let i = 0; i < formQuestions.length; i += 1) {
      if (!String(customAnswers[i] || '').trim()) {
        setError(`Please answer: ${formQuestions[i].question}`)
        return
      }
    }
    setLoading(true)
    try {
      const emailRes = await fetch(
        `${base}/api/v1/blog-admin/public/whitepapers/${encodeURIComponent(paper.slug)}/download-email`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmed }),
        }
      )
      const emailJson = await emailRes.json()
      if (!emailRes.ok) throw new Error(emailJson.message || 'Failed to save email')

      const res = await fetch(
        `${base}/api/v1/blog-admin/public/whitepapers/${encodeURIComponent(paper.slug)}/download-complete`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: trimmed,
            ...form,
            marketingConsent: (consent.showPartners ? partnersAccepted : true) && !optOutCommunication,
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
      if (optOutCommunication && typeof window !== 'undefined') {
        try {
          window.localStorage.removeItem('cb_subscribed_email')
        } catch {
          // ignore
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const setField = (key: keyof typeof form, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const idPrefix = embedded ? 'wp-embed' : 'wp'

  const formCard = (
            <div className={formPanelClass}>
            {step !== 'done' && (
              <section>
                <form onSubmit={onFormSubmit}>
                  <div className={formStack}>
                    <Field label="Work email" required htmlFor={`${idPrefix}-email`}>
                      <input
                        id={`${idPrefix}-email`}
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@yourcompany.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                      />
                    </Field>
                    <p className="-mt-1 text-[11px] leading-snug text-gray-500">{consent.emailNote}</p>
                    {downloadFields.map((field) => (
                      <Field key={field.key} label={field.label} required={field.required} htmlFor={`${idPrefix}-${field.key}`}>
                        <input
                          id={`${idPrefix}-${field.key}`}
                          required={field.required !== false}
                          type={field.inputType === 'tel' ? 'tel' : field.inputType === 'email' ? 'email' : 'text'}
                          value={form[field.key as keyof typeof form] || ''}
                          onChange={(e) => setField(field.key as keyof typeof form, e.target.value)}
                          className={inputClass}
                        />
                      </Field>
                    ))}
                  </div>

                  <WhitePaperHighlightFormFields
                    idPrefix={idPrefix}
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

                  <WhitePaperConsentBlock
                    idPrefix={idPrefix}
                    className="mt-4"
                    copy={consent}
                    termsAccepted={termsAccepted}
                    partnersAccepted={partnersAccepted}
                    optOutCommunication={optOutCommunication}
                    onTermsChange={setTermsAccepted}
                    onPartnersChange={setPartnersAccepted}
                    onOptOutChange={setOptOutCommunication}
                    extraAccepted={extraAccepted}
                    onExtraChange={(index, checked) =>
                      setExtraAccepted((prev) => {
                        const next = [...prev]
                        next[index] = checked
                        return next
                      })
                    }
                  />

                  {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

                  <div className="mt-5 flex flex-col items-center">
                    <button
                      type="submit"
                      disabled={
                        loading ||
                        (consent.showTerms && !termsAccepted) ||
                        (consent.showPartners && !partnersAccepted) ||
                        (consent.extra || []).some((item, index) => item.required !== false && !extraAccepted[index])
                      }
                      className={btnPrimary}
                    >
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Download Now'}
                    </button>
                    <WhitePaperConsentFooter text={consent.footerText} />
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
                {!embedded ? (
                  <p className="mt-4 text-sm">
                    <Link href={detailHref} className="font-medium text-cb-orange hover:underline">
                      {whitePaperReturnToItemLabel(resourceType)}
                    </Link>
                  </p>
                ) : null}
              </section>
            )}
            </div>
  )

  if (embedded) {
    return <div className="w-full max-w-[420px]">{formCard}</div>
  }

  return (
    <main className="min-h-screen bg-white pb-24">
      <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6">
        <Link
          href="/resources/whitepapers"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-cb-orange"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          {whitePaperBackToLibraryLabel()}
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
            <p className="mt-3 text-xs font-medium uppercase tracking-wider text-gray-500">
              {whitePaperFreeBadgeLabel(resourceType)}
            </p>
            <h1 className="mt-1 font-serif text-lg leading-snug text-navy lg:text-xl">{headline}</h1>
            <p className="mt-1 text-sm text-gray-600">
              Offered by <span className="text-navy">{offeredBy}</span>
            </p>
            {paper.description ? (
              <p className="mt-3 hidden text-sm leading-relaxed text-gray-600 lg:block">
                {cleanDisplayText(paper.description)}
              </p>
            ) : null}
            <WhitePaperShareBar slug={paper.slug} title={headline} resourceType={resourceType} compact />
          </div>

          {/* Form column */}
          <div className="min-w-0 lg:pl-4 xl:pl-8">
            {formCard}

            <WhitePaperInsideExplorer
              slug={paper.slug}
              resourceType={resourceType}
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

/** One field per row — gray panel like the reference download gate */
const formStack = 'flex flex-col gap-3'

const formPanelClass = 'mx-auto w-full max-w-[420px] rounded-sm bg-[#f3f3f3] px-6 py-7'

const inputClass =
  'block h-10 w-full min-w-0 rounded-sm border border-[#d5d5d5] bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-500 focus:ring-0'

const btnPrimary =
  'mx-auto flex min-w-[160px] items-center justify-center rounded-sm bg-cb-orange px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cb-orange-hover disabled:cursor-not-allowed disabled:bg-cb-orange disabled:opacity-70'

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
