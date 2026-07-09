import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Loader2, CheckCircle2, FileText, ImageIcon, Sparkles } from 'lucide-react'
import api, { API_TIMEOUT_LONG_MS, blogAdminHttp, ensureBlogAdminBaseURL, requireAdminToken } from '../../utils/api'
import {
  WhitePaperSeoFields,
  emptySeoForm,
  seoFormFromPaper,
  seoFormFromBasics,
  seoFormToPayload,
} from './WhitePaperSeoFields'
import {
  WhitePaperHighlightQuestions,
  highlightQuestionsFromPaper,
  highlightQuestionsToPayload,
} from './WhitePaperHighlightQuestions'

function claudeContentFromResponse(data) {
  if (!data) return null
  return {
    slug: data.slug,
    seoTitle: data.seoTitle,
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    metaKeywords: data.metaKeywords,
    ogTitle: data.ogTitle,
    ogDescription: data.ogDescription,
    structuredSeoContent: data.structuredSeoContent,
    insideOverview: data.insideOverview,
    insideSections: data.insideSections,
    testimonialsHeading: data.testimonialsHeading,
    testimonials: data.testimonials,
  }
}

export function WhitePaperUploadDrawer({ open, onClose, onPublished, toast, editingPaper = null }) {
  const [mounted, setMounted] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [offeredBy, setOfferedBy] = useState('Compare Bazaar')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [resourceType, setResourceType] = useState('whitepaper')
  const [pdf, setPdf] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbPreview, setThumbPreview] = useState(null)
  const [extractingPdf, setExtractingPdf] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [published, setPublished] = useState(null)
  const [seo, setSeo] = useState(emptySeoForm)
  const [highlightQuestions, setHighlightQuestions] = useState([])
  const [savingSeo, setSavingSeo] = useState(false)
  const [seoMode, setSeoMode] = useState('claude')
  const [generatingClaude, setGeneratingClaude] = useState(false)
  const [claudeSeoReady, setClaudeSeoReady] = useState(false)
  const [claudeContent, setClaudeContent] = useState(null)

  const [isDark, setIsDark] = useState(false)
  const isEditMode = Boolean(editingPaper?._id)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    if (!editingPaper) {
      setSeo(emptySeoForm())
      setHighlightQuestions([])
      setResourceType('whitepaper')
      setSeoMode('claude')
      setClaudeSeoReady(false)
      setClaudeContent(null)
      return
    }
    setTitle(editingPaper.title || '')
    setDescription(editingPaper.description || '')
    setOfferedBy(editingPaper.metadata?.offeredBy || 'Compare Bazaar')
    setAuthor(editingPaper.metadata?.author || '')
    setCategory(editingPaper.metadata?.category || '')
    setResourceType(editingPaper.metadata?.resourceType === 'report' ? 'report' : 'whitepaper')
    setPdf(null)
    setThumbnail(null)
    setThumbPreview(editingPaper.thumbnailUrl || null)
    setPublished(null)
    setSeo(seoFormFromPaper(editingPaper))
    setHighlightQuestions(highlightQuestionsFromPaper(editingPaper))
    setSeoMode('manual')
    setClaudeSeoReady(false)
    setClaudeContent(null)
  }, [open, editingPaper])

  useEffect(() => {
    if (!open) return
    ensureBlogAdminBaseURL().catch(() => {})
  }, [open])

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
    setResourceType('whitepaper')
    setPdf(null)
    setThumbnail(null)
    setThumbPreview(null)
    setExtractingPdf(false)
    setPublished(null)
    setSeo(emptySeoForm())
    setHighlightQuestions([])
    setSeoMode('claude')
    setClaudeSeoReady(false)
    setClaudeContent(null)
    setGeneratingClaude(false)
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
    setClaudeSeoReady(false)
    setClaudeContent(null)
    if (!file) return

    setExtractingPdf(true)
    try {
      if (!requireAdminToken(toast)) return
      const form = new FormData()
      form.append('pdf', file)
      const res = await blogAdminHttp.post('/whitepapers/preview', form, {
        timeout: API_TIMEOUT_LONG_MS,
      })
      const data = res.data?.data || {}
      if (seoMode === 'claude') {
        if (data.title && !title.trim()) setTitle(data.title)
        if (data.description && !description.trim()) setDescription(data.description)
        toast.success('PDF read complete. Title & description auto-filled.')
      } else {
        toast.success('PDF uploaded. Fill fields manually below.')
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to read PDF'
      toast.error(msg)
    } finally {
      setExtractingPdf(false)
    }
  }

  const metadataPayload = () => ({
    offeredBy: offeredBy.trim(),
    author: author.trim(),
    category: category.trim(),
    resourceType,
  })

  const handleGenerateClaude = async () => {
    if (!pdf && !isEditMode) {
      toast.error('Upload a PDF first')
      return
    }
    if (!title.trim()) {
      toast.error('Add a title before generating SEO')
      return
    }

    setGeneratingClaude(true)
    try {
      if (!requireAdminToken(toast)) return
      const form = new FormData()
      if (pdf) form.append('pdf', pdf)
      if (isEditMode) form.append('paperId', editingPaper._id)
      form.append('title', title.trim())
      form.append('description', description.trim())
      form.append('metadata', JSON.stringify(metadataPayload()))

      const res = await blogAdminHttp.post('/whitepapers/generate-seo', form, {
        timeout: API_TIMEOUT_LONG_MS,
      })

      const data = res.data?.data
      setSeo(seoFormFromPaper(data))
      setClaudeContent(claudeContentFromResponse(data))
      setClaudeSeoReady(true)
      toast.success('Claude SEO generated — edit any field, then publish')
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to generate SEO'
      toast.error(msg)
    } finally {
      setGeneratingClaude(false)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!isEditMode && (!pdf || !thumbnail)) {
      toast.error('PDF and thumbnail are required')
      return
    }
    if (seoMode === 'manual') {
      const seoPayload = seoFormToPayload(seo)
      if (!seoPayload.slug.trim()) {
        toast.error('URL slug is required in manual SEO section')
        return
      }
      if (!seoPayload.metaTitle.trim()) {
        toast.error('Google meta title is required in manual SEO section')
        return
      }
    }

    const form = new FormData()
    if (pdf) form.append('pdf', pdf)
    if (thumbnail) form.append('thumbnail', thumbnail)
    form.append('title', title.trim())
    form.append('description', description.trim())
    form.append('metadata', JSON.stringify(metadataPayload()))
    form.append('highlightQuestions', JSON.stringify(highlightQuestionsToPayload(highlightQuestions)))
    form.append('seoMode', seoMode)
    const seoPayload = seoFormToPayload(seo)
    if (seoMode === 'manual') {
      form.append('seo', JSON.stringify(seoPayload))
    } else if (claudeSeoReady && claudeContent) {
      form.append('seo', JSON.stringify(seoPayload))
      form.append('seoGenerated', 'true')
      form.append('claudeContent', JSON.stringify(claudeContent))
    }

    setSubmitting(true)
    setPublished(null)
    try {
      if (!requireAdminToken(toast)) return
      await ensureBlogAdminBaseURL()
      const endpoint = isEditMode ? `/whitepapers/${editingPaper._id}` : '/whitepapers'
      const method = isEditMode ? 'put' : 'post'
      const res = await blogAdminHttp[method](endpoint, form, {
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
              <p className="mt-0.5 text-xs text-gray-500">
                {seoMode === 'manual'
                  ? 'Manual SEO mode'
                  : claudeSeoReady
                    ? 'Claude SEO ready — edit fields before publish'
                    : 'Generate with Claude, then edit before publish'}
              </p>
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
              onSaveSeo={async ({ title: saveTitle, description: saveDescription }) => {
                setSavingSeo(true)
                try {
                  if (!requireAdminToken(toast)) return
                  const res = await api.patch(`/whitepapers/${published._id}/seo`, {
                    seo: seoFormToPayload(seo),
                    title: saveTitle?.trim(),
                    description: saveDescription?.trim(),
                  })
                  const data = res.data
                  setPublished(data)
                  setSeo(seoFormFromPaper(data))
                  toast.success('Changes saved')
                  onPublished?.(data)
                } catch (err) {
                  toast.error(err.response?.data?.message || err.message || 'Failed to save changes')
                } finally {
                  setSavingSeo(false)
                }
              }}
            />
          ) : submitting ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-brand" />
              <p className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                {isEditMode
                  ? seoMode === 'claude' && claudeSeoReady
                    ? 'Updating white paper with your edits…'
                    : seoMode === 'claude'
                      ? 'Updating & regenerating SEO with Claude…'
                      : 'Updating white paper…'
                  : seoMode === 'claude' && claudeSeoReady
                    ? 'Publishing with your edited SEO…'
                    : seoMode === 'claude'
                      ? 'Uploading & generating SEO with Claude…'
                      : 'Uploading with manual SEO…'}
              </p>
              <p className="mt-1 text-xs text-gray-500">Usually 30–90 seconds</p>
            </div>
          ) : (
            <form id="wp-upload-form" onSubmit={onSubmit} className="space-y-5">
              <ResourceTypeToggle value={resourceType} onChange={setResourceType} />

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

              <SeoModeToggle
                value={seoMode}
                onChange={(mode) => {
                  setSeoMode(mode)
                  if (mode === 'manual' && !seo.slug && (title.trim() || description.trim())) {
                    setSeo(seoFormFromBasics(title, description))
                  }
                }}
              />

              <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs leading-relaxed text-gray-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
                {seoMode === 'claude'
                  ? 'Click Generate with Claude to fill SEO fields. Edit anything you want, then publish — your edits are saved.'
                  : 'Manual mode: you fill title, description, and all SEO fields yourself. Claude will not run on publish.'}
              </p>

              {extractingPdf && (
                <p className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
                  Reading PDF…
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
                  onChange={(e) => {
                    const next = e.target.value
                    setTitle(next)
                    setSeo((prev) => ({ ...prev, seoTitle: next.slice(0, 70) }))
                  }}
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

              {seoMode === 'manual' ? (
                <WhitePaperSeoFields seo={seo} onChange={setSeo} variant="manual" />
              ) : (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleGenerateClaude}
                    disabled={generatingClaude || (!pdf && !isEditMode) || !title.trim()}
                    className="btn-secondary flex w-full items-center justify-center gap-2 py-3 disabled:opacity-50"
                  >
                    {generatingClaude ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating with Claude…
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        {claudeSeoReady ? 'Regenerate with Claude' : 'Generate with Claude'}
                      </>
                    )}
                  </button>
                  {claudeSeoReady ? (
                    <WhitePaperSeoFields seo={seo} onChange={setSeo} variant="claude" />
                  ) : (
                    <div className="rounded-lg border border-dashed border-gray-200 px-3 py-3 text-xs text-gray-500 dark:border-gray-700">
                      Generate first to preview SEO fields, or publish directly and Claude will run on publish.
                    </div>
                  )}
                </div>
              )}
            </form>
          )}
        </div>

        {!published && !submitting && (
          <footer className="shrink-0 border-t border-gray-200 bg-white px-5 py-4 dark:border-gray-800 dark:bg-gray-900">
            <button type="submit" form="wp-upload-form" className="btn-primary w-full justify-center py-3">
              {isEditMode
                ? seoMode === 'claude' && claudeSeoReady
                  ? 'Update with edited SEO'
                  : seoMode === 'claude'
                    ? 'Update & regenerate SEO'
                    : 'Update white paper'
                : seoMode === 'claude' && claudeSeoReady
                  ? 'Publish with edited SEO'
                  : seoMode === 'claude'
                    ? 'Publish with Claude SEO'
                    : 'Publish with manual SEO'}
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

function ResourceTypeToggle({ value, onChange }) {
  return (
    <div className="space-y-1.5">
      <label className="label mb-0">
        Resource type <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800/50">
        <button
          type="button"
          onClick={() => onChange('whitepaper')}
          className={`rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${
            value === 'whitepaper'
              ? 'bg-white font-semibold text-brand shadow-sm dark:bg-gray-900'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <span className="block text-sm font-semibold">Whitepaper</span>
          <span className="mt-0.5 block text-[11px] font-normal opacity-80">
            Long-form research PDF for download
          </span>
        </button>
        <button
          type="button"
          onClick={() => onChange('report')}
          className={`rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${
            value === 'report'
              ? 'bg-white font-semibold text-brand shadow-sm dark:bg-gray-900'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <span className="block text-sm font-semibold">Report</span>
          <span className="mt-0.5 block text-[11px] font-normal opacity-80">
            Shorter benchmark or buying guide PDF
          </span>
        </button>
      </div>
    </div>
  )
}

function SeoModeToggle({ value, onChange }) {
  return (
    <div className="space-y-1.5">
      <label className="label mb-0">Content &amp; SEO mode</label>
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800/50">
        <button
          type="button"
          onClick={() => onChange('claude')}
          className={`rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${
            value === 'claude'
              ? 'bg-white font-semibold text-brand shadow-sm dark:bg-gray-900'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <span className="block text-sm font-semibold">Claude auto</span>
          <span className="mt-0.5 block text-[11px] font-normal opacity-80">PDF → auto SEO + inside content</span>
        </button>
        <button
          type="button"
          onClick={() => onChange('manual')}
          className={`rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${
            value === 'manual'
              ? 'bg-white font-semibold text-brand shadow-sm dark:bg-gray-900'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          <span className="block text-sm font-semibold">Manual fill</span>
          <span className="mt-0.5 block text-[11px] font-normal opacity-80">You type all fields yourself</span>
        </button>
      </div>
    </div>
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
  const [title, setTitle] = useState(published.title || '')
  const [description, setDescription] = useState(published.description || '')

  useEffect(() => {
    setTitle(published.title || '')
    setDescription(published.description || '')
  }, [published.title, published.description])

  const handleTitleChange = (next) => {
    setTitle(next)
    setSeo((prev) => ({ ...prev, seoTitle: next.slice(0, 70) }))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 dark:border-green-900 dark:bg-green-950/40">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
        <div>
          <p className="text-sm font-semibold text-green-900 dark:text-green-100">Published</p>
          <p className="mt-0.5 text-xs text-green-800/90 dark:text-green-200/80">
            Edit title, description, or SEO below — then save your changes.
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

      <div className="space-y-1.5">
        <label className="label">Title</label>
        <input
          type="text"
          className="input"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          maxLength={300}
        />
      </div>

      <div className="space-y-1.5">
        <label className="label">Description</label>
        <textarea
          className="input min-h-[72px] resize-y py-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={220}
        />
        <p className="text-xs text-gray-400">{description.length}/220 characters</p>
      </div>

      <WhitePaperSeoFields seo={seo} onChange={setSeo} />

      <button
        type="button"
        onClick={() => onSaveSeo({ title, description })}
        disabled={savingSeo}
        className="btn-secondary w-full justify-center py-3 disabled:opacity-50"
      >
        {savingSeo ? 'Saving…' : 'Save changes'}
      </button>

      <a
        href={`/resources/whitepapers/${published.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary flex w-full justify-center"
      >
        View live page
      </a>
    </div>
  )
}
