import { useState, useEffect } from 'react'
import { useParams, useOutletContext, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Check, X, Globe, Send, Edit, Eye, Loader2, Copy, RefreshCw } from 'lucide-react'
import { StatusBadge } from '../components/ui/StatusBadge'
import { ConfirmModal } from '../components/ui/Modal'
import api, { API_TIMEOUT_LONG_MS } from '../utils/api'

export const BlogDetail = () => {
  const { id } = useParams()
  const { toast } = useOutletContext()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)
  const [confirm, setConfirm] = useState({ open: false, type: '' })
  const [previewMode, setPreviewMode] = useState(true)
  const [keywordInput, setKeywordInput] = useState('')

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/blogs/${id}`)
      setBlog(res.data)
      setForm({
        title: res.data.title,
        content: res.data.content,
        metaTitle: res.data.metaTitle || '',
        metaDescription: res.data.metaDescription || '',
        keywords: res.data.keywords || [],
        tags: res.data.tags || [],
      })
    } catch (err) {
      toast.error(err.message)
      navigate('/blogs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await api.put(`/blogs/${id}`, form)
      setBlog(res.data)
      setEditing(false)
      toast.success('Blog updated successfully!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleAction = async (action) => {
    setActionLoading(action)
    try {
      let res
      if (action === 'approve') res = await api.post(`/blogs/${id}/approve`)
      else if (action === 'reject') res = await api.post(`/blogs/${id}/reject`)
      else if (action === 'publish') res = await api.post(`/blogs/${id}/publish`)
      setBlog(res.data)
      toast.success(res.message)
      if (action === 'approve') {
        window.location.href = '/blog'
        return
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setActionLoading(null)
      setConfirm({ open: false, type: '' })
    }
  }

  const handleSendApproval = async (via) => {
    setActionLoading('send-' + via)
    try {
      const res = await api.post(`/blogs/${id}/send-approval`, { via })
      toast.success(res.message)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const runRegenerateFromAi = async () => {
    const topic = String(blog.topic || blog.title || '').trim()
    if (!topic) {
      toast.error('No topic or title to regenerate from.')
      setConfirm({ open: false, type: '' })
      return
    }
    setActionLoading('regenerate')
    try {
      const kw = Array.isArray(form.keywords) ? form.keywords : []
      const res = await api.post(
        '/generate-blog',
        {
          topic,
          keywords: kw,
          tone: blog.tone || 'professional',
          customInstructions: `Rewrite this Compare Bazaar article. Keep the same URL slug "${blog.slug}" in mind (do not output slug in HTML). Current working title theme: "${String(form.title || '').slice(0, 200)}". Produce a fresh full HTML article with hero banner per site template.`,
        },
        { timeout: API_TIMEOUT_LONG_MS }
      )
      const d = res.data
      if (!d?.content) {
        toast.error('Generation returned no content.')
        return
      }
      setForm((prev) => ({
        ...prev,
        title: d.title || prev.title,
        content: d.content,
        metaTitle: d.metaTitle ?? prev.metaTitle,
        metaDescription: d.metaDescription ?? prev.metaDescription,
        keywords: Array.isArray(d.keywords) && d.keywords.length ? d.keywords : prev.keywords,
        tags: Array.isArray(d.tags) && d.tags.length ? d.tags : prev.tags,
      }))
      toast.success('New AI draft loaded — review fields, then Save Changes.')
      setConfirm({ open: false, type: '' })
    } catch (err) {
      toast.error(err.message || 'Regenerate failed')
    } finally {
      setActionLoading(null)
    }
  }

  const addKeyword = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const kw = keywordInput.trim()
      if (kw && !form.keywords.includes(kw)) {
        setForm({ ...form, keywords: [...form.keywords, kw] })
        setKeywordInput('')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    )
  }

  if (!blog) return null

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/blogs')} className="btn-secondary p-2">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 line-clamp-1">{blog.title}</h1>
              <StatusBadge status={blog.status} />
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {blog.wordCount || 0} words · {blog.readingTime || 1} min read · Created {new Date(blog.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          {!editing && (
            <button onClick={() => setEditing(true)} className="btn-secondary">
              <Edit className="w-4 h-4" /> Edit
            </button>
          )}

          {editing && (
            <>
              <button type="button" onClick={() => setEditing(false)} className="btn-secondary">
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                type="button"
                onClick={() => setConfirm({ open: true, type: 'regenerate' })}
                disabled={!!actionLoading || saving}
                className="btn-secondary"
                title="Fetch a new Claude draft using this blog’s topic & keywords"
              >
                {actionLoading === 'regenerate' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Regenerate
              </button>
              <button type="button" onClick={handleSave} disabled={saving || !!actionLoading} className="btn-primary">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </>
          )}

          {blog.status === 'pending' && !editing && (
            <>
              <button onClick={() => setConfirm({ open: true, type: 'approve' })} className="btn-success" disabled={!!actionLoading}>
                <Check className="w-4 h-4" /> Approve
              </button>
              <button onClick={() => setConfirm({ open: true, type: 'reject' })} className="btn-danger" disabled={!!actionLoading}>
                <X className="w-4 h-4" /> Reject
              </button>
            </>
          )}

          {blog.status === 'approved' && !editing && (
            <button onClick={() => setConfirm({ open: true, type: 'publish' })} className="btn-primary" disabled={!!actionLoading}>
              {actionLoading === 'publish' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
              Publish
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="xl:col-span-2 space-y-5">
          {!editing && previewMode ? (
            <>
              <div className="flex items-center justify-between gap-3 border-b border-gray-200 pb-3 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Live preview</h3>
                <button type="button" onClick={() => setPreviewMode(false)} className="btn-secondary text-xs">
                  <Edit className="w-3.5 h-3.5" /> Raw HTML
                </button>
              </div>
              <div
                className="blog-preview blog-cms-html prose prose-lg max-w-none text-gray-700 dark:prose-invert pt-2 pb-8 [&_.prose]:max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950/40">
              <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 border-b border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{editing ? 'Edit content' : 'Content'}</h3>
                {editing ? (
                  <button
                    type="button"
                    onClick={() => setConfirm({ open: true, type: 'regenerate' })}
                    disabled={!!actionLoading || saving}
                    className="btn-secondary text-xs"
                  >
                    {actionLoading === 'regenerate' ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5" />
                    )}
                    Regenerate
                  </button>
                ) : (
                  <button type="button" onClick={() => setPreviewMode(true)} className="btn-secondary text-xs">
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                )}
              </div>
              <div className="p-5">
                {editing ? (
                  <>
                    <label className="label">Title</label>
                    <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input mb-4" />
                    <label className="label">Content (HTML)</label>
                    <textarea
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      rows={20}
                      className="input font-mono text-xs resize-none"
                    />
                  </>
                ) : (
                  <pre className="text-xs font-mono text-gray-600 dark:text-gray-400 whitespace-pre-wrap overflow-x-auto">
                    {blog.content}
                  </pre>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* SEO */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Meta Title</label>
                {editing ? (
                  <input value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} className="input" maxLength={70} />
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">{blog.metaTitle || '—'}</p>
                )}
                {editing && <p className="text-xs text-gray-400 mt-1">{form.metaTitle?.length || 0}/70 chars</p>}
              </div>
              <div>
                <label className="label">Meta Description</label>
                {editing ? (
                  <textarea value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} className="input resize-none" rows={3} maxLength={160} />
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">{blog.metaDescription || '—'}</p>
                )}
                {editing && <p className="text-xs text-gray-400 mt-1">{form.metaDescription?.length || 0}/160 chars</p>}
              </div>
              <div>
                <label className="label">Keywords</label>
                {editing ? (
                  <>
                    <div className="flex flex-wrap gap-1.5 p-2 border rounded-xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 min-h-[44px]">
                      {form.keywords.map((kw) => (
                        <span key={kw} className="flex items-center gap-1 bg-brand-light text-brand text-xs px-2 py-0.5 rounded-full">
                          {kw} <button type="button" onClick={() => setForm({ ...form, keywords: form.keywords.filter((k) => k !== kw) })}><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                      <input value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} onKeyDown={addKeyword} placeholder="+ keyword" className="outline-none bg-transparent text-xs text-gray-700 dark:text-gray-300 placeholder-gray-400 flex-1 min-w-[80px]" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {blog.keywords?.map((kw) => (
                      <span key={kw} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">{kw}</span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="label">URL Slug</label>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 font-mono text-xs flex-1 truncate">{blog.slug}</p>
                  <button onClick={() => { navigator.clipboard.writeText(blog.slug); toast.info('Slug copied!') }} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Send for approval */}
          {blog.status === 'pending' && (
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Notify Telegram</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Approval emails are off — only Telegram alerts.</p>
              <button onClick={() => handleSendApproval('telegram')} disabled={!!actionLoading} className="btn-primary w-full justify-center text-sm">
                {actionLoading === 'send-telegram' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send via Telegram
              </button>
            </div>
          )}

          {/* Blog info */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Blog Details</h3>
            <dl className="space-y-3">
              {[
                { label: 'Status', value: <StatusBadge status={blog.status} /> },
                { label: 'Created', value: new Date(blog.createdAt).toLocaleDateString() },
                { label: 'Updated', value: new Date(blog.updatedAt).toLocaleDateString() },
                blog.approvedAt && { label: 'Approved', value: new Date(blog.approvedAt).toLocaleDateString() },
                blog.publishedAt && { label: 'Published', value: new Date(blog.publishedAt).toLocaleDateString() },
                { label: 'Tone', value: blog.tone || 'professional' },
                { label: 'Words', value: blog.wordCount || 0 },
                { label: 'Read time', value: `${blog.readingTime || 1} min` },
                (blog.status === 'approved' || blog.status === 'published') && {
                  label: 'Page views',
                  value: (blog.viewCount ?? 0).toLocaleString('en-US'),
                },
              ].filter(Boolean).map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start">
                  <dt className="text-xs text-gray-400 uppercase tracking-wide">{label}</dt>
                  <dd className="text-sm text-gray-700 dark:text-gray-300 font-medium text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Confirm modals */}
      <ConfirmModal isOpen={confirm.open && confirm.type === 'approve'} onClose={() => setConfirm({ open: false })} onConfirm={() => handleAction('approve')} title="Approve Blog" message="Approve this blog? It will be ready to publish." confirmText="Approve" loading={actionLoading === 'approve'} />
      <ConfirmModal isOpen={confirm.open && confirm.type === 'reject'} onClose={() => setConfirm({ open: false })} onConfirm={() => handleAction('reject')} title="Reject Blog" message="Reject this blog? You can still edit and re-approve it later." confirmText="Reject" danger loading={actionLoading === 'reject'} />
      <ConfirmModal isOpen={confirm.open && confirm.type === 'publish'} onClose={() => setConfirm({ open: false })} onConfirm={() => handleAction('publish')} title="Publish Blog" message="Publish this blog to your website? It will be made live." confirmText="Publish Now" loading={actionLoading === 'publish'} />
      <ConfirmModal
        isOpen={confirm.open && confirm.type === 'regenerate'}
        onClose={() => setConfirm({ open: false, type: '' })}
        onConfirm={() => runRegenerateFromAi()}
        title="Regenerate with AI"
        message="Claude will replace title, HTML body, meta fields, and keywords in the editor with a new draft (compare-bazaar.com voice). Slug stays the same until you save. Continue?"
        confirmText="Regenerate"
        loading={actionLoading === 'regenerate'}
      />
    </div>
  )
}
