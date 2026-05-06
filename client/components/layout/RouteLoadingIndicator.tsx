'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const MIN_VISIBLE_MS = 650
const MAX_VISIBLE_MS = 9000

export function RouteLoadingIndicator() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const routeKey = `${pathname || ''}?${searchParams?.toString() || ''}`
  const [visible, setVisible] = useState(false)
  const startedAtRef = useRef<number>(0)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const forceHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isNavigatingRef = useRef(false)
  const activeAnchorRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    if (!isNavigatingRef.current) return

    const elapsed = Date.now() - startedAtRef.current
    const delay = Math.max(MIN_VISIBLE_MS - elapsed, 0)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => {
      setVisible(false)
      isNavigatingRef.current = false
      if (activeAnchorRef.current) {
        activeAnchorRef.current.classList.remove('cb-link-pending')
        activeAnchorRef.current = null
      }
    }, delay)
  }, [routeKey])

  useEffect(() => {
    const clearTimers = () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current)
        hideTimerRef.current = null
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

        if (!isInternal || isSameRoute) return

        clearTimers()
        startedAtRef.current = Date.now()
        isNavigatingRef.current = true
        setVisible(true)
        if (activeAnchorRef.current && activeAnchorRef.current !== anchor) {
          activeAnchorRef.current.classList.remove('cb-link-pending')
        }
        activeAnchorRef.current = anchor
        anchor.classList.add('cb-link-pending')
        forceHideTimerRef.current = setTimeout(() => {
          setVisible(false)
          isNavigatingRef.current = false
          if (activeAnchorRef.current) {
            activeAnchorRef.current.classList.remove('cb-link-pending')
            activeAnchorRef.current = null
          }
        }, MAX_VISIBLE_MS)
      } catch {
        // Ignore malformed URLs.
      }
    }

    document.addEventListener('click', handleDocumentClick, true)
    return () => {
      document.removeEventListener('click', handleDocumentClick, true)
      clearTimers()
      if (activeAnchorRef.current) {
        activeAnchorRef.current.classList.remove('cb-link-pending')
        activeAnchorRef.current = null
      }
    }
  }, [])

  return (
    <div
      className={`fixed inset-0 z-[120] flex items-center justify-center transition-opacity duration-300 ${
        visible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-live="polite"
      aria-label="Route loading indicator"
    >
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1.5px]" />
      <div className="absolute left-0 right-0 top-0 h-[3px] overflow-hidden bg-white/40">
        <div className="cb-route-progress h-full w-[35%] rounded-full bg-gradient-to-r from-[#ff8633] via-[#ff9f55] to-[#ffd2a8]" />
      </div>
      <div className="relative flex items-center gap-3 rounded-full border border-white/70 bg-white/95 px-5 py-3 shadow-xl">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#ff8633]/30 border-t-[#ff8633]" />
        <span className="text-sm font-semibold text-[#000e54]">Opening page...</span>
      </div>
    </div>
  )
}
