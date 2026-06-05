import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import axios from 'axios'
import { X, Loader2, CheckCircle2, FileText, ImageIcon } from 'lucide-react'
import { API_TIMEOUT_LONG_MS } from '../../utils/api'
import {
  WhitePaperSeoFields,
  emptySeoForm,
  seoFormFromPaper,
  seoFormToPayload,
} from './WhitePaperSeoFields'
import {
  WhitePaperHighlightQuestions,
  highlightQuestionsFromPaper,
  highlightQuestionsToPayload,
} from './WhitePaperHighlightQuestions'

function getBlogAdminBaseURL() {
  const fromEnv = process.env.NEXT_PUBLIC_BLOG_ADMIN_API_BASE
  if (fromEnv && String(fromEnv).trim()) return String(fromEnv).replace(/\/$/, '')
  if (process.env.NODE_ENV === 'development') return 'http://127.0.0.1:5000/api/v1/blog-admin'
  return '/api/v1/blog-admin'
}

export function WhitePaperUploadDrawer({ open, onClose, onPublished, toast, editingPaper = null }) {
  const [mounted, setMounted] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [offeredBy, setOfferedBy] = useState('Compare Bazaar')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [pdf, setPdf] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbPreview, setThumbPreview] = useState(null)
  const [extractingPdf, setExtractingPdf] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [published, setPublished] = useState(null)
  const [seo, setSeo] = useState(emptySeoForm)
  const [highlightQuestions, setHighlightQuestions] = useState([])
  const [savingSeo, setSavingSeo] = useState(false)

  const [isDark, setIsDark] = useState(false)
  const isEditMode = Boolean(editingPaper?._id)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    if (!editingPaper) {
      setSeo(emptySeoForm())
      setHighlightQuestions([])
      return
    }
    setTitle(editingPaper.title || '')
    setDescription(editingPaper.description || '')
    setOfferedBy(editingPaper.metadata?.offeredBy || 'Compare Bazaar')
    setAuthor(editingPaper.metadata?.author || '')
    setCategory(editingPaper.metadata?.category || '')
    setPdf(null)
    setThumbnail(null)
    setThumbPreview(editingPaper.thumbnailUrl || null)
    setPublished(null)
    setSeo(seoFormFromPaper(editingPaper))
    setHighlightQuestions(highlightQuestionsFromPaper(editingPaper))
  }, [open, editingPaper])

  useEffect(() => {
    if (!open) return
    const read = () => setIsDark(document.documentElement.classList.contains('dark'))
    read()
    const obs = new MutationObserver(read)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [open])

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setOfferedBy('Compare Bazaar')
    setAuthor('')
    setCategory('')
    setPdf(null)
    setThumbnail(null)
    setThumbPreview(null)
    setExtractingPdf(false)
    setPublished(null)
    setSeo(emptySeoForm())
    setHighlightQuestions([])
  }

  const handleClose = () => {
    if (submitting) return
    resetForm()
    onClose()
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape' && !submitting) handleClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, submitting])

  useEffect(() => {
    if (!thumbnail) {
      setThumbPreview(null)
      return
    }
    const url = URL.createObjectURL(thumbnail)
    setThumbPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [thumbnail])

  const handlePdfChange = async (file) => {
    setPdf(file || null)
    if (!file) return

    setExtractingPdf(true)
    try {
      const token = localStorage.getItem('admin_token')
      const base = getBlogAdminBaseURL()
      const form = new FormData()
      form.append('pdf', file)
      const res = await axios.post(`${base}/whitepapers/preview`, form, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'multipart/form-data',
        },
        timeout: API_TIMEOUT_LONG_MS,
      })
      const data = res.data?.data || {}
      if (data.title && !title.trim()) setTitle(data.title)
      if (data.description && !description.trim()) setDescription(data.description)
      toast.success('PDF read complete. Title & description auto-filled.')
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to read PDF'
      toast.error(msg)
    } finally {
      setExtractingPdf(false)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!isEditMode && (!pdf || !thumbnail)) {
      toast.error('PDF and thumbnail are required')
      return
    }

    const form = new FormData()
    form.append('pdf', pdf)
    form.append('thumbnail', thumbnail)
    form.append('title', title.trim())
    form.append('description', description.trim())
    form.append(
      'metadata',
      JSON.stringify({
        offeredBy: offeredBy.trim(),
        author: author.trim(),
        category: category.trim(),
      })
    )
    form.append('highlightQuestions', JSON.stringify(highlightQuestionsToPayload(highlightQuestions)))
    if (isEditMode) {
      form.append('seo', JSON.stringify(seoFormToPayload(seo)))
    }

    setSubmitting(true)
    setPublished(null)
    try {
      const token = localStorage.getItem('admin_token')
      const base = getBlogAdminBaseURL()
      const endpoint = isEditMode ? `${base}/whitepapers/${editingPaper._id}` : `${base}/whitepapers`
      const method = isEditMode ? 'put' : 'post'
      const res = await axios[method](endpoint, form, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'multipart/form-data',
        },
        timeout: API_TIMEOUT_LONG_MS,
      })
      const data = res.data?.data
      setPublished(data)
      setSeo(seoFormFromPaper(data))
      toast.success(res.data?.message || (isEditMode ? 'Updated successfully' : 'Published successfully'))
      onPublished?.(data)
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Upload failed'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (!open || !mounted) return null

  return createPortal(
    <div className="blog-admin-drawer-root" role="presentation">
      <button
        type="button"
        className="blog-admin-drawer-backdrop"
        aria-label="Close panel"
        onClick={handleClose}
      />

      <aside
        className={`blog-admin-drawer-panel blog-admin-root font-sans antialiased ${isDark ? 'dark' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wp-drawer-title"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <div className="min-w-0 pr-3">
            <h2 id="wp-drawer-title" className="truncate text-lg font-semibold text-gray-900 dark:text-gray-100">
              {published ? (isEditMode ? 'Updated' : 'Published') : isEditMode ? 'Edit white paper' : 'New white paper'}
            </h2>
            {!published && (
              <p className="mt-0.5 text-xs text-gray-500">SEO auto-generated from PDF</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-40 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          {published ? (
            <SuccessView
              published={published}
              thumbPreview={thumbPreview}
              seo={seo}
              setSeo={setSeo}
              savingSeo={savingSeo}
              onSaveSeo={async () => {
                setSavingSeo(true)
                try {
                  const token = localStorage.getItem('admin_token')
                  const base = getBlogAdminBaseURL()
                  const res = await axios.patch(
                    `${base}/whitepapers/${published._id}/seo`,
                    { seo: seoFormToPayload(seo) },
                    { headers: { Authorization: token ? `Bearer ${token}` : '' } }
                  )
                  const data = res.data?.data
                  setPublished(data)
                  setSeo(seoFormFromPaper(data))
                  toast.success('SEO saved')
                  onPublished?.(data)
                } catch (err) {
                  toast.error(err.response?.data?.message || err.message || 'Failed to save SEO')
                } finally {
                  setSavingSeo(false)
                }
              }}
            />
          ) : submitting ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-brand" />
              <p className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                {isEditMode ? 'Updating & regenerating SEO…' : 'Uploading & generating SEO…'}
              </p>
              <p className="mt-1 text-xs text-gray-500">Usually 30–90 seconds</p>
            </div>
          ) : (
            <form id="wp-upload-form" onSubmit={onSubmit} className="space-y-5">
              <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs leading-relaxed text-gray-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
                Upload PDF first. We auto-read it and prefill title, description and SEO context.
              </p>

              {extractingPdf && (
                <p className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
                  Reading PDF and extracting content...
                </p>
              )}

              <div className="space-y-1.5">
                <label className="label">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={300}
                  placeholder="Auto-filled from PDF (you can edit)"
                />
              </div>

              <div className="space-y-1.5">
                <label className="label">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="input min-h-[72px] resize-y py-3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={220}
                  placeholder="Short intro (1–2 sentences, max 220 characters)"
                />
                <p className="text-xs text-gray-400">{description.length}/220 characters</p>
              </div>

              <div className="space-y-1.5">
                <label className="label">Offered by</label>
                <input type="text" className="input" value={offeredBy} onChange={(e) => setOfferedBy(e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <label className="label">Author</label>
                <input
                  type="text"
                  className="input"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-1.5">
                <label className="label">Category</label>
                <input
                  type="text"
                  className="input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. CRM, Payroll"
                />
              </div>

              <WhitePaperHighlightQuestions
                questions={highlightQuestions}
                onChange={setHighlightQuestions}
              />

              <div className="space-y-1.5">
                <label className="label">
                  PDF file <span className="text-red-500">*</span>
                </label>
                <FileInput
                  accept="application/pdf"
                  file={pdf}
                  icon={FileText}
                  emptyLabel="Choose PDF"
                  onChange={handlePdfChange}
                />
              </div>

              <div className="space-y-1.5">
                <label className="label">
                  Thumbnail <span className="text-red-500">*</span>
                </label>
                <FileInput
                  accept="image/jpeg,image/png,image/webp"
                  file={thumbnail}
                  icon={ImageIcon}
                  emptyLabel="Choose image"
                  preview={thumbPreview}
                  onChange={setThumbnail}
                />
              </div>

              {isEditMode ? (
                <WhitePaperSeoFields seo={seo} onChange={setSeo} />
              ) : (
                <div className="rounded-lg border border-dashed border-gray-200 px-3 py-3 text-xs text-gray-500 dark:border-gray-700">
                  Google &amp; Open Graph SEO fields (title, keywords, OG tags) will appear here after you publish.
                </div>
              )}
            </form>
          )}
        </div>

        {!published && !submitting && (
          <footer className="shrink-0 border-t border-gray-200 bg-white px-5 py-4 dark:border-gray-800 dark:bg-gray-900">
            <button type="submit" form="wp-upload-form" className="btn-primary w-full justify-center py-3">
              {isEditMode ? 'Update white paper' : 'Submit & publish'}
            </button>
          </footer>
        )}

        {published && (
          <footer className="shrink-0 border-t border-gray-200 bg-white px-5 py-4 dark:border-gray-800 dark:bg-gray-900">
            <button type="button" onClick={handleClose} className="btn-secondary w-full justify-center py-3">
              Close
            </button>
          </footer>
        )}
      </aside>
    </div>,
    document.body
  )
}

function FileInput({ accept, file, icon: Icon, emptyLabel, preview, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors hover:border-gray-300 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600">
      {preview ? (
        <img src={preview} alt="" className="h-12 w-12 shrink-0 rounded-lg border border-gray-200 object-cover" />
      ) : (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-700">
          <Icon className="h-5 w-5" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-gray-800 dark:text-gray-200">
          {file ? file.name : emptyLabel}
        </span>
        <span className="text-xs text-gray-400">Click to replace</span>
      </span>
      <input
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
    </label>
  )
}

function SuccessView({ published, thumbPreview, seo, setSeo, onSaveSeo, savingSeo }) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 dark:border-green-900 dark:bg-green-950/40">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
        <div>
          <p className="text-sm font-semibold text-green-900 dark:text-green-100">Published</p>
          <p className="mt-0.5 text-xs text-green-800/90 dark:text-green-200/80">
            Review Claude SEO below — edit keywords or OG copy, then save.
          </p>
        </div>
      </div>

      {(published.thumbnailUrl || thumbPreview) && (
        <img
          src={published.thumbnailUrl || thumbPreview}
          alt=""
          className="mx-auto max-h-40 rounded-lg border border-gray-200 object-contain"
        />
      )}

      <WhitePaperSeoFields seo={seo} onChange={setSeo} />

      <button
        type="button"
        onClick={onSaveSeo}
        disabled={savingSeo}
        className="btn-secondary w-full justify-center py-3 disabled:opacity-50"
      >
        {savingSeo ? 'Saving SEO…' : 'Save SEO changes'}
      </button>

      <a
        href={`/resources/whitepaper/${published.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary flex w-full justify-center"
      >
        View live page
      </a>
    </div>
  )
}
