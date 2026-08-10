import { useState } from 'react'
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  FileEdit,
  LayoutTemplate,
  MousePointerClick,
  Save,
  Upload,
} from 'lucide-react'

const WORKFLOW_STEPS = [
  {
    icon: MousePointerClick,
    title: 'Select page',
    detail: 'Pick page type (Comparison or Quotes), then choose the page from the dropdown.',
  },
  {
    icon: FileEdit,
    title: 'Edit content',
    detail: 'Fill each section below — SEO, hero, products, table, FAQs. Right panel shows live preview.',
  },
  {
    icon: Eye,
    title: 'Preview',
    detail: 'Use Preview mode or check the right-side panel before publishing.',
  },
  {
    icon: Save,
    title: 'Save & publish',
    detail: 'Click Save & publish — changes go live on the public site within ~2 minutes.',
  },
]

const TEMPLATE_STEPS = [
  { icon: Download, text: 'Download Word or JSON template with current content' },
  { icon: FileEdit, text: 'Edit in Word / Google Docs — keep === SECTION === markers' },
  { icon: Upload, text: 'Upload .docx, .pdf, .json, or .md — fields auto-fill in the editor' },
]

export function ServicePageWriterGuide({ pageType = 'comparison' }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/[0.04] via-white to-cb-orange/[0.04] shadow-sm dark:border-brand/30 dark:from-brand/10 dark:via-gray-900 dark:to-gray-900">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <BookOpen className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-navy dark:text-white">Content writer guide</p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              How to edit {pageType === 'comparison' ? 'comparison / review' : 'quote landing'} pages step by step
            </p>
          </div>
        </div>
        {open ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
      </button>

      {open ? (
        <div className="space-y-5 border-t border-brand/10 px-5 pb-5 pt-4 dark:border-brand/20">
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">Main workflow</p>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {WORKFLOW_STEPS.map((step, index) => (
                <div
                  key={step.title}
                  className="relative rounded-xl border border-gray-200/80 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/80"
                >
                  <span className="absolute -top-2.5 left-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                    {index + 1}
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <step.icon className="h-4 w-4 text-brand" />
                    <p className="text-sm font-semibold text-navy dark:text-white">{step.title}</p>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-gray-300 bg-white/60 p-4 dark:border-gray-600 dark:bg-gray-900/50">
            <div className="mb-2 flex items-center gap-2">
              <LayoutTemplate className="h-4 w-4 text-cb-orange" />
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Bulk edit with template (optional)</p>
            </div>
            <ol className="space-y-2">
              {TEMPLATE_STEPS.map((step, index) => (
                <li key={index} className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-500 dark:bg-gray-800">
                    {index + 1}
                  </span>
                  <step.icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                  <span>{step.text}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px] text-gray-500 dark:text-gray-400">
            <span className="rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-700 ring-1 ring-amber-200/80 dark:bg-amber-900/20 dark:text-amber-300">
              First time? Click Import defaults once to load all pages into CMS
            </span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700 ring-1 ring-emerald-200/80 dark:bg-emerald-900/20 dark:text-emerald-300">
              Meta description: aim for 120–160 characters
            </span>
          </div>
        </div>
      ) : null}
    </div>
  )
}
