import { useCallback, useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Activity,
  BarChart3,
  Globe2,
  MonitorSmartphone,
  RefreshCw,
  Shield,
  Users,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import api from '../utils/api'
import { GA_MEASUREMENT_ID } from '@/lib/googleAnalytics'

const CH_COLORS = ['#F58220', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b']
const RANGES = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: '7 days' },
  { key: '30d', label: '30 days' },
]

function fmt(n) {
  return Number(n || 0).toLocaleString()
}

function pct(part, total) {
  if (!total) return '0%'
  return `${Math.round((Number(part || 0) / Number(total)) * 100)}%`
}

export const SuperAdminGoogleAnalytics = () => {
  const { toast } = useOutletContext()
  const [range, setRange] = useState('7d')
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [status, setStatus] = useState(null)
  const [data, setData] = useState(null)

  const load = useCallback(
    async (selectedRange, { quiet = false } = {}) => {
      if (!quiet) setLoading(true)
      else setSyncing(true)

      try {
        const statusRes = await api.get('/site-analytics/google-analytics/status')
        if (statusRes?.success) setStatus(statusRes.data)

        if (!statusRes?.data?.configured) {
          setData(null)
          return
        }

        const reportRes = await api.get('/site-analytics/google-analytics/report', {
          params: { range: selectedRange },
        })

        if (!reportRes?.success || !reportRes?.data) {
          throw new Error(reportRes?.message || 'Failed to sync Google Analytics')
        }

        setData(reportRes.data)
        if (quiet) toast.success('Google Analytics synced')
      } catch (err) {
        const message = err?.response?.data?.message || err.message || 'Failed to load Google Analytics'
        if (!quiet) toast.error(message)
        if (err?.response?.data?.data) setStatus(err.response.data.data)
      } finally {
        setLoading(false)
        setSyncing(false)
      }
    },
    [toast],
  )

  useEffect(() => {
    load(range)
  }, [range, load])

  const deviceTotal = useMemo(
    () => (data?.devices || []).reduce((sum, row) => sum + Number(row.sessions || 0), 0),
    [data],
  )

  const channelTotal = useMemo(
    () => (data?.channels || []).reduce((sum, row) => sum + Number(row.sessions || 0), 0),
    [data],
  )

  if (loading) {
    return <div className="py-20 text-center text-sm text-gray-500">Syncing Google Analytics…</div>
  }

  const configured = status?.configured

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6 pb-10">
      <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-semibold text-[#F58220]">
              <Shield className="w-3.5 h-3.5" />
              Super Admin
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
              Google Analytics
            </h1>
            <p className="text-sm text-gray-600 max-w-2xl">
              Live GA4 data synced from your property. Site tag: <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{GA_MEASUREMENT_ID}</code>
              {data?.propertyId ? (
                <>
                  {' '}
                  · Property <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{data.propertyId}</code>
                </>
              ) : null}
            </p>
            {data?.syncedAt ? (
              <p className="text-xs text-gray-500">
                Last synced {new Date(data.syncedAt).toLocaleString()}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1">
              {RANGES.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setRange(item.key)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    range === item.key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => load(range, { quiet: true })}
              disabled={syncing || !configured}
              className="inline-flex items-center gap-2 rounded-xl bg-[#F58220] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e67412] disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              Sync now
            </button>
          </div>
        </div>
      </section>

      {!configured ? (
        <SetupPanel status={status} />
      ) : (
        <>
          <section className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <MetricCard title="Realtime users" value={fmt(data?.realtimeUsers ?? 0)} hint="Right now in GA4" icon={Activity} accent="text-emerald-600" />
            <MetricCard title="Active users" value={fmt(data?.overview?.activeUsers)} hint={`Selected range (${range})`} icon={Users} />
            <MetricCard title="Sessions" value={fmt(data?.overview?.sessions)} hint="Total sessions" icon={BarChart3} />
            <MetricCard title="Page views" value={fmt(data?.overview?.pageViews)} hint="screenPageViews" icon={Globe2} />
            <MetricCard title="Avg session" value={data?.overview?.avgSessionDurationLabel || '0s'} hint={`Bounce ${data?.overview?.bounceRate || 0}%`} icon={MonitorSmartphone} />
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Panel title="Users & sessions trend">
              <div className="h-[320px] p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data?.trend || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="activeUsers" stroke="#F58220" strokeWidth={2.5} dot={false} name="Active users" />
                    <Line type="monotone" dataKey="sessions" stroke="#3b82f6" strokeWidth={2} dot={false} name="Sessions" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Traffic channels">
              <div className="h-[320px] p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data?.channels || []} dataKey="sessions" nameKey="channel" innerRadius={70} outerRadius={110}>
                      {(data?.channels || []).map((entry, index) => (
                        <Cell key={entry.channel} fill={CH_COLORS[index % CH_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-600">
                  {(data?.channels || []).map((row, index) => (
                    <span key={row.channel} className="inline-flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CH_COLORS[index % CH_COLORS.length] }} />
                      {row.channel} ({fmt(row.sessions)} · {pct(row.sessions, channelTotal)})
                    </span>
                  ))}
                </div>
              </div>
            </Panel>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Panel title="Top pages">
              <DataTable
                columns={['Page', 'Views', 'Users', 'Avg time']}
                rows={(data?.topPages || []).map((row) => [row.path, fmt(row.pageViews), fmt(row.activeUsers), row.avgSessionDuration])}
                empty="No page data for this range."
              />
            </Panel>

            <Panel title="Landing pages">
              <DataTable
                columns={['Landing page', 'Sessions', 'Users']}
                rows={(data?.landingPages || []).map((row) => [row.path, fmt(row.sessions), fmt(row.activeUsers)])}
                empty="No landing page data for this range."
              />
            </Panel>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Panel title="Countries">
              <div className="h-[300px] p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={(data?.countries || []).slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="country" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="activeUsers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Devices">
              <div className="p-5 space-y-3">
                {(data?.devices || []).map((row, index) => {
                  const share = pct(row.sessions, deviceTotal)
                  return (
                    <div key={row.device}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize text-gray-700">{row.device}</span>
                        <span className="text-gray-600 tabular-nums">
                          {fmt(row.sessions)} sessions · {share}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: share,
                            backgroundColor: CH_COLORS[index % CH_COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Panel>
          </section>

          <Panel title="Source / medium">
            <DataTable
              columns={['Source', 'Medium', 'Sessions', 'Users']}
              rows={(data?.sources || []).map((row) => [row.source, row.medium, fmt(row.sessions), fmt(row.activeUsers)])}
              empty="No source/medium data for this range."
            />
          </Panel>

          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MiniStat label="New users" value={fmt(data?.overview?.newUsers)} />
            <MiniStat label="Engagement rate" value={`${data?.overview?.engagementRate || 0}%`} />
            <MiniStat label="Bounce rate" value={`${data?.overview?.bounceRate || 0}%`} />
            <MiniStat label="Events" value={fmt(data?.overview?.eventCount)} />
          </section>
        </>
      )}
    </div>
  )
}

function SetupPanel({ status }) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6 space-y-4">
      <h2 className="text-lg font-semibold text-amber-900">Google Analytics API setup required</h2>
      <p className="text-sm text-amber-800">
        The site gtag is installed, but this dashboard needs GA4 Data API credentials on the backend to pull full reports.
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-sm text-amber-900">
        <li>Create a Google Cloud service account with <strong>Google Analytics Data API</strong> enabled.</li>
        <li>In GA4 → Admin → Property access management, add the service account email as <strong>Viewer</strong>.</li>
        <li>Set backend env vars: <code className="bg-white/70 px-1 rounded">GA4_PROPERTY_ID</code>, <code className="bg-white/70 px-1 rounded">GA4_SERVICE_ACCOUNT_JSON</code>.</li>
        <li>Restart backend, then click <strong>Sync now</strong> on this page.</li>
      </ol>
      {status?.missing?.length ? (
        <div className="rounded-xl border border-amber-200 bg-white/70 p-4 text-sm text-gray-700">
          <p className="font-semibold text-gray-900 mb-2">Missing configuration</p>
          <ul className="list-disc pl-5 space-y-1">
            {status.missing.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}

function MetricCard({ title, value, hint, icon: Icon, accent = 'text-[#F58220]' }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-wide text-gray-500">{title}</p>
        <Icon className={`w-4 h-4 ${accent}`} />
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{hint}</p>
    </div>
  )
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
    </div>
  )
}

function Panel({ title, children }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <header className="px-5 py-4 border-b border-gray-100">
        <h3 className="font-semibold tracking-tight text-gray-900">{title}</h3>
      </header>
      {children}
    </section>
  )
}

function DataTable({ columns, rows, empty }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            {columns.map((col) => (
              <th key={col} className="text-left py-2 px-4 font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.length ? (
            rows.map((row, index) => (
              <tr key={`${row[0]}-${index}`}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${index}-${cellIndex}`}
                    className={`py-2.5 px-4 text-gray-700 ${cellIndex === 0 ? 'font-medium text-gray-900 max-w-[420px] truncate' : 'tabular-nums'}`}
                    title={typeof cell === 'string' ? cell : undefined}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="py-10 px-4 text-center text-sm text-gray-500">
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
