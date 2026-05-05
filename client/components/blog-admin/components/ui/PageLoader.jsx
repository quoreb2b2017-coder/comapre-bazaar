import { Loader2 } from 'lucide-react'

/** Full-screen loader used while the admin bundle loads or auth/session is resolving */
export function BlogAdminPageLoader({ label = 'Loading…' }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="text-center transition-opacity duration-300">
        <Loader2 className="w-10 h-10 animate-spin text-brand mx-auto mb-3" aria-hidden />
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  )
}
