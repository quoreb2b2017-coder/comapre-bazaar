#!/usr/bin/env node
/**
 * Post-deploy SEO verification: redirects (single-hop), JSON-LD presence, robots policy.
 * Usage: node scripts/verify-seo.mjs [baseUrl]
 * Example: node scripts/verify-seo.mjs https://www.compare-bazaar.com
 */

const BASE = (process.argv[2] || process.env.SITE_URL || 'https://www.compare-bazaar.com').replace(/\/$/, '')
const SUBDOMAIN = 'https://blogs.compare-bazaar.com'

const REDIRECT_TESTS = [
  { url: `${BASE}/resources/whitepaper`, expect: '/resources/whitepapers' },
  { url: `${BASE}/resources/whitepaper/test-slug`, expect: '/resources/whitepapers/test-slug' },
  { url: `${BASE}/privacy-policy/ccpa-opt-out`, expect: '/do-not-sell' },
  { url: `${BASE}/do-not-sell-my-info`, expect: '/do-not-sell' },
  { url: `${BASE}/home`, expect: '/' },
  { url: `${BASE}/about-us`, expect: '/about' },
  { url: `${BASE}/gps-fleet-management`, expect: '/technology/gps-fleet-management-software' },
  {
    url: `${BASE}/blog/gusto-vs-adp-vs-paychex-which-payroll-platform-fits-your-headcount`,
    expect: '/blog/gusto-vs-adp-vs-paychex-complete-comparison',
  },
  {
    url: `${BASE}/technology/best-payroll-system/get-free-quotes`,
    expect: '/human-resources/best-payroll-software/get-free-quotes',
  },
]

const PAGE_SCHEMA_TESTS = [
  { path: '/human-resources/best-payroll-software', needs: ['@graph', 'ItemList', 'BreadcrumbList'] },
  { path: '/marketing/best-crm-software', needs: ['@graph', 'ItemList'] },
  { path: '/blog/gusto-vs-adp-vs-paychex-complete-comparison', needs: ['@graph', 'BlogPosting'] },
]

const PAGE_MODULE_TESTS = [
  { path: '/human-resources/best-payroll-software', needs: ['why-businesses-need-modern-payroll-systems', 'Further reading'] },
]

const COMPARE_CANONICAL_TESTS = [
  {
    path: '/compare?category=technology-payroll&brand=gusto',
    canonical: 'https://www.compare-bazaar.com/technology/best-payroll-system',
  },
  {
    path: '/marketing/best-crm-software/get-free-quotes?ref=review&product=pipedrive-sales-review&vendor=Pipedrive',
    canonical: 'https://www.compare-bazaar.com/marketing/best-crm-software/get-free-quotes',
  },
  {
    path: '/resources/whitepapers/payroll-switching-cost-report-2026/description',
    canonical: 'https://www.compare-bazaar.com/resources/whitepapers/payroll-switching-cost-report-2026',
  },
]

async function fetchHead(url, redirects = 0) {
  const res = await fetch(url, { redirect: 'manual' })
  const location = res.headers.get('location')
  if (res.status >= 300 && res.status < 400 && location && redirects < 5) {
    const next = location.startsWith('http') ? location : new URL(location, url).href
    return fetchHead(next, redirects + 1)
  }
  return { res, finalUrl: url, hops: redirects }
}

async function testRedirect({ url, expect }) {
  const res = await fetch(url, { redirect: 'manual' })
  const location = res.headers.get('location') || ''
  const okStatus = res.status === 301 || res.status === 308 || res.status === 307 || res.status === 302
  const okLocation = location.includes(expect)
  return {
    name: `redirect ${url}`,
    pass: okStatus && okLocation,
    detail: `status=${res.status} location=${location}`,
  }
}

async function testRedirectChain(url) {
  let current = url
  let hops = 0
  let lastStatus = 0
  while (hops < 3) {
    const res = await fetch(current, { redirect: 'manual' })
    lastStatus = res.status
    const location = res.headers.get('location')
    if (res.status >= 300 && res.status < 400 && location) {
      hops += 1
      current = location.startsWith('http') ? location : new URL(location, current).href
      continue
    }
    break
  }
  return {
    name: `single-hop ${url}`,
    pass: hops <= 1,
    detail: `hops=${hops} finalStatus=${lastStatus} final=${current}`,
  }
}

