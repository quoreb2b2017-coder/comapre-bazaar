type Params = { params: { indexNowKey: string } }

export const dynamic = 'force-dynamic'

export function GET(_request: Request, { params }: Params) {
  const configuredKey = process.env.INDEXNOW_KEY
  if (!configuredKey || params.indexNowKey !== configuredKey) {
    return new Response('Not Found', { status: 404 })
  }

  return new Response(configuredKey, {
    status: 200,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
