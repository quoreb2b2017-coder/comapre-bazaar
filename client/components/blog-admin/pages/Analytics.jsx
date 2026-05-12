import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { ChartNoAxesCombined } from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ChartTooltip,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from 'recharts'
import api from '../utils/api'

const CH_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6']
const PRIORITY_STYLES = {
  high: 'bg-rose-100 text-rose-700',
  medium: 'bg-amber-100 text-amber-700',
  advanced: 'bg-indigo-100 text-indigo-700',
}
const STATUS_STYLES = {
  live: 'bg-emerald-100 text-emerald-700',
  partial: 'bg-yellow-100 text-yellow-700',
  setup: 'bg-gray-100 text-gray-600',
}

function fmt(n) {
  const v = Number(n || 0)
  return v.toLocaleString()
}

function pct(n, d) {
  if (!d) return '0%'
  return `${Math.round((Number(n || 0) / Number(d || 1)) * 100)}%`
}

function classifyChannel(evt) {
  const m = evt?.marketingMeta || {}
  const src = String(m.utmSource || '').toLowerCase()
  const med = String(m.utmMedium || '').toLowerCase()
  const refHost = String(m.referrerHost || '').toLowerCase()
  if (/(facebook|instagram|linkedin|twitter|x|youtube|social)/.test(src + med)) return 'Social'
  if (med.includes('email') || src.includes('newsletter')) return 'Email'
  if (src || med) return 'Campaign'
  if (refHost) return 'Referral'
  return 'Direct'
}

function inferContentCategory(path) {
  const p = String(path || '').toLowerCase()
  if (p.includes('crm')) return 'Sales'
  if (p.includes('payroll') || p.includes('hr')) return 'HR'
  if (p.includes('email') || p.includes('marketing')) return 'Marketing'
  if (p.includes('project') || p.includes('management')) return 'Operations'
  if (p.includes('phone') || p.includes('voip') || p.includes('tech')) return 'Technology'
  return 'General'
}

function inferKeywordFromPath(path) {
  return String(path || '')
    .replace(/^\/+/, '')
    .replace(/\?.*$/, '')
    .replace(/[-_/]+/g, ' ')
    .trim()
    .slice(0, 42)
}

function shortKeywordLabel(s, max = 20) {
  const v = String(s || '').trim()
  if (v.length <= max) return v
  return `${v.slice(0, max - 1)}…`
}

function priorityLabel(p) {
  if (p === 'high') return 'High priority'
  if (p === 'medium') return 'Medium'
  return 'Advanced'
}

