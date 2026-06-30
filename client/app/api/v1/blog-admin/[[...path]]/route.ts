import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 300

function backendBase(): string {
  return (process.env.BLOG_CMS_BACKEND_URL || process.env.BACKEND_URL || 'http://127.0.0.1:5000').replace(
    /\/$/,
    ''
  )
}

async function proxyRequest(req: NextRequest, pathSegments: string[] | undefined) {
  const path = (pathSegments || []).join('/')
  const search = req.nextUrl.search
  const suffix = path ? `/${path}` : ''
  const target = `${backendBase()}/api/v1/blog-admin${suffix}${search}`

  const headers = new Headers()
  const auth = req.headers.get('authorization')
  const adminToken = req.headers.get('x-admin-token')
  const contentType = req.headers.get('content-type')
  const accept = req.headers.get('accept')

  if (auth) headers.set('authorization', auth)
  if (adminToken) headers.set('x-admin-token', adminToken)
  if (contentType) headers.set('content-type', contentType)
  if (accept) headers.set('accept', accept)

  const method = req.method
  let body: ArrayBuffer | undefined
  if (method !== 'GET' && method !== 'HEAD') {
    try {
      body = await req.arrayBuffer()
    } catch {
      return NextResponse.json({ success: false, message: 'Failed to read upload body' }, { status: 400 })
    }
  }

  try {
    const upstream = await fetch(target, {
      method,
      headers,
      body: body?.byteLength ? body : undefined,
      cache: 'no-store',
    })

    const responseBody = await upstream.arrayBuffer()
    const resHeaders = new Headers()
    const upstreamType = upstream.headers.get('content-type')
    if (upstreamType) resHeaders.set('content-type', upstreamType)

    return new NextResponse(responseBody, {
      status: upstream.status,
      headers: resHeaders,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Backend unreachable'
    console.error('[blog-admin proxy]', method, target, message)
    return NextResponse.json(
      {
        success: false,
        message: `Blog admin API proxy failed: ${message}. Check BACKEND_URL on Vercel.`,
      },
      { status: 502 }
    )
  }
}

type RouteCtx = { params: { path?: string[] } }

export async function GET(req: NextRequest, ctx: RouteCtx) {
  return proxyRequest(req, ctx.params.path)
}

export async function POST(req: NextRequest, ctx: RouteCtx) {
  return proxyRequest(req, ctx.params.path)
}

export async function PUT(req: NextRequest, ctx: RouteCtx) {
  return proxyRequest(req, ctx.params.path)
}

export async function PATCH(req: NextRequest, ctx: RouteCtx) {
  return proxyRequest(req, ctx.params.path)
}

export async function DELETE(req: NextRequest, ctx: RouteCtx) {
  return proxyRequest(req, ctx.params.path)
}
