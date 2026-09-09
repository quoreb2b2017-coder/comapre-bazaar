'use client'

import { useEffect, useId, useState } from 'react'
import { CheckCircle2, Loader2, X } from 'lucide-react'
import { EMAIL_RE, SUBSCRIBE_EMAIL_KEY, unsubscribeNewsletter } from '@/lib/subscribeNewsletter'

const REASONS = [
  { id: 'not-relevant', label: 'The updates no longer match what I am shopping for.' },
  { id: 'delivery-issues', label: 'Emails are hard to open or keep landing in spam.' },
  { id: 'too-many', label: 'I am getting more messages than I need right now.' },
  { id: 'dont-remember', label: 'I do not recall signing up for these emails.' },
  { id: 'other', label: 'Something else.' },
] as const

type Props = {
  open: boolean
  onClose: () => void
}

export function UnsubscribeModal({ open, onClose }: Props) {
  const titleId = useId()
  const [email, setEmail] = useState('')
  const [reason, setReason] = useState<string>(REASONS[0].id)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!open) return
    setError('')
    setDone(false)
    setLoading(false)
    setReason(REASONS[0].id)
    try {
      const saved = window.localStorage.getItem(SUBSCRIBE_EMAIL_KEY) || ''
      if (EMAIL_RE.test(saved)) setEmail(saved)
    } catch {
      // ignore
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const reasonLabel = REASONS.find((r) => r.id === reason)?.label || reason
      await unsubscribeNewsletter(email, reasonLabel)
      try {
        window.localStorage.removeItem(SUBSCRIBE_EMAIL_KEY)
      } catch {
        // ignore
      }
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not unsubscribe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#0B2A6F]/50 backdrop-blur-[2px]"
        aria-label="Close unsubscribe form"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-[440px] overflow-hidden rounded-xl bg-white shadow-[0_28px_80px_-24px_rgba(11,42,111,0.5)]"
      >
        <div className="relative bg-[#0B2A6F] px-6 py-4 text-center">
          <h2 id={titleId} className="text-[15px] font-semibold uppercase tracking-[0.14em] text-white">
            Compare<span className="text-[#F58220]">Bazaar</span>
          </h2>
          <p className="mt-1 text-[12px] text-white/75">Unsubscribe from email updates</p>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-5">
          {done ? (
            <div className="py-4 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-[#F58220]" aria-hidden />
              <p className="mt-3 text-base font-semibold text-[#0B2A6F]">You are unsubscribed</p>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                We’ve stopped sending Compare Bazaar email updates to this address. You can subscribe again anytime
                from the footer.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 inline-flex min-w-[140px] items-center justify-center rounded-md bg-[#F58220] px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#e57518]"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <p className="text-[13px] leading-relaxed text-gray-600">
                Enter the email you used to subscribe. We’ll remove it from our Compare Bazaar update list.
              </p>

              <div>
                <label htmlFor="cb-unsubscribe-email" className="mb-1.5 block text-sm font-semibold text-[#0B2A6F]">
                  Email
                </label>
                <input
                  id="cb-unsubscribe-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourcompany.com"
                  className="block h-10 w-full rounded-md border border-gray-200 bg-[#F4F6FB] px-3 text-sm text-[#0B2A6F] outline-none transition placeholder:text-gray-400 focus:border-[#F58220] focus:bg-white"
                />
              </div>

              <fieldset className="border-0 p-0">
                <legend className="mb-2.5 text-sm font-semibold text-[#0B2A6F]">
                  Why are you leaving? <span className="font-normal text-gray-500">(optional insight)</span>
                </legend>
                <div className="space-y-2.5">
                  {REASONS.map((item) => (
                    <label
                      key={item.id}
                      className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-snug text-gray-700"
                    >
                      <input
                        type="radio"
                        name="unsubscribe-reason"
                        value={item.id}
                        checked={reason === item.id}
                        onChange={() => setReason(item.id)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[#F58220]"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-w-[140px] items-center justify-center rounded-md bg-[#F58220] px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#e57518] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
