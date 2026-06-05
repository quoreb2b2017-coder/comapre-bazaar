import { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { ChevronLeft, ChevronRight, FileStack, RefreshCw, Search } from 'lucide-react'
import api from '../utils/api'
import { WhitePaperLeadsMetrics, WhitePaperLeadsTable } from '../components/whitepapers/WhitePaperLeadsTable'

const PAGE_SIZE = 25

const STATUS_FILTERS = [
  { value: 'all', label: 'All submissions' },
  { value: 'completed', label: 'PDF downloaded' },
  { value: 'email_only', label: 'Email only (incomplete)' },
]

export const WhitePaperDownloads = () => {
  const { toast } = useOutletContext()
  const [rows, setRows] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })

  const loadStats = async () => {
    try {
      const res = await api.get('/whitepapers/stats')
      setStats(res.data || null)
    } catch {
      setStats(null)
    }
  }

  const load = async (p = page, search = q, filter = status) => {
    setLoading(true)
    try {
      const res = await api.get('/whitepapers/leads', {
        params: { page: p, limit: PAGE_SIZE, search: search.trim(), status: filter },
      })
      setRows(res.data || [])
      setPagination(res.pagination || { total: 0, totalPages: 1, page: p })
    } catch (e) {
      toast.error(e.message || 'Failed to load downloads')
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  useEffect(() => {
    load(page, q, status)
  }, [page, status])

  const onSearch = () => {
    setPage(1)
    load(1, q, status)
  }

  const refreshAll = () => {
    loadStats()
    load(page, q, status)
  }

  return (
    <div className="route-page-enter space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <nav className="mb-2 flex items-center gap-2 text-xs text-gray-500">
            <Link to="/whitepapers" className="hover:text-brand">
              White Papers
            </Link>
            <span>/</span>
            <span className="text-gray-700 dark:text-gray-300">Download leads</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Download leads
          </h1>
          <p className="mt-1 max-w-xl text-sm text-gray-500 dark:text-gray-400">
            Contact details from the public whitepaper form — which resource they requested, email, and full profile.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/whitepapers" className="btn-secondary inline-flex gap-2 text-sm">
            <FileStack className="h-4 w-4" />
            White papers
          </Link>
          <button type="button" onClick={refreshAll} className="btn-secondary inline-flex gap-2 text-sm">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="xl-sheet">
        <WhitePaperLeadsMetrics stats={stats} pagination={pagination} rows={rows} />

        <div className="xl-toolbar">
          <div className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              placeholder="Search email, name, job, whitepaper, city…"
              className="input !rounded-lg pl-10"
            />
          </div>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(1)
            }}
            className="input w-full sm:w-52 !rounded-lg"
            aria-label="Filter by status"
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          <button type="button" className="btn-primary shrink-0" onClick={onSearch}>
            Search
          </button>
        </div>

        <WhitePaperLeadsTable rows={rows} loading={loading} showWhitepaperColumn page={page} pageSize={PAGE_SIZE} />

        <div className="xl-footbar">
          <span>
            Page <strong className="text-gray-800 dark:text-gray-200">{page}</strong> of{' '}
            <strong className="text-gray-800 dark:text-gray-200">{pagination.totalPages || 1}</strong>
            <span className="mx-2 text-gray-300 dark:text-gray-600">·</span>
            <strong className="tabular-nums text-gray-800 dark:text-gray-200">{pagination.total}</strong> records
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="btn-secondary inline-flex items-center gap-1.5 text-sm disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              type="button"
              disabled={page >= pagination.totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
              className="btn-secondary inline-flex items-center gap-1.5 text-sm disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
