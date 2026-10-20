import { useCallback, useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Search,
  RefreshCw,
  Loader2,
  Sparkles,
  Download,
  Check,
  X,
  Plus,
  Link2,
  Globe2,
  AlertCircle,
  FileSearch,
  MapPin,
  CheckCircle2,
  CircleDashed,
  XCircle,
  Clock3,
  TrendingUp,
  Flame,
  TrendingDown,
  Hash,
} from 'lucide-react'
import api, { API_TIMEOUT_LONG_MS, getAdminAuthHeaders, getBlogAdminBaseURL } from '../utils/api'

const PAGE_TYPES = [
  { value: '', label: 'All types' },
  { value: 'homepage', label: 'Homepage' },
  { value: 'category', label: 'Category' },
  { value: 'comparison', label: 'Comparison' },
  { value: 'product', label: 'Product' },
  { value: 'blog', label: 'Blog' },
  { value: 'landing', label: 'Landing' },
  { value: 'quote', label: 'Quote' },
  { value: 'whitepaper', label: 'Whitepaper' },
  { value: 'other', label: 'Other' },
]

const ACTION_STYLES = {
  KEEP: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  ADD: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
  REPLACE: 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800',
  REMOVE: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
  INVESTIGATE: 'bg-violet-50 text-violet-800 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800',
}

const STATUS_META = {
  never: {
    label: 'Not analyzed',
    className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    Icon: CircleDashed,
  },
  queued: {
    label: 'Queued',
    className: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
    Icon: Clock3,
  },
  processing: {
    label: 'Running',
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    Icon: Loader2,
  },
  done: {
    label: 'Done',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    Icon: CheckCircle2,
  },
  failed: {
    label: 'Failed',
    className: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
    Icon: XCircle,
  },
}

const defaultRegion = {
  country: 'US',
  region: '',
  city: '',
  language: 'en',
  searchEngine: 'google',
  audience: 'B2B software buyers',
}

function formatNum(v) {
  if (v == null || Number.isNaN(Number(v))) return '—'
  return Number(v).toLocaleString()
}

function googleRankLabel(r) {
  const n = Number(r?.currentRanking)
  if (Number.isFinite(n) && n > 0) return `Google #${n}`
  if (/not in top/i.test(r?.gscSource || '')) return 'Not in Google top 10'
  return ''
}

function cleanText(s) {
  return String(s || '')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .trim()
}

