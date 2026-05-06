import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Loader2, RefreshCw, Search, Mail, Power, Trash2 } from 'lucide-react'
import api from '../utils/api'

export const Subscribers = () => {
  const { toast } = useOutletContext()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState('')
  const [q, setQ] = useState('')
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 20 })

  const fetchRows = async (page = 1, search = q) => {
    setLoading(true)
    try {
      const res = await api.get('/subscribers', { params: { page, limit: 20, search } })
      setRows(res.data || [])
      setPagination(res.pagination || { page: 1, pages: 1, total: 0, limit: 20 })
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRows(1, '')
  }, [])

  const toggle = async (id) => {
    setActionLoading(`toggle-${id}`)
    try {
      const res = await api.post(`/subscribers/${id}/toggle`)
      toast.success(res.message || 'Updated')
      fetchRows(pagination.page, q)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setActionLoading('')
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this subscriber?')) return
    setActionLoading(`delete-${id}`)
    try {
      const res = await api.delete(`/subscribers/${id}`)
      toast.success(res.message || 'Deleted')
      fetchRows(pagination.page, q)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setActionLoading('')
    }
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Subscribers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage blog newsletter subscribers.</p>
        </div>
        <button onClick={() => fetchRows(pagination.page, q)} className="btn-secondary gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by email"
              className="input pl-9"
            />
          </div>
          <button className="btn-primary" onClick={() => fetchRows(1, q)}>Search</button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Subscriber ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Blog</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Blog ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Subscribed</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Notifications</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin inline mr-2" /> Loading subscribers...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">No subscribers found.</td>
                </tr>
              ) : (
                rows.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 font-mono">{s._id}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200">
                        <Mail className="w-3.5 h-3.5 text-gray-400" /> {s.email}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {s.sourceBlogTitle || s.sourceBlogSlug || s.subscribedFrom || '-'}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 font-mono">
                      {s.sourceBlogId || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${s.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'}`}>
                        {s.isActive ? 'Active' : 'Paused'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{s.totalNotifications || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                          title="Toggle active"
                          onClick={() => toggle(s._id)}
                          disabled={!!actionLoading}
                        >
                          {actionLoading === `toggle-${s._id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
                        </button>
                        <button
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                          title="Delete"
                          onClick={() => remove(s._id)}
                          disabled={!!actionLoading}
                        >
                          {actionLoading === `delete-${s._id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {pagination.pages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <p className="text-sm text-gray-500">Page {pagination.page} of {pagination.pages}</p>
            <div className="flex gap-2">
              <button disabled={pagination.page <= 1} onClick={() => fetchRows(pagination.page - 1, q)} className="btn-secondary text-xs">Previous</button>
              <button disabled={pagination.page >= pagination.pages} onClick={() => fetchRows(pagination.page + 1, q)} className="btn-secondary text-xs">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
