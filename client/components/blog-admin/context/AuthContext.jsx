import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import api from '../utils/api'
import { getPublicSiteHomeUrl } from '../utils/publicSite'
import { afterNextPaint } from '../utils/deferPaint'

const AuthContext = createContext(null)

/** Keep session spinner visible briefly so it does not flash subliminally, then end after paint */
const AUTH_LOADER_MIN_MS = 320

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const authStartedAt = useRef(0)

  useEffect(() => {
    authStartedAt.current = typeof performance !== 'undefined' ? performance.now() : Date.now()

    const finishNoSession = () => {
      afterNextPaint(() => setLoading(false))
    }

    const finishAfterSessionCheck = () => {
      const start = authStartedAt.current
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
      const elapsed = now - start
      const rest = Math.max(0, AUTH_LOADER_MIN_MS - elapsed)
      setTimeout(() => {
        afterNextPaint(() => setLoading(false))
      }, rest)
    }

    const token = localStorage.getItem('admin_token')
    const user = localStorage.getItem('admin_user')
    if (token && user) {
      setAdmin(JSON.parse(user))
      api.get('/auth/me')
        .then((res) => setAdmin(res.admin))
        .catch(() => {
          localStorage.removeItem('admin_token')
          localStorage.removeItem('admin_user')
          setAdmin(null)
        })
        .finally(finishAfterSessionCheck)
    } else {
      finishNoSession()
    }
  }, [])

  const login = useCallback((token, adminData) => {
    localStorage.setItem('admin_token', token)
    localStorage.setItem('admin_user', JSON.stringify(adminData))
    setAdmin(adminData)
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      /* offline / session already invalid */
    }
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setAdmin(null)
    if (typeof window !== 'undefined') {
      window.location.href = getPublicSiteHomeUrl()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
