'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { DisclosureBanner } from '@/components/layout/DisclosureBanner'
import { RouteLoadingIndicator } from '@/components/layout/RouteLoadingIndicator'
import ArrowNavigation from '@/components/ArrowNavigation'
import { CookieConsentBanner } from '@/components/consent/CookieConsentBanner'
import { SiteAnalyticsBeacon } from '@/components/consent/SiteAnalyticsBeacon'

const CompareBazaarChat = dynamic(
  () => import('@/components/chatbot/CompareBazaarChat').then((mod) => mod.CompareBazaarChat),
  { ssr: false }
)

function isBlogAdminPath(pathname: string | null) {
  if (!pathname) return false
  return pathname === '/blog-admin' || pathname.startsWith('/blog-admin/')
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (isBlogAdminPath(pathname)) {
    return <>{children}</>
  }
  return (
    <>
      <RouteLoadingIndicator />
      <DisclosureBanner />
      <SiteNav />
      <main className="flex-1">{children}</main>
      <ArrowNavigation />
      <CompareBazaarChat />
      <CookieConsentBanner />
      <Suspense fallback={null}>
        <SiteAnalyticsBeacon />
      </Suspense>
      <SiteFooter />
    </>
  )
}
