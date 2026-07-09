import { useEffect, useState } from 'react'
import { Link, useLocation, useOutletContext } from 'react-router-dom'
import { Plus, ExternalLink, Trash2, Pencil, Download, ChevronLeft, ChevronRight, Users } from 'lucide-react'
import api from '../utils/api'
import { WhitePaperUploadDrawer } from '../components/whitepapers/WhitePaperUploadDrawer'
import { WhitePaperLeadsTable } from '../components/whitepapers/WhitePaperLeadsTable'

const PAGE_SIZE = 10

export const WhitePapers = () => {
  const { toast } = useOutletContext()
  const location = useLocation()
  const [papers, setPapers] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingPaper, setEditingPaper] = useState(null)
  const [leadsPaper, setLeadsPaper] = useState(null)
  const [leads, setLeads] = useState([])

  const loadStats = async () => {
    try {
      const res = await api.get('/whitepapers/stats')
      setStats(res.data || null)
    } catch {
      setStats(null)
    }
  }

  const load = async (p = page) => {
    setLoading(true)
    try {
      const res = await api.get(`/whitepapers?page=${p}&limit=${PAGE_SIZE}`)
      setPapers(res.data || [])
      setPagination(res.pagination || { total: 0, totalPages: 1, page: p, limit: PAGE_SIZE })
    } catch (e) {
      toast.error(e.message || 'Failed to load whitepapers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  useEffect(() => {
    load(page)
  }, [page])

  useEffect(() => {
    if (location.state?.openUpload) {
      setEditingPaper(null)
      setDrawerOpen(true)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const onDelete = async (id) => {
    if (!window.confirm('Delete this white paper?')) return
    try {
      await api.delete(`/whitepapers/${id}`)
      toast.success('White paper deleted')
      loadStats()
      load(page)
    } catch (e) {
      toast.error(e.message || 'Delete failed')
    }
  }

  const togglePublish = async (paper) => {
    const next = paper.status === 'published' ? 'unpublished' : 'published'
    try {
      await api.patch(`/whitepapers/${paper._id}/status`, { status: next })
      toast.success(next === 'published' ? 'Published' : 'Unpublished')
      loadStats()
      load(page)
    } catch (e) {
      toast.error(e.message || 'Status update failed')
    }
  }

  const showLeads = async (paper) => {
    setLeadsPaper(paper)
    try {
      const res = await api.get(`/whitepapers/${paper._id}/leads`)
      setLeads(res.data || [])
    } catch (e) {
      toast.error(e.message || 'Failed to load leads')
      setLeads([])
    }
  }

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">White Papers</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage, publish, and track downloads</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/whitepapers/downloads" className="btn-secondary inline-flex items-center gap-2">
              <Users className="h-4 w-4" /> All download leads
            </Link>
            <button
              type="button"
              onClick={() => {
                setEditingPaper(null)
                setDrawerOpen(true)
              }}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> New white paper
            </button>
          </div>
        </div>

        {stats ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            <StatCard label="Published" value={stats.published} />
            <StatCard label="Unpublished" value={stats.unpublished} />
            <StatCard label="Total downloads" value={stats.totalDownloads} />
            <StatCard label="Total views" value={stats.totalViews} />
            <StatCard label="Completed leads" value={stats.totalLeads} className="col-span-2 sm:col-span-1" />
          </div>
        ) : null}

        {loading ? (
          <div className="py-12 text-center text-sm text-gray-500">Loading…</div>
        ) : papers.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">No white papers yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-700">
                  <th className="py-3 pr-4">Title</th>
                  <th className="py-3 pr-4">Type</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4 text-right">Views</th>
                  <th className="py-3 pr-4 text-right">Downloads</th>
                  <th className="py-3 pr-4">Published</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {papers.map((p) => (
                  <tr key={p._id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{p.seoTitle || p.title}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-gray-400">/resources/whitepapers/{p.slug}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <ResourceTypeBadge type={p.metadata?.resourceType} />
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="py-3 pr-4 text-right tabular-nums">{p.viewCount ?? 0}</td>
                    <td className="py-3 pr-4 text-right tabular-nums">{p.downloadCount ?? 0}</td>
                    <td className="py-3 pr-4 text-gray-500">
                      {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        <button type="button" className="btn-secondary text-xs px-2 py-1" onClick={() => showLeads(p)} title="Leads">
                          <Download className="h-3.5 w-3.5" />
                        </button>
                        {p.status === 'published' && p.slug ? (
                          <a
                            href={`/resources/whitepapers/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary text-xs px-2 py-1"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : null}
                        <button
                          type="button"
                          className="btn-secondary text-xs px-2 py-1"
                          onClick={() => togglePublish(p)}
                        >
                          {p.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          type="button"
                          className="btn-secondary text-xs px-2 py-1"
                          onClick={() => {
                            setEditingPaper(p)
                            setDrawerOpen(true)
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(p._id)}
                          className="rounded-lg border border-gray-200 px-2 py-1 text-gray-500 hover:text-red-600 dark:border-gray-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.totalPages > 1 ? (
          <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
            <p className="text-sm text-gray-500">
              Page {page} of {pagination.totalPages} · {pagination.total} total
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="btn-secondary inline-flex items-center gap-1 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              <button
                type="button"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="btn-secondary inline-flex items-center gap-1 disabled:opacity-40"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {leadsPaper ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-[2px]">
          <div className="flex max-h-[92vh] w-full max-w-[96rem] flex-col">
            <div className="xl-sheet flex max-h-full flex-col">
              <div className="xl-toolbar justify-between gap-4 border-b border-gray-200 dark:border-gray-700">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Download leads</p>
                  <h3 className="mt-1 truncate text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {leadsPaper.seoTitle || leadsPaper.title}
                  </h3>
                  <p className="mt-0.5 font-mono text-xs text-gray-400">/resources/whitepapers/{leadsPaper.slug}</p>
                </div>
                <button type="button" className="btn-secondary shrink-0 text-sm" onClick={() => setLeadsPaper(null)}>
                  Close
                </button>
              </div>
              <WhitePaperLeadsTable
                rows={leads}
                loading={false}
                showWhitepaperColumn={false}
                emptyMessage="No submissions for this whitepaper yet."
                page={1}
                pageSize={leads.length || 1}
              />
              <div className="xl-footbar">
                <span>
                  <strong className="tabular-nums text-gray-800 dark:text-gray-200">{leads.length}</strong> submission
                  {leads.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <WhitePaperUploadDrawer
        open={drawerOpen}
        editingPaper={editingPaper}
        onClose={() => {
          setDrawerOpen(false)
          setEditingPaper(null)
        }}
        onPublished={() => {
          loadStats()
          load(page)
        }}
        toast={toast}
      />
    </>
  )
}

function StatCard({ label, value, className = '' }) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">{value ?? 0}</p>
    </div>
  )
}

function ResourceTypeBadge({ type }) {
  const isReport = type === 'report'
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
        isReport
          ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300'
          : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
      }`}
    >
      {isReport ? 'Report' : 'Whitepaper'}
    </span>
  )
}

function StatusBadge({ status }) {
  const map = {
    published: 'badge-published',
    unpublished: 'bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium',
    failed: 'badge-rejected',
    processing: 'badge-pending',
  }
  return <span className={map[status] || 'badge-pending'}>{status}</span>
}
