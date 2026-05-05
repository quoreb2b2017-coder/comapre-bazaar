'use client'

import { useEffect, useState } from 'react'
import { BarChart2 } from 'lucide-react'
import { formatBlogViews } from '@/lib/formatBlogViews'

/**
 * Registers one reader view (POST) then shows count. Initial SSR value avoids layout jump when possible.
 */
export function BlogViewCounter({ slug, initialCount }: { slug: string; initialCount: number }) {
  const [count, setCount] = useState(Math.max(0, Math.floor(initialCount || 0)))

  useEffect(() => {
    let cancelled = false
    const path = `/api/v1/blog-admin/public/blogs/${encodeURIComponent(slug)}/view`
    fetch(path, { method: 'POST', credentials: 'same-origin', cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => {
        if (!cancelled && j?.success && typeof j.viewCount === 'number') {
          setCount(Math.max(0, j.viewCount))
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [slug])

  const label = `${formatBlogViews(count)} ${count === 1 ? 'view' : 'views'}`

  return (
    <>
      <span className="text-gray-300">·</span>
      <span className="inline-flex items-center gap-1" title={label}>
        <BarChart2 className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
        <span aria-live="polite">{label}</span>
      </span>
    </>
  )
}
