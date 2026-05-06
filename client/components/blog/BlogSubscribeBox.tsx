'use client'

import { useEffect, useState } from 'react'

type Props = {
  slug: string
  compact?: boolean
  /** Flat, publication-style block (no rounded gradient card). */
  variant?: 'default' | 'editorial'
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function BlogSubscribeBox({ slug, compact = false, variant = 'default' }: Props) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [ok, setOk] = useState<boolean | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const localKey = `cb_subscribed_email_${slug}`

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(localKey) || '' : ''
    if (saved && EMAIL_RE.test(saved)) {
      setEmail(saved)
      setIsSubscribed(true)
    }
  }, [localKey])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const v = email.trim().toLowerCase()
    if (!EMAIL_RE.test(v)) {
      setOk(false)
      setMsg('Please enter a valid email address.')
      return
    }
    setLoading(true)
    setMsg('')
    setOk(null)
    try {
      const res = await fetch('/api/v1/blog-admin/public/blogs/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: v, sourceSlug: slug }),
      })
      const data = await res.json()
      if (!res.ok || !data?.success) throw new Error(data?.message || 'Subscribe failed')
      setOk(true)
      setMsg('Subscribed successfully. New blogs will be sent to your email.')
      setIsSubscribed(true)
      if (typeof window !== 'undefined') window.localStorage.setItem(localKey, v)
    } catch (err) {
      setOk(false)
      setMsg(err instanceof Error ? err.message : 'Subscribe failed')
    } finally {
      setLoading(false)
    }
  }

  const unsubscribe = async () => {
    const v = email.trim().toLowerCase()
    if (!EMAIL_RE.test(v)) {
      setOk(false)
      setMsg('Enter the subscribed email first to unsubscribe.')
      return
    }
    setLoading(true)
    setMsg('')
    setOk(null)
    try {
      const res = await fetch('/api/v1/blog-admin/public/blogs/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: v, sourceSlug: slug }),
      })
      const data = await res.json()
      if (!res.ok || !data?.success) throw new Error(data?.message || 'Unsubscribe failed')
      setOk(true)
      setIsSubscribed(false)
      setMsg('Unsubscribed successfully.')
      if (typeof window !== 'undefined') window.localStorage.removeItem(localKey)
    } catch (err) {
      setOk(false)
      setMsg(err instanceof Error ? err.message : 'Unsubscribe failed')
    } finally {
      setLoading(false)
    }
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
        One signup—each new article lands in your email when we publish.
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
          disabled={loading}
          className={`h-11 w-full px-5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:opacity-60 ${
            editorial ? 'rounded-sm bg-brand' : 'rounded-xl bg-brand'
          }`}
        >
          {loading ? 'Saving...' : isSubscribed ? 'Resubscribe' : 'Subscribe'}
        </button>
        {isSubscribed ? (
          <button
            type="button"
            onClick={unsubscribe}
            disabled={loading}
            className={`h-11 w-full px-5 text-sm font-semibold transition disabled:opacity-60 ${
              editorial
                ? 'rounded-sm border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
                : 'rounded-xl border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            {loading ? 'Saving...' : 'Unsubscribe'}
          </button>
        ) : null}
      </form>
      {msg ? (
        <p className={`mt-3 text-sm ${ok ? 'text-emerald-700' : 'text-red-600'}`}>
          {msg}
        </p>
      ) : null}
    </section>
  )
}
