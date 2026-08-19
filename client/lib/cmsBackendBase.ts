/**
 * Server (SSR): direct Express URL from BACKEND_URL / BLOG_CMS_BACKEND_URL.
 * Browser (prod): empty string so fetch uses same-origin `/api/v1/blog-admin/*`.
 * Browser (dev): hit Express directly so route clicks do not compile the Next API proxy.
 */
export function cmsBackendBase(): string {
  if (typeof window !== 'undefined') {
    if (process.env.NODE_ENV === 'development') {
      return String(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '')
    }
    return ''
  }
  const raw =
    process.env.BLOG_CMS_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:5000'
  return raw.replace(/\/$/, '')
}

/** Windows often binds Express on localhost but not 127.0.0.1 (or the reverse). */
export function cmsBackendBaseCandidates(): string[] {
  const primary = cmsBackendBase()
  if (!primary) return ['']
  const bases = [primary]
  if (primary.includes('127.0.0.1')) {
    bases.push(primary.replace('127.0.0.1', 'localhost'))
  } else if (primary.includes('localhost')) {
    bases.push(primary.replace('localhost', '127.0.0.1'))
  }
  return [...new Set(bases)]
}
