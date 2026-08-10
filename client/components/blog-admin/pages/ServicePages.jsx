import { useEffect, useMemo, useState, useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Save,
  RefreshCw,
  ExternalLink,
  Eye,
  Pencil,
} from 'lucide-react'
import api from '../utils/api'
import { comparisonPages } from '@/data/comparisons'
import { quotePageSeedPayload } from '@/lib/quotePageCms'
import { ComparisonFullPreview, QuoteFullPreview } from '../components/service-pages/ServicePageFullPreview'
import { ComparisonPageEditor, QuotePageEditor, Field } from '../components/service-pages/ComparisonPageEditor'
import { BlogAdminSelect } from '../components/ui/BlogAdminSelect'
import { ServicePageTemplateTools } from '../components/service-pages/ServicePageTemplateTools'
import { ServicePageWriterGuide } from '../components/service-pages/ServicePageWriterGuide'

const VERTICAL_ORDER = ['marketing', 'sales', 'technology', 'human-resources', 'general']
const VERTICAL_LABELS = {
  marketing: 'Marketing',
  sales: 'Sales',
  technology: 'Technology',
  'human-resources': 'Human Resources',
  general: 'General',
}

const PAGE_TYPE_OPTIONS = [
  {
    value: 'comparison',
    label: 'Comparison / review pages',
    hint: 'CRM, payroll, email marketing hub pages',
  },
  {
    value: 'quote',
    label: 'Get free quotes pages',
    hint: 'Lead-gen quote landing pages',
  },
]

function unwrapApiList(res) {
  if (Array.isArray(res)) return res
  if (Array.isArray(res?.data)) return res.data
  return []
}

function canonicalToVertical(canonical = '') {
  if (canonical.includes('/marketing/')) return 'marketing'
  if (canonical.includes('/sales/')) return 'sales'
  if (canonical.includes('/technology/')) return 'technology'
  if (canonical.includes('/human-resources/')) return 'human-resources'
  return 'general'
}

function pageKeyToVertical(pageKey = '') {
  if (pageKey.startsWith('marketing/')) return 'marketing'
  if (pageKey.startsWith('sales/')) return 'sales'
  if (pageKey.startsWith('technology/')) return 'technology'
  if (pageKey.startsWith('human-resources/')) return 'human-resources'
  return 'general'
}

function buildPageOptions(pageType, comparisonList, quoteList) {
  const items = []

  if (pageType === 'comparison') {
    const cmsBySlug = new Map((comparisonList || []).map((p) => [p.slug, p]))
    const seen = new Set()

    for (const staticPage of comparisonPages) {
      seen.add(staticPage.slug)
      const cms = cmsBySlug.get(staticPage.slug)
      if (cms) {
        items.push({
          key: staticPage.slug,
          label: cms.displayName || cms.h1 || staticPage.h1 || staticPage.slug,
          vertical: cms.vertical || canonicalToVertical(cms.canonical || staticPage.canonical),
          canonical: cms.canonical || staticPage.canonical,
          updatedAt: cms.updatedAt ?? null,
          staticOnly: false,
        })
      } else {
        items.push({
          key: staticPage.slug,
          label: staticPage.h1,
          vertical: canonicalToVertical(staticPage.canonical),
          canonical: staticPage.canonical,
          updatedAt: null,
          staticOnly: true,
        })
      }
    }

    for (const cms of cmsBySlug.values()) {
      if (seen.has(cms.slug)) continue
      items.push({
        key: cms.slug,
        label: cms.displayName || cms.h1 || cms.slug,
        vertical: cms.vertical || canonicalToVertical(cms.canonical),
        canonical: cms.canonical,
        updatedAt: cms.updatedAt ?? null,
        staticOnly: false,
      })
    }
  } else {
    const staticQuotes = quotePageSeedPayload()
    const cmsByKey = new Map((quoteList || []).map((p) => [p.pageKey, p]))
    const seen = new Set()

    for (const staticQuote of staticQuotes) {
      seen.add(staticQuote.pageKey)
      const cms = cmsByKey.get(staticQuote.pageKey)
      if (cms) {
        items.push({
          key: staticQuote.pageKey,
          label: cms.displayName || cms.baseH1 || staticQuote.baseH1 || staticQuote.pageKey,
          vertical: cms.vertical || pageKeyToVertical(staticQuote.pageKey),
          canonical: cms.canonical || staticQuote.canonical,
          updatedAt: cms.updatedAt ?? null,
          staticOnly: false,
        })
      } else {
        items.push({
          key: staticQuote.pageKey,
          label: staticQuote.baseH1 || staticQuote.pageKey,
          vertical: pageKeyToVertical(staticQuote.pageKey),
          canonical: staticQuote.canonical,
          updatedAt: null,
          staticOnly: true,
        })
      }
    }

    for (const cms of cmsByKey.values()) {
      if (seen.has(cms.pageKey)) continue
      items.push({
        key: cms.pageKey,
        label: cms.displayName || cms.baseH1 || cms.pageKey,
        vertical: cms.vertical || pageKeyToVertical(cms.pageKey),
        canonical: cms.canonical,
        updatedAt: cms.updatedAt ?? null,
        staticOnly: false,
      })
    }
  }

  return items.sort((a, b) => {
    const va = VERTICAL_ORDER.indexOf(a.vertical)
    const vb = VERTICAL_ORDER.indexOf(b.vertical)
    const ia = va === -1 ? VERTICAL_ORDER.length : va
    const ib = vb === -1 ? VERTICAL_ORDER.length : vb
    if (ia !== ib) return ia - ib
    return a.label.localeCompare(b.label)
  })
}

