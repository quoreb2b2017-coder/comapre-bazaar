import { useRef, useState } from 'react'
import { Download, Upload, FileText, FileJson, Loader2 } from 'lucide-react'
import { blogAdminHttp, ensureBlogAdminBaseURL } from '../../utils/api'
import {
  buildComparisonMarkdownTemplate,
  buildQuoteMarkdownTemplate,
  downloadJsonTemplate,
  downloadTextFile,
  downloadWordTemplate,
} from '@/lib/servicePageTemplate'

export function ServicePageTemplateTools({
  pageType,
  selectedKey,
  comparisonContent,
  quoteConfig,
  onImportComparison,
  onImportQuote,
  toast,
  disabled = false,
}) {
  const fileRef = useRef(null)
  const [importing, setImporting] = useState(false)

  const slugSafe = selectedKey ? selectedKey.replace(/[^\w-]+/g, '-') : 'page'

  const handleDownloadJson = () => {
    if (pageType === 'comparison' && comparisonContent) {
      downloadJsonTemplate(`${slugSafe}-template.json`, comparisonContent)
      toast.success('JSON template downloaded')
    } else if (pageType === 'quote' && quoteConfig) {
      downloadJsonTemplate(`${slugSafe}-quote-template.json`, { pageKey: selectedKey, ...quoteConfig })
      toast.success('JSON template downloaded')
    } else {
      toast.warning('Load a page first before downloading template')
    }
  }

  const handleDownloadWord = () => {
    if (pageType === 'comparison' && comparisonContent) {
      const md = buildComparisonMarkdownTemplate(comparisonContent)
      downloadWordTemplate(`${slugSafe}-template.doc`, md)
      downloadTextFile(`${slugSafe}-template.md`, md, 'text/markdown;charset=utf-8')
      toast.success('Word (.doc) and Markdown templates downloaded')
    } else if (pageType === 'quote' && quoteConfig) {
      const md = buildQuoteMarkdownTemplate(quoteConfig)
      downloadWordTemplate(`${slugSafe}-quote-template.doc`, md)
      downloadTextFile(`${slugSafe}-quote-template.md`, md, 'text/markdown;charset=utf-8')
      toast.success('Word (.doc) and Markdown templates downloaded')
    } else {
      toast.warning('Load a page first before downloading template')
    }
  }

  const handleUploadClick = () => {
    if (!selectedKey) {
      toast.warning('Select a page first')
      return
    }
    fileRef.current?.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !selectedKey) return

    setImporting(true)
    try {
      await ensureBlogAdminBaseURL()
      const form = new FormData()
      form.append('file', file)

      if (pageType === 'comparison' && comparisonContent) {
        form.append('baseContent', JSON.stringify(comparisonContent))
      } else if (pageType === 'quote' && quoteConfig) {
        form.append('baseConfig', JSON.stringify(quoteConfig))
      }

      const endpoint =
        pageType === 'comparison'
          ? `/comparison-pages/${encodeURIComponent(selectedKey)}/import`
          : `/quote-pages/${encodeURIComponent(selectedKey)}/import`

      const res = await blogAdminHttp.post(endpoint, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      })

      const body = res.data
      if (!body?.success) {
        throw new Error(body?.message || 'Import failed')
      }

      if (pageType === 'comparison') {
        onImportComparison(body.data)
      } else {
        onImportQuote(body.data)
      }

      if (body.warnings?.length) {
        toast.warning(body.warnings.join(' · '))
      }
      toast.success(body.message || 'Content imported from file — review and Save & publish')
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || 'Upload failed')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-dashed border-brand/30 bg-brand/[0.03] p-5 dark:border-brand/40 dark:bg-brand/5">
      <div className="mb-4 flex items-center gap-2">
        <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand">
          Optional · Bulk edit
        </span>
        <p className="text-sm font-semibold text-navy dark:text-white">Template download & upload</p>
      </div>

      <div className="mb-4 grid gap-2 sm:grid-cols-3">
        {[
          { n: 1, text: 'Download JSON or Word template with current page content' },
          { n: 2, text: 'Edit offline — keep === SECTION === markers unchanged' },
          { n: 3, text: 'Upload file — all fields auto-fill in the editor below' },
        ].map((step) => (
          <div key={step.n} className="flex items-start gap-2 rounded-xl border border-gray-200/80 bg-white/80 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-900/60">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
              {step.n}
            </span>
            <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">{step.text}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          After upload, review fields in the editor → click <strong>Save & publish</strong>
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={disabled || importing}
            onClick={handleDownloadJson}
            className="btn-secondary inline-flex items-center gap-1.5 text-xs"
          >
            <FileJson className="h-3.5 w-3.5" /> JSON
          </button>
          <button
            type="button"
            disabled={disabled || importing}
            onClick={handleDownloadWord}
            className="btn-secondary inline-flex items-center gap-1.5 text-xs"
          >
            <Download className="h-3.5 w-3.5" /> Word + MD
          </button>
          <button
            type="button"
            disabled={disabled || importing || !selectedKey}
            onClick={handleUploadClick}
            className="btn-primary inline-flex items-center gap-1.5 text-xs"
          >
            {importing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {importing ? 'Reading file…' : 'Upload file'}
          </button>
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-400">
        <FileText className="h-3 w-3" />
        Supported: .json · .docx · .pdf · .md · .txt (max 15 MB). In Word, use Save As → .docx before upload.
      </p>
      <input
        ref={fileRef}
        type="file"
        accept=".json,.docx,.pdf,.md,.txt,application/json,application/pdf,text/plain"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
