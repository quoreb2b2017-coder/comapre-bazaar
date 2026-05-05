import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{payload[0].value} blogs</p>
      </div>
    )
  }
  return null
}

export const ActivityChart = ({ data = [], loading }) => {
  const formatted = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: d.count,
  }))

  if (loading) {
    return (
      <div className="h-full min-h-[280px] py-1">
        <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4" />
        <div className="h-[200px] bg-gray-100/80 dark:bg-gray-800/40 rounded-xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="h-full min-h-[280px] flex flex-col py-1">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Blog activity</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">New posts per day · last 14 days</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold px-2.5 py-1 border border-emerald-200/60 dark:border-emerald-800/50">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
      </div>
      <div className="flex-1 mt-4 w-full" style={{ minHeight: 220 }}>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={formatted} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="blogGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.65} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} allowDecimals={false} width={32} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="count" stroke="#1d4ed8" strokeWidth={2.5} fill="url(#blogGradient)" activeDot={{ r: 5, strokeWidth: 0, fill: '#1d4ed8' }} dot={{ fill: '#1d4ed8', r: 2.5, strokeWidth: 2, stroke: '#fff' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
