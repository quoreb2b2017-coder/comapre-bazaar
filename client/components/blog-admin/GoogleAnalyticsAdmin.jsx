import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import {
  GA_MEASUREMENT_ID,
  applyGoogleAnalyticsConsent,
  blogAdminPagePath,
  trackGoogleAnalyticsPageView,
} from '@/lib/googleAnalytics'

export function GoogleAnalyticsAdmin() {
  const { pathname, search } = useLocation()
  const initialized = useRef(false)

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    const pagePath = blogAdminPagePath(pathname, search)

    if (!initialized.current) {
      initialized.current = true
      applyGoogleAnalyticsConsent(true)
      trackGoogleAnalyticsPageView(pagePath)
      return
    }

    trackGoogleAnalyticsPageView(pagePath)
  }, [pathname, search])

  return null
}
