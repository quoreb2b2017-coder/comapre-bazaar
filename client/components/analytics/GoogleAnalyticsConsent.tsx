'use client'

import { useEffect } from 'react'
import { parseConsentCookie } from '@/lib/cookieConsent'
import { GA_MEASUREMENT_ID, applyGoogleAnalyticsConsent } from '@/lib/googleAnalytics'

export function GoogleAnalyticsConsent() {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    const sync = () => {
      const consent = parseConsentCookie()
      applyGoogleAnalyticsConsent(consent?.analytics ?? false)
    }

    sync()
    window.addEventListener('cookie-consent-updated', sync)
    return () => window.removeEventListener('cookie-consent-updated', sync)
  }, [])

  return null
}
