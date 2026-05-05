'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  parseConsentCookie,
  saveConsentCookie,
  getOrCreateVisitorId,
  siteAnalyticsEndpoint,
  clearMarketingAttributionCookie,
  type ConsentPreferences,
} from '@/lib/cookieConsent'

type PanelMode = 'bar' | 'prefs'

function postConsentEvent(consent: Pick<ConsentPreferences, 'analytics' | 'marketing'>) {
  const sessionId = getOrCreateVisitorId()
  if (!sessionId) return
  const url = siteAnalyticsEndpoint()
  void fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      kind: 'consent',
      sessionId,
      path: typeof window !== 'undefined' ? window.location.pathname : '/',
      referrer: typeof document !== 'undefined' ? document.referrer?.slice(0, 512) || '' : '',
      consent: {
        analytics: consent.analytics,
        marketing: consent.marketing,
      },
    }),
    credentials: 'omit',
  }).catch(() => {})
}

export function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false)
  const [stored, setStored] = useState<ConsentPreferences | null>(null)
  const [panel, setPanel] = useState<PanelMode>('bar')
  const [analyticsOn, setAnalyticsOn] = useState(true)
  const [marketingOn, setMarketingOn] = useState(false)

  useEffect(() => {
    setMounted(true)
    const existing = parseConsentCookie()
    setStored(existing)
    if (existing) {
      setAnalyticsOn(existing.analytics)
      setMarketingOn(existing.marketing)
    }
  }, [])

  useEffect(() => {
    const openPrefs = () => {
      const cur = parseConsentCookie()
      if (cur) {
        setAnalyticsOn(cur.analytics)
        setMarketingOn(cur.marketing)
      }
      setPanel('prefs')
    }
    window.addEventListener('cookie-consent-open', openPrefs)
    return () => window.removeEventListener('cookie-consent-open', openPrefs)
  }, [])

  const commit = useCallback((analytics: boolean, marketing: boolean) => {
    if (!marketing) clearMarketingAttributionCookie()
    const prefs = saveConsentCookie({ analytics, marketing })
    setStored(prefs)
    postConsentEvent(prefs)
    setPanel('bar')
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookie-consent-updated'))
    }
  }, [])

  const acceptAll = useCallback(() => {
    commit(true, true)
  }, [commit])

  const rejectNonEssential = useCallback(() => {
    commit(false, false)
  }, [commit])

  const savePreferences = useCallback(() => {
    commit(analyticsOn, marketingOn)
  }, [analyticsOn, marketingOn, commit])

  if (!mounted) return null

  const showBar = !stored
  const showPrefsPanel = panel === 'prefs'

  if (!showBar && !showPrefsPanel) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] flex justify-center pointer-events-none px-3 pb-4 sm:px-4 sm:pb-5"
      role="dialog"
      aria-label="Cookie preferences"
      aria-modal="false"
    >
      <div className="pointer-events-auto w-full max-w-3xl rounded-2xl border border-[#081F52]/20 bg-[#0B2A6F] text-white shadow-[0_-8px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
        {showPrefsPanel ? (
          <div className="p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl font-semibold tracking-tight">Cookie preferences</h2>
                <p className="mt-2 text-sm text-white/80 leading-relaxed max-w-xl">
                  Manage how Compare Bazaar uses cookies. Strictly necessary cookies stay on so the site works.
                  Analytics helps us improve pages; marketing cookies support affiliate attribution when you click vendor links.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPanel('bar')}
                className="text-xs font-semibold uppercase tracking-wide text-[#F58220] hover:text-[#ffc48a] shrink-0"
              >
                Close
              </button>
            </div>

            <ul className="space-y-3">
              <li className="rounded-xl bg-white/10 border border-white/10 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm">Strictly necessary</p>
                  <p className="text-xs text-white/65 mt-1">Security, consent storage, basic navigation.</p>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/45">Always on</span>
              </li>
              <li className="rounded-xl bg-white/10 border border-white/10 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm">Analytics</p>
                  <p className="text-xs text-white/65 mt-1">Anonymous page views to see popular content.</p>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer shrink-0">
                  <span className="sr-only">Analytics cookies</span>
                  <input
                    type="checkbox"
                    checked={analyticsOn}
                    onChange={(e) => setAnalyticsOn(e.target.checked)}
                    className="h-4 w-4 rounded border-white/40 text-[#F58220] focus:ring-[#F58220]"
                  />
                </label>
              </li>
              <li className="rounded-xl bg-white/10 border border-white/10 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm">Marketing / affiliate</p>
                  <p className="text-xs text-white/65 mt-1">
                    Link campaign tags (UTM source/medium/campaign), first landing stored in{' '}
                    <code className="text-white/80">cb_attr</code> (~90 days), plus referral clicks — only if enabled.
                  </p>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer shrink-0">
                  <span className="sr-only">Marketing cookies</span>
                  <input
                    type="checkbox"
                    checked={marketingOn}
                    onChange={(e) => setMarketingOn(e.target.checked)}
                    className="h-4 w-4 rounded border-white/40 text-[#F58220] focus:ring-[#F58220]"
                  />
                </label>
              </li>
            </ul>

            <div className="flex flex-col-reverse sm:flex-row sm:flex-wrap gap-2 sm:justify-end pt-1">
              <button
                type="button"
                onClick={rejectNonEssential}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold bg-white/10 hover:bg-white/15 border border-white/15 transition-colors"
              >
                Reject non-essential
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold bg-[#F58220] text-[#0B2A6F] hover:bg-[#ffb066] transition-colors"
              >
                Accept all
              </button>
              <button
                type="button"
                onClick={savePreferences}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold bg-white text-[#0B2A6F] hover:bg-white/90 transition-colors"
              >
                Save choices
              </button>
            </div>

            <p className="text-[11px] text-white/55">
              See our{' '}
              <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-white">
                Privacy Policy
              </Link>{' '}
              for details.
            </p>
          </div>
        ) : (
          <div className="p-5 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="min-w-0 flex-1 space-y-2">
              <h2 className="font-serif text-lg sm:text-xl font-semibold tracking-tight text-white">
                We value your privacy
              </h2>
              <p className="text-sm text-white/80 leading-relaxed">
                We use cookies for essential features, optional analytics to improve the site, and affiliate attribution when you click vendor links.
                You can change your choices anytime via{' '}
                <button
                  type="button"
                  className="text-[#F58220] font-semibold hover:underline underline-offset-2"
                  onClick={() => setPanel('prefs')}
                >
                  Cookie preferences
                </button>
                .
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setPanel('prefs')}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold bg-white/10 hover:bg-white/15 border border-white/15 transition-colors whitespace-nowrap"
              >
                Customize
              </button>
              <button
                type="button"
                onClick={rejectNonEssential}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold bg-transparent hover:bg-white/10 border border-white/25 transition-colors whitespace-nowrap"
              >
                Reject non-essential
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold bg-[#F58220] text-[#0B2A6F] hover:bg-[#ffb066] transition-colors whitespace-nowrap"
              >
                Accept all
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
