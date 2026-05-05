'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  getOrCreateVisitorId,
  parseConsentCookie,
  siteAnalyticsEndpoint,
  isSiteAnalyticsEnabled,
  buildMarketingPayload,
  rememberEmailDomainHintFromRaw,
} from '@/lib/cookieConsent'

export function SiteAnalyticsBeacon() {
  const pathname = usePathname() || '/'
  const searchParams = useSearchParams()
  const lastKeyRef = useRef<string | null>(null)
  const lastEmailDomainRef = useRef<string>('')
  const [consentBump, setConsentBump] = useState(0)

  useEffect(() => {
    const bump = () => setConsentBump((n) => n + 1)
    window.addEventListener('cookie-consent-updated', bump)
    window.addEventListener('site-analytics-refresh', bump)
    return () => {
      window.removeEventListener('cookie-consent-updated', bump)
      window.removeEventListener('site-analytics-refresh', bump)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const pushDomainRefresh = (rawValue: string) => {
      const captured = rememberEmailDomainHintFromRaw(rawValue || '')
      if (!captured) return
      if (captured === lastEmailDomainRef.current) return
      lastEmailDomainRef.current = captured
      window.dispatchEvent(new Event('site-analytics-refresh'))
    }

    const onFieldEvent = (ev: Event) => {
      const el = ev.target as HTMLInputElement | HTMLTextAreaElement | null
      if (!el) return
      const inputType = String((el as HTMLInputElement).type || '').toLowerCase()
      const fieldName = String(el.name || '').toLowerCase()
      const fieldId = String(el.id || '').toLowerCase()
      const looksEmailField =
        inputType === 'email' ||
        fieldName.includes('email') ||
        fieldId.includes('email')
      if (!looksEmailField) return
      pushDomainRefresh((el as HTMLInputElement).value || '')
    }

    const onFormSubmit = (ev: Event) => {
      const form = ev.target as HTMLFormElement | null
      if (!form) return
      const candidates = form.querySelectorAll('input, textarea')
      candidates.forEach((node) => {
        const el = node as HTMLInputElement | HTMLTextAreaElement
        const inputType = String((el as HTMLInputElement).type || '').toLowerCase()
        const fieldName = String(el.name || '').toLowerCase()
        const fieldId = String(el.id || '').toLowerCase()
        const looksEmailField =
          inputType === 'email' ||
          fieldName.includes('email') ||
          fieldId.includes('email')
        if (!looksEmailField) return
        pushDomainRefresh((el as HTMLInputElement).value || '')
      })
    }

    document.addEventListener('input', onFieldEvent, true)
    document.addEventListener('change', onFieldEvent, true)
    document.addEventListener('blur', onFieldEvent, true)
    document.addEventListener('submit', onFormSubmit, true)
    return () => {
      document.removeEventListener('input', onFieldEvent, true)
      document.removeEventListener('change', onFieldEvent, true)
      document.removeEventListener('blur', onFieldEvent, true)
      document.removeEventListener('submit', onFormSubmit, true)
    }
  }, [])

  useEffect(() => {
    if (!isSiteAnalyticsEnabled()) return

    const consent = parseConsentCookie()
    if (!consent?.analytics) return

    const path =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : '')

    const sessionId = getOrCreateVisitorId()
    if (!sessionId) return

    const dedupeKey = `${sessionId}:${path}:${consentBump}`
    if (lastKeyRef.current === dedupeKey) return
    lastKeyRef.current = dedupeKey

    const marketing = buildMarketingPayload(pathname, searchParams, consent.marketing)

    const payload = {
      kind: 'page_view' as const,
      sessionId,
      path: path.slice(0, 512),
      referrer: typeof document !== 'undefined' ? document.referrer?.slice(0, 512) || '' : '',
      consent: {
        analytics: consent.analytics,
        marketing: consent.marketing,
      },
      marketing,
    }

    const url = siteAnalyticsEndpoint()
    const body = JSON.stringify(payload)

    void fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
      credentials: 'omit',
    }).catch(() => {
      /* non-blocking */
    })
  }, [pathname, searchParams?.toString(), consentBump])

  return null
}
