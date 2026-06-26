'use client'

import { useEffect, useState } from 'react'
import { EMAIL_RE, SUBSCRIBE_EMAIL_KEY, subscribeNewsletter } from '@/lib/subscribeNewsletter'

type Props = {
  sourceSlug: string
  compact?: boolean
  variant?: 'default' | 'editorial' | 'homepage' | 'hero' | 'footer'
}

export function NewsletterSubscribeForm({
  sourceSlug,
  compact = false,
  variant = 'default',
}: Props) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [ok, setOk] = useState<boolean | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(SUBSCRIBE_EMAIL_KEY) || '' : ''
    if (saved && EMAIL_RE.test(saved)) {
      setEmail(saved)
      setIsSubscribed(true)
    }
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    setOk(null)
    try {
      await subscribeNewsletter(email, sourceSlug)
      const value = email.trim().toLowerCase()
      setOk(true)
      setMsg('Subscribed successfully. New guides will be sent to your email.')
      setIsSubscribed(true)
      if (typeof window !== 'undefined') window.localStorage.setItem(SUBSCRIBE_EMAIL_KEY, value)
    } catch (err) {
      setOk(false)
      setMsg(err instanceof Error ? err.message : 'Subscribe failed')
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'footer') {
    return (
      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#F58220] mb-2">Newsletter</p>
        <p className="text-sm text-white/90 mb-3">Software buying guides in your inbox.</p>
        <form onSubmit={submit} className="flex flex-col gap-2">
          <input
            type="email"
            name="subscribeEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="h-10 w-full rounded-lg border border-white/25 bg-white/10 px-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-[#F58220] focus:ring-1 focus:ring-[#F58220]"
            required
          />
          <button
            type="submit"
            disabled={loading || isSubscribed}
            className="h-10 rounded-lg bg-[#F58220] px-4 text-sm font-semibold text-white transition hover:bg-[#e67410] disabled:opacity-60"
          >
            {loading ? 'Saving...' : isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        </form>
        {msg ? <p className={`mt-2 text-xs ${ok ? 'text-emerald-300' : 'text-red-300'}`}>{msg}</p> : null}
      </div>
    )
  }

  if (variant === 'hero') {
    return (
      <section className="mt-6 border-t border-gray-100 pt-5" aria-label="Newsletter signup">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F58220]">Subscribe</p>
        <h2 className="mt-1.5 text-lg tracking-tight text-navy sm:text-xl">Get software buying guides in your inbox</h2>
        <p className="mt-1 max-w-xl text-sm text-gray-600">
          New comparisons and pricing updates - no spam, unsubscribe anytime.
        </p>
        <form onSubmit={submit} className="mt-3 flex flex-col gap-2.5 sm:max-w-lg sm:flex-row">
          <input
            type="email"
            name="subscribeEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="h-11 min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-4 text-sm outline-none ring-brand/30 transition focus:border-brand focus:ring"
            required
          />
          <button
            type="submit"
            disabled={loading || isSubscribed}
            className="h-11 shrink-0 rounded-xl bg-brand px-6 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:opacity-60 sm:min-w-[132px]"
          >
            {loading ? 'Saving...' : isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        </form>
        {msg ? <p className={`mt-3 text-sm ${ok ? 'text-emerald-700' : 'text-red-600'}`}>{msg}</p> : null}
      </section>
    )
  }

  if (variant === 'homepage') {
    return (
      <section
        className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-gray-50/80 p-6 sm:p-8 shadow-[0_18px_36px_-24px_rgba(15,31,61,0.45)]"
        aria-label="Newsletter signup"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F58220]">Subscribe</p>
        <h2 className="mt-2 text-2xl sm:text-3xl text-navy tracking-tight">Get software buying guides in your inbox</h2>
        <p className="mt-2 max-w-xl text-sm sm:text-base text-gray-600">
          New comparisons and pricing updates - no spam, unsubscribe anytime.
        </p>
        <form onSubmit={submit} className="mt-5 flex flex-col gap-3 sm:max-w-lg sm:flex-row">
          <input
            type="email"
            name="subscribeEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="h-11 min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-4 text-sm outline-none ring-brand/30 transition focus:border-brand focus:ring"
            required
          />
          <button
            type="submit"
            disabled={loading || isSubscribed}
            className="h-11 shrink-0 rounded-xl bg-brand px-6 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:opacity-60 sm:min-w-[132px]"
          >
            {loading ? 'Saving...' : isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        </form>
        {msg ? <p className={`mt-3 text-sm ${ok ? 'text-emerald-700' : 'text-red-600'}`}>{msg}</p> : null}
      </section>
    )
  }

  const editorial = variant === 'editorial'
  const shell =
    editorial && compact
      ? 'mt-6 border-t border-gray-200 pt-6'
      : editorial && !compact
        ? 'mt-14 border-t-2 border-gray-900/10 pt-10'
        : compact
          ? 'mt-4 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-3.5'
          : 'mt-12 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 sm:p-7'

  const kickerCls = editorial ? 'text-gray-500' : 'text-blue-700'

  return (
    <section className={shell}>
      <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${kickerCls}`}>Subscribe</p>
      <h3 className={`${compact ? 'text-xl' : 'text-2xl'} mt-2 font-serif tracking-tight text-navy`}>
        New guides in your inbox
      </h3>
      <p className={`${compact ? 'text-[13px]' : 'text-[15px]'} mt-2 max-w-[52ch] leading-relaxed text-gray-600`}>
        One signup: each new article lands in your email when we publish.
      </p>
      <form onSubmit={submit} className={`mt-4 flex flex-col gap-3 ${editorial && !compact ? 'sm:max-w-md' : ''}`}>
        <input
          type="email"
          name="subscribeEmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className={`h-11 w-full min-w-0 border border-gray-300 bg-white px-4 text-sm outline-none ring-brand/30 transition focus:border-brand focus:ring ${
            editorial ? 'rounded-sm' : 'rounded-xl'
          }`}
          required
        />
        <button
          type="submit"
          disabled={loading || isSubscribed}
          className={`h-11 w-full px-5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:opacity-60 ${
            editorial ? 'rounded-sm bg-brand' : 'rounded-xl bg-brand'
          }`}
        >
          {loading ? 'Saving...' : isSubscribed ? 'Already Subscribed' : 'Subscribe'}
        </button>
      </form>
      {msg ? (
        <p className={`mt-3 text-sm ${ok ? 'text-emerald-700' : 'text-red-600'}`}>
          {msg}
        </p>
      ) : null}
    </section>
  )
}
