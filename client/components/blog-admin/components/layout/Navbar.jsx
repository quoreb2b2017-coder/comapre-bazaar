import { LogOut, Menu } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { ThemeSwitch } from '../ui/ThemeSwitch'

export const Navbar = ({ onMenuToggle, darkMode, setDarkMode }) => {
  const { admin, logout } = useAuth()
  const [showProfile, setShowProfile] = useState(false)

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Blog Automation System</h2>
          <p className="text-xs text-gray-400">Powered by Claude AI</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => logout()}
          className="inline-flex sm:hidden items-center justify-center p-2 rounded-xl text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          aria-label="Log out"
        >
          <LogOut className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => logout()}
          className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
        <div className="pl-2 border-l border-gray-200 dark:border-gray-700 ml-0.5">
          <ThemeSwitch darkMode={darkMode} setDarkMode={setDarkMode} showLabel />
        </div>

        {/* Profile dropdown */}
        <div className="relative z-50">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold">
              {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">{admin?.name || 'Admin'}</p>
              <p className="text-xs text-gray-400 leading-tight">{admin?.role?.replace('_', ' ')}</p>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 z-50 w-56 card shadow-xl border border-gray-200 dark:border-gray-700 py-1 animate-fade-in">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{admin?.name}</p>
                <p className="text-xs text-gray-400 truncate">{admin?.email}</p>
              </div>
              <button
                onClick={() => { setShowProfile(false); logout() }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {showProfile && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-20 bg-transparent sm:bg-black/10"
          onClick={() => setShowProfile(false)}
        />
      )}
    </header>
  )
}
