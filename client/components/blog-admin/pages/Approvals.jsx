import { useState, useEffect, useCallback } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import {
  Clock,
  Check,
  X,
  Eye,
  Send,
  Loader2,
  Globe,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  BarChart2,
} from 'lucide-react'
import api from '../utils/api'

const PAGE_SIZE = 5

export const Approvals = () => {
  const { toast } = useOutletContext()
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [pendingPage, setPendingPage] = useState(1)
  const [pendingPagination, setPendingPagination] = useState({ total: 0, page: 1, pages: 1 })
  const [approvedList, setApprovedList] = useState([])
  const [approvedPage, setApprovedPage] = useState(1)
  const [approvedPagination, setApprovedPagination] = useState({ total: 0, page: 1, pages: 1 })
  const [publishedList, setPublishedList] = useState([])
  const [publishedPage, setPublishedPage] = useState(1)
  const [publishedPagination, setPublishedPagination] = useState({ total: 0, page: 1, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [approvedLoading, setApprovedLoading] = useState(true)
  const [publishedLoading, setPublishedLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)

  const fetchPending = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/blogs', {
        params: { status: 'pending', page: pendingPage, limit: PAGE_SIZE },
      })
      setBlogs(res.data || [])
      if (res.pagination) setPendingPagination(res.pagination)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [pendingPage])

  const fetchApproved = useCallback(async () => {
    setApprovedLoading(true)
    try {
      const res = await api.get('/blogs', {
        params: { status: 'approved', page: approvedPage, limit: PAGE_SIZE },
      })
      setApprovedList(res.data || [])
      if (res.pagination) setApprovedPagination(res.pagination)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setApprovedLoading(false)
    }
  }, [approvedPage])

  const fetchPublished = useCallback(async () => {
    setPublishedLoading(true)
    try {
      const res = await api.get('/blogs', {
        params: { status: 'published', page: publishedPage, limit: PAGE_SIZE, sortBy: 'publishedAt', sortOrder: 'desc' },
      })
      setPublishedList(res.data || [])
      if (res.pagination) setPublishedPagination(res.pagination)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setPublishedLoading(false)
    }
  }, [publishedPage])

  useEffect(() => {
    fetchPending()
  }, [fetchPending])

  useEffect(() => {
    fetchApproved()
  }, [fetchApproved])

  useEffect(() => {
    fetchPublished()
  }, [fetchPublished])

  const refreshAll = () => {
    fetchPending()
    fetchApproved()
    fetchPublished()
  }

  const handleAction = async (action, blogId) => {
    setActionLoading(blogId + action)
    try {
      let res
      if (action === 'approve') res = await api.post(`/blogs/${blogId}/approve`)
      else if (action === 'reject') res = await api.post(`/blogs/${blogId}/reject`)
      toast.success(res.message)
      refreshAll()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const handleSendAllTelegram = async () => {
    try {
      const res = await api.get('/blogs', { params: { status: 'pending', page: 1, limit: 200 } })
      const allPending = res.data || []
      toast.info(`Sending ${allPending.length} pending blogs via Telegram…`)
      for (const blog of allPending) {
        try {
          await api.post(`/blogs/${blog._id}/send-approval`, { via: 'telegram' })
        } catch {}
      }
      toast.success('Telegram notifications sent for all pending blogs.')
      fetchPending()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="space-y-10 animate-fade-in">
      {/* —— Pending —— */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Approval Queue</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              {pendingPagination.total} awaiting review · {PAGE_SIZE} per page
            </p>
          </div>
          {pendingPagination.total > 0 && (
            <button type="button" onClick={() => handleSendAllTelegram()} className="btn-secondary text-sm">
              <Send className="w-4 h-4" /> Send all pending via Telegram
            </button>
          )}
        </div>

        {loading ? (
          <div className="divide-y divide-gray-100 border-t border-gray-200 dark:divide-gray-800 dark:border-gray-800">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="py-5 animate-pulse">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3 max-w-lg" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 max-w-md" />
                </div>
              ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="border-t border-gray-200 dark:border-gray-800 py-14 px-4 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800/90">
              <Check className="h-7 w-7 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-gray-900 dark:text-gray-100">All caught up</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Nothing pending review.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200 border-t border-b border-gray-200 dark:divide-gray-800 dark:border-gray-800">
              {blogs.map((blog) => (
                <div key={blog._id} className="py-5 sm:py-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{blog.title}</h3>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                        <span>{blog.wordCount || 0} words</span>
                        <span>{blog.readingTime || 1} min read</span>
                        <span>Created {new Date(blog.createdAt).toLocaleDateString()}</span>
                        {blog.topic && <span>Topic: {blog.topic}</span>}
                      </div>
                      {blog.metaDescription && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{blog.metaDescription}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => navigate(`/blogs/${blog._id}`)} className="btn-secondary text-xs">
                        <Eye className="w-3.5 h-3.5" /> Review
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction('approve', blog._id)}
                        disabled={!!actionLoading}
                        className="btn-success text-xs"
                      >
                        {actionLoading === blog._id + 'approve' ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction('reject', blog._id)}
                        disabled={!!actionLoading}
                        className="btn-danger text-xs"
                      >
                        {actionLoading === blog._id + 'reject' ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <X className="w-3.5 h-3.5" />
                        )}
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {pendingPagination.pages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Page {pendingPagination.page} of {pendingPagination.pages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPendingPage((p) => Math.max(1, p - 1))}
                    disabled={pendingPage <= 1}
                    className="btn-secondary gap-1.5 px-3 py-2 text-sm disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingPage((p) => Math.min(pendingPagination.pages, p + 1))}
                    disabled={pendingPage >= pendingPagination.pages}
                    className="btn-primary gap-1.5 px-4 py-2 text-sm disabled:opacity-40"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* —— Approved (not yet live) —— */}
      <section className="space-y-4 border-t border-gray-200 dark:border-gray-800 pt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Ready to publish</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              {approvedPagination.total} approved — not on the public blog until you hit Publish · {PAGE_SIZE} per page
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate({ pathname: '/blogs', search: '?status=approved' })}
            className="text-sm font-semibold text-brand hover:underline"
          >
            Open in Blog Management
          </button>
        </div>

        {approvedLoading ? (
          <div className="divide-y divide-gray-100 border-t border-gray-200 dark:divide-gray-800 dark:border-gray-800">
            {Array(2)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="py-4 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 max-w-lg" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 max-w-md" />
                </div>
              ))}
          </div>
        ) : approvedList.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-1">
            No posts in this step. Approve items from the queue above; after that, publish them — then they appear in{' '}
            <strong className="text-gray-700 dark:text-gray-300">Published</strong> below.
          </p>
        ) : (
          <>
            <div className="divide-y divide-gray-200 border-t border-b border-gray-200 dark:divide-gray-800 dark:border-gray-800">
              {approvedList.map((blog) => (
                <div key={blog._id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">{blog.title}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5 text-xs text-gray-400">
                      {blog.topic && <span>{blog.topic}</span>}
                      <span>{blog.wordCount || 0} words</span>
                      {blog.approvedAt && <span>Approved {new Date(blog.approvedAt).toLocaleDateString()}</span>}
                      <span className="inline-flex items-center gap-0.5">
                        <BarChart2 className="w-3 h-3 opacity-80" aria-hidden />
                        {(blog.viewCount ?? 0).toLocaleString('en-US')} views
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/blogs/${blog._id}`)}
                    className="btn-primary text-xs gap-1 shrink-0"
                  >
                    <Globe className="w-3.5 h-3.5" /> Publish
                  </button>
                </div>
              ))}
            </div>
            {approvedPagination.pages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(approvedPage - 1) * PAGE_SIZE + 1}–{Math.min(approvedPage * PAGE_SIZE, approvedPagination.total)} of{' '}
                  {approvedPagination.total}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setApprovedPage((p) => Math.max(1, p - 1))}
                    disabled={approvedPage <= 1}
                    className="btn-secondary gap-1.5 px-3 py-2 text-sm disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setApprovedPage((p) => Math.min(approvedPagination.pages, p + 1))}
                    disabled={approvedPage >= approvedPagination.pages}
                    className="btn-primary gap-1.5 px-4 py-2 text-sm disabled:opacity-40"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* —— Published (live) —— */}
      <section className="space-y-4 border-t border-gray-200 dark:border-gray-800 pt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Published</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              {publishedPagination.total} live on <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">/blog</code> · newest first ·{' '}
              {PAGE_SIZE} per page
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate({ pathname: '/blogs', search: '?status=published' })}
            className="text-sm font-semibold text-brand hover:underline"
          >
            Manage all in table
          </button>
        </div>

        {publishedLoading ? (
          <div className="divide-y divide-gray-100 border-t border-gray-200 dark:divide-gray-800 dark:border-gray-800">
            {Array(2)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="py-4 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 max-w-lg" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 max-w-md" />
                </div>
              ))}
          </div>
        ) : publishedList.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No published posts yet.</p>
        ) : (
          <>
            <div className="divide-y divide-gray-200 border-t border-b border-gray-200 dark:divide-gray-800 dark:border-gray-800">
              {publishedList.map((blog) => (
                <div key={blog._id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">{blog.title}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5 text-xs text-gray-400">
                      {blog.slug && (
                        <span className="font-mono truncate max-w-[200px] sm:max-w-xs" title={blog.slug}>
                          /blog/{blog.slug}
                        </span>
                      )}
                      {blog.publishedAt && <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>}
                      <span className="inline-flex items-center gap-0.5 text-gray-500 dark:text-gray-400">
                        <BarChart2 className="w-3 h-3 opacity-80" aria-hidden />
                        {(blog.viewCount ?? 0).toLocaleString('en-US')} views
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button type="button" onClick={() => navigate(`/blogs/${blog._id}`)} className="btn-secondary text-xs gap-1">
                      <Eye className="w-3.5 h-3.5" /> Admin
                    </button>
                    {blog.slug ? (
                      <a
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-xs gap-1 inline-flex items-center"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Live
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
            {publishedPagination.pages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(publishedPage - 1) * PAGE_SIZE + 1}–{Math.min(publishedPage * PAGE_SIZE, publishedPagination.total)} of{' '}
                  {publishedPagination.total}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPublishedPage((p) => Math.max(1, p - 1))}
                    disabled={publishedPage <= 1}
                    className="btn-secondary gap-1.5 px-3 py-2 text-sm disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setPublishedPage((p) => Math.min(publishedPagination.pages, p + 1))}
                    disabled={publishedPage >= publishedPagination.pages}
                    className="btn-primary gap-1.5 px-4 py-2 text-sm disabled:opacity-40"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
