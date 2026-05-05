import { useState, useLayoutEffect } from 'react'

function readStoredDarkMode() {
  if (typeof window === 'undefined') return false
  try {
    const v = localStorage.getItem('darkMode')
    return v === 'true' || v === '1'
  } catch {
    return false
  }
}

/** Syncs Tailwind `dark` class on <html> and `.blog-admin-root` with localStorage `darkMode`. */
export function useBlogAdminTheme() {
  const [darkMode, setDarkMode] = useState(readStoredDarkMode)

  useLayoutEffect(() => {
    const root = document.querySelector('.blog-admin-root')
    document.documentElement.classList.toggle('dark', darkMode)
    if (root) root.classList.toggle('dark', darkMode)
    try {
      localStorage.setItem('darkMode', darkMode ? 'true' : 'false')
    } catch {
      /* ignore */
    }
  }, [darkMode])

  return [darkMode, setDarkMode]
}
