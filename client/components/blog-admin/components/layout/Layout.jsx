import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { NavigationProgress } from './NavigationProgress'
import { useBlogAdminTheme } from '../../hooks/useBlogAdminTheme'

export const Layout = ({ toast }) => {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useBlogAdminTheme()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full z-40 lg:hidden">
            <Sidebar collapsed={false} setCollapsed={() => setMobileSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ${
          collapsed ? 'lg:ml-[72px]' : 'lg:ml-64'
        }`}
      >
        <Navbar
          onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        <main className="relative flex-1 min-w-0 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
          <NavigationProgress />
          {/* location.key remounts content per navigation so enter animation + fresh route state */}
          <div key={location.key} className="route-page-enter">
            <Outlet context={{ toast }} />
          </div>
        </main>
      </div>
    </div>
  )
}
