import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/** Lowercase URL paths so indexed /Technology/* and /Sales/* URLs 301 to canonical routes. */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
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
