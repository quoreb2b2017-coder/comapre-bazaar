import { useState, useEffect, useRef } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { Zap, Clock, CheckCircle, ArrowRight, LayoutDashboard, Sparkles, FileText } from 'lucide-react'
import { StatsCards } from '../components/dashboard/StatsCards'
import { ActivityChart } from '../components/dashboard/ActivityChart'
import { StatusBadge } from '../components/ui/StatusBadge'
import api from '../utils/api'
import { afterNextPaint } from '../utils/deferPaint'

const statusDot = (status) => ({
  published: 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]',
  approved: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.45)]',
  rejected: 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.45)]',
  pending: 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]',
}[status] || 'bg-gray-400')

export const Dashboard = () => {
  const { toast } = useOutletContext()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const loadStarted = useRef(0)

  useEffect(() => {
    loadStarted.current = typeof performance !== 'undefined' ? performance.now() : Date.now()
    api.get('/blogs/stats')
      .then((res) => setData(res))
      .catch((err) => toast.error('Failed to load dashboard: ' + err.message))
      .finally(() => {
        const start = loadStarted.current
        const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
        const elapsed = now - start
        const minSkeletonMs = 280
        const rest = Math.max(0, minSkeletonMs - elapsed)
        setTimeout(() => {
          afterNextPaint(() => setLoading(false))
        }, rest)
      })
  }, [])

  return (
    <div className="space-y-8 animate-fade-in max-w-[1600px] mx-auto">
      {/* Welcome hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-navy-mid to-brand text-white shadow-xl shadow-brand/20 ring-1 ring-white/10">
        <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-brand/30 blur-3xl" aria-hidden />
        <div className="absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-white/5 blur-2xl" aria-hidden />
        <div className="relative px-6 py-8 sm:px-8 sm:py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Blog automation
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-white/75 max-w-xl">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              {' · '}
              Track posts, approvals, and publishing at a glance.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/generate')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-navy shadow-lg transition hover:bg-white/95 hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Zap className="w-4 h-4 text-brand" />
            Generate blog
          </button>
        </div>
      </div>

      {/* Stats */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Overview</span>
        </div>
        <StatsCards stats={data?.stats} loading={loading} />
      </section>

      {/* Chart + Activity */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <FileText className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Activity &amp; feed</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          <div className="lg:col-span-2 min-h-[280px]">
            <ActivityChart data={data?.dailyStats} loading={loading} />
          </div>

          <div className="flex flex-col lg:border-l lg:border-gray-200 lg:dark:border-gray-800 lg:pl-8 pt-2 lg:pt-0">
            <div className="flex items-start justify-between gap-2 mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Recent posts</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Latest updates</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/blogs')}
                className="text-xs font-medium text-brand hover:text-brand-hover flex items-center gap-1 shrink-0"
              >
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex-1 flex flex-col min-h-[200px]">
              {loading ? (
                <div className="space-y-3 flex-1">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-200/90 dark:bg-gray-700/80 animate-pulse flex-shrink-0" />
                      <div className="flex-1 space-y-2 pt-1">
                        <div className="h-3 bg-gray-200/90 dark:bg-gray-700/80 rounded animate-pulse w-4/5" />
                        <div className="h-2.5 bg-gray-200/90 dark:bg-gray-700/80 rounded animate-pulse w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1 flex-1">
                  {data?.recentActivity?.length ? (
                    data.recentActivity.map((blog) => (
                      <button
                        type="button"
                        key={blog._id}
                        onClick={() => navigate(`/blogs/${blog._id}`)}
                        className="w-full flex items-start gap-3 p-3 rounded-xl text-left border border-transparent hover:border-brand/25 hover:bg-brand-light/50 dark:hover:bg-brand/10 transition-all group"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gray-100 dark:bg-gray-800 group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors shadow-inner`}>
                          <span className={`w-2.5 h-2.5 rounded-full ${statusDot(blog.status)}`} />
                        </div>
                        <div className="flex-1 min-w-0 py-0.5">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-brand transition-colors">{blog.title}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <StatusBadge status={blog.status} />
                            <span className="text-xs text-gray-400 tabular-nums">
                              {new Date(blog.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-10">No recent activity yet</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Zap className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Quick actions</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Zap,
              label: 'Generate new blog',
              desc: 'AI draft with hero banner & SEO meta',
              gradient: 'from-violet-500/15 to-brand/15',
              iconBg: 'bg-brand-light text-brand ring-2 ring-brand/20',
              href: '/generate',
            },
            {
              icon: Clock,
              label: 'Review pending',
              desc: `${data?.stats?.pending ?? 0} awaiting review`,
              gradient: 'from-amber-500/15 to-yellow-500/10',
              iconBg: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/20',
              href: '/approvals',
            },
            {
              icon: CheckCircle,
              label: 'Approved posts',
              desc: `${data?.stats?.approved ?? 0} ready to publish`,
              gradient: 'from-emerald-500/15 to-teal-500/10',
              iconBg: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20',
              href: '/blogs?status=approved',
            },
          ].map(({ icon: Icon, label, desc, gradient, iconBg, href }) => (
            <button
              key={label}
              type="button"
              onClick={() => navigate(href)}
              className={`relative overflow-hidden rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-gradient-to-br ${gradient} p-5 text-left shadow-md shadow-gray-900/5 dark:shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-brand/30 dark:hover:border-brand/40 group`}
            >
              <div className={`relative z-[1] w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="relative z-[1] font-semibold text-gray-900 dark:text-gray-100 text-sm">{label}</p>
              <p className="relative z-[1] text-xs text-gray-500 dark:text-gray-400 mt-1 leading-snug">{desc}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