async function testPageSchema({ path, needs }) {
  const res = await fetch(`${BASE}${path}`)
  const html = await res.text()
  const hasLd = html.includes('application/ld+json')
  const missing = needs.filter((token) => !html.includes(token))
  return {
    name: `schema ${path}`,
    pass: res.ok && hasLd && missing.length === 0,
    detail: missing.length ? `missing tokens: ${missing.join(', ')}` : 'ok',
  }
}

async function testPageModule({ path, needs }) {
  const res = await fetch(`${BASE}${path}`)
  const html = await res.text()
  const missing = needs.filter((token) => !html.includes(token))
  return {
    name: `module ${path}`,
    pass: res.ok && missing.length === 0,
    detail: missing.length ? `missing: ${missing.join(', ')}` : 'ok',
  }
}

async function testCompareCanonical({ path, canonical }) {
  const res = await fetch(`${BASE}${path}`)
  const html = await res.text()
  const match =
    html.match(/rel="canonical"[^>]*href="([^"]+)"/i) || html.match(/href="([^"]+)"[^>]*rel="canonical"/i)
  const href = (match?.[1] || '').replace(/&amp;/g, '&')
  const canonicalOk = href === canonical
  const noindex = /name="robots"[^>]*content="[^"]*noindex/i.test(html) || /content="[^"]*noindex[^"]*"[^>]*name="robots"/i.test(html)
  return {
    name: `compare canonical ${path}`,
    pass: res.ok && canonicalOk && noindex,
    detail: `canonical=${href || '(missing)'} noindex=${noindex} status=${res.status}`,
  }
}

async function testRobots() {
  const res = await fetch(`${BASE}/robots.txt`)
  const text = await res.text()
  const blocksGpt = /User-agent:\s*GPTBot[\s\S]*?Disallow:\s*\/\s*$/im.test(text)
  const allowsAll = text.includes('Allow: /')
  return {
    name: 'robots.txt policy',
    pass: res.ok && allowsAll && !blocksGpt,
    detail: blocksGpt ? 'GPTBot still blocked' : 'GPTBot allowed; CCBot may still be blocked',
  }
}

async function testSubdomain() {
  try {
    const res = await fetch(`${SUBDOMAIN}/`, { redirect: 'manual' })
    const location = res.headers.get('location') || ''
    const pass = (res.status === 301 || res.status === 308) && location.includes('www.compare-bazaar.com/blog')
    return {
      name: 'subdomain blogs.compare-bazaar.com',
      pass,
      detail: pass ? `status=${res.status} location=${location}` : `status=${res.status} location=${location || '(none)'} — add Vercel domain alias if missing`,
    }
  } catch (err) {
    return {
      name: 'subdomain blogs.compare-bazaar.com',
      pass: false,
      detail: `network error: ${err.message}`,
    }
  }
}

async function main() {
  console.log(`SEO verification against ${BASE}\n`)
  const results = []

  for (const test of REDIRECT_TESTS) results.push(await testRedirect(test))
  for (const url of REDIRECT_TESTS.map((t) => t.url)) results.push(await testRedirectChain(url))
  for (const test of PAGE_SCHEMA_TESTS) results.push(await testPageSchema(test))
  for (const test of PAGE_MODULE_TESTS) results.push(await testPageModule(test))
  for (const test of COMPARE_CANONICAL_TESTS) results.push(await testCompareCanonical(test))
  results.push(await testRobots())
  results.push(await testSubdomain())

  let failed = 0
  for (const r of results) {
    const mark = r.pass ? 'PASS' : 'FAIL'
    if (!r.pass) failed += 1
    console.log(`${mark}  ${r.name}`)
    console.log(`      ${r.detail}`)
  }

  console.log(`\n${results.length - failed}/${results.length} passed`)
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
