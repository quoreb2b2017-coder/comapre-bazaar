import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Zap,
  Bell,
  Settings,
  ChevronLeft,
  PenTool,
  LogOut,
  Sparkles,
  Cookie,
  Users,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/blogs', icon: FileText, label: 'All Blogs' },
  { to: '/generate', icon: Zap, label: 'Generate Blog' },
  { to: '/approvals', icon: Bell, label: 'Approvals' },
  { to: '/trends', icon: Sparkles, label: 'Trending chat' },
  { to: '/cookies-report', icon: Cookie, label: 'Cookies & visitors' },
  { to: '/subscribers', icon: Users, label: 'Subscribers' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export const Sidebar = ({ collapsed, setCollapsed }) => {
  const { admin, logout } = useAuth()

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 flex flex-col bg-gradient-to-b from-navy via-[#121f3d] to-[#0c1428] text-white shadow-xl shadow-black/25 border-r border-white/5 transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand to-brand-hover flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand/30 ring-2 ring-white/10">
          <PenTool className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-serif text-base font-semibold text-white leading-tight tracking-tight">
              Blog Admin
            </p>
            <p className="text-white/45 text-xs mt-0.5">Automation · Claude</p>
          </div>
        )}
      </div>

      <p
        className={`px-4 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-white/35 ${collapsed ? 'sr-only' : ''}`}
      >
        Menu
      </p>

      {/* Nav */}
      <nav className="flex-1 py-2 px-2 space-y-1 overflow-y-auto min-h-0">
        {NAV.map(({ to, icon: Icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium border border-transparent ${
                isActive
                  ? 'bg-white/12 text-white shadow-inner border-white/10 ring-1 ring-white/5'
                  : 'text-white/65 hover:bg-white/[0.07] hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0 opacity-90 group-hover:opacity-100" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Account + logout */}
      <div className="border-t border-white/10 p-2 space-y-2 bg-black/15">
        {!collapsed && admin?.email && (
          <div className="px-3 py-2 rounded-xl bg-white/[0.06] border border-white/5">
            <p className="text-[11px] text-white/40 uppercase tracking-wide font-semibold">Signed in</p>
            <p className="text-xs text-white/90 truncate mt-0.5 font-medium">{admin.email}</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => logout()}
          title="Sign out"
          className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-white/90 bg-red-600/90 hover:bg-red-600 border border-red-500/40 shadow-md shadow-red-900/30 transition-all ${
            collapsed ? 'px-2' : ''
          }`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-white/45 hover:text-white hover:bg-white/[0.06] transition-all text-xs"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          {!collapsed && <span>Collapse sidebar</span>}
        </button>
      </div>
    </aside>
  )
}
