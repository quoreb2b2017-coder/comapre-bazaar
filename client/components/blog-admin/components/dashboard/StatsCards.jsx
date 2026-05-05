import { FileText, Clock, CheckCircle, XCircle, Globe } from 'lucide-react'

const CARDS = [
  { key: 'total',     label: 'Total blogs',     icon: FileText,     accent: 'from-blue-500/20 to-sky-500/5',   color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300',   ring: 'ring-blue-500/15' },
  { key: 'pending',   label: 'Pending review',  icon: Clock,        accent: 'from-amber-500/20 to-yellow-500/5', color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300', ring: 'ring-amber-500/15' },
  { key: 'approved',  label: 'Approved',        icon: CheckCircle,  accent: 'from-emerald-500/20 to-teal-500/5',  color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300', ring: 'ring-emerald-500/15' },
  { key: 'rejected',  label: 'Rejected',        icon: XCircle,      accent: 'from-rose-500/20 to-red-500/5',     color: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',    ring: 'ring-rose-500/15' },
  { key: 'published', label: 'Published',       icon: Globe,        accent: 'from-violet-500/20 to-purple-500/5',  color: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300', ring: 'ring-violet-500/15' },
]

export const StatsCards = ({ stats, loading }) => (
  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
    {CARDS.map(({ key, label, icon: Icon, color, accent, ring }) => (
      <div
        key={key}
        className="group relative overflow-hidden rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-5 shadow-md shadow-gray-900/5 dark:shadow-black/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} aria-hidden />
        <div className="relative">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center ${color} ring-2 ${ring} shadow-sm`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
          {loading ? (
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-1" />
          ) : (
            <p className="text-2xl sm:text-3xl font-bold tabular-nums text-gray-900 dark:text-gray-50 tracking-tight">{stats?.[key] ?? 0}</p>
          )}
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1.5 font-medium leading-tight">{label}</p>
        </div>
      </div>
    ))}
  </div>
)
