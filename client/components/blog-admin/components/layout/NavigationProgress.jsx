import { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Thin bar while changing routes — visible even when lazy chunks are already cached
 * (Suspense fallback does not run for synchronous resolves).
 */
export function NavigationProgress() {
  const { key } = useLocation()
  const [active, setActive] = useState(false)
  const skipFirst = useRef(true)

  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false
      return
    }
    setActive(true)
    const id = window.setTimeout(() => setActive(false), 420)
    return () => window.clearTimeout(id)
  }, [key])

  if (!active) return null

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[3px] overflow-hidden"
      aria-hidden
    >
      <div className="blog-admin-nav-strip absolute inset-y-0 w-[38%] rounded-full bg-gradient-to-r from-brand via-brand-mid to-brand-hover shadow-[0_0_14px_rgba(29,78,216,0.45)]" />
    </div>
  )
}
