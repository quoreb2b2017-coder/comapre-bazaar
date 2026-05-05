import axios from 'axios'

/**
 * In `next dev`, rewrites proxy to the backend can reset the socket on long Claude calls.
 * Call the API directly in development (override port via NEXT_PUBLIC_BLOG_ADMIN_API_BASE).
 */
function getBlogAdminBaseURL() {
  const fromEnv = process.env.NEXT_PUBLIC_BLOG_ADMIN_API_BASE
  if (fromEnv && String(fromEnv).trim()) return String(fromEnv).replace(/\/$/, '')
  if (process.env.NODE_ENV === 'development') {
    return 'http://127.0.0.1:5000/api/v1/blog-admin'
  }
  return '/api/v1/blog-admin'
}

/** Default for most API calls. Long operations (e.g. Claude) override per request. */
const baseURL = getBlogAdminBaseURL()

const api = axios.create({
  baseURL,
  timeout: 30000,
})

/** Use for `/generate-blog` — shorter drafts usually finish well under this (raise if you tune prompts for very long posts). */
export const API_TIMEOUT_LONG_MS = 180000

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle 401
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

export default api