function StatusPill({ status }) {
  const meta = STATUS_META[status] || STATUS_META.never
  const Icon = meta.Icon
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.className}`}
    >
      <Icon className={`h-3 w-3 ${status === 'processing' ? 'animate-spin' : ''}`} />
      {meta.label}
    </span>
  )
}

function TypePill({ type }) {
  return (
    <span className="inline-flex rounded-md bg-navy/5 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-navy/70 dark:bg-white/10 dark:text-white/70">
      {type || 'other'}
    </span>
  )
}

function ScoreRing({ score }) {
  const v = Number(score)
  if (!Number.isFinite(v)) {
    return <span className="text-sm text-slate-400">—</span>
  }
  const color =
    v >= 70 ? 'text-emerald-600 dark:text-emerald-400' : v >= 45 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500'
  return (
    <div className="text-center">
      <p className={`font-serif text-xl leading-none ${color}`}>{Math.round(v)}</p>
      <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-slate-400">score</p>
    </div>
  )
}

function classifyDemand(r) {
  // Important: Number(null) === 0 — never treat missing volume as zero/low
  const hasVol = r?.searchVolume != null && r.searchVolume !== ''
  if (hasVol) {
    const vol = Number(r.searchVolume)
    if (Number.isFinite(vol)) {
      if (vol >= 500) return 'high'
      if (vol >= 100) return 'medium'
      return 'low'
    }
  }
  if (r?.highSearchCandidate === true || r?.demandTier === 'high') return 'high'
  if (r?.demandTier === 'low') return 'low'
  if (r?.demandTier === 'medium') return 'medium'
  // ADD / REPLACE with strong score or high priority → high-search opportunity
  if (
    (r?.action === 'ADD' || r?.action === 'REPLACE') &&
    (r?.priority === 'high' || (Number(r?.opportunityScore) || 0) >= 60)
  ) {
    return 'high'
  }
  if (r?.priority === 'high' && (Number(r?.opportunityScore) || 0) >= 65) return 'high'
  if (r?.priority === 'low' || (Number(r?.opportunityScore) || 0) < 40) return 'low'
  return 'medium'
}

export const KeywordResearch = () => {
  const { toast } = useOutletContext()
  const [pages, setPages] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [q, setQ] = useState('')
  const [pageType, setPageType] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loadingPages, setLoadingPages] = useState(true)
  const [discovering, setDiscovering] = useState(false)
  const [manualUrl, setManualUrl] = useState('')
  const [addingUrl, setAddingUrl] = useState(false)
  const [regionOpen, setRegionOpen] = useState(false)

  const [selectedIds, setSelectedIds] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('seo_kr_selected') || '[]')
    } catch {
      return []
    }
  })
  const [activePageId, setActivePageId] = useState(() => sessionStorage.getItem('seo_kr_active') || '')

  const [region, setRegion] = useState(() => {
    try {
      return { ...defaultRegion, ...JSON.parse(sessionStorage.getItem('seo_kr_region') || '{}') }
    } catch {
      return defaultRegion
    }
  })

  const [integrations, setIntegrations] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeElapsed, setAnalyzeElapsed] = useState(0)
  const [actionFilter, setActionFilter] = useState('')
  const [sortBy, setSortBy] = useState('opportunity')
  const [demandFilter, setDemandFilter] = useState('') // high | medium | low | ''
  const [kwQuery, setKwQuery] = useState('')
  const [manualInput, setManualInput] = useState('')
  const [addingKeywords, setAddingKeywords] = useState(false)

  useEffect(() => {
    if (!analyzing) {
      setAnalyzeElapsed(0)
      return undefined
    }
    const t0 = Date.now()
    const id = setInterval(() => setAnalyzeElapsed(Math.floor((Date.now() - t0) / 1000)), 1000)
    return () => clearInterval(id)
  }, [analyzing])

  useEffect(() => {
    sessionStorage.setItem('seo_kr_selected', JSON.stringify(selectedIds))
  }, [selectedIds])

  useEffect(() => {
    if (activePageId) sessionStorage.setItem('seo_kr_active', activePageId)
  }, [activePageId])

  useEffect(() => {
    sessionStorage.setItem('seo_kr_region', JSON.stringify(region))
  }, [region])

  const loadIntegrations = useCallback(async () => {
    try {
      const res = await api.get('/keyword-research/integrations')
      setIntegrations(res.data || null)
    } catch {
      setIntegrations(null)
    }
  }, [])

  const loadPages = useCallback(
    async (page = 1) => {
      setLoadingPages(true)
      try {
        const res = await api.get('/keyword-research/pages', {
          params: {
            page,
            limit: 80,
            ...(q ? { q } : {}),
            ...(pageType ? { pageType } : {}),
            ...(statusFilter ? { status: statusFilter } : {}),
          },
        })
        setPages(res.data || [])
        setPagination(res.pagination || { page: 1, pages: 1, total: 0 })
      } catch (err) {
        toast.error(err.message || 'Failed to load pages')
      } finally {
        setLoadingPages(false)
      }
    },
    [q, pageType, statusFilter, toast]
  )

  useEffect(() => {
    loadIntegrations()
    loadPages(1)
  }, [loadIntegrations, loadPages])

  const activePage = useMemo(
    () => pages.find((p) => p._id === activePageId) || null,
    [pages, activePageId]
  )

  const loadLatestAnalysis = useCallback(async (pageId) => {
    if (!pageId) {
      setAnalysis(null)
      return
    }
    try {
      const res = await api.get('/keyword-research/analyses', {
        params: { pageId, limit: 1 },
      })
      const latest = res.data?.[0]
      if (latest) {
        const full = await api.get(`/keyword-research/analyses/${latest._id}`)
        setAnalysis(full.data || latest)
      } else {
        setAnalysis(null)
      }
    } catch {
      setAnalysis(null)
    }
  }, [])

  useEffect(() => {
    if (activePageId) loadLatestAnalysis(activePageId)
  }, [activePageId, loadLatestAnalysis])

  // New analysis / page → show ALL keywords (don't keep a stale High-only filter)
  useEffect(() => {
    setDemandFilter('')
    setActionFilter('')
    setKwQuery('')
  }, [analysis?._id, activePageId])

  const onDiscover = async () => {
    setDiscovering(true)
    try {
      const res = await api.post('/keyword-research/pages/discover', {}, { timeout: API_TIMEOUT_LONG_MS })
      toast.success(
        `Found ${res.data?.discovered ?? 0} pages · sitemap ${res.data?.fromSitemap ?? 0} · CMS ${res.data?.fromCms ?? 0}`
      )
      await loadPages(1)
    } catch (err) {
      toast.error(err.message || 'Discover failed')
    } finally {
      setDiscovering(false)
    }
  }

  const showAddedPage = (doc) => {
    if (!doc?._id) return
    setPages((prev) => [doc, ...prev.filter((p) => p._id !== doc._id)])
    setActivePageId(doc._id)
    setSelectedIds((prev) => (prev.includes(doc._id) ? prev : [...prev, doc._id]))
    setQ('')
  }

  const addUrl = async (raw) => {
    const url = String(raw || '').trim()
    if (!url) return null
    setAddingUrl(true)
    try {
      const res = await api.post('/keyword-research/pages/manual', { url })
      toast.success('Page added')
      setManualUrl('')
      showAddedPage(res.data)
      return res.data
    } catch (err) {
      toast.error(err.message || 'Could not add URL')
      return null
    } finally {
      setAddingUrl(false)
    }
  }

  const onAddManual = () => addUrl(manualUrl)

  const looksLikePageUrl = (value) => {
    const text = String(value || '').trim()
    return (
      /^https?:\/\//i.test(text) ||
      text.startsWith('/') ||
      /^localhost(:\d+)?\//i.test(text) ||
      /^[\w.-]+\.[a-z]{2,}(:\d+)?\//i.test(text)
    )
  }

  const onSearchSubmit = async () => {
    const text = q.trim()
    if (looksLikePageUrl(text)) {
      const found = pages.find((p) => text.includes(p.path) && p.path !== '/')
      if (found) {
        setActivePageId(found._id)
        setQ('')
        return
      }
      await addUrl(text)
      return
    }
    await loadPages(1)
  }

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const selectAllVisible = () => {
    const ids = pages.map((p) => p._id)
    setSelectedIds((prev) => [...new Set([...prev, ...ids])])
  }

  const clearSelection = () => setSelectedIds([])

  const pollAnalysisUntilDone = async (analysisId) => {
    const maxTries = 48 // ~2 min at 2.5s
    for (let i = 0; i < maxTries; i += 1) {
      await new Promise((r) => setTimeout(r, 2500))
      const full = await api.get(`/keyword-research/analyses/${analysisId}`)
      const doc = full.data
      if (!doc) continue
      setAnalysis(doc)
      if (doc.status === 'done') return doc
      if (doc.status === 'failed') return doc
    }
    return { status: 'failed', error: 'Timed out waiting for Claude. Click Retry Analyze SEO.' }
  }

  const runAnalyze = async (bulk = false) => {
    const pageIds = bulk ? selectedIds : activePageId ? [activePageId] : []
    if (!pageIds.length) {
      toast.error(bulk ? 'Select at least one page' : 'Select a page first')
      return
    }
    setAnalyzing(true)
    setAnalysis({
      status: 'processing',
      recommendations: [],
      existingKeywords: [],
      error: '',
      seoSuggestions: {},
    })
    try {
      const res = await api.post(
        '/keyword-research/analyze',
        { pageIds, pageId: pageIds[0], region, force: true },
        { timeout: 60000 }
      )
      if (bulk && res.data?.results) {
        toast.success(`Bulk queued: ${res.data.results.length} page(s). Open each page to see results.`)
        await loadPages(pagination.page)
        if (activePageId) await loadLatestAnalysis(activePageId)
        return
      }
      const started = res.data
      setAnalysis(started)
      if (started?._id) {
        const finalDoc = await pollAnalysisUntilDone(started._id)
        setAnalysis(finalDoc)
        if (finalDoc?.status === 'done') {
          toast.success('Analysis complete')
        } else if (finalDoc?.status === 'failed') {
          toast.error(finalDoc.error || 'Analysis failed — click Retry')
        }
      }
      await loadPages(pagination.page)
    } catch (err) {
      toast.error(err.message || 'Analysis failed')
      setAnalysis((prev) => ({
        ...(prev || {}),
        status: 'failed',
        error: err.message || 'Analysis failed',
      }))
      if (activePageId) await loadLatestAnalysis(activePageId)
    } finally {
      setAnalyzing(false)
    }
  }

  const setApproval = async (recId, approvalStatus) => {
    if (!analysis?._id) return
    try {
      const res = await api.patch(
        `/keyword-research/analyses/${analysis._id}/recommendations/${recId}`,
        { approvalStatus }
      )
      setAnalysis(res.data)
      toast.success(approvalStatus === 'approved' ? 'Approved' : 'Rejected')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const exportCsv = async () => {
    if (!analysis?._id) return
    try {
      const base = getBlogAdminBaseURL()
      const url = `${base}/keyword-research/analyses/${analysis._id}/export.csv`
      const res = await fetch(url, { headers: getAdminAuthHeaders() })
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `keyword-research-${analysis._id}.csv`
      a.click()
      URL.revokeObjectURL(a.href)
    } catch (err) {
      toast.error(err.message || 'Export failed')
    }
  }

  const allRecs = analysis?.recommendations || []

  const filteredRecs = useMemo(() => {
    let rows = [...allRecs]
    if (actionFilter) rows = rows.filter((r) => r.action === actionFilter)
    if (demandFilter) rows = rows.filter((r) => classifyDemand(r) === demandFilter)
    const needle = kwQuery.trim().toLowerCase()
    if (needle) {
      rows = rows.filter((r) =>
        `${r.proposedKeyword || ''} ${r.currentKeyword || ''}`.toLowerCase().includes(needle)
      )
    }
    rows.sort((a, b) => {
      if (sortBy === 'volume') return (b.searchVolume || 0) - (a.searchVolume || 0)
      if (sortBy === 'rank') {
        const ar = Number(a.currentRanking)
        const br = Number(b.currentRanking)
        const aOk = Number.isFinite(ar) && ar > 0
        const bOk = Number.isFinite(br) && br > 0
        if (aOk && bOk) return ar - br
        if (aOk) return -1
        if (bOk) return 1
        return 0
      }
      if (sortBy === 'action') return String(a.action).localeCompare(String(b.action))
      return (b.opportunityScore || 0) - (a.opportunityScore || 0)
    })
    return rows
  }, [allRecs, actionFilter, sortBy, demandFilter, kwQuery])

  const actionCounts = useMemo(() => {
    const counts = { KEEP: 0, ADD: 0, REPLACE: 0, REMOVE: 0, INVESTIGATE: 0 }
    for (const r of analysis?.recommendations || []) {
      if (counts[r.action] != null) counts[r.action] += 1
    }
    return counts
  }, [analysis])

  const keywordStats = useMemo(() => {
    if (analysis?.keywordStats) return analysis.keywordStats
    const recs = analysis?.recommendations || []
    const high = recs.filter((r) => classifyDemand(r) === 'high')
    const medium = recs.filter((r) => classifyDemand(r) === 'medium')
    const low = recs.filter((r) => classifyDemand(r) === 'low')
    return {
      totalKeywords: recs.length,
      totalManual: recs.filter((r) => r.source === 'manual').length,
      totalApprovedAdds: recs.filter(
        (r) => (r.action === 'ADD' || r.action === 'REPLACE') && r.approvalStatus === 'approved'
      ).length,
      highSearch: high.length,
      mediumSearch: medium.length,
      lowSearch: low.length,
    }
  }, [analysis])

  /** High-search keywords the page should ADD */
  const highSearchAdds = useMemo(() => {
    const rows = (analysis?.recommendations || []).filter((r) => {
      if (r.action !== 'ADD' && r.action !== 'REPLACE') return false
      return classifyDemand(r) === 'high'
    })
    return [...rows].sort((a, b) => (b.opportunityScore || 0) - (a.opportunityScore || 0)).slice(0, 12)
  }, [analysis])

  const addManualKeywords = async () => {
    if (!manualInput.trim()) return
    if (!activePageId && !analysis?._id) {
      toast.error('Select a page first')
      return
    }
    setAddingKeywords(true)
    try {
      let res
      if (analysis?._id && analysis.status !== 'processing') {
        res = await api.post(`/keyword-research/analyses/${analysis._id}/keywords`, {
          keywords: manualInput,
          region,
        })
      } else {
        res = await api.post(`/keyword-research/pages/${activePageId}/keywords`, {
          keywords: manualInput,
          region,
        })
      }
      setAnalysis(res.data)
      setManualInput('')
      toast.success(res.message || `Added ${res.data?.added?.length || 0} keyword(s)`)
      await loadPages(pagination.page)
    } catch (err) {
      toast.error(err.message || 'Could not add keywords')
    } finally {
      setAddingKeywords(false)
    }
  }

  const removeRec = async (recId) => {
    if (!analysis?._id || !recId) return
    try {
      const res = await api.delete(`/keyword-research/analyses/${analysis._id}/recommendations/${recId}`)
      setAnalysis(res.data)
      toast.success('Keyword removed')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const regionLabel = [region.city, region.region, region.country, region.language]
    .filter(Boolean)
    .join(' · ')

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
  const selectClass =
    'rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700 outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'

  return (
    <div className="animate-fade-in space-y-5 pb-8">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-navy via-[#152a4a] to-[#0c1428] p-5 text-white shadow-lg shadow-navy/20 sm:p-6 dark:border-white/10">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand/20 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cb-orange">Blog Admin · SEO</p>
            <h1 className="mt-1.5 font-serif text-2xl tracking-tight sm:text-3xl">Keyword Research</h1>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Pick a page on the left, set your market, then run Claude analysis for keyword actions and on-page
              suggestions.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-white/55">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1">
                <FileSearch className="h-3 w-3" />
                {pagination.total || 0} pages indexed
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1">
                <MapPin className="h-3 w-3" />
                {regionLabel || 'US · en'}
              </span>
              {selectedIds.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-cb-orange/20 px-2.5 py-1 text-cb-orange">
                  {selectedIds.length} selected
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onDiscover}
              disabled={discovering}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-sm font-medium text-white backdrop-blur hover:bg-white/15 disabled:opacity-60"
            >
              {discovering ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Scan site
            </button>
            <button
              type="button"
              onClick={() => runAnalyze(true)}
              disabled={analyzing || selectedIds.length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-cb-orange px-3.5 py-2.5 text-sm font-semibold text-white shadow-md shadow-cb-orange/25 hover:bg-cb-orange-hover disabled:opacity-50"
            >
              {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Bulk ({selectedIds.length})
            </button>
          </div>
        </div>
      </div>

      {integrations?.claude && !integrations.claude.configured && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">Claude API key required</p>
            <p className="mt-0.5 text-xs opacity-90">{integrations.claude.note}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        {/* ── Pages sidebar ── */}
        <aside className="flex max-h-[calc(100vh-7rem)] min-h-[560px] flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
          <div className="border-b border-slate-100 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/80">
            <div className="mb-2.5 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-navy dark:text-white">Website pages</h2>
              <span className="text-[11px] tabular-nums text-slate-400">{pagination.total}</span>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
                placeholder="Search title, path, or paste a URL…"
                className={`${inputClass} pl-9`}
              />
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <select value={pageType} onChange={(e) => setPageType(e.target.value)} className={selectClass}>
                {PAGE_TYPES.map((t) => (
                  <option key={t.value || 'all'} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
                <option value="">Any status</option>
                <option value="never">Not analyzed</option>
                <option value="done">Done</option>
                <option value="failed">Failed</option>
                <option value="processing">Running</option>
              </select>
            </div>

            <div className="mt-2 flex gap-1.5">
              <input
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onAddManual()}
                placeholder="Paste page URL…"
                className={`${inputClass} !py-1.5 text-xs`}
              />
              <button
                type="button"
                onClick={onAddManual}
                disabled={addingUrl || !manualUrl.trim()}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy text-white hover:bg-navy/90 disabled:opacity-40"
                title="Add URL"
              >
                {addingUrl ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              </button>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
              <span>{selectedIds.length} selected</span>
              <div className="flex gap-3">
                <button type="button" className="font-medium hover:text-navy dark:hover:text-white" onClick={selectAllVisible}>
                  Select all
                </button>
                <button type="button" className="font-medium hover:text-navy dark:hover:text-white" onClick={clearSelection}>
                  Clear
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingPages ? (
              <div className="flex flex-col items-center justify-center gap-2 py-20 text-sm text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin text-brand" />
                Loading pages…
              </div>
            ) : pages.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <FileSearch className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-3 text-sm font-medium text-navy dark:text-white">
                  {q.trim() ? 'No page matches this search' : 'No pages yet'}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {q.trim()
                    ? 'Press Enter on a full URL to add that page and open it.'
                    : <>Click <strong>Scan site</strong> to pull sitemap + CMS URLs.</>}
                </p>
                <button
                  type="button"
                  onClick={onDiscover}
                  disabled={discovering}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-navy px-3 py-2 text-xs font-semibold text-white"
                >
                  {discovering ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                  Scan site
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {pages.map((p) => {
                  const active = p._id === activePageId
                  const checked = selectedIds.includes(p._id)
                  return (
                    <li key={p._id}>
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setActivePageId(p._id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') setActivePageId(p._id)
                        }}
                        className={`flex cursor-pointer gap-2.5 px-3 py-3 transition-colors ${
                          active
                            ? 'bg-brand/8 border-l-[3px] border-brand dark:bg-brand/15'
                            : 'border-l-[3px] border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleSelect(p._id)}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1 h-3.5 w-3.5 rounded border-slate-300 text-brand focus:ring-brand/30"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-semibold text-navy dark:text-white">
                            {cleanText(p.title) || p.path}
                          </p>
                          <p className="mt-0.5 truncate font-mono text-[11px] text-slate-400">{p.path}</p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                            <TypePill type={p.pageType} />
                            <StatusPill status={p.analysisStatus} />
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2.5 text-xs dark:border-slate-800">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => loadPages(pagination.page - 1)}
                className="rounded-lg px-2 py-1 font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-35 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Prev
              </button>
              <span className="tabular-nums text-slate-400">
                {pagination.page} / {pagination.pages}
              </span>
              <button
                type="button"
                disabled={pagination.page >= pagination.pages}
                onClick={() => loadPages(pagination.page + 1)}
                className="rounded-lg px-2 py-1 font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-35 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Next
              </button>
            </div>
          )}
        </aside>

        {/* ── Workspace ── */}
        <section className="min-w-0 space-y-4">
          {/* Selected page card */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-700 dark:bg-slate-900/60">
            {!activePage ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <FileSearch className="h-6 w-6 text-slate-400" />
                </div>
                <p className="mt-3 text-sm font-semibold text-navy dark:text-white">Select a page to analyze</p>
                <p className="mt-1 max-w-sm text-xs text-slate-500">
                  Choose any URL from the left list. Blog and comparison pages usually give the richest keyword output.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <TypePill type={activePage.pageType} />
                      <StatusPill status={activePage.analysisStatus} />
                    </div>
                    <h2 className="mt-2 font-serif text-xl leading-snug text-navy dark:text-white sm:text-2xl">
                      {cleanText(activePage.title) || activePage.path}
                    </h2>
                    <a
                      href={activePage.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1.5 inline-flex max-w-full items-center gap-1.5 truncate text-sm text-brand hover:underline"
                    >
                      <Link2 className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{activePage.url}</span>
                    </a>
                    <p className="mt-1.5 text-xs text-slate-500">
                      Last analysis:{' '}
                      {activePage.lastAnalyzedAt
                        ? new Date(activePage.lastAnalyzedAt).toLocaleString()
                        : 'never'}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={!activePageId || analyzing}
                    onClick={() => runAnalyze(false)}
                    className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-navy/20 hover:bg-navy/90 disabled:opacity-50"
                  >
                    {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {analyzing ? 'Analyzing…' : 'Analyze SEO'}
                  </button>
                </div>

                {/* Manual keywords */}
                <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-800/40">
                  <p className="text-xs font-semibold text-navy dark:text-white">Add keywords manually</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Type keywords (comma or new line). We classify high / medium / low search when volume data
                    exists.
                  </p>
                  <div className="mt-2 flex gap-2">
                    <textarea
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      rows={2}
                      placeholder="e.g. best payroll software, payroll software for small business"
                      className={`${inputClass} !py-2 min-h-[64px] resize-y`}
                    />
                    <button
                      type="button"
                      onClick={addManualKeywords}
                      disabled={addingKeywords || !manualInput.trim()}
                      className="inline-flex h-auto shrink-0 flex-col items-center justify-center gap-1 rounded-xl bg-navy px-3 py-2 text-xs font-semibold text-white hover:bg-navy/90 disabled:opacity-40"
                    >
                      {addingKeywords ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                      Add
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setRegionOpen((o) => !o)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <Globe2 className="h-3.5 w-3.5 text-brand" />
                    Target: {regionLabel}
                    <span className="text-slate-400">{regionOpen ? '▲' : '▼'}</span>
                  </button>

                  {regionOpen && (
                    <div className="mt-3 grid gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 p-3 sm:grid-cols-2 lg:grid-cols-3 dark:border-slate-800 dark:bg-slate-800/40">
                      {[
                        ['country', 'Country'],
                        ['region', 'State / province'],
                        ['city', 'City'],
                        ['language', 'Language'],
                        ['audience', 'Audience'],
                      ].map(([key, label]) => (
                        <label key={key} className="text-[11px] font-medium text-slate-500">
                          {label}
                          <input
                            value={region[key]}
                            onChange={(e) => setRegion((r) => ({ ...r, [key]: e.target.value }))}
                            className={`${inputClass} mt-1 !py-1.5`}
                          />
                        </label>
                      ))}
                      <label className="text-[11px] font-medium text-slate-500">
                        Search engine
                        <select
                          value={region.searchEngine}
                          onChange={(e) => setRegion((r) => ({ ...r, searchEngine: e.target.value }))}
                          className={`${inputClass} mt-1 !py-1.5`}
                        >
                          <option value="google">Google</option>
                          <option value="bing">Bing</option>
                        </select>
                      </label>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Results */}
          {!activePage ? null : (analyzing || analysis?.status === 'processing' || analysis?.status === 'queued') &&
            analysis?.status !== 'failed' &&
            analysis?.status !== 'done' ? (
            <div className="rounded-2xl border border-brand/20 bg-gradient-to-b from-brand/5 to-white px-6 py-14 text-center dark:from-brand/10 dark:to-slate-900">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10">
                <Loader2 className="h-7 w-7 animate-spin text-brand" />
              </div>
              <p className="mt-4 font-serif text-lg text-navy dark:text-white">Running keyword analysis</p>
              <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-500">
                Fetch page → Claude keywords → save. Claude is the slow step.
              </p>
              <p className="mt-3 font-mono text-sm font-semibold tabular-nums text-brand">
                {analyzeElapsed}s elapsed
                {analyzeElapsed >= 45 ? ' · almost done…' : analyzeElapsed >= 15 ? ' · Claude working…' : ' · starting…'}
              </p>
              <div className="mx-auto mt-5 h-1.5 w-56 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-brand transition-all duration-500"
                  style={{ width: `${Math.min(92, 8 + analyzeElapsed * 1.2)}%` }}
                />
              </div>
            </div>
          ) : analysis?.status === 'failed' ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-6 py-10 text-center dark:border-rose-900 dark:bg-rose-950/30">
              <XCircle className="mx-auto h-9 w-9 text-rose-500" />
              <p className="mt-3 font-serif text-lg text-navy dark:text-white">Analysis failed</p>
              <p className="mx-auto mt-1.5 max-w-lg text-sm text-rose-800 dark:text-rose-200">
                {analysis.error || 'Something went wrong. Try again.'}
              </p>
              <button
                type="button"
                disabled={analyzing}
                onClick={() => runAnalyze(false)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white"
              >
                <Sparkles className="h-4 w-4" />
                Retry Analyze SEO
              </button>
            </div>
          ) : !analysis ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900/40">
              <Sparkles className="mx-auto h-9 w-9 text-slate-300" />
              <p className="mt-3 font-serif text-lg text-navy dark:text-white">Ready to analyze</p>
              <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-500">
                Click <strong>Analyze SEO</strong> above. Results appear here with keyword actions and title/meta
                previews.
              </p>
            </div>
          ) : (
            <>
              {/* Counts: total / high / low */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                {[
                  {
                    key: 'total',
                    label: 'Total keywords',
                    value: keywordStats.totalKeywords,
                    icon: Hash,
                    color: 'text-navy dark:text-white',
                    filter: '',
                  },
                  {
                    key: 'high',
                    label: 'High search',
                    value: keywordStats.highSearch,
                    icon: Flame,
                    color: 'text-cb-orange',
                    filter: 'high',
                  },
                  {
                    key: 'medium',
                    label: 'Medium search',
                    value: keywordStats.mediumSearch,
                    icon: TrendingUp,
                    color: 'text-amber-600',
                    filter: 'medium',
                  },
                  {
                    key: 'low',
                    label: 'Low search',
                    value: keywordStats.lowSearch,
                    icon: TrendingDown,
                    color: 'text-slate-500',
                    filter: 'low',
                  },
                  {
                    key: 'manual',
                    label: 'Manual added',
                    value: keywordStats.totalManual,
                    icon: Plus,
                    color: 'text-brand',
                    filter: '',
                  },
                  {
                    key: 'approved',
                    label: 'Approved ADDs',
                    value: keywordStats.totalApprovedAdds,
                    icon: Check,
                    color: 'text-emerald-600',
                    filter: '',
                  },
                ].map((card) => {
                  const Icon = card.icon
                  const active = demandFilter === card.filter && card.filter
                  return (
                    <button
                      key={card.key}
                      type="button"
                      onClick={() =>
                        card.filter ? setDemandFilter((f) => (f === card.filter ? '' : card.filter)) : undefined
                      }
                      className={`rounded-xl border px-3 py-2.5 text-left transition ${
                        active
                          ? 'border-cb-orange/40 bg-cb-orange/10 ring-2 ring-cb-orange/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900'
                      } ${card.filter ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        <Icon className="h-3 w-3" />
                        {card.label}
                      </p>
                      <p className={`mt-1 font-serif text-2xl ${card.color}`}>{card.value ?? 0}</p>
                    </button>
                  )
                })}
              </div>

              {/* High vs Low lists */}
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-cb-orange/25 bg-cb-orange/5 p-4 dark:bg-cb-orange/10">
                  <h3 className="flex items-center gap-2 font-serif text-base text-navy dark:text-white">
                    <Flame className="h-4 w-4 text-cb-orange" />
                    High search keywords
                    <span className="rounded-full bg-cb-orange/20 px-2 py-0.5 text-xs font-bold text-cb-orange">
                      {keywordStats.highSearch || 0}
                    </span>
                  </h3>
                  <ul className="mt-3 max-h-56 space-y-1.5 overflow-y-auto">
                    {(analysis.recommendations || [])
                      .filter((r) => classifyDemand(r) === 'high')
                      .map((r) => (
                        <li
                          key={r._id}
                          className="flex items-center justify-between gap-2 rounded-lg bg-white/80 px-2.5 py-1.5 text-sm dark:bg-slate-900/60"
                        >
                          <span className="min-w-0 truncate font-medium text-navy dark:text-white">
                            {r.proposedKeyword || r.currentKeyword}
                            {r.source === 'manual' && (
                              <span className="ml-1 text-[10px] font-normal text-brand">manual</span>
                            )}
                          </span>
                          <span className="shrink-0 text-[10px] text-slate-400">
                            {Number.isFinite(Number(r.searchVolume))
                              ? `vol ${formatNum(r.searchVolume)}`
                              : 'high demand'}
                          </span>
                        </li>
                      ))}
                    {(keywordStats.highSearch || 0) === 0 && (
                      <li className="text-xs text-slate-500">None yet — run Analyze or add keywords.</li>
                    )}
                  </ul>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                  <h3 className="flex items-center gap-2 font-serif text-base text-navy dark:text-white">
                    <TrendingDown className="h-4 w-4 text-slate-500" />
                    Low search keywords
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      {keywordStats.lowSearch || 0}
                    </span>
                  </h3>
                  <ul className="mt-3 max-h-56 space-y-1.5 overflow-y-auto">
                    {(analysis.recommendations || [])
                      .filter((r) => classifyDemand(r) === 'low')
                      .map((r) => (
                        <li
                          key={r._id}
                          className="flex items-center justify-between gap-2 rounded-lg bg-white px-2.5 py-1.5 text-sm dark:bg-slate-900/60"
                        >
                          <span className="min-w-0 truncate font-medium text-slate-700 dark:text-slate-200">
                            {r.proposedKeyword || r.currentKeyword}
                            {r.source === 'manual' && (
                              <span className="ml-1 text-[10px] font-normal text-brand">manual</span>
                            )}
                          </span>
                          <span className="shrink-0 text-[10px] text-slate-400">
                            {Number.isFinite(Number(r.searchVolume))
                              ? `vol ${formatNum(r.searchVolume)}`
                              : 'low demand'}
                          </span>
                        </li>
                      ))}
                    {(keywordStats.lowSearch || 0) === 0 && (
                      <li className="text-xs text-slate-500">No low-search keywords flagged.</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* High search → ADD these */}
              {highSearchAdds.length > 0 && (
                <div className="overflow-hidden rounded-2xl border border-cb-orange/30 bg-gradient-to-br from-cb-orange/10 via-white to-amber-50/80 shadow-sm dark:from-cb-orange/15 dark:via-slate-900 dark:to-slate-900 dark:border-cb-orange/40">
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-cb-orange/15 px-4 py-3.5 sm:px-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cb-orange text-white shadow-md shadow-cb-orange/30">
                        <Flame className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg text-navy dark:text-white">
                          High search — add these
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                          Strong-demand keywords missing (or weak) on this page. Approve to mark them for your
                          content edit.
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-cb-orange/15 px-2.5 py-1 text-[11px] font-bold text-cb-orange">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {highSearchAdds.length} to add
                    </span>
                  </div>
                  <ul className="divide-y divide-cb-orange/10">
                    {highSearchAdds.map((r, idx) => (
                      <li
                        key={r._id || `high-${idx}`}
                        className="flex flex-wrap items-start gap-3 px-4 py-3.5 sm:px-5"
                      >
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-navy text-[11px] font-bold text-white">
                          {idx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[15px] font-semibold text-navy dark:text-white">
                              {r.proposedKeyword || r.currentKeyword}
                            </p>
                            <span className="rounded-md border border-sky-200 bg-sky-50 px-1.5 py-0.5 text-[10px] font-bold text-sky-800">
                              ADD
                            </span>
                            {Number.isFinite(Number(r.searchVolume)) ? (
                              <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                                Vol {formatNum(r.searchVolume)} · verified
                              </span>
                            ) : (
                              <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                                High demand · AI ranked
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            {r.reasoning}
                          </p>
                          <p className="mt-1 text-[11px] text-slate-400">
                            Place in: {r.suggestedPlacement || 'title / H1'}
                            {r.searchIntent ? ` · ${r.searchIntent}` : ''}
                            {r.opportunityScore != null ? ` · score ${r.opportunityScore}` : ''}
                            {googleRankLabel(r) ? ` · ${googleRankLabel(r)}` : ''}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setApproval(r._id, 'approved')}
                          disabled={!r._id}
                          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                            r.approvalStatus === 'approved'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-navy text-white hover:bg-navy/90'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                          {r.approvalStatus === 'approved' ? 'Added' : 'Add this'}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action summary */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {Object.entries(actionCounts).map(([action, count]) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => setActionFilter((f) => (f === action ? '' : action))}
                    className={`rounded-xl border px-3 py-2.5 text-left transition ${
                      actionFilter === action
                        ? ACTION_STYLES[action] + ' ring-2 ring-offset-1 ring-brand/30'
                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900'
                    }`}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wide opacity-70">{action}</p>
                    <p className="mt-0.5 font-serif text-xl text-navy dark:text-white">{count}</p>
                  </button>
                ))}
              </div>

              {/* Existing keywords */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-700 dark:bg-slate-900/60">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-lg text-navy dark:text-white">Existing keywords</h3>
                    <p className="text-xs text-slate-500">
                      Completed {analysis.completedAt ? new Date(analysis.completedAt).toLocaleString() : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={exportCsv}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Export CSV
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(analysis.existingKeywords || []).length === 0 ? (
                    <span className="text-sm text-slate-400">None detected on this page</span>
                  ) : (
                    analysis.existingKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                      >
                        {kw}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Recommendations */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-700 dark:bg-slate-900/60">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-lg text-navy dark:text-white">
                      Recommendations
                      <span className="ml-2 text-sm font-sans font-normal text-slate-400">
                        {filteredRecs.length}
                        {allRecs.length !== filteredRecs.length ? ` / ${allRecs.length}` : ''}
                      </span>
                    </h3>
                    {(analysis.dataSources?.notes || []).find((n) => /google rank/i.test(n)) ? (
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {(analysis.dataSources.notes || []).find((n) => /google rank/i.test(n))}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <input
                      value={kwQuery}
                      onChange={(e) => setKwQuery(e.target.value)}
                      placeholder="Search keywords…"
                      className={selectClass}
                    />
                    <select
                      value={actionFilter}
                      onChange={(e) => setActionFilter(e.target.value)}
                      className={selectClass}
                    >
                      <option value="">All actions</option>
                      {Object.keys(ACTION_STYLES).map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectClass}>
                      <option value="opportunity">Sort: opportunity</option>
                      <option value="volume">Sort: volume</option>
                      <option value="rank">Sort: Google rank</option>
                      <option value="action">Sort: action</option>
                    </select>
                    <select
                      value={demandFilter}
                      onChange={(e) => setDemandFilter(e.target.value)}
                      className={selectClass}
                    >
                      <option value="">All demand</option>
                      <option value="high">High search only</option>
                      <option value="medium">Medium only</option>
                      <option value="low">Low search only</option>
                    </select>
                  </div>
                </div>

                {filteredRecs.length === 0 ? (
                  <div className="py-10 text-center">
                    {allRecs.length === 0 ? (
                      <>
                        <p className="text-sm font-medium text-navy dark:text-white">
                          No keywords on this page yet
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Click <strong>Analyze SEO</strong> so Claude finds high-search keywords for this page.
                        </p>
                        <button
                          type="button"
                          disabled={analyzing || !activePageId}
                          onClick={() => runAnalyze(false)}
                          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white"
                        >
                          <Sparkles className="h-4 w-4" />
                          Analyze SEO
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-navy dark:text-white">
                          No keywords match this filter
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {allRecs.length} keyword(s) exist — filter is hiding them (
                          {demandFilter ? `demand: ${demandFilter}` : ''}
                          {actionFilter ? ` · action: ${actionFilter}` : ''}).
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setDemandFilter('')
                            setActionFilter('')
                          }}
                          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-navy hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                        >
                          Show all {allRecs.length} recommendations
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {filteredRecs.map((r) => (
                      <li
                        key={r._id}
                        className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 transition hover:border-slate-200 hover:bg-white dark:border-slate-800 dark:bg-slate-800/30 dark:hover:bg-slate-800/60"
                      >
                        <div className="flex flex-wrap items-start gap-3">
                          <ScoreRing score={r.opportunityScore} />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`inline-flex rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${
                                  ACTION_STYLES[r.action] || ''
                                }`}
                              >
                                {r.action}
                              </span>
                              {classifyDemand(r) === 'high' && (
                                <span className="inline-flex items-center gap-0.5 rounded-md bg-cb-orange/15 px-1.5 py-0.5 text-[10px] font-bold text-cb-orange">
                                  <Flame className="h-3 w-3" /> High search
                                </span>
                              )}
                              {classifyDemand(r) === 'low' && (
                                <span className="inline-flex items-center gap-0.5 rounded-md bg-slate-200/80 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                                  <TrendingDown className="h-3 w-3" /> Low search
                                </span>
                              )}
                              {classifyDemand(r) === 'medium' && (
                                <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                                  Medium
                                </span>
                              )}
                              {r.source === 'manual' && (
                                <span className="rounded-md bg-brand/10 px-1.5 py-0.5 text-[10px] font-bold text-brand">
                                  Manual
                                </span>
                              )}
                              {r.priority && (
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                  {r.priority} priority
                                </span>
                              )}
                              {r.searchIntent && (
                                <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] text-slate-500 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
                                  {r.searchIntent}
                                </span>
                              )}
                            </div>
                            <p className="mt-1.5 text-[15px] font-semibold text-navy dark:text-white">
                              {r.proposedKeyword || r.currentKeyword}
                            </p>
                            {r.currentKeyword &&
                              r.proposedKeyword &&
                              r.currentKeyword !== r.proposedKeyword && (
                                <p className="text-[11px] text-slate-400">Replace: {r.currentKeyword}</p>
                              )}
                            <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                              {r.reasoning}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                              {r.suggestedPlacement && <span>Place in: {r.suggestedPlacement}</span>}
                              <span>Vol: {formatNum(r.searchVolume)}</span>
                              <span>KD: {formatNum(r.keywordDifficulty)}</span>
                              <span className={googleRankLabel(r).startsWith('Google #') ? 'font-semibold text-emerald-700' : ''}>
                                {googleRankLabel(r) || 'Google rank —'}
                              </span>
                            </div>
                          </div>
                          <div className="flex shrink-0 gap-1.5">
                            <button
                              type="button"
                              title="Approve / mark added"
                              onClick={() => setApproval(r._id, 'approved')}
                              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                                r.approvalStatus === 'approved'
                                  ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                                  : 'border-slate-200 text-slate-400 hover:border-emerald-300 hover:text-emerald-600 dark:border-slate-600'
                              }`}
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              title="Reject"
                              onClick={() => setApproval(r._id, 'rejected')}
                              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                                r.approvalStatus === 'rejected'
                                  ? 'border-rose-400 bg-rose-50 text-rose-700'
                                  : 'border-slate-200 text-slate-400 hover:border-rose-300 hover:text-rose-600 dark:border-slate-600'
                              }`}
                            >
                              <X className="h-4 w-4" />
                            </button>
                            {r.source === 'manual' && (
                              <button
                                type="button"
                                title="Remove manual keyword"
                                onClick={() => removeRec(r._id)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-rose-300 hover:text-rose-600 dark:border-slate-600"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* SEO suggestions */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-700 dark:bg-slate-900/60">
                <h3 className="font-serif text-lg text-navy dark:text-white">On-page suggestions</h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Preview only — nothing is published until you edit the page yourself.
                </p>

                <div className="mt-4 space-y-3">
                  {['title', 'metaDescription', 'h1'].map((field) => {
                    const block = analysis.seoSuggestions?.[field] || {}
                    const label =
                      field === 'metaDescription' ? 'Meta description' : field === 'h1' ? 'H1' : 'SEO title'
                    return (
                      <div key={field} className="grid gap-2 md:grid-cols-2">
                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Current {label}
                          </p>
                          <p className="mt-1.5 text-sm leading-snug text-slate-700 dark:text-slate-200">
                            {cleanText(block.current) || '—'}
                          </p>
                        </div>
                        <div className="rounded-xl border border-brand/25 bg-brand/5 p-3 dark:border-brand/40 dark:bg-brand/10">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-brand">
                            Proposed {label}
                          </p>
                          <p className="mt-1.5 text-sm leading-snug text-navy dark:text-white">
                            {cleanText(block.proposed) || '—'}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
                  {analysis.seoSuggestions?.headingStructure && (
                    <p>
                      <span className="font-semibold text-navy dark:text-white">Headings · </span>
                      {analysis.seoSuggestions.headingStructure}
                    </p>
                  )}
                  {analysis.seoSuggestions?.keywordPlacement && (
                    <p>
                      <span className="font-semibold text-navy dark:text-white">Placement · </span>
                      {analysis.seoSuggestions.keywordPlacement}
                    </p>
                  )}
                  {analysis.seoSuggestions?.contentQuality && (
                    <p>
                      <span className="font-semibold text-navy dark:text-white">Content · </span>
                      {analysis.seoSuggestions.contentQuality}
                    </p>
                  )}
                  {analysis.seoSuggestions?.structuredData && (
                    <p>
                      <span className="font-semibold text-navy dark:text-white">Schema · </span>
                      {analysis.seoSuggestions.structuredData}
                    </p>
                  )}
                  {(analysis.seoSuggestions?.missingSubtopics || []).length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Missing subtopics
                      </p>
                      <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
                        {analysis.seoSuggestions.missingSubtopics.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {(analysis.seoSuggestions?.internalLinks || []).length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Internal link ideas
                      </p>
                      <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
                        {analysis.seoSuggestions.internalLinks.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
