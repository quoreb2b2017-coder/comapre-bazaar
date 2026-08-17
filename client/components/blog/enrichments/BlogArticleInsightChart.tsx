'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatUnitValue, type ArticleEnrichment } from '@/lib/blogArticleEnrichments'
import type { ChartUnit } from '@/lib/blogChartCatalog'

type Props = {
  enrichment: Extract<ArticleEnrichment, { type: 'chart' }>
}

function formatTick(v: number, unit: ChartUnit): string {
  if (unit === 'percent') return `${v}%`
  if (unit === 'dollars') return `$${v}`
  if (unit === 'rating') return `${v}%`
  if (unit === 'score') return `${v}`
  if (unit === 'hours') return `${v}h`
  return String(v)
}

function ChartTooltip({
  active,
  payload,
  label,
  unit,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
  unit: ChartUnit
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white/95 px-3.5 py-2.5 shadow-lg backdrop-blur-sm">
      <p className="mb-1.5 text-xs font-medium text-slate-500">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-2 text-sm font-semibold text-navy">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.color }} />
          {p.name}: {formatUnitValue(p.value, unit)}
        </p>
      ))}
    </div>
  )
}

function PieTooltip({
  active,
  payload,
  unit,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: { fill: string } }>
  unit: ChartUnit
}) {
  if (!active || !payload?.length) return null
  const p = payload[0]
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white/95 px-3.5 py-2.5 shadow-lg backdrop-blur-sm">
      <p className="flex items-center gap-2 text-sm font-semibold text-navy">
        <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: p.payload.fill }} />
        {p.name}: {formatUnitValue(p.value, unit)}
      </p>
    </div>
  )
}

export function BlogArticleInsightChart({ enrichment }: Props) {
  const { title, subtitle, data, chartKind, unit, palette, seriesLabels, insight, sourceLabel, id } = enrichment
  const gradId = `blog-chart-grad-${id}`
  const hasSecond = data.some((d) => d.value2 != null)
  const s1 = seriesLabels?.[0] ?? 'Primary'
  const s2 = seriesLabels?.[1] ?? 'Comparison'

  const yDomain: [number, number | 'auto'] =
    unit === 'rating' ? [99.8, 100] : unit === 'percent' ? [0, 100] : [0, 'auto']

  const chartHeight = chartKind === 'pie' ? 260 : 250

  return (
    <figure className="blog-article-enrichment blog-article-chart not-prose" aria-label={title}>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="min-w-0 flex-1">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F58220]">
            Market data
          </p>
          <figcaption className="font-serif text-[1.15rem] font-semibold leading-snug text-navy sm:text-xl">
            {title}
          </figcaption>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-500">{subtitle}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className="rounded-full border border-[#0B2A6F]/15 bg-[#0B2A6F]/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-navy">
            {chartKind === 'pie' ? 'Share' : chartKind === 'grouped' ? 'Compare' : 'Trend'}
          </span>
          <span className="text-[10px] text-slate-400">{sourceLabel}</span>
        </div>
      </div>

      <div className="w-full" style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartKind === 'pie' ? (
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={92}
                paddingAngle={2}
                stroke="#fff"
                strokeWidth={2}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={palette[i % palette.length]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip unit={unit} />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
              />
            </PieChart>
          ) : chartKind === 'horizontal' ? (
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis
                type="number"
                domain={yDomain}
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => formatTick(v, unit)}
              />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fontSize: 11, fill: '#475569' }}
                tickLine={false}
                axisLine={false}
                width={88}
              />
              <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ fill: 'rgba(245,130,32,0.06)' }} />
              <Bar dataKey="value" name={s1} radius={[0, 4, 4, 0]} maxBarSize={22}>
                {data.map((_, i) => (
                  <Cell key={i} fill={palette[i % palette.length]} />
                ))}
              </Bar>
            </BarChart>
          ) : chartKind === 'line' ? (
            <LineChart data={data} margin={{ top: 8, right: 12, left: -4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis domain={yDomain} tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} width={40} tickFormatter={(v) => formatTick(v, unit)} />
              <Tooltip content={<ChartTooltip unit={unit} />} />
              {hasSecond && <Legend formatter={(v) => <span className="text-xs text-slate-600">{v}</span>} />}
              <Line type="monotone" dataKey="value" name={s1} stroke={palette[0]} strokeWidth={2.5} dot={{ fill: palette[0], r: 4, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, fill: '#F58220', stroke: '#fff', strokeWidth: 2 }} />
              {hasSecond && (
                <Line type="monotone" dataKey="value2" name={s2} stroke={palette[1] || '#F58220'} strokeWidth={2} strokeDasharray="6 4" dot={{ fill: palette[1], r: 3, strokeWidth: 2, stroke: '#fff' }} />
              )}
            </LineChart>
          ) : chartKind === 'area' ? (
            <AreaChart data={data} margin={{ top: 8, right: 12, left: -4, bottom: 0 }}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={palette[0]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={palette[0]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis domain={yDomain} tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} width={40} tickFormatter={(v) => formatTick(v, unit)} />
              <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ stroke: '#F58220', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area type="monotone" dataKey="value" name={s1} stroke={palette[0]} strokeWidth={2.5} fill={`url(#${gradId})`} activeDot={{ r: 5, fill: '#F58220', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          ) : chartKind === 'grouped' ? (
            <BarChart data={data} margin={{ top: 8, right: 12, left: -4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis domain={yDomain} tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} width={40} tickFormatter={(v) => formatTick(v, unit)} />
              <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ fill: 'rgba(11,42,111,0.04)' }} />
              <Legend formatter={(v) => <span className="text-xs text-slate-600">{v}</span>} />
              <Bar dataKey="value" name={s1} fill={palette[0]} radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="value2" name={s2} fill={palette[1] || '#F58220'} radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          ) : (
            <BarChart data={data} margin={{ top: 8, right: 12, left: -4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis domain={yDomain} tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} width={40} tickFormatter={(v) => formatTick(v, unit)} />
              <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ fill: 'rgba(245,130,32,0.08)' }} />
              <Bar dataKey="value" name={s1} radius={[4, 4, 0, 0]} maxBarSize={44}>
                {data.map((_, i) => (
                  <Cell key={i} fill={palette[i % palette.length]} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {insight ? (
        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50/80 px-3.5 py-3">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F58220]/15 text-[10px] font-bold text-[#F58220]">
            i
          </span>
          <p className="text-sm leading-relaxed text-slate-600">{insight}</p>
        </div>
      ) : null}
    </figure>
  )
}
