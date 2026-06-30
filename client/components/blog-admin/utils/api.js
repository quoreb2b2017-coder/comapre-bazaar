import axios from 'axios'

/**
 * In `next dev`, rewrites proxy to the backend can reset the socket on long Claude calls.
 * Call the API directly in development (override port via NEXT_PUBLIC_BLOG_ADMIN_API_BASE).
 */
export function getBlogAdminBaseURL() {
  const fromEnv = process.env.NEXT_PUBLIC_BLOG_ADMIN_API_BASE
  if (fromEnv && String(fromEnv).trim()) return String(fromEnv).replace(/\/$/, '')
  if (process.env.NODE_ENV === 'development') {
    return 'http://127.0.0.1:5000/api/v1/blog-admin'
  }
  return '/api/v1/blog-admin'
}

export function getAdminToken() {
  if (typeof window === 'undefined') return ''
  return String(localStorage.getItem('admin_token') || '').trim()
}

/** Auth headers for manual fetch/axios calls. Sends backup header when proxies strip Authorization. */
export function getAdminAuthHeaders(extra = {}) {
  const token = getAdminToken()
  if (!token) return { ...extra }
  return {
    ...extra,
    Authorization: `Bearer ${token}`,
    'X-Admin-Token': token,
  }
}

function attachAuthHeaders(config) {
  const token = getAdminToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    config.headers['X-Admin-Token'] = token
  }
  return config
}

/** Raw axios client — use for multipart uploads (returns full Axios response). */
export const blogAdminHttp = axios.create({
  baseURL: getBlogAdminBaseURL(),
  timeout: 30000,
})

blogAdminHttp.interceptors.request.use(attachAuthHeaders, (error) => Promise.reject(error))

const api = axios.create({
  baseURL: getBlogAdminBaseURL(),
  timeout: 30000,
})

/** Use for `/generate-blog` — shorter drafts usually finish well under this (raise if you tune prompts for very long posts). */
export const API_TIMEOUT_LONG_MS = 180000

api.interceptors.request.use(attachAuthHeaders, (error) => Promise.reject(error))

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      window.location.href = '/blog-admin/login'
    }
    let message = error.response?.data?.message || error.message || 'Something went wrong'
    if (error.code === 'ECONNABORTED' || /timeout/i.test(String(message))) {
      message = 'Request timed out. If this was blog generation, try again or use a shorter topic; the server may still be working.'
    }
    return Promise.reject(new Error(message))
  }
)

export function requireAdminToken(toast) {
  const token = getAdminToken()
  if (token) return token
  toast?.error?.('Session expired. Please sign in again.')
  if (typeof window !== 'undefined') {
    window.location.href = '/blog-admin/login'
  }
  return ''
}

export default api
