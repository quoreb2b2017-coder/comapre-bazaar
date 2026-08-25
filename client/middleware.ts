import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { resolveLegacyRedirect } from './legacyRedirects.mjs'

const RETIRED_WHITEPAPER_SLUGS = new Set([
  'iot-implementation-guide',
  'blockchain-applications',
  'customer-experience-transformation',
])

/** Repair HTML-entity slugs and singular /resources/whitepaper paths in one hop. */
function repairSeoPath(pathname: string): string | null {
  let next = pathname.replace(/andamp/gi, 'and')
  const lower = next.toLowerCase()

  if (lower === '/resources/whitepaper' || lower.startsWith('/resources/whitepaper/')) {
    const slug = lower.slice('/resources/whitepaper'.length).replace(/^\/+|\/+$/g, '')
    next = !slug || RETIRED_WHITEPAPER_SLUGS.has(slug) ? '/resources/whitepapers' : `/resources/whitepapers/${slug}`
  }

  if (next === pathname) return null
  return next
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const legacyDestination = resolveLegacyRedirect(pathname)
  if (legacyDestination) {
    const url = request.nextUrl.clone()
    url.pathname = legacyDestination
    url.search = request.nextUrl.search
    return NextResponse.redirect(url, { status: 301 })
  }

  const repaired = repairSeoPath(pathname)
  if (repaired) {
    const url = request.nextUrl.clone()
    url.pathname = repaired
    url.search = request.nextUrl.search
    return NextResponse.redirect(url, { status: 301 })
  }

  const lowercased = pathname.toLowerCase()
  if (pathname !== lowercased) {
    const url = request.nextUrl.clone()
    url.pathname = lowercased
    return NextResponse.redirect(url, { status: 301 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
}
