import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, Filter, Eye, Edit, Check, X, Trash2, Globe, ChevronLeft, ChevronRight, RefreshCw, Send, BarChart2 } from 'lucide-react'
import { StatusBadge } from '../ui/StatusBadge'
import { ConfirmModal } from '../ui/Modal'
import api from '../../utils/api'
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
} from 'recharts'

const STATUSES = ['all', 'pending', 'approved', 'rejected', 'published']

export const BlogTable = ({ toast }) => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [blogs, setBlogs] = useState([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: 'all', search: '', dateFrom: '', dateTo: '' })
  const [confirmModal, setConfirmModal] = useState({ open: false, type: '', blog: null })
  const [actionLoading, setActionLoading] = useState(null)

  const pageLimit = 5

  useEffect(() => {
    const s = searchParams.get('status')
    if (s && STATUSES.includes(s)) {
      setFilters((prev) => (prev.status === s ? prev : { ...prev, status: s }))
    }
  }, [searchParams])

  const fetchBlogs = useCallback(
    async (page = 1) => {
      setLoading(true)
      try {
        const params = { page, limit: pageLimit, ...filters }
        const res = await api.get('/blogs', { params })
        setBlogs(res.data)
        setPagination(res.pagination)
      } catch (err) {
        toast.error('Failed to load blogs: ' + err.message)
      } finally {
        setLoading(false)
      }
    },
    [filters, pageLimit]
  )

  useEffect(() => {
    fetchBlogs(1)
  }, [filters, fetchBlogs])

  const handleAction = async (action, blogId, extra = {}) => {
    setActionLoading(blogId + action)
    try {
      let res
      if (action === 'approve') res = await api.post(`/blogs/${blogId}/approve`)
      else if (action === 'reject') res = await api.post(`/blogs/${blogId}/reject`, extra)
      else if (action === 'publish') res = await api.post(`/blogs/${blogId}/publish`)
      else if (action === 'delete') res = await api.delete(`/blogs/${blogId}`)
      toast.success(res.message)
      fetchBlogs(pagination.page)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setActionLoading(null)
      setConfirmModal({ open: false, type: '', blog: null })
    }
  }

  const confirm = (type, blog) => setConfirmModal({ open: true, type, blog })

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'
  const chartData = blogs.map((blog, idx) => ({
    name: `#${idx + 1}`,
    title: blog.title,
    views: Number(blog.viewCount || 0),
    readMins: Number(blog.readingTime || 0),
    words: Number(blog.wordCount || 0),
  }))

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search blogs..."
              className="input pl-9"
            />
          </div>

          {/* Status filter */}
          <select
            value={filters.status}
            onChange={(e) => {
              const status = e.target.value
              setFilters({ ...filters, status })
              if (status === 'all') setSearchParams({})
              else setSearchParams({ status })
            }}
            className="input w-auto"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>

          {/* Date filters */}
          <input type="date" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} className="input w-auto" title="From date" />
          <input type="date" value={filters.dateTo} onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} className="input w-auto" title="To date" />

          <button onClick={() => fetchBlogs(pagination.page)} className="btn-secondary gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide hidden sm:table-cell">Words</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide hidden lg:table-cell">Views</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide hidden md:table-cell">Created</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    {Array(6).fill(0).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    <p className="text-lg mb-1">No blogs found</p>
                    <p className="text-sm">Try adjusting your filters or generate a new blog</p>
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                    <td className="px-4 py-3 max-w-[280px]">
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">{blog.title}</p>
                      {blog.topic && <p className="text-xs text-gray-400 truncate mt-0.5">{blog.topic}</p>}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={blog.status} /></td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{blog.wordCount || 0}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300" title="Public article views">
                        <BarChart2 className="w-3.5 h-3.5 text-gray-400" aria-hidden />
                        {(blog.viewCount ?? 0).toLocaleString('en-US')}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(blog.createdAt)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => navigate(`/blogs/${blog._id}`)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all" title="View"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => navigate(`/blogs/${blog._id}/edit`)} className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all" title="Edit"><Edit className="w-4 h-4" /></button>

                        {blog.status === 'pending' && (
                          <>
                            <button onClick={() => confirm('approve', blog)} disabled={!!actionLoading} className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all" title="Approve"><Check className="w-4 h-4" /></button>
                            <button onClick={() => confirm('reject', blog)} disabled={!!actionLoading} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all" title="Reject"><X className="w-4 h-4" /></button>
                          </>
                        )}

                        {blog.status === 'approved' && (
                          <button onClick={() => confirm('publish', blog)} disabled={!!actionLoading} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all" title="Publish">
                            {actionLoading === blog._id + 'publish' ? <span className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin block" /> : <Globe className="w-4 h-4" />}
                          </button>
                        )}

                        <button onClick={() => confirm('delete', blog)} disabled={!!actionLoading} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchBlogs(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="btn-secondary px-3 py-1.5 text-xs gap-1 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" /> {filters.status === 'approved' ? 'Previous' : ''}
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px] text-center">
                {pagination.page} / {pagination.pages}
              </span>
              <button
                onClick={() => fetchBlogs(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className={`px-3 py-1.5 text-xs gap-1 disabled:opacity-40 ${filters.status === 'approved' ? 'btn-primary' : 'btn-secondary'}`}
              >
                {filters.status === 'approved' ? 'Next' : ''} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Blog performance chart */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Blog performance snapshot</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Current page blogs, views, estimated read minutes, and word count.
          </p>
        </div>
        <div className="h-[280px]">
          {chartData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <ChartTooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                  labelFormatter={(label, payload) => payload?.[0]?.payload?.title || label}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar yAxisId="left" dataKey="views" name="Views" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={42} />
                <Line yAxisId="right" type="monotone" dataKey="readMins" name="Read time (min)" stroke="#059669" strokeWidth={2} dot />
                <Line yAxisId="right" type="monotone" dataKey="words" name="Words" stroke="#7c3aed" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-gray-500">No chart data available.</div>
          )}
        </div>
      </div>

      {/* Confirm modals */}
      <ConfirmModal
        isOpen={confirmModal.open && confirmModal.type === 'delete'}
        onClose={() => setConfirmModal({ open: false })}
        onConfirm={() => handleAction('delete', confirmModal.blog?._id)}
        title="Delete Blog"
        message={`Are you sure you want to permanently delete "${confirmModal.blog?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        danger
        loading={!!actionLoading}
      />
      <ConfirmModal
        isOpen={confirmModal.open && confirmModal.type === 'approve'}
        onClose={() => setConfirmModal({ open: false })}
        onConfirm={() => handleAction('approve', confirmModal.blog?._id)}
        title="Approve Blog"
        message={`Approve "${confirmModal.blog?.title}"? It will be ready to publish.`}
        confirmText="Approve Blog"
        loading={!!actionLoading}
      />
      <ConfirmModal
        isOpen={confirmModal.open && confirmModal.type === 'reject'}
        onClose={() => setConfirmModal({ open: false })}
        onConfirm={() => handleAction('reject', confirmModal.blog?._id)}
        title="Reject Blog"
        message={`Reject "${confirmModal.blog?.title}"? You can still edit and re-submit it later.`}
        confirmText="Reject"
        danger
        loading={!!actionLoading}
      />
      <ConfirmModal
        isOpen={confirmModal.open && confirmModal.type === 'publish'}
        onClose={() => setConfirmModal({ open: false })}
        onConfirm={() => handleAction('publish', confirmModal.blog?._id)}
        title="Publish Blog"
        message={`Publish "${confirmModal.blog?.title}" to your website? This will make it live.`}
        confirmText="Publish Now"
        loading={!!actionLoading}
      />
    </div>
  )
}
