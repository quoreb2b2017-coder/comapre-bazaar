'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, X } from 'lucide-react'
import logoIcon from '@/components/icon.png'
import { EMAIL_RE, SUBSCRIBE_EMAIL_KEY, subscribeNewsletter } from '@/lib/subscribeNewsletter'

const DISMISS_KEY = 'cb_home_subscribe_popup_dismissed'
const BENEFITS = [
  'Expert scores on features, pricing, and ease of use',
  'New CRM, payroll, and HR comparisons as we publish',
  'Dated pricing updates when vendors change list prices',
  'Independent rankings — vendors cannot pay for position',
]

export function HomeSubscribePopup() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [ok, setOk] = useState<boolean | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const subscribed = window.localStorage.getItem(SUBSCRIBE_EMAIL_KEY) || ''
    if (subscribed && EMAIL_RE.test(subscribed)) return
    if (window.sessionStorage.getItem(DISMISS_KEY) === '1') return

    const timer = window.setTimeout(() => setOpen(true), 2500)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const dismiss = () => {
    setOpen(false)
    if (typeof window !== 'undefined') window.sessionStorage.setItem(DISMISS_KEY, '1')
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    setOk(null)
    try {
      await subscribeNewsletter(email, 'home-popup')
      const value = email.trim().toLowerCase()
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(SUBSCRIBE_EMAIL_KEY, value)
        window.sessionStorage.setItem(DISMISS_KEY, '1')
      }
      setOk(true)
      setMsg('Subscribed. New guides will land in your inbox.')
      window.setTimeout(() => setOpen(false), 1200)
    } catch (err) {
      setOk(false)
      setMsg(err instanceof Error ? err.message : 'Subscribe failed')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#0B2A6F]/45 backdrop-blur-[2px]"
        aria-label="Close subscribe popup"
        onClick={dismiss}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="home-subscribe-title"
        className="relative w-full max-w-[420px] overflow-hidden rounded-xl bg-white shadow-[0_28px_80px_-24px_rgba(11,42,111,0.45)]"
      >
        <div className="flex items-center justify-between px-6 pt-5">
          <div className="flex items-center gap-2.5">
            <Image src={logoIcon} alt="" width={28} height={28} className="h-7 w-7 rounded-md" />
            <p className="text-[15px] font-bold tracking-tight text-[#0B2A6F]">Compare Bazaar</p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 pb-6 pt-5">
          <h2 id="home-subscribe-title" className="text-[1.55rem] font-bold leading-tight tracking-tight text-slate-900">
            Want the right software before the vendor call?
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-slate-500">
            Subscribe now for Compare Bazaar guides — expert scores, dated pricing, and independent
            shortlists for US small businesses.
          </p>

          <ul className="mt-4 space-y-2.5">
            {BENEFITS.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[13.5px] leading-snug text-slate-600">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] bg-[#F58220]">
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <form onSubmit={submit} className="mt-5">
            <label htmlFor="home-subscribe-email" className="text-[13px] font-semibold text-slate-900">
              Your Email <span className="text-[#F58220]">*</span>
            </label>
            <input
              id="home-subscribe-email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              className="mt-1.5 h-11 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#0B2A6F] focus:ring-2 focus:ring-[#0B2A6F]/15"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-3 h-11 w-full rounded-md bg-[#F58220] text-[15px] font-semibold text-white transition hover:bg-[#e07418] disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Subscribe now'}
            </button>
          </form>

          {msg ? (
            <p className={`mt-2 text-[13px] ${ok ? 'text-emerald-700' : 'text-red-600'}`}>{msg}</p>
          ) : null}

          <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
            Tip: use your work email so buying guides reach the right inbox.
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
            By subscribing you agree to our{' '}
            <Link href="/privacy-policy" className="underline hover:text-[#0B2A6F]">
              Privacy Policy
            </Link>
            . Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  )
}