function buildMetricsCatalog(derived) {
  const hasTraffic = Number(derived?.last30?.uniqueSessions || 0) > 0
  const hasTopPages = (derived?.topPages || []).length > 0
  const hasSources = (derived?.topSources || []).length > 0 || (derived?.channelSplit || []).length > 0
  const hasGeo = (derived?.mk?.countries || []).length > 0
  const hasDevice = (derived?.mk?.devices || []).length > 0
  const hasDailyTrend = (derived?.trend || []).length > 0
  const hasCampaign = (derived?.campaignRows || []).length > 0
  const hasConsent = (derived?.consentByType || []).length > 0
  const hasReferrer = (derived?.topReferrers || []).length > 0
  const hasEmailIntent = Number(derived?.mk?.emailPrefillHits7d || 0) > 0
  const setup30 = derived?.setupMetrics?.customEvents30d || {}
  const setupKeys = setup30.keyMetrics || {}
  const hasCustomPipeline = !!derived?.setupMetrics?.customEvents30d
  const hasScrollDepth = Number(setupKeys.scrollDepthEvents || 0) > 0
  const hasInternalLinkClicks = Number(setupKeys.internalLinkClicks || 0) > 0
  const hasAffiliateClicks = Number(setupKeys.affiliateClicks || 0) > 0
  const hasSponsoredCta = Number(setupKeys.sponsoredCtaClicks || 0) > 0
  const hasSponsorLogos = Number(setupKeys.sponsorLogoImpressions || 0) > 0
  const hasLeadDownloads = Number(setupKeys.leadMagnetDownloads || 0) > 0
  const hasEmailSignups = Number(setupKeys.emailSignups || 0) > 0
  const hasFormAbandon = Number(setupKeys.formAbandonments || 0) > 0
  const has404 = Number(setupKeys.notFoundPageViews || 0) > 0
  const hasWebVitals =
    Number(setupKeys.webVitalsLcpTotal || 0) > 0 ||
    Number(setupKeys.webVitalsClsTotal || 0) > 0 ||
    Number(setupKeys.webVitalsInpTotal || 0) > 0

  const customReadyStatus = hasCustomPipeline ? 'partial' : 'setup'

  return [
    {
      category: '1. Traffic & Visitor Analytics',
      metrics: [
        { name: 'Monthly unique visitors', priority: 'high', status: hasTraffic ? 'live' : 'setup' },
        { name: 'New vs returning visitors', priority: 'high', status: hasTraffic ? 'partial' : 'setup' },
        { name: 'Traffic source breakdown', priority: 'high', status: hasSources ? 'live' : 'setup' },
        { name: 'Top landing pages', priority: 'high', status: hasTopPages ? 'live' : 'setup' },
        { name: 'Bounce rate by page', priority: 'high', status: hasTraffic ? 'partial' : 'setup' },
        { name: 'Session duration', priority: 'high', status: hasCustomPipeline ? 'partial' : 'setup' },
        { name: 'Pages per session', priority: 'medium', status: hasTraffic ? 'live' : 'setup' },
        { name: 'Geographic breakdown', priority: 'medium', status: hasGeo ? 'live' : hasCustomPipeline ? 'partial' : 'setup' },
        { name: 'Device split', priority: 'medium', status: hasDevice ? 'live' : 'setup' },
        { name: 'Hour/day heatmap', priority: 'advanced', status: hasDailyTrend ? 'partial' : 'setup' },
      ],
    },
    {
      category: '2. Content Performance Analytics',
      metrics: [
        { name: 'Top pages by traffic', priority: 'high', status: hasTopPages ? 'live' : 'setup' },
        { name: 'Avg time on comparison pages', priority: 'high', status: customReadyStatus },
        { name: 'Scroll depth %', priority: 'high', status: hasScrollDepth ? 'live' : customReadyStatus },
        { name: 'Blog post performance', priority: 'high', status: hasTopPages ? 'partial' : 'setup' },
        { name: 'Internal link clicks', priority: 'medium', status: hasInternalLinkClicks ? 'live' : customReadyStatus },
        { name: 'Content freshness score', priority: 'medium', status: hasDailyTrend ? 'partial' : 'setup' },
        { name: 'Exit pages', priority: 'medium', status: hasTopPages ? 'partial' : 'setup' },
        { name: 'Social shares per article', priority: 'advanced', status: 'setup' },
        { name: 'Comments / engagement', priority: 'advanced', status: 'setup' },
      ],
    },
    {
      category: '3. Affiliate & Revenue Analytics',
      metrics: [
        { name: 'Revenue per visitor (RPV)', priority: 'high', status: 'setup' },
        { name: 'Monthly affiliate revenue', priority: 'high', status: 'setup' },
        { name: 'Revenue by category', priority: 'high', status: 'setup' },
        { name: 'Avg. commission per deal', priority: 'medium', status: 'setup' },
        { name: 'Trial to paid conversion', priority: 'medium', status: 'setup' },
        { name: 'Sponsor revenue vs affiliate', priority: 'medium', status: 'setup' },
        { name: '30/60/90 day revenue forecast', priority: 'advanced', status: 'setup' },
      ],
    },
    {
      category: '4. SEO & Keyword Analytics',
      metrics: [
        { name: 'Keyword rankings tracker', priority: 'high', status: hasCampaign ? 'partial' : 'setup' },
        { name: 'Organic impressions', priority: 'high', status: 'setup' },
        { name: 'Organic CTR', priority: 'high', status: 'setup' },
        { name: 'Backlink growth', priority: 'high', status: 'setup' },
        { name: 'Domain authority trend', priority: 'high', status: 'setup' },
        { name: 'Page 1 vs page 2 keywords', priority: 'high', status: 'setup' },
        { name: 'Featured snippet wins', priority: 'medium', status: 'setup' },
        { name: 'Competitor keyword gap', priority: 'advanced', status: 'setup' },
      ],
    },
    {
      category: '5. Technical & UX Analytics',
      metrics: [
        { name: 'A/B test results', priority: 'advanced', status: 'setup' },
      ],
    },
    {
      category: '6. Business Growth Metrics',
      metrics: [
        { name: 'Customer acquisition cost', priority: 'medium', status: 'setup' },
        { name: 'Lifetime value per category', priority: 'medium', status: 'setup' },
        { name: 'Competitor traffic comparison', priority: 'advanced', status: 'setup' },
        { name: 'Brand search volume', priority: 'advanced', status: 'setup' },
      ],
    },
  ]
}

