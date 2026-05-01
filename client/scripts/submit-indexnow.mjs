#!/usr/bin/env node

/**
 * Usage examples:
 * 1) node scripts/submit-indexnow.mjs https://www.compare-bazaar.com/a https://www.compare-bazaar.com/b
 * 2) node scripts/submit-indexnow.mjs --file urls.txt
 *
 * Requires:
 * - INDEXNOW_INTERNAL_ENDPOINT (e.g. http://localhost:3000/api/indexnow)
 * - INDEXNOW_API_TOKEN (optional if endpoint does not enforce token)
 */

import fs from 'node:fs'

function normalizeUrls(args) {
  const fileIndex = args.indexOf('--file')
  if (fileIndex >= 0) {
    const filePath = args[fileIndex + 1]
    if (!filePath) throw new Error('Missing file path after --file')
    const text = fs.readFileSync(filePath, 'utf8')
    return text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
  }
  return args.filter(Boolean)
}

async function main() {
  const endpoint = process.env.INDEXNOW_INTERNAL_ENDPOINT
  if (!endpoint) {
    throw new Error('Missing INDEXNOW_INTERNAL_ENDPOINT')
  }

  const urlList = normalizeUrls(process.argv.slice(2))
  if (urlList.length === 0) {
    throw new Error('Provide URLs as args or use --file urls.txt')
  }

  const token = process.env.INDEXNOW_API_TOKEN
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { 'x-indexnow-token': token } : {}),
    },
    body: JSON.stringify({ urlList }),
  })

  const data = await response.json()
  if (!response.ok || !data.ok) {
    throw new Error(`IndexNow submission failed: ${JSON.stringify(data)}`)
  }

  console.log(`Submitted ${data.submitted} URLs to IndexNow`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
