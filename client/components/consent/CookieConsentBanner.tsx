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
      <div
        className={`pointer-events-auto w-full text-white ${
          showPrefsPanel
            ? 'max-w-3xl rounded-md border border-gray-200 bg-white text-gray-700 shadow-[0_-8px_28px_rgba(0,0,0,0.16)]'
            : 'max-w-[1200px] rounded-md border border-gray-200 bg-white text-gray-700 shadow-[0_-6px_20px_rgba(0,0,0,0.12)]'
        }`}
      >
        {showPrefsPanel ? (
          <div className="p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl font-semibold tracking-tight text-gray-800">Cookie preferences</h2>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed max-w-xl">
                  Manage how Compare Bazaar uses cookies. Strictly necessary cookies stay on so the site works.
                  Analytics helps us improve pages; marketing cookies support affiliate attribution when you click vendor links.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPanel('bar')}
                className="text-xs font-semibold uppercase tracking-wide text-gray-500 hover:text-gray-800 shrink-0"
              >
                Close
              </button>
            </div>

            <ul className="space-y-3">
              <li className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm text-gray-800">Strictly necessary</p>
                  <p className="text-xs text-gray-600 mt-1">Security, consent storage, basic navigation.</p>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Always on</span>
              </li>
              <li className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-gray-800">Analytics</p>
                  <p className="text-xs text-gray-600 mt-1">Anonymous page views to see popular content.</p>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer shrink-0">
                  <span className="sr-only">Analytics cookies</span>
                  <span className="relative inline-flex h-6 w-11 items-center">
                    <input
                      type="checkbox"
                      checked={analyticsOn}
                      onChange={(e) => setAnalyticsOn(e.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="absolute inset-0 rounded-full bg-[#bfc6d8] transition-colors peer-checked:bg-[#93EEA8]" />
                    <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                  </span>
                </label>
              </li>
              <li className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-gray-800">Marketing / affiliate</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Link campaign tags (UTM source/medium/campaign), first landing stored in{' '}
                    <code className="text-gray-700">cb_attr</code> (~90 days), plus referral clicks — only if enabled.
                  </p>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer shrink-0">
                  <span className="sr-only">Marketing cookies</span>
                  <span className="relative inline-flex h-6 w-11 items-center">
                    <input
                      type="checkbox"
                      checked={marketingOn}
                      onChange={(e) => setMarketingOn(e.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="absolute inset-0 rounded-full bg-[#bfc6d8] transition-colors peer-checked:bg-[#93EEA8]" />
                    <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                  </span>
                </label>
              </li>
            </ul>

            <div className="flex flex-col-reverse sm:flex-row sm:flex-wrap gap-2 sm:justify-end pt-1">
              <button
                type="button"
                onClick={rejectNonEssential}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold border border-[#dc6b14] bg-gradient-to-br from-[#F58220] via-[#f48930] to-[#ec7416] text-white hover:brightness-105 transition"
              >
                Reject non-essential
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold border border-[#dc6b14] bg-gradient-to-br from-[#F58220] via-[#f48930] to-[#ec7416] text-white hover:brightness-105 transition"
              >
                Accept all
              </button>
              <button
                type="button"
                onClick={savePreferences}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold border border-[#dc6b14] bg-gradient-to-br from-[#F58220] via-[#f48930] to-[#ec7416] text-white hover:brightness-105 transition"
              >
                Save choices
              </button>
            </div>

            <p className="text-[11px] text-gray-500">
              See our{' '}
              <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-gray-800">
                Privacy Policy
              </Link>{' '}
              for details.
            </p>
          </div>
        ) : (
          <div className="relative bg-transparent p-3 sm:p-4">
            <button
              type="button"
              onClick={rejectNonEssential}
              className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center text-gray-400 transition hover:text-gray-700"
              aria-label="Close cookie banner"
            >
              <span aria-hidden className="text-lg leading-none">
                ×
              </span>
            </button>

            <div className="flex flex-col gap-3 pr-7 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
              <div className="min-w-0 flex-1">
                <p className="text-[14px] leading-[1.45] text-gray-600 sm:text-[15px]">
                  This website stores data such as cookies to enable essential site functionality, as well as marketing,
                  personalization, and analytics. You may change your settings at any time or accept the default
                  settings. You may close this banner to continue with only essential cookies.{' '}
                  <Link href="/privacy-policy" className="underline underline-offset-2 text-gray-600 hover:text-gray-900">
                    Privacy Policy
                  </Link>
                  .
                </p>

                <button
                  type="button"
                  onClick={() => setPanel('prefs')}
                  className="mt-1 text-[14px] text-gray-600 underline underline-offset-2 hover:text-gray-900 sm:text-[15px]"
                >
                  Storage Preferences
                </button>

                <div className="mt-2 flex flex-nowrap items-center gap-x-4 gap-y-2 overflow-x-auto pb-1 text-gray-600 sm:gap-x-5">
                  <label className="inline-flex shrink-0 items-center gap-2 text-[14px] sm:text-[15px]">
                    <span className="relative inline-flex h-6 w-10 items-center">
                      <input
                        type="checkbox"
                        checked={marketingOn}
                        onChange={(e) => setMarketingOn(e.target.checked)}
                        className="peer sr-only"
                      />
                      <span className="absolute inset-0 rounded-full bg-[#c6bddb] transition-colors peer-checked:bg-[#93EEA8]" />
                      <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
                    </span>
                    Marketing
                  </label>

                  <label className="inline-flex shrink-0 items-center gap-2 text-[14px] sm:text-[15px]">
                    <span className="relative inline-flex h-6 w-10 items-center">
                      <input
                        type="checkbox"
                        checked={false}
                        disabled
                        className="peer sr-only"
                      />
                      <span className="absolute inset-0 rounded-full bg-[#c6bddb]" />
                      <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white" />
                    </span>
                    Personalization
                  </label>

                  <label className="inline-flex shrink-0 items-center gap-2 text-[14px] sm:text-[15px]">
                    <span className="relative inline-flex h-6 w-10 items-center">
                      <input
                        type="checkbox"
                        checked={analyticsOn}
                        onChange={(e) => setAnalyticsOn(e.target.checked)}
                        className="peer sr-only"
                      />
                      <span className="absolute inset-0 rounded-full bg-[#c6bddb] transition-colors peer-checked:bg-[#93EEA8]" />
                      <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
                    </span>
                    Analytics
                  </label>
                </div>
              </div>

              <div className="flex w-full shrink-0 flex-col gap-2 sm:w-[260px]">
                <button
                  type="button"
                  onClick={savePreferences}
                  className="h-12 rounded-md border border-[#dc6b14] bg-gradient-to-br from-[#F58220] via-[#f48930] to-[#ec7416] px-4 text-[18px] font-semibold text-white transition hover:brightness-105"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={acceptAll}
                  className="h-12 rounded-md border border-[#dc6b14] bg-gradient-to-br from-[#F58220] via-[#f48930] to-[#ec7416] px-4 text-[18px] font-semibold text-white transition hover:brightness-105"
                >
                  Accept All
                </button>
                <button
                  type="button"
                  onClick={rejectNonEssential}
                  className="h-12 rounded-md border border-[#dc6b14] bg-gradient-to-br from-[#F58220] via-[#f48930] to-[#ec7416] px-4 text-[18px] font-semibold text-white transition hover:brightness-105"
                >
                  Reject All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