export const Analytics = () => {
  const { toast } = useOutletContext()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/site-analytics/report')
      .then((res) => {
        if (!res?.success || !res?.data) throw new Error(res?.message || 'Invalid analytics payload')
        setData(res.data)
      })
      .catch((err) => toast.error(err.message || 'Failed to load analytics'))
      .finally(() => setLoading(false))
  }, [])

  const derived = useMemo(() => {
    const windows = data?.windows || {}
    const last30 = windows.last30d || { pageViews: 0, uniqueSessions: 0, consentBreakdown: [] }
    const last7 = windows.last7d || { pageViews: 0, uniqueSessions: 0, consentBreakdown: [] }
    const mk = data?.marketing || {}
    const recent = data?.recent || []

    const pagesPerVisit = last30.uniqueSessions ? (last30.pageViews / last30.uniqueSessions).toFixed(2) : '0.00'

    const bySession = new Map()
    recent
      .filter((e) => e.kind === 'page_view')
      .forEach((e) => bySession.set(e.sessionId, (bySession.get(e.sessionId) || 0) + 1))
    const sampledSessions = bySession.size
    const bounceSample = [...bySession.values()].filter((n) => n <= 1).length
    const bounceRate = sampledSessions ? Math.round((bounceSample / sampledSessions) * 100) : 0

    const marketingConsents = (last30.consentBreakdown || [])
      .filter((r) => r.marketing === true)
      .reduce((acc, r) => acc + Number(r.count || 0), 0)

    const channelsMap = new Map()
    recent
      .filter((e) => e.kind === 'page_view')
      .forEach((evt) => {
        const channel = classifyChannel(evt)
        channelsMap.set(channel, (channelsMap.get(channel) || 0) + 1)
      })
    const channelSplit = [...channelsMap.entries()].map(([name, value]) => ({ name, value }))

    const trend = (data?.dailyPageViews || []).map((row) => ({
      month: String(row.date).slice(5),
      visitors: Number(row.uniqueSessions || 0),
      views: Number(row.views || 0),
    }))

    const tagged30Estimate = Math.round((Number(mk.taggedPageViews7d || 0) * 30) / 7)
    const email30Estimate = Math.round((Number(mk.emailPrefillHits7d || 0) * 30) / 7)
    const funnel = [
      { label: 'Total visitors (30d)', value: Number(last30.uniqueSessions || 0), color: '#3b82f6' },
      { label: 'Page views (30d)', value: Number(last30.pageViews || 0), color: '#2563eb' },
      { label: 'Tagged visits (est. 30d)', value: tagged30Estimate, color: '#10b981' },
      { label: 'Email-intent hits (est. 30d)', value: email30Estimate, color: '#0f766e' },
      { label: 'Marketing consent events (30d)', value: marketingConsents, color: '#f59e0b' },
    ]
    const funnelMax = Math.max(...funnel.map((x) => x.value), 1)

    const topPages = (data?.topPaths || []).slice(0, 8).map((r) => ({
      page: r.path,
      category: inferContentCategory(r.path),
      visits: Number(r.views || 0),
      status: r.views >= 100 ? 'Top performer' : r.views >= 40 ? 'Growing' : 'Needs push',
    }))

    const keywordOpp = (mk.utmCampaigns || []).slice(0, 8).map((r) => ({
      keyword: r.campaign,
      traffic: Number(r.views || 0),
    }))

    const keywordFallback = topPages.map((p) => ({
      keyword: inferKeywordFromPath(p.page) || p.category,
      traffic: p.visits,
    }))

    const topSources = (mk.utmSources || []).slice(0, 8).map((s) => ({
      source: s.source,
      visits: Number(s.views || 0),
      share: pct(s.views, last7.pageViews),
    }))

    const topReferrers = (mk.referrerHosts || []).slice(0, 8).map((r) => ({
      host: r.host,
      visits: Number(r.views || 0),
      share: pct(r.views, last7.pageViews),
    }))

    const consentByType = (last30.consentBreakdown || []).map((c) => ({
      label: c.marketing ? 'Marketing ON' : c.analytics ? 'Analytics only' : 'Essential only',
      count: Number(c.count || 0),
    }))

    const acceptedAll = (last30.consentBreakdown || [])
      .filter((r) => r.analytics === true && r.marketing === true)
      .reduce((acc, r) => acc + Number(r.count || 0), 0)
    const rejectedAll = (last30.consentBreakdown || [])
      .filter((r) => r.analytics === false && r.marketing === false)
      .reduce((acc, r) => acc + Number(r.count || 0), 0)
    const partial = (last30.consentBreakdown || [])
      .filter((r) => (r.analytics === true && r.marketing === false))
      .reduce((acc, r) => acc + Number(r.count || 0), 0)
    const totalConsent = acceptedAll + rejectedAll + partial || 1

    const campaignRows = (mk.utmCampaigns || []).slice(0, 10).map((c) => {
      const visits = Number(c.views || 0)
      const emailAssist = Math.round((Number(mk.emailPrefillHits7d || 0) * visits) / Math.max(1, Number(last7.pageViews || 0)))
      return {
        campaign: c.campaign,
        visits,
        share: pct(visits, last7.pageViews),
        emailAssist,
      }
    })

    const metricCatalog = buildMetricsCatalog({
      last30,
      mk,
      topPages,
      topSources,
      channelSplit,
      trend,
      campaignRows,
      consentByType,
      topReferrers,
      setupMetrics: data?.setupMetrics,
    })
    const metricTotals = metricCatalog.reduce(
      (acc, group) => {
        group.metrics.forEach((m) => {
          acc.total += 1
          if (m.status === 'live') acc.live += 1
          else if (m.status === 'partial') acc.partial += 1
          else acc.setup += 1
        })
        return acc
      },
      { total: 0, live: 0, partial: 0, setup: 0 }
    )

    return {
      last30,
      last7,
      mk,
      pagesPerVisit,
      bounceRate,
      sampledSessions,
      marketingConsents,
      channelSplit,
      trend,
      funnel,
      funnelMax,
      topPages,
      keywordOpp,
      keywordFallback,
      topSources,
      topReferrers,
      consentByType,
      campaignRows,
      metricCatalog,
      metricTotals,
      acceptedAll,
      rejectedAll,
      partial,
      totalConsent,
    }
  }, [data])

  if (loading) {
    return <div className="py-20 text-center text-sm text-gray-500">Loading analytics dashboard…</div>
  }
  if (!data) return <div className="py-20 text-center text-sm text-gray-500">No analytics data available.</div>

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-8 pb-10">
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Metric title="Monthly visitors" value={fmt(derived.last30.uniqueSessions)} hint="Last 30 days" />
        <Metric title="Avg pages / visit" value={derived.pagesPerVisit} hint="Engagement depth" />
        <Metric title="Tagged traffic share" value={pct(derived.mk.taggedPageViews7d, derived.last7.pageViews)} hint="Last 7 days" />
        <Metric title="Bounce rate (est.)" value={`${derived.bounceRate}%`} hint={`Sampled ${fmt(derived.sampledSessions)} sessions`} />
        <Metric title="Email-intent hits" value={fmt(derived.mk.emailPrefillHits7d)} hint="Last 7 days" />
      </section>



      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Panel title="Traffic sources breakdown">
          <div className="h-[320px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={derived.channelSplit} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110}>
                  {derived.channelSplit.map((entry, index) => (
                    <Cell key={entry.name} fill={CH_COLORS[index % CH_COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-600">
              {derived.channelSplit.map((x, i) => (
                <span key={x.name} className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CH_COLORS[i % CH_COLORS.length] }} />
                  {x.name} ({fmt(x.value)})
                </span>
              ))}
            </div>
          </div>
        </Panel>

        <Panel title="Visitor trend (real)">
          <div className="h-[320px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={derived.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip />
                <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </section>

      <Panel title="Visitor → conversion signal pipeline">
        <div className="p-5 space-y-3">
          {derived.funnel.map((step) => (
            <div key={step.label} className="grid grid-cols-[220px_minmax(0,1fr)_72px] gap-3 items-center">
              <p className="text-sm text-gray-700">{step.label}</p>
              <div className="h-9 rounded-md bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-md flex items-center px-3 text-white text-sm font-semibold"
                  style={{ width: `${Math.max(6, Math.round((step.value / derived.funnelMax) * 100))}%`, background: step.color }}
                >
                  {fmt(step.value)}
                </div>
              </div>
              <p className="text-sm tabular-nums text-gray-700 text-right">{fmt(step.value)}</p>
            </div>
          ))}
        </div>
      </Panel>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Panel title="Campaign performance table (7d)">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left py-2 px-4">Campaign</th>
                  <th className="text-left py-2 px-4">Visits</th>
                  <th className="text-left py-2 px-4">Share</th>
                  <th className="text-left py-2 px-4">Email assist</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {derived.campaignRows.length ? (
                  derived.campaignRows.map((row) => (
                    <tr key={row.campaign}>
                      <td className="py-2.5 px-4 text-gray-900 max-w-[280px] truncate" title={row.campaign}>
                        {row.campaign}
                      </td>
                      <td className="py-2.5 px-4 tabular-nums text-gray-700">{fmt(row.visits)}</td>
                      <td className="py-2.5 px-4 text-gray-700">{row.share}</td>
                      <td className="py-2.5 px-4 tabular-nums text-gray-700">{fmt(row.emailAssist)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-10 px-4 text-center text-sm text-gray-500">
                      No UTM campaign data in last 7 days.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Consent & source quality (7d)">
          <div className="p-5 grid grid-cols-1 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Consent mix</p>
              <div className="flex flex-wrap gap-2">
                {derived.consentByType.length ? (
                  derived.consentByType.map((c) => (
                    <span key={c.label} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                      {c.label}: {fmt(c.count)}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No consent events in selected window.</span>
                )}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <MiniList title="Top UTM sources" rows={derived.topSources} keyField="source" labelField="source" />
              <MiniList title="Top referrer hosts" rows={derived.topReferrers} keyField="host" labelField="host" />
            </div>
          </div>
        </Panel>
      </section>

      <Panel title="Top performing content pages">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left py-2 px-4">Page</th>
                <th className="text-left py-2 px-4">Category</th>
                <th className="text-left py-2 px-4">Monthly visits</th>
                <th className="text-left py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {derived.topPages.map((row) => (
                <tr key={row.page}>
                  <td className="py-2.5 px-4 font-medium text-gray-900 max-w-[440px] truncate" title={row.page}>
                    {row.page}
                  </td>
                  <td className="py-2.5 px-4 text-gray-700">{row.category}</td>
                  <td className="py-2.5 px-4 tabular-nums text-gray-700">{fmt(row.visits)}</td>
                  <td className="py-2.5 px-4 text-gray-700">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Panel title="SEO & keyword opportunity tracker (real campaigns)">
          <div className="h-[340px] p-4">
            {(derived.keywordOpp.length || derived.keywordFallback.length) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={(derived.keywordOpp.length ? derived.keywordOpp : derived.keywordFallback)
                    .slice(0, 8)
                    .map((x) => ({ ...x, label: shortKeywordLabel(x.keyword, 24) }))}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 12, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="label" width={150} tickLine={false} axisLine={false} />
                  <ChartTooltip />
                  <Bar dataKey="traffic" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full grid place-items-center text-sm text-gray-500">No campaign data yet.</div>
            )}
          </div>
          {!derived.keywordOpp.length && derived.keywordFallback.length ? (
            <p className="px-4 pb-4 text-xs text-gray-500">
              Showing inferred keywords from top content paths (UTM campaigns not available yet).
            </p>
          ) : null}
          <div className="px-4 pb-4">
            <div className="rounded-lg border border-gray-100 overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left py-2 px-3">Keyword / Campaign</th>
                    <th className="text-right py-2 px-3">Traffic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(derived.keywordOpp.length ? derived.keywordOpp : derived.keywordFallback).slice(0, 5).map((r) => (
                    <tr key={r.keyword}>
                      <td className="py-2 px-3 text-gray-700 truncate max-w-[320px]" title={r.keyword}>
                        {r.keyword}
                      </td>
                      <td className="py-2 px-3 text-right tabular-nums text-gray-700">{fmt(r.traffic)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Panel>

        <Panel title="Growth opportunities (based on live signals)">
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Opportunity
              title="Referrer partnerships"
              desc={`Top referrer hosts: ${(derived.mk.referrerHosts || []).slice(0, 3).map((x) => x.host).join(', ') || 'no data yet'}`}
            />
            <Opportunity
              title="Email capture optimization"
              desc={`Email-intent hits in 7d: ${fmt(derived.mk.emailPrefillHits7d || 0)}. Improve lead capture pages.`}
            />
            <Opportunity
              title="Geo expansion"
              desc={`Top countries: ${(derived.mk.countries || []).slice(0, 3).map((x) => x.country).join(', ') || 'no data yet'}`}
            />
            <Opportunity
              title="Device UX focus"
              desc={`Device mix: ${(derived.mk.devices || []).map((x) => `${x.device}:${fmt(x.views)}`).join(' · ') || 'no data'}`}
            />
          </div>
        </Panel>
      </section>

      {/* ── Cookie Banner & Consent Analytics ── */}
      <Panel title="Cookie banner & consent analytics">
        <div className="p-5 space-y-6">

          {/* Status row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-semibold text-emerald-700">Active</span>
            </div>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-600">Cookie banner is live on <strong>compare-bazaar.com</strong></span>
            <span className="ml-auto rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700">GDPR</span>
            <span className="rounded-full bg-purple-50 border border-purple-200 px-3 py-1 text-xs font-semibold text-purple-700">Worldwide</span>
          </div>

          {/* Accept / Reject breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-emerald-600">Accept All</p>
              <p className="mt-1 text-2xl font-bold text-emerald-700">{fmt(derived.acceptedAll)}</p>
              <p className="mt-0.5 text-xs text-emerald-600">{derived.totalConsent ? Math.round((derived.acceptedAll / derived.totalConsent) * 100) : 0}% of consent events</p>
            </div>
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-rose-600">Reject All</p>
              <p className="mt-1 text-2xl font-bold text-rose-700">{fmt(derived.rejectedAll)}</p>
              <p className="mt-0.5 text-xs text-rose-600">{derived.totalConsent ? Math.round((derived.rejectedAll / derived.totalConsent) * 100) : 0}% of consent events</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-amber-600">Analytics Only</p>
              <p className="mt-1 text-2xl font-bold text-amber-700">{fmt(derived.partial)}</p>
              <p className="mt-0.5 text-xs text-amber-600">{derived.totalConsent ? Math.round((derived.partial / derived.totalConsent) * 100) : 0}% of consent events</p>
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-gray-500">Unique visitors (30d)</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{fmt(derived.last30.uniqueSessions)}</p>
              <p className="mt-0.5 text-xs text-gray-500">Distinct session IDs</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-gray-500">Unique visitors (7d)</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{fmt(derived.last7.uniqueSessions)}</p>
              <p className="mt-0.5 text-xs text-gray-500">Distinct session IDs</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-gray-500">Consent events (30d)</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{fmt(derived.last30.consentEvents)}</p>
              <p className="mt-0.5 text-xs text-gray-500">Banner interactions</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-gray-500">Marketing consent (30d)</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{fmt(derived.marketingConsents)}</p>
              <p className="mt-0.5 text-xs text-gray-500">Marketing ON events</p>
            </div>
          </div>

          {/* Consent breakdown + Geo */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {/* Consent type breakdown */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-3">Consent type breakdown (30d)</p>
              {derived.consentByType.length ? (
                <div className="space-y-2">
                  {derived.consentByType.map((c) => {
                    const total = derived.consentByType.reduce((s, x) => s + x.count, 0)
                    const pctVal = total ? Math.round((c.count / total) * 100) : 0
                    const color = c.label === 'Marketing ON' ? '#10b981' : c.label === 'Analytics only' ? '#3b82f6' : '#9ca3af'
                    return (
                      <div key={c.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{c.label}</span>
                          <span className="tabular-nums text-gray-600">{fmt(c.count)} ({pctVal}%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pctVal}%`, background: color }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No consent events yet. Banner interactions will appear here.</p>
              )}
            </div>

            {/* Geo-target breakdown */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-wide text-gray-500">Geo-target breakdown (7d)</p>
                <span className="rounded-full bg-purple-50 border border-purple-200 px-2 py-0.5 text-xs font-semibold text-purple-700">Worldwide</span>
              </div>
              {(derived.mk.countries || []).length ? (
                <ul className="space-y-2">
                  {(derived.mk.countries || []).slice(0, 8).map((c) => {
                    const total = (derived.mk.countries || []).reduce((s, x) => s + Number(x.views || 0), 0)
                    const pctVal = total ? Math.round((Number(c.views) / total) * 100) : 0
                    return (
                      <li key={c.country}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700 font-medium">{c.country || 'Unknown'}</span>
                          <span className="tabular-nums text-gray-600">{fmt(c.views)} ({pctVal}%)</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                          <div className="h-full rounded-full bg-blue-500" style={{ width: `${pctVal}%` }} />
                        </div>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No geo data yet. Visitors from all countries will appear here once traffic flows.</p>
              )}
            </div>
          </div>

          {/* Device + Regulation info */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-3">Device breakdown (7d)</p>
              {(derived.mk.devices || []).length ? (
                <div className="space-y-2">
                  {(derived.mk.devices || []).map((d) => {
                    const total = (derived.mk.devices || []).reduce((s, x) => s + Number(x.views || 0), 0)
                    const pctVal = total ? Math.round((Number(d.views) / total) * 100) : 0
                    const color = d.device === 'mobile' ? '#f59e0b' : d.device === 'tablet' ? '#8b5cf6' : '#3b82f6'
                    return (
                      <div key={d.device}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700 capitalize">{d.device || 'unknown'}</span>
                          <span className="tabular-nums text-gray-600">{fmt(d.views)} ({pctVal}%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pctVal}%`, background: color }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No device data yet.</p>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-3">Banner configuration</p>
              <ul className="space-y-2 text-sm">
                {[
                  { label: 'Status', value: 'Active', color: 'text-emerald-600 font-semibold' },
                  { label: 'Regulation', value: 'GDPR', color: 'text-blue-600 font-semibold' },
                  { label: 'Geo-target', value: 'Worldwide', color: 'text-purple-600 font-semibold' },
                  { label: 'Consent version', value: 'v1', color: 'text-gray-700' },
                  { label: 'Cookie name', value: 'cb_consent', color: 'text-gray-700 font-mono text-xs' },
                  { label: 'Visitor ID cookie', value: 'cb_vid (400d)', color: 'text-gray-700 font-mono text-xs' },
                  { label: 'Analytics tracking', value: 'First-party only', color: 'text-gray-700' },
                  { label: 'Data retention', value: '180 days', color: 'text-gray-700' },
                ].map((row) => (
                  <li key={row.label} className="flex justify-between border-b border-gray-100 pb-1.5 last:border-0">
                    <span className="text-gray-500">{row.label}</span>
                    <span className={row.color}>{row.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </Panel>
    </div>
  )
}

function Metric({ title, value, hint }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-gray-500">{title}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{hint}</p>
    </div>
  )
}

function Panel({ title, children }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white">
      <header className="px-5 py-4 border-b border-gray-100 flex items-center gap-2 text-gray-900">
        <ChartNoAxesCombined className="w-4 h-4 text-brand" />
        <h3 className="font-semibold tracking-tight">{title}</h3>
      </header>
      {children}
    </section>
  )
}

function Opportunity({ title, desc }) {
  return (
    <article className="rounded-xl border border-gray-200 p-4 bg-gray-50">
      <p className="text-base font-semibold text-gray-900">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-gray-600">{desc}</p>
    </article>
  )
}

function MiniList({ title, rows, keyField, labelField }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
      <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">{title}</p>
      <ul className="space-y-1.5">
        {rows?.length ? (
          rows.slice(0, 5).map((r) => (
            <li key={r[keyField]} className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate text-gray-700" title={r[labelField]}>
                {r[labelField]}
              </span>
              <span className="tabular-nums text-gray-500">{r.share || fmt(r.visits)}</span>
            </li>
          ))
        ) : (
          <li className="text-sm text-gray-500">No data</li>
        )}
      </ul>
    </div>
  )
}

