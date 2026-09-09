'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { EMAIL_RE, SUBSCRIBE_EMAIL_KEY, unsubscribeNewsletter } from '@/lib/subscribeNewsletter'

const REASONS = [
  { id: 'not-relevant', label: 'The updates no longer match what I am shopping for.' },
  { id: 'delivery-issues', label: 'Emails are hard to open or keep landing in spam.' },
  { id: 'too-many', label: 'I am getting more messages than I need right now.' },
  { id: 'dont-remember', label: 'I do not recall signing up for these emails.' },
  { id: 'other', label: 'Something else.' },
] as const

export function UnsubscribePageClient({ initialEmail = '' }: { initialEmail?: string }) {
  const [email, setEmail] = useState(initialEmail)
  const [reason, setReason] = useState<string>(REASONS[0].id)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

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

  return (
    <div className="mx-auto w-full max-w-[480px] overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-28px_rgba(11,42,111,0.45)]">
      <div className="bg-[#0B2A6F] px-6 py-5 text-center">
        <p className="text-[15px] font-semibold uppercase tracking-[0.14em] text-white">
          Compare<span className="text-[#F58220]">Bazaar</span>
        </p>
        <p className="mt-1 text-[12px] text-white/75">Manage email updates</p>
      </div>

      <div className="px-6 py-6">
        {done ? (
          <div className="py-2 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-[#F58220]" aria-hidden />
            <p className="mt-3 text-base font-semibold text-[#0B2A6F]">You are unsubscribed</p>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
              We stopped Compare Bazaar email updates for this address. You can still browse blogs anytime.
            </p>
            <Link
              href="/blog"
              className="mt-5 inline-flex min-w-[160px] items-center justify-center rounded-md bg-[#F58220] px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#e57518]"
            >
              Browse blogs
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <p className="text-[13px] leading-relaxed text-gray-600">
              Enter the email you used to subscribe. We will remove it from the Compare Bazaar update list and send a
              confirmation.
            </p>

            <div>
              <label htmlFor="unsubscribe-page-email" className="mb-1.5 block text-sm font-semibold text-[#0B2A6F]">
                Email
              </label>
              <input
                id="unsubscribe-page-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourcompany.com"
                className="block h-10 w-full rounded-md border border-gray-200 bg-[#F4F6FB] px-3 text-sm text-[#0B2A6F] outline-none transition placeholder:text-gray-400 focus:border-[#F58220] focus:bg-white"
              />
              {!EMAIL_RE.test(email.trim()) && email.trim() ? (
                <p className="mt-1 text-xs text-red-600">Enter a valid email address.</p>
              ) : null}
            </div>

            <fieldset className="border-0 p-0">
              <legend className="mb-2.5 text-sm font-semibold text-[#0B2A6F]">
                Why are you leaving? <span className="font-normal text-gray-500">(helps us improve)</span>
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
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Unsubscribe'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
