/**
 * Server (SSR): direct Express URL from BACKEND_URL / BLOG_CMS_BACKEND_URL.
 * Browser (prod): empty string so fetch uses same-origin `/api/v1/blog-admin/*`.
 * Browser (dev): hit Express directly so route clicks do not compile the Next API proxy.
 */
export function cmsBackendBase(): string {
  if (typeof window !== 'undefined') {
    if (process.env.NODE_ENV === 'development') {
      return String(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000').replace(/\/$/, '')
    }
    return ''
  }
  const raw =
    process.env.BLOG_CMS_BACKEND_URL || process.env.BACKEND_URL || 'http://127.0.0.1:5000'
  return raw.replace(/\/$/, '')
}
