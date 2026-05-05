import { Moon, Sun } from 'lucide-react'

/**
 * Accessible Light / Dark toggle for blog admin (uses darkMode state from parent).
 */
export function ThemeSwitch({
  darkMode,
  setDarkMode,
  showLabel = true,
  className = '',
  /** Override label colour (e.g. text-white/90 on dark hero backgrounds) */
  labelClassName,
}) {
  const labelTone =
    labelClassName ||
    'text-gray-600 dark:text-gray-300'
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel ? (
        <span className={`text-xs font-medium hidden sm:inline select-none ${labelTone}`}>
          {darkMode ? 'Dark' : 'Light'}
        </span>
      ) : null}
      <button
        type="button"
        role="switch"
        aria-checked={darkMode}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={() => setDarkMode((on) => !on)}
        className={`relative inline-flex h-7 w-[2.75rem] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 ${
          darkMode ? 'bg-brand' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-6 w-6 mt-px transform rounded-full bg-white shadow-md transition duration-200 ease-out ${
            darkMode ? 'translate-x-[1.2rem]' : 'translate-x-0.5'
          }`}
        >
          <span className="flex h-full w-full items-center justify-center">
            {darkMode ? (
              <Moon className="w-3.5 h-3.5 text-brand" aria-hidden />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-500" aria-hidden />
            )}
          </span>
        </span>
      </button>
    </div>
  )
}
