import { useCallback, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Upload,
  RefreshCw,
  Loader2,
  Play,
  Trash2,
  RotateCcw,
  FileSpreadsheet,
} from 'lucide-react'
import api, { blogAdminHttp, API_TIMEOUT_LONG_MS } from '../utils/api'

const STATUS_STYLES = {
  queued: 'bg-sky-50 text-sky-800 border-sky-200',
  processing: 'bg-amber-50 text-amber-800 border-amber-200',
  done: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  failed: 'bg-rose-50 text-rose-800 border-rose-200',
  skipped: 'bg-slate-50 text-slate-600 border-slate-200',
}

export const ExcelQueue = () => {
  const { toast } = useOutletContext()
  const [stats, setStats] = useState(null)
  const [rows, setRows] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [running, setRunning] = useState(false)
  const [actionId, setActionId] = useState('')

  const load = useCallback(
    async (page = 1, status = statusFilter) => {
      setLoading(true)
      try {
        const [statsRes, listRes] = await Promise.all([
          api.get('/excel-queue/stats'),
          api.get('/excel-queue', {
            params: { page, limit: 25, ...(status ? { status } : {}) },
          }),
        ])
        setStats(statsRes.data || null)
        setRows(listRes.data || [])
        setPagination(listRes.pagination || { page: 1, pages: 1, total: 0 })
      } catch (err) {
        toast.error(err.message || 'Failed to load Excel queue')
      } finally {
        setLoading(false)
      }
    },
    [statusFilter, toast]
  )

  useEffect(() => {
    load(1)
  }, [load])

  const onUpload = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await blogAdminHttp.post('/excel-queue/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      })
      const data = res.data
      const removed = data?.data?.removedExisting || 0
      const queued = data?.data?.queued || 0
      toast.success(data?.message || `Queued ${queued} titles`)
      if (removed > 0) {
        toast.success(`${removed} existing title(s) removed from upload`)
      }
      const otherSkipped = (data?.data?.skipped || []).filter(
        (s) => !String(s.reason || '').includes('already exists')
      )
      if (otherSkipped.length) {
        toast.error(`${otherSkipped.length} row(s) skipped — check titles/categories`)
      }
      await load(1)
    } catch (err) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const runNow = async (force = false) => {
    setRunning(true)
    try {
      const res = await api.post(
        '/excel-queue/run-now',
        { force },
        { timeout: API_TIMEOUT_LONG_MS }
      )
      toast.success(res.message || 'Batch finished')
      await load(pagination.page || 1)
    } catch (err) {
      toast.error(err.message || 'Batch failed')
    } finally {
      setRunning(false)
    }
  }

  const retryItem = async (id) => {
    setActionId(id)
    try {
      await api.post(`/excel-queue/${id}/retry`)
      toast.success('Re-queued')
      await load(pagination.page || 1)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setActionId('')
    }
  }

  const deleteItem = async (id) => {
    if (!window.confirm('Remove this title from the queue?')) return
    setActionId(id)
    try {
      await api.delete(`/excel-queue/${id}`)
      toast.success('Deleted')
      await load(pagination.page || 1)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setActionId('')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl text-navy tracking-tight">Excel blog queue</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Categories come from your Excel file. Each day runs{' '}
            <strong>{stats?.categoriesPerDay || 5} categories</strong> (1 title each) — e.g. 10 categories
            → 5 today, 5 tomorrow, then repeat. Duplicate titles are removed automatically.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => load(pagination.page || 1)}
            className="btn-secondary inline-flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => runNow(false)}
            className="btn-secondary inline-flex items-center gap-2"
            disabled={running}
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Run today
          </button>
          <label className="btn-primary inline-flex cursor-pointer items-center gap-2">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Upload Excel
            <input
              type="file"
              accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
              className="hidden"
              disabled={uploading}
              onChange={onUpload}
            />
          </label>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: 'Queued', value: stats?.queued ?? '—' },
          { label: 'Done today', value: `${stats?.doneToday ?? 0}/${stats?.dailyLimit ?? '—'}` },
          { label: 'Category types', value: stats?.categoryTypeCount ?? '—' },
          { label: 'Published (all)', value: stats?.done ?? '—' },
          { label: 'Failed', value: stats?.failed ?? '—' },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{card.label}</p>
            <p className="mt-1 font-serif text-2xl text-navy">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Category types ({stats?.categoryTypeCount || 0}) · {stats?.categoriesPerDay || 5}/day
          </p>
          <p className="text-xs text-slate-500">
            Group {(stats?.groupIndex ?? 0) + 1}/{stats?.groupCount || 1}
          </p>
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-[#F58220]/30 bg-[#FFF8F1] px-3 py-2 text-xs">
            <p className="font-semibold uppercase tracking-wider text-[#F58220]">Today ({stats?.todayGroupLabels?.length || 0})</p>
            <p className="mt-1 text-navy">
              {(stats?.todayGroupLabels || []).length ? stats.todayGroupLabels.join(', ') : '—'}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
            <p className="font-semibold uppercase tracking-wider text-slate-400">Tomorrow ({stats?.tomorrowGroupLabels?.length || 0})</p>
            <p className="mt-1 text-slate-600">
              {(stats?.tomorrowGroupLabels || []).length ? stats.tomorrowGroupLabels.join(', ') : '—'}
            </p>
          </div>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {(stats?.categoryTypes || []).length === 0 ? (
            <p className="col-span-full text-xs text-slate-400">No categories yet — upload Excel.</p>
          ) : (
            stats.categoryTypes.map((cat) => {
              const isToday = (stats?.todayCategoryKeys || []).includes(cat.key)
              return (
                <div
                  key={cat.key}
                  className={`rounded-lg border px-3 py-3 ${
                    isToday
                      ? 'border-[#F58220]/40 bg-[#FFF8F1]'
                      : 'border-slate-100 bg-slate-50'
                  }`}
                >
                  <p className="text-sm font-semibold text-navy">
                    {cat.label}
                    {isToday ? (
                      <span className="ml-1 text-[10px] font-semibold uppercase text-[#F58220]">today</span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Remaining: <strong className="text-navy">{cat.queued}</strong>
                    {' · '}
                    Done: {cat.done}
                  </p>
                </div>
              )
            })
          )}
        </div>
        {stats?.todaysPreview?.length ? (
          <div className="mt-4 border-t border-slate-100 pt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Running today (preview)
            </p>
            <ul className="mt-2 space-y-1.5">
              {stats.todaysPreview.map((item) => (
                <li key={item._id} className="text-sm text-slate-600">
                  <span className="mr-2 inline-block rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[#F58220] ring-1 ring-slate-200">
                    {item.categoryLabel || item.category}
                  </span>
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-3 text-xs text-slate-400">No queued titles in today&apos;s group — upload an Excel file.</p>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
        <p className="flex items-start gap-2">
          <FileSpreadsheet className="mt-0.5 h-4 w-4 shrink-0 text-[#F58220]" />
          <span>
            Example with 10 categories: <strong>5 today</strong>, <strong>5 tomorrow</strong>, then repeat. Env:{' '}
            <code className="rounded bg-slate-100 px-1">BLOG_EXCEL_CATEGORIES_PER_DAY=5</code>. Cron 09:00 IST.
            {stats?.lastRun ? (
              <>
                {' '}
                · Last run: {new Date(stats.lastRun).toLocaleString()}
              </>
            ) : null}
          </span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Filter</span>
        {['', 'queued', 'processing', 'done', 'failed'].map((s) => (
          <button
            key={s || 'all'}
            type="button"
            onClick={() => {
              setStatusFilter(s)
            }}
            className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
              statusFilter === s
                ? 'border-navy bg-navy text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            {s || 'all'}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Result</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                    No queue items yet — upload an Excel file to start.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row._id} className="border-b border-slate-50 align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium text-navy">{row.title}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {row.sourceFileName || '—'} · {new Date(row.createdAt).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-4 py-3 uppercase text-slate-600">{row.category}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${
                          STATUS_STYLES[row.status] || STATUS_STYLES.skipped
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {row.blogSlug ? (
                        <a
                          href={`/blog/${row.blogSlug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#0B2A6F] hover:underline"
                        >
                          /blog/{row.blogSlug}
                        </a>
                      ) : row.error ? (
                        <span className="text-rose-600">{row.error}</span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {['failed', 'skipped'].includes(row.status) ? (
                          <button
                            type="button"
                            title="Retry"
                            disabled={actionId === row._id}
                            onClick={() => retryItem(row._id)}
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </button>
                        ) : null}
                        {row.status !== 'processing' ? (
                          <button
                            type="button"
                            title="Delete"
                            disabled={actionId === row._id}
                            onClick={() => deleteItem(row._id)}
                            className="rounded-lg border border-slate-200 p-1.5 text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {pagination.pages > 1 ? (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
            <span>
              Page {pagination.page} / {pagination.pages} · {pagination.total} items
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded border border-slate-200 px-2 py-1 disabled:opacity-40"
                disabled={pagination.page <= 1}
                onClick={() => load(pagination.page - 1)}
              >
                Prev
              </button>
              <button
                type="button"
                className="rounded border border-slate-200 px-2 py-1 disabled:opacity-40"
                disabled={pagination.page >= pagination.pages}
                onClick={() => load(pagination.page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
