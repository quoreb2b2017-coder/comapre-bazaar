import { NextRequest, NextResponse } from 'next/server'

const backendBase = () =>
  (process.env.BACKEND_URL || 'http://127.0.0.1:5000').replace(/\/$/, '')

/** Forward analytics beacons; swallow errors when backend is offline (local dev). */
export async function POST(req: NextRequest) {
  const target = `${backendBase()}/api/v1/blog-admin/public/site-analytics/event`

  let body: string
  try {
    body = await req.text()
  } catch {
    return new NextResponse(null, { status: 204 })
  }

  try {
    const upstream = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers.get('content-type') || 'application/json',
        'User-Agent': req.headers.get('user-agent') || '',
        'X-Forwarded-For': req.headers.get('x-forwarded-for') || '',
      },
      body,
      cache: 'no-store',
    })

    const text = await upstream.text()
    return new NextResponse(text || null, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('content-type') || 'application/json',
      },
    })
  } catch {
    return new NextResponse(null, { status: 204 })
  }
}
