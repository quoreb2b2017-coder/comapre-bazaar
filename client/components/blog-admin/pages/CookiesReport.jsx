import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Cookie, Loader2, Radio } from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts'
import api from '../utils/api'

function fmt(n) {
  if (n == null || Number.isNaN(n)) return '—'
  return Number(n).toLocaleString()
}

function formatSessionUtm(m) {
  if (!m) return '—'
  const parts = [m.utmSource, m.utmMedium, m.utmCampaign].filter(Boolean)
  return parts.length ? parts.join(' · ') : '—'
}

/** Flat header + table body — no card icons */
function ReportPanel({ title, description, children, className = '' }) {
  return (
    <div
      className={`rounded-lg border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 ${className}`}
    >
      <div className="border-b border-gray-100 dark:border-gray-800/80 px-4 py-2.5 sm:px-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{title}</h3>
        {description ? <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{description}</p> : null}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  )
}

function DimTable({ rows, colLabel = 'Name' }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 bg-gray-50/80 dark:bg-gray-800/40">
          <th className="py-2 pl-4 pr-2 sm:pl-5 font-semibold">{colLabel}</th>
          <th className="py-2 pr-4 sm:pr-5 text-right font-semibold w-20">Views</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
        {rows?.length ? (
          rows.map((row) => (
            <tr key={String(row.label)} className="text-gray-800 dark:text-gray-200">
              <td className="py-1.5 pl-4 pr-2 sm:pl-5 min-w-0 max-w-[70vw] sm:max-w-none">
                <span className="block truncate text-[13px]" title={row.label}>
                  {row.label || '—'}
                </span>
              </td>
              <td className="py-1.5 pr-4 sm:pr-5 text-right tabular-nums text-[13px] text-gray-900 dark:text-gray-100">
                {fmt(row.views)}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={2} className="py-8 px-4 text-center text-gray-500 text-xs">
              No data in this window.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

function MetricCell({ label, value, hint }) {
  return (
    <div className="px-4 py-3 sm:py-3.5 border-b border-gray-100 dark:border-gray-800/80 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums text-gray-900 dark:text-gray-50 tracking-tight">{value}</p>
      {hint ? <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500 leading-snug">{hint}</p> : null}
    </div>
  )
}

export const CookiesReport = () => {
  const { toast } = useOutletContext()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/site-analytics/report')
      .then((res) => {
        if (res?.success && res?.data) setData(res.data)
        else throw new Error(res?.message || 'Invalid response')
      })
      .catch((err) => toast.error(err.message || 'Failed to load analytics'))
      .finally(() => setLoading(false))
  }, [])

  const w7 = data?.windows?.last7d
  const daily = data?.dailyPageViews || []
  const mk = data?.marketing || {}

  const chartDaily = daily.map((row) => ({
    day: String(row.date).slice(5),
    views: row.views,
    visitors: row.uniqueSessions,
  }))
  const countryBars = (mk.countries || []).slice(0, 14).map((r) => ({ name: r.country, views: r.views }))
  const tzBars = (mk.timeZones || []).slice(0, 12).map((r) => ({ name: r.zone, views: r.views }))

  return (
    <div className="w-full min-w-0 max-w-[1600px] mx-auto space-y-8 sm:space-y-10 pb-10 animate-fade-in">
      {/* Title */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-md bg-gray-100 dark:bg-gray-800 p-2 text-gray-600 dark:text-gray-300">
            <Cookie className="w-5 h-5" aria-hidden />
          </div>
          <div className="min-w-0 space-y-1">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-50 tracking-tight">
              Site analytics
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
              Consent-based visitor metrics. Geo comes from your CDN when headers exist; timezone, language, screen and platform come from
              the browser. Email-shaped query params only set a boolean flag—addresses are never stored.
            </p>
            {data?.generatedAt ? (
              <p className="text-xs text-gray-400 pt-1">Report generated {new Date(data.generatedAt).toLocaleString()}</p>
            ) : null}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500">
          <Loader2 className="w-9 h-9 animate-spin text-brand" />
          <p className="text-sm">Loading analytics…</p>
        </div>
      ) : !data ? (
        <p className="text-sm text-gray-500">No data loaded.</p>
      ) : (
        <>
          {/* KPI strip — dense professional summary, not icon cards */}
          <section className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800">
              <MetricCell label="Unique visitors (7d)" value={fmt(w7?.uniqueSessions)} hint="Distinct sessions" />
              <MetricCell label="Page views (7d)" value={fmt(w7?.pageViews)} hint="Analytics consent" />
              <MetricCell label="Consent events (7d)" value={fmt(w7?.consentEvents)} hint="Preference saves" />
              <MetricCell label="UTM-tagged (7d)" value={fmt(mk.taggedPageViews7d)} hint="With utm_source" />
              <MetricCell label="Email-prefill flags (7d)" value={fmt(mk.emailPrefillHits7d)} hint="URL query shape only" />
              <MetricCell label="Events retained" value="~180d" hint="MongoDB TTL" />
            </div>
          </section>

          {/* Charts */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Traffic & geography</h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <ReportPanel title="Views & visitors — last 30 days" description="UTC day buckets.">
                <div className="h-[260px] p-4 pt-2">
                  {chartDaily.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartDaily} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                        <defs>
                          <linearGradient id="cookieViewsGrad2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.9} className="dark:stroke-gray-600" />
                        <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} allowDecimals={false} width={36} />
                        <ChartTooltip
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                          labelFormatter={(l) => `Day ${l}`}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        <Area type="monotone" dataKey="views" name="Views" stroke="#1d4ed8" strokeWidth={2} fill="url(#cookieViewsGrad2)" dot={false} />
                        <Area type="monotone" dataKey="visitors" name="Visitors" stroke="#059669" strokeWidth={1.8} fill="none" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-gray-500">No daily data.</div>
                  )}
                </div>
              </ReportPanel>

              <ReportPanel title="Countries — 7 days" description="Edge IP country when the platform sends it.">
                <div className="h-[260px] p-4 pt-2">
                  {countryBars.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={countryBars} layout="vertical" margin={{ top: 4, right: 12, left: 4, bottom: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} allowDecimals={false} />
                        <YAxis type="category" dataKey="name" width={40} tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                        <ChartTooltip cursor={{ fill: 'rgba(29,78,216,0.06)' }} />
                        <Bar dataKey="views" fill="#1d4ed8" radius={[0, 4, 4, 0]} maxBarSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-gray-500">No country data.</div>
                  )}
                </div>
              </ReportPanel>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <ReportPanel title="Time zones — 7 days" description="Browser IANA zone (Intl).">
                <div className="h-[240px] p-4 pt-2">
                  {tzBars.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={tzBars} margin={{ top: 4, right: 8, left: 4, bottom: 56 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                        <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} angle={-35} textAnchor="end" height={68} interval={0} />
                        <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} allowDecimals={false} width={32} />
                        <ChartTooltip />
                        <Bar dataKey="views" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={32} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-gray-500">No timezone data.</div>
                  )}
                </div>
              </ReportPanel>

              <ReportPanel title="Viewport buckets — 7 days" description="Inner width vs breakpoints (xs–2xl).">
                <DimTable
                  rows={(mk.viewportBuckets || []).map((r) => ({ label: r.bucket, views: r.views }))}
                  colLabel="Bucket"
                />
              </ReportPanel>
            </div>
          </section>

          {/* Audience & device */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Audience & device</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <ReportPanel title="Primary language" description="First BCP-47 tag.">
                <DimTable rows={(mk.primaryLanguages || []).map((r) => ({ label: r.lang, views: r.views }))} colLabel="Language" />
              </ReportPanel>
              <ReportPanel title="Language stacks" description="Full navigator.languages string.">
                <DimTable rows={(mk.languagesLabels || []).map((r) => ({ label: r.label, views: r.views }))} colLabel="Stack" />
              </ReportPanel>
              <ReportPanel title="Device category" description="From viewport width.">
                <DimTable rows={(mk.devices || []).map((r) => ({ label: r.device, views: r.views }))} colLabel="Device" />
              </ReportPanel>
              <ReportPanel title="Platform / OS" description="navigator.platform or userAgentData.">
                <DimTable rows={(mk.platforms || []).map((r) => ({ label: r.platform, views: r.views }))} colLabel="Platform" />
              </ReportPanel>
              <ReportPanel title="ISP providers" description="Derived from visitor IP lookup.">
                <DimTable rows={(mk.isps || []).map((r) => ({ label: r.isp, views: r.views }))} colLabel="ISP" />
              </ReportPanel>
              <ReportPanel title="Connection" description="Network Information API.">
                <DimTable rows={(mk.connectionTypes || []).map((r) => ({ label: r.type, views: r.views }))} colLabel="Type" />
              </ReportPanel>
              <ReportPanel title="Email domains" description="Domain only from URL email prefills, no full email stored.">
                <DimTable rows={(mk.emailDomains || []).map((r) => ({ label: r.domain, views: r.views }))} colLabel="Domain" />
              </ReportPanel>
              <ReportPanel title="Regions (edge)" description="Sub-country region header when present.">
                <DimTable rows={(mk.regions || []).map((r) => ({ label: r.region, views: r.views }))} colLabel="Region" />
              </ReportPanel>
              <ReportPanel title="Cities (edge)" description="City header when present.">
                <DimTable rows={(mk.cities || []).map((r) => ({ label: r.city, views: r.views }))} colLabel="City" />
              </ReportPanel>
            </div>
          </section>

          {/* Acquisition */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Acquisition & campaigns</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ReportPanel title="Referrer hosts" description="document.referrer hostname only (7d).">
                <DimTable rows={(mk.referrerHosts || []).map((r) => ({ label: r.host, views: r.views }))} colLabel="Host" />
              </ReportPanel>
              <ReportPanel title="UTM sources" description="utm_source (7d, marketing on).">
                <DimTable rows={(mk.utmSources || []).map((r) => ({ label: r.source, views: r.views }))} colLabel="Source" />
              </ReportPanel>
              <ReportPanel title="UTM campaigns" description="Session utm_campaign.">
                <DimTable rows={(mk.utmCampaigns || []).map((r) => ({ label: r.campaign, views: r.views }))} colLabel="Campaign" />
              </ReportPanel>
              <ReportPanel title="First-touch campaigns" description="From cb_attr first landing.">
                <DimTable rows={(mk.firstTouchCampaigns || []).map((r) => ({ label: r.campaign, views: r.views }))} colLabel="Campaign" />
              </ReportPanel>
            </div>
          </section>

          {/* Paths & daily detail */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Content & calendar</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ReportPanel title="Top paths — 7 days" description="Paths with analytics hits.">
                <div className="max-h-[min(50vh,360px)] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 z-[1] bg-gray-50 dark:bg-gray-800/95">
                    <tr className="text-left text-[11px] font-medium uppercase tracking-wide text-gray-500 border-b border-gray-100 dark:border-gray-800">
                      <th className="py-2 pl-4 sm:pl-5 font-semibold">Path</th>
                      <th className="py-2 pr-4 sm:pr-5 text-right font-semibold w-20">Views</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {(data.topPaths || []).length ? (
                      data.topPaths.map((row) => (
                        <tr key={row.path}>
                          <td className="py-2 pl-4 sm:pl-5 font-mono text-xs text-gray-700 dark:text-gray-300 max-w-0">
                            <span className="block truncate" title={row.path}>
                              {row.path}
                            </span>
                          </td>
                          <td className="py-2 pr-4 sm:pr-5 text-right tabular-nums">{fmt(row.views)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="py-10 px-4 text-center text-gray-500 text-sm">
                          No page views yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                </div>
              </ReportPanel>

              <ReportPanel title="Daily totals — 30 days" description="UTC · views and unique sessions.">
                <div className="max-h-[min(50vh,380px)] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 z-[1] bg-gray-50 dark:bg-gray-800/95">
                      <tr className="text-left text-[11px] font-medium uppercase tracking-wide text-gray-500">
                        <th className="py-2 pl-4 sm:pl-5 font-semibold">Date</th>
                        <th className="py-2 font-semibold text-right">Views</th>
                        <th className="py-2 pr-4 sm:pr-5 font-semibold text-right">Visitors</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {daily.length ? (
                        daily.map((row) => (
                          <tr key={row.date}>
                            <td className="py-1.5 pl-4 sm:pl-5 whitespace-nowrap text-gray-700 dark:text-gray-300 text-[13px]">{row.date}</td>
                            <td className="py-1.5 text-right tabular-nums text-[13px]">{fmt(row.views)}</td>
                            <td className="py-1.5 pr-4 sm:pr-5 text-right tabular-nums text-gray-600 dark:text-gray-400 text-[13px]">
                              {fmt(row.uniqueSessions)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-10 px-4 text-center text-gray-500">
                            No rows.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </ReportPanel>
            </div>
          </section>

          {/* Recent */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Recent events</h2>
            <ReportPanel title="Latest 80 events" description="Page views and consent saves. Scroll horizontally on small screens.">
              <div className="overflow-x-auto overscroll-x-contain">
                <table className="w-full text-[11px] min-w-[1280px]">
                  <thead>
                    <tr className="text-left uppercase tracking-wide text-gray-500 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                      <th className="py-2 px-2 font-semibold whitespace-nowrap">Time</th>
                      <th className="py-2 px-2 font-semibold whitespace-nowrap">Kind</th>
                      <th className="py-2 px-2 font-semibold whitespace-nowrap">Visitor</th>
                      <th className="py-2 px-2 font-semibold">Path</th>
                      <th className="py-2 px-2 font-semibold max-w-[140px]" title="document.referrer (raw)">
                        Referrer
                      </th>
                      <th className="py-2 px-2 font-semibold whitespace-nowrap">A/M</th>
                      <th className="py-2 px-2 font-semibold whitespace-nowrap">Country</th>
                      <th className="py-2 px-2 font-semibold whitespace-nowrap">Region</th>
                      <th className="py-2 px-2 font-semibold whitespace-nowrap">City</th>
                      <th className="py-2 px-2 font-semibold whitespace-nowrap">IP</th>
                      <th className="py-2 px-2 font-semibold whitespace-nowrap">ISP</th>
                      <th className="py-2 px-2 font-semibold whitespace-nowrap">TZ</th>
                      <th className="py-2 px-2 font-semibold whitespace-nowrap">Lang</th>
                      <th className="py-2 px-2 font-semibold whitespace-nowrap">Platform</th>
                      <th className="py-2 px-2 font-semibold whitespace-nowrap">Referrer host</th>
                      <th className="py-2 px-2 font-semibold whitespace-nowrap">Email domain</th>
                      <th className="py-2 px-2 font-semibold whitespace-nowrap">Email Δ</th>
                      <th className="py-2 px-2 font-semibold whitespace-nowrap">Dev</th>
                      <th className="py-2 px-2 font-semibold whitespace-nowrap">
                        <Radio className="w-3 h-3 inline opacity-60" aria-hidden />
                      </th>
                      <th className="py-2 px-2 font-semibold">UTM</th>
                      <th className="py-2 px-2 font-semibold">UA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {(data.recent || []).map((e, i) => (
                      <tr key={`${e.createdAt}-${i}`} className="text-gray-700 dark:text-gray-300">
                        <td className="py-2 px-2 whitespace-nowrap text-gray-500">{new Date(e.createdAt).toLocaleString()}</td>
                        <td className="py-2 px-2 font-medium whitespace-nowrap">{e.kind}</td>
                        <td className="py-2 px-2 font-mono max-w-[100px] truncate" title={e.sessionId}>
                          {e.sessionId}
                        </td>
                        <td className="py-2 px-2 font-mono max-w-[160px] truncate" title={e.path}>
                          {e.path || '—'}
                        </td>
                        <td className="py-2 px-2 max-w-[140px] truncate text-gray-600 dark:text-gray-400" title={e.referrer || ''}>
                          {e.referrer || '—'}
                        </td>
                        <td className="py-2 px-2 whitespace-nowrap">
                          {e.consentSnapshot
                            ? `${e.consentSnapshot.analytics ? '1' : '0'}/${e.consentSnapshot.marketing ? '1' : '0'}`
                            : '—'}
                        </td>
                        <td className="py-2 px-2 whitespace-nowrap">{e.marketingMeta?.country || '—'}</td>
                        <td className="py-2 px-2 whitespace-nowrap max-w-[72px] truncate" title={e.marketingMeta?.region}>
                          {e.marketingMeta?.region || '—'}
                        </td>
                        <td className="py-2 px-2 whitespace-nowrap max-w-[80px] truncate" title={e.marketingMeta?.city}>
                          {e.marketingMeta?.city || '—'}
                        </td>
                        <td className="py-2 px-2 whitespace-nowrap font-mono text-[10px] max-w-[120px] truncate" title={e.marketingMeta?.ip}>
                          {e.marketingMeta?.ip || '—'}
                        </td>
                        <td className="py-2 px-2 whitespace-nowrap max-w-[110px] truncate" title={e.marketingMeta?.isp}>
                          {e.marketingMeta?.isp || '—'}
                        </td>
                        <td className="py-2 px-2 whitespace-nowrap max-w-[100px] truncate text-[10px]" title={e.marketingMeta?.timeZone}>
                          {e.marketingMeta?.timeZone || '—'}
                        </td>
                        <td className="py-2 px-2 whitespace-nowrap max-w-[64px] truncate" title={e.marketingMeta?.primaryLanguage}>
                          {e.marketingMeta?.primaryLanguage || '—'}
                        </td>
                        <td className="py-2 px-2 whitespace-nowrap max-w-[90px] truncate" title={e.marketingMeta?.platform}>
                          {e.marketingMeta?.platform || '—'}
                        </td>
                        <td className="py-2 px-2 max-w-[120px] truncate text-gray-600" title={e.marketingMeta?.referrerHost}>
                          {e.marketingMeta?.referrerHost || '—'}
                        </td>
                        <td className="py-2 px-2 whitespace-nowrap max-w-[130px] truncate" title={e.marketingMeta?.emailPrefillDomain}>
                          {e.marketingMeta?.emailPrefillDomain || '—'}
                        </td>
                        <td className="py-2 px-2 whitespace-nowrap">{e.marketingMeta?.emailPrefillHint ? 'yes' : '—'}</td>
                        <td className="py-2 px-2 whitespace-nowrap">{e.marketingMeta?.deviceCategory || '—'}</td>
                        <td className="py-2 px-2 whitespace-nowrap text-gray-500">{e.marketingMeta?.connectionEffectiveType || '—'}</td>
                        <td className="py-2 px-2 max-w-[120px] truncate" title={formatSessionUtm(e.marketingMeta)}>
                          {formatSessionUtm(e.marketingMeta)}
                        </td>
                        <td className="py-2 px-2 text-gray-500 max-w-[140px] truncate" title={e.userAgent}>
                          {e.userAgent || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ReportPanel>
          </section>
        </>
      )}
    </div>
  )
}
