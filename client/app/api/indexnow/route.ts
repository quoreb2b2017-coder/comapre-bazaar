import { NextResponse } from 'next/server'

type IndexNowRequest = {
  urlList?: string[]
}

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'
const INDEXNOW_HOST = 'www.compare-bazaar.com'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const apiToken = process.env.INDEXNOW_API_TOKEN
  const configuredKey = process.env.INDEXNOW_KEY

  if (!configuredKey) {
    return NextResponse.json(
      { ok: false, error: 'INDEXNOW_KEY is not configured.' },
      { status: 500 }
    )
  }

  if (apiToken) {
    const authHeader = request.headers.get('x-indexnow-token')
    if (authHeader !== apiToken) {
      return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 })
    }
  }

  let payload: IndexNowRequest
  try {
    payload = (await request.json()) as IndexNowRequest
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400 })
  }

  const urlList = (payload.urlList ?? []).filter((url) => typeof url === 'string' && url.trim().length > 0)
  if (urlList.length === 0) {
    return NextResponse.json({ ok: false, error: 'urlList is required.' }, { status: 400 })
  }

  if (urlList.length > 10000) {
    return NextResponse.json(
      { ok: false, error: 'IndexNow supports up to 10,000 URLs per request.' },
      { status: 400 }
    )
  }

  const body = {
    host: INDEXNOW_HOST,
    key: configuredKey,
    keyLocation: `https://${INDEXNOW_HOST}/${configuredKey}.txt`,
    urlList,
  }

  const upstream = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  })

  if (!upstream.ok) {
    const detail = await upstream.text()
    return NextResponse.json(
      { ok: false, error: 'IndexNow request failed.', status: upstream.status, detail },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true, submitted: urlList.length })
}
