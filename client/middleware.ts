import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { resolveLegacyRedirect } from './legacyRedirects.mjs'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const legacyDestination = resolveLegacyRedirect(pathname)
  if (legacyDestination) {
    const url = request.nextUrl.clone()
    url.pathname = legacyDestination
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
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
