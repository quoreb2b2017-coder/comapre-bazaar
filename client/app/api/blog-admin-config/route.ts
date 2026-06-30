import { NextResponse } from 'next/server'

function serverBackendBase(): string {
  return (process.env.BLOG_CMS_BACKEND_URL || process.env.BACKEND_URL || '').replace(/\/$/, '')
}

/**
 * Tells the blog-admin SPA which API base to use in the browser.
 * Uploads must bypass the Next rewrite (Vercel ~4.5 MB body cap on proxied requests).
 */
export async function GET() {
  const backend = serverBackendBase()
  if (!backend) {
    return NextResponse.json({
      direct: false,
      apiBase: '/api/v1/blog-admin',
    })
  }

  const apiBase = backend.endsWith('/api/v1/blog-admin')
    ? backend
    : `${backend}/api/v1/blog-admin`

  return NextResponse.json({
    direct: true,
    apiBase,
  })
}
