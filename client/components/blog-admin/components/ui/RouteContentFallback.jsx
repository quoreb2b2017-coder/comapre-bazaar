import { Loader2 } from 'lucide-react'

/** Shown inside the admin layout main column while a lazy route chunk loads */
export function RouteContentFallback() {
  return (
    <div
      className="flex min-h-[min(60vh,520px)] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-gray-200/80 bg-white/60 px-6 py-16 dark:border-gray-800 dark:bg-gray-900/40"
      aria-busy="true"
      aria-label="Loading page"
    >
      <Loader2 className="h-9 w-9 animate-spin text-brand" aria-hidden />
      <p className="text-sm text-gray-500 dark:text-gray-400">Loading page…</p>
    </div>
  )
}
