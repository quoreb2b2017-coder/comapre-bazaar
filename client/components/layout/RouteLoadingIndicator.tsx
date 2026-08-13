'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const FADE_MS = 80
const SHOW_DELAY_MS = 180
const MAX_VISIBLE_MS = 800

function buildRouteSignature(pathname: string, search: string) {
  return search ? `${pathname}?${search}` : pathname
}

function isBlogIndexSoftNav(nextUrl: URL, currentUrl: URL) {
  return (
    nextUrl.pathname === '/blog' &&
    currentUrl.pathname === '/blog' &&
    (nextUrl.search !== currentUrl.search || nextUrl.hash !== currentUrl.hash)
  )
}

export function RouteLoadingIndicator() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const search = searchParams?.toString() ?? ''
  const routeSignature = useMemo(
    () => buildRouteSignature(pathname ?? '/', search),
    [pathname, search]
  )

  const [visible, setVisible] = useState(false)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const forceHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isNavigatingRef = useRef(false)
  const targetPathRef = useRef<string | null>(null)
  const activeAnchorRef = useRef<HTMLAnchorElement | null>(null)

  const finish = () => {
    setVisible(false)
    isNavigatingRef.current = false
    targetPathRef.current = null
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current)
      showTimerRef.current = null
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
    if (forceHideTimerRef.current) {
      clearTimeout(forceHideTimerRef.current)
      forceHideTimerRef.current = null
    }
    if (activeAnchorRef.current) {
      activeAnchorRef.current.classList.remove('cb-link-pending')
      activeAnchorRef.current = null
    }
  }

  useEffect(() => {
    if (!isNavigatingRef.current) return

    const target = targetPathRef.current
    const reachedTarget = !target || (pathname ?? '/') === target

    if (!reachedTarget) return

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    if (forceHideTimerRef.current) {
      clearTimeout(forceHideTimerRef.current)
      forceHideTimerRef.current = null
    }

    hideTimerRef.current = setTimeout(finish, FADE_MS)
  }, [pathname, routeSignature])

  useEffect(() => {
    const clearTimers = () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current)
        hideTimerRef.current = null
      }
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current)
        showTimerRef.current = null
      }
      if (forceHideTimerRef.current) {
        clearTimeout(forceHideTimerRef.current)
        forceHideTimerRef.current = null
      }
    }

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const anchor = target?.closest('a') as HTMLAnchorElement | null
      if (!anchor) return
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return

      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return

      try {
        const nextUrl = new URL(anchor.href, window.location.origin)
        const currentUrl = new URL(window.location.href)
        const isInternal = nextUrl.origin === currentUrl.origin
        const isSameRoute =
          nextUrl.pathname === currentUrl.pathname &&
          nextUrl.search === currentUrl.search &&
          nextUrl.hash === currentUrl.hash

        const isCompareQueryTweak =
          nextUrl.pathname === '/compare' &&
          currentUrl.pathname === '/compare' &&
          nextUrl.search !== currentUrl.search

        if (anchor.hasAttribute('data-cb-soft-nav')) return

        if (!isInternal || isSameRoute || isCompareQueryTweak || isBlogIndexSoftNav(nextUrl, currentUrl)) {
          return
        }

        clearTimers()
        isNavigatingRef.current = true
        targetPathRef.current = nextUrl.pathname

        if (activeAnchorRef.current && activeAnchorRef.current !== anchor) {
          activeAnchorRef.current.classList.remove('cb-link-pending')
        }
        activeAnchorRef.current = anchor
        anchor.classList.add('cb-link-pending')

        showTimerRef.current = setTimeout(() => {
          if (isNavigatingRef.current) setVisible(true)
        }, SHOW_DELAY_MS)

        forceHideTimerRef.current = setTimeout(finish, MAX_VISIBLE_MS)
      } catch {
        // Ignore malformed URLs.
      }
    }

    const hideImmediately = () => finish()

    document.addEventListener('click', handleDocumentClick, true)
    window.addEventListener('popstate', hideImmediately)
    window.addEventListener('pageshow', hideImmediately)
    return () => {
      document.removeEventListener('click', handleDocumentClick, true)
      window.removeEventListener('popstate', hideImmediately)
      window.removeEventListener('pageshow', hideImmediately)
      clearTimers()
      if (activeAnchorRef.current) {
        activeAnchorRef.current.classList.remove('cb-link-pending')
        activeAnchorRef.current = null
      }
    }
  }, [])

  return (
    <div
      className={`fixed inset-0 z-[120] transition-opacity duration-[160ms] ease-out ${
        visible ? 'pointer-events-none opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-live="polite"
      aria-busy={visible}
      aria-label={visible ? 'Loading' : undefined}
    >
      <div
        className={`absolute inset-0 bg-slate-900/10 transition-opacity duration-[160ms] ease-out ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div className="absolute left-0 right-0 top-0 h-[3px] overflow-hidden bg-white/60">
        <div
          className={`cb-route-progress h-full w-[35%] rounded-full bg-gradient-to-r from-[#ff8633] via-[#ff9f55] to-[#ffd2a8] transition-opacity duration-150 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
      <div
        className={`absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 transition-all duration-[160ms] ease-out ${
          visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <span
          className="block h-10 w-10 animate-spin rounded-full border-[3px] border-[#ff8633]/20 border-t-[#ff8633] bg-white/90 shadow-[0_8px_24px_-8px_rgba(8,20,60,0.35)]"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
