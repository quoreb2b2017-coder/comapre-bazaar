/**
 * Server (SSR): direct Express URL from BACKEND_URL / BLOG_CMS_BACKEND_URL.
 * Browser: empty string so fetch uses same-origin `/api/v1/blog-admin/*`
 * (Next.js rewrites proxy to the backend — no CORS, no localhost in production).
 */
export function cmsBackendBase(): string {
  if (typeof window !== 'undefined') return ''
  const raw =
    process.env.BLOG_CMS_BACKEND_URL || process.env.BACKEND_URL || 'http://127.0.0.1:5000'
  return raw.replace(/\/$/, '')
}
