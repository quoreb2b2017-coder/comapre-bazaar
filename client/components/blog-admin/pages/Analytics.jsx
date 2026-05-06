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
          <div className="h-[300px] p-4">
            {derived.keywordOpp.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={derived.keywordOpp}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="keyword" interval={0} angle={-25} textAnchor="end" height={80} />
                  <YAxis />
                  <ChartTooltip />
                  <Bar dataKey="traffic" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full grid place-items-center text-sm text-gray-500">No campaign data yet.</div>
            )}
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