export const ServicePages = () => {
  const { toast } = useOutletContext()
  const toastRef = useRef(toast)
  toastRef.current = toast

  const [listsLoading, setListsLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [comparisonList, setComparisonList] = useState([])
  const [quoteList, setQuoteList] = useState([])
  const [pageType, setPageType] = useState('comparison')
  const [selectedKey, setSelectedKey] = useState('')
  const [mode, setMode] = useState('edit')
  const [comparisonContent, setComparisonContent] = useState(null)
  const [quoteConfig, setQuoteConfig] = useState(null)
  const [pageLoading, setPageLoading] = useState(false)
  const [usingStaticFallback, setUsingStaticFallback] = useState(false)

  const pageOptions = useMemo(
    () => buildPageOptions(pageType, comparisonList, quoteList),
    [pageType, comparisonList, quoteList]
  )

  const pageKeys = useMemo(() => pageOptions.map((item) => item.key).join('\u0000'), [pageOptions])

  const pageSelectOptions = useMemo(
    () =>
      pageOptions.map((item) => ({
        value: item.key,
        label: item.label,
        hint: item.canonical || (item.staticOnly ? 'Static fallback · not in CMS yet' : undefined),
        group: VERTICAL_LABELS[item.vertical] || item.vertical,
      })),
    [pageOptions]
  )

  const selectedOption = pageOptions.find((p) => p.key === selectedKey)

  const loadLists = async () => {
    setListsLoading(true)
    try {
      const [compRes, quoteRes] = await Promise.all([
        api.get('/comparison-pages'),
        api.get('/quote-pages'),
      ])
      setComparisonList(unwrapApiList(compRes))
      setQuoteList(unwrapApiList(quoteRes))
    } catch (e) {
      toastRef.current.error(e.message || 'Failed to load service pages')
    } finally {
      setListsLoading(false)
    }
  }

  useEffect(() => {
    loadLists()
  }, [])

  // Keep selected page valid when list/type changes — do not fetch here
  useEffect(() => {
    if (pageOptions.length === 0) {
      setSelectedKey('')
      return
    }
    setSelectedKey((current) => {
      if (current && pageOptions.some((p) => p.key === current)) return current
      return pageOptions[0].key
    })
  }, [pageType, pageKeys])

  // Load page content only when type + slug change
  useEffect(() => {
    if (!selectedKey) {
      setComparisonContent(null)
      setQuoteConfig(null)
      setUsingStaticFallback(false)
      setPageLoading(false)
      return
    }

    let cancelled = false
    setPageLoading(true)
    setUsingStaticFallback(false)

    async function loadSelectedPage() {
      try {
        if (pageType === 'comparison') {
          try {
            const res = await api.get(`/comparison-pages/${encodeURIComponent(selectedKey)}`)
            if (cancelled) return
            const page = res?.data ?? res
            setComparisonContent(page?.content || null)
            setQuoteConfig(null)
            setUsingStaticFallback(false)
          } catch {
            if (cancelled) return
            const fallback = comparisonPages.find((p) => p.slug === selectedKey)
            if (fallback) {
              setComparisonContent(fallback)
              setQuoteConfig(null)
              setUsingStaticFallback(true)
            } else {
              setComparisonContent(null)
              toastRef.current.error('Page not found')
            }
          }
        } else {
          try {
            const res = await api.get(`/quote-pages/${encodeURIComponent(selectedKey)}`)
            if (cancelled) return
            const payload = res?.data ?? res
            setQuoteConfig(payload || null)
            setComparisonContent(null)
            setUsingStaticFallback(false)
          } catch {
            if (cancelled) return
            const fallback = quotePageSeedPayload().find((q) => q.pageKey === selectedKey)
            if (fallback) {
              setQuoteConfig(fallback)
              setComparisonContent(null)
              setUsingStaticFallback(true)
            } else {
              setQuoteConfig(null)
              setComparisonContent(null)
              toastRef.current.error('Quote page not found')
            }
          }
        }
      } finally {
        if (!cancelled) setPageLoading(false)
      }
    }

    loadSelectedPage()

    return () => {
      cancelled = true
      setPageLoading(false)
    }
  }, [pageType, selectedKey])

  const handleSeed = async () => {
    if (!window.confirm('Import all default comparison & quote pages into CMS? Existing pages will be updated.')) return
    setSeeding(true)
    try {
      await api.post('/comparison-pages/seed', { pages: comparisonPages })
      await api.post('/quote-pages/seed', { pages: quotePageSeedPayload() })
      toastRef.current.success('All service pages imported to CMS')
      await loadLists()
    } catch (e) {
      toastRef.current.error(e.message || 'Import failed')
    } finally {
      setSeeding(false)
    }
  }

  const handleSave = async () => {
    if (!selectedKey) return
    setSaving(true)
    try {
      if (pageType === 'comparison') {
        await api.put(`/comparison-pages/${encodeURIComponent(selectedKey)}`, {
          content: comparisonContent,
          status: 'published',
        })
        toastRef.current.success('Comparison page saved & published')
        setUsingStaticFallback(false)
      } else {
        await api.put(`/quote-pages/${encodeURIComponent(selectedKey)}`, {
          ...quoteConfig,
          status: 'published',
        })
        toastRef.current.success('Quote page saved & published')
      }
      await loadLists()
    } catch (e) {
      toastRef.current.error(e.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const previewContent = comparisonContent

  return (
    <div className="space-y-6 animate-fade-in pb-24 lg:pb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand">Content management</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">Service Pages Editor</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Edit comparison pages (CRM, payroll, etc.) and quote landing pages. Each field maps to a section on the live public site.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={handleSeed} disabled={seeding} className="btn-secondary inline-flex items-center gap-2" title="Load all default pages into CMS (first-time setup)">
            <RefreshCw className={`h-4 w-4 ${seeding ? 'animate-spin' : ''}`} />
            Import defaults
          </button>
          <button type="button" onClick={handleSave} disabled={saving || !selectedKey || pageLoading} className="btn-primary inline-flex items-center gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'Publishing…' : 'Save & publish'}
          </button>
        </div>
      </div>

      <ServicePageWriterGuide pageType={pageType} />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <p className="mb-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Step 1 · Choose page</p>
        <div className="grid gap-4 lg:grid-cols-[minmax(180px,220px)_minmax(0,1fr)_auto] lg:items-end">
          <Field label="Page type" hint="Comparison = review pages · Quotes = lead form pages">
            <BlogAdminSelect
              value={pageType}
              onChange={setPageType}
              options={PAGE_TYPE_OPTIONS}
              placeholder="Choose page type…"
              disabled={listsLoading || pageLoading}
            />
          </Field>

          <Field label="Select page" hint="Search by name or URL. Pages are grouped by category (Marketing, HR, etc.)">
            <BlogAdminSelect
              value={selectedKey}
              onChange={setSelectedKey}
              options={pageSelectOptions}
              placeholder={listsLoading ? 'Loading pages…' : 'Choose a page to edit…'}
              searchable
              searchPlaceholder="Search CRM, payroll, quotes…"
              emptyLabel="No pages match your search"
              disabled={listsLoading || pageSelectOptions.length === 0}
              listMaxHeight="max-h-80"
            />
          </Field>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <p className="mb-2 w-full text-[11px] font-bold uppercase tracking-wider text-gray-400 lg:mb-0 lg:hidden">Step 2 · View mode</p>
            <button
              type="button"
              onClick={() => setMode('edit')}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                mode === 'edit'
                  ? 'bg-brand text-white shadow-md shadow-brand/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <Pencil className="h-4 w-4" /> Edit
            </button>
            <button
              type="button"
              onClick={() => setMode('preview')}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                mode === 'preview'
                  ? 'bg-brand text-white shadow-md shadow-brand/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <Eye className="h-4 w-4" /> Preview
            </button>
            {selectedOption?.canonical ? (
              <a
                href={selectedOption.canonical}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <ExternalLink className="h-4 w-4" /> Live
              </a>
            ) : null}
          </div>
        </div>

        {selectedOption && !pageLoading ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
            {usingStaticFallback || selectedOption.staticOnly ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200/80">
                Not in CMS yet — Save to publish
              </span>
            ) : selectedOption.updatedAt ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200/80">
                Published in CMS
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200/80">
                Loaded from CMS
              </span>
            )}
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              {VERTICAL_LABELS[selectedOption.vertical] || selectedOption.vertical}
            </span>
            {selectedOption.canonical ? (
              <span className="truncate text-xs text-gray-500">{selectedOption.canonical}</span>
            ) : null}
          </div>
        ) : null}
      </div>

      {!listsLoading && selectedKey ? (
        <ServicePageTemplateTools
          pageType={pageType}
          selectedKey={selectedKey}
          comparisonContent={comparisonContent}
          quoteConfig={quoteConfig}
          onImportComparison={setComparisonContent}
          onImportQuote={setQuoteConfig}
          toast={toast}
          disabled={pageLoading}
        />
      ) : null}

      {listsLoading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900">
          Loading pages…
        </div>
      ) : mode === 'preview' ? (
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Step 3 · Full preview (matches live site)</p>
          {pageType === 'comparison' ? (
            <ComparisonFullPreview content={previewContent} expanded />
          ) : (
            <QuoteFullPreview config={quoteConfig} expanded />
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Step 3 · Edit content (left) · Live preview (right)</p>
          <div className="grid gap-6 xl:grid-cols-2">
            <div className={`min-w-0 transition-opacity duration-200 ${pageLoading ? 'pointer-events-none opacity-60' : ''}`}>
              {pageType === 'comparison' && comparisonContent ? (
                <ComparisonPageEditor content={comparisonContent} onChange={setComparisonContent} />
              ) : null}
              {pageType === 'quote' && quoteConfig ? (
                <QuotePageEditor config={quoteConfig} onChange={setQuoteConfig} />
              ) : null}
              {!pageLoading && !comparisonContent && !quoteConfig ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center dark:border-gray-600 dark:bg-gray-900/50">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No content loaded</p>
                  <p className="mt-2 text-xs text-gray-500">
                    Select a page above, or click <strong>Import defaults</strong> to load all pages into CMS for the first time.
                  </p>
                </div>
              ) : null}
            </div>
            <aside className="min-w-0 xl:sticky xl:top-24 xl:self-start">
              <p className="mb-2 hidden text-xs font-medium text-gray-400 xl:block">Preview updates as you type ↓</p>
              {pageType === 'comparison' ? (
                <ComparisonFullPreview content={previewContent} />
              ) : (
                <QuoteFullPreview config={quoteConfig} />
              )}
            </aside>
          </div>
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/95 lg:hidden">
        <div className="flex gap-2">
          <button type="button" onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')} className="btn-secondary flex-1 text-sm">
            {mode === 'edit' ? 'Preview' : 'Edit'}
          </button>
          <button type="button" onClick={handleSave} disabled={saving || !selectedKey || pageLoading} className="btn-primary flex-[2] text-sm">
            {saving ? 'Publishing…' : 'Save & publish'}
          </button>
        </div>
      </div>
    </div>
  )
}
