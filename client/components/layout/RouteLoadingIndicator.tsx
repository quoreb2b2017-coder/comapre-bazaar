'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

const MIN_VISIBLE_MS = 320

export function RouteLoadingIndicator() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const startedAtRef = useRef<number>(0)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const clearHideTimer = () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current)
        hideTimerRef.current = null
      }
    }

    const hideSmoothly = () => {
      clearHideTimer()
      const elapsed = Date.now() - startedAtRef.current
      const delay = Math.max(MIN_VISIBLE_MS - elapsed, 0)
      hideTimerRef.current = setTimeout(() => {
        setVisible(false)
      }, delay)
    }

    if (visible) {
      hideSmoothly()
    }

    return clearHideTimer
  }, [pathname, visible])

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const anchor = target?.closest('a')
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

        startedAtRef.current = Date.now()
        setVisible(true)
      } catch {
        // Ignore malformed URLs.
      }
    }

    document.addEventListener('click', handleDocumentClick, true)
    return () => {
      document.removeEventListener('click', handleDocumentClick, true)
    }
  }, [])

  return (
    <div
      className={`fixed inset-0 z-[120] flex items-center justify-center transition-opacity duration-200 ${
        visible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-live="polite"
      aria-label="Route loading indicator"
    >
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1.5px]" />
      <div className="relative flex items-center gap-3 rounded-full border border-white/70 bg-white/95 px-5 py-3 shadow-xl">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#ff8633]/30 border-t-[#ff8633]" />
        <span className="text-sm font-semibold text-[#000e54]">Loading...</span>
      </div>
    </div>
  )
}
