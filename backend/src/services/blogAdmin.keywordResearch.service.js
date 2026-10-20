const axios = require('axios')
const Anthropic = require('@anthropic-ai/sdk').default
const SeoKeywordPage = require('../models/seoKeywordPage.model')
const SeoKeywordAnalysis = require('../models/seoKeywordAnalysis.model')
const Blog = require('../models/automationBlog.model')
const ComparisonPage = require('../models/comparisonPage.model')
const QuotePageConfig = require('../models/quotePageConfig.model')
const WhitePaper = require('../models/whitePaper.model')

const ALLOWED_HOSTS = new Set([
  'www.compare-bazaar.com',
  'compare-bazaar.com',
  'localhost',
  '127.0.0.1',
])

const BULK_MAX = Math.min(10, Number(process.env.SEO_KEYWORD_BULK_MAX || 5) || 5)

let anthropicClient = null

function siteDomain() {
  try {
    return new URL(siteBaseUrl()).hostname.replace(/^www\./i, '').toLowerCase()
  } catch {
    return 'compare-bazaar.com'
  }
}

function hostMatchesSite(host, domain) {
  const h = String(host || '').replace(/^www\./i, '').toLowerCase()
  const d = String(domain || '').replace(/^www\./i, '').toLowerCase()
  if (!h || !d) return false
  return h === d || h.endsWith(`.${d}`)
}

function siteBaseUrl() {
  const raw = String(
    process.env.WEBSITE_URL || process.env.BLOG_VOICE_SITE_URL || 'https://www.compare-bazaar.com'
  )
    .trim()
    .replace(/\/+$/, '')
  return raw.startsWith('http') ? raw : 'https://www.compare-bazaar.com'
}

function getAnthropicModel() {
  return String(
    process.env.ANTHROPIC_SEO_MODEL || process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6'
  ).trim()
}

function getAnthropic(apiKey) {
  const key = String(apiKey || '').trim()
  if (!key) throw new Error('Anthropic API key not configured')
  if (!anthropicClient || anthropicClient._apiKey !== key) {
    anthropicClient = new Anthropic({ apiKey: key })
    anthropicClient._apiKey = key
  }
  return anthropicClient
}

function integrationStatus() {
  const hasClaude = Boolean(
    String(process.env.ANTHROPIC_API_KEY || '').trim()
  )
  const hasDataForSeo = Boolean(
    String(process.env.DATAFORSEO_LOGIN || '').trim() &&
      String(process.env.DATAFORSEO_PASSWORD || '').trim()
  )
  const hasGoogleAds = Boolean(
    String(process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '').trim() &&
      String(process.env.GOOGLE_ADS_CUSTOMER_ID || '').trim()
  )
  const hasGsc = Boolean(
    String(process.env.GSC_SITE_URL || '').trim() &&
      (String(process.env.GA4_SERVICE_ACCOUNT_JSON || '').trim() ||
        String(process.env.GOOGLE_APPLICATION_CREDENTIALS || '').trim())
  )
  return {
    claude: {
      configured: hasClaude,
      note: hasClaude
        ? 'ANTHROPIC_API_KEY (or Settings claude_api_key) available for analysis'
        : 'Set ANTHROPIC_API_KEY or Settings → Claude API key',
    },
    dataForSeo: {
      configured: hasDataForSeo,
      note: hasDataForSeo
        ? 'DataForSEO credentials present — search volume / difficulty can be verified'
        : 'Optional: DATAFORSEO_LOGIN + DATAFORSEO_PASSWORD for verified keyword metrics',
    },
    googleAds: {
      configured: hasGoogleAds,
      note: hasGoogleAds
        ? 'Google Ads Keyword Planner credentials present'
        : 'Optional: GOOGLE_ADS_* for Keyword Planner volumes (not wired in v1)',
    },
    gsc: {
      configured: hasGsc,
      note: hasGsc
        ? 'GSC credentials detected — wire OAuth/service account queries in a follow-up'
        : 'Optional: GSC_SITE_URL + service account for impressions/clicks/CTR',
    },
  }
}

function assertAllowedUrl(rawUrl) {
  let parsed
  try {
    parsed = new URL(String(rawUrl || '').trim())
  } catch {
    throw new Error('Invalid URL')
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Only http/https URLs are allowed')
  }
  const host = parsed.hostname.toLowerCase()
  const allowedExtra = String(process.env.SEO_CRAWL_ALLOWED_HOSTS || '')
    .split(',')
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean)
  const allowed = new Set([...ALLOWED_HOSTS, ...allowedExtra])
  if (!allowed.has(host)) {
    throw new Error(`Crawling blocked for host "${host}". Add it to SEO_CRAWL_ALLOWED_HOSTS if intentional.`)
  }
  // Block obvious SSRF targets
  if (
    host === 'metadata.google.internal' ||
    host.endsWith('.internal') ||
    host === '0.0.0.0'
  ) {
    throw new Error('Blocked host')
  }
  return parsed
}

function classifyPageType(pathname) {
  const p = String(pathname || '/').toLowerCase()
  if (p === '/' || p === '') return 'homepage'
  if (p.startsWith('/blog/')) return 'blog'
  if (p === '/blog') return 'blog'
  if (p.includes('/resources/whitepapers') || p.includes('/whitepaper')) return 'whitepaper'
  if (p.includes('get-free-quote') || p.includes('bz-get-free-quotes')) return 'quote'
  if (p.includes('/compare') || /\/best-/.test(p)) return 'comparison'
  if (
    p.startsWith('/marketing') ||
    p.startsWith('/technology') ||
    p.startsWith('/sales') ||
    p.startsWith('/human-resources')
  ) {
    return 'category'
  }
  if (p.includes('/review') || p.includes('/product')) return 'product'
  if (p.includes('/landing') || p.includes('/lp/')) return 'landing'
  return 'other'
}

function normalizePath(pathname) {
  let p = String(pathname || '/')
  if (!p.startsWith('/')) p = `/${p}`
  p = p.split('?')[0].split('#')[0]
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1)
  return p || '/'
}

/** Pull /path out of a pasted URL, localhost link, or bare path so search still hits the page. */
function pathFromSearch(raw) {
  const text = String(raw || '').trim()
  if (!text) return ''
  if (text.startsWith('/')) return normalizePath(text)
  const withProto = /^https?:\/\//i.test(text) ? text : /^[\w.-]+\.[a-z]{2,}(:\d+)?\//i.test(text) || /^localhost(:\d+)?\//i.test(text) ? `https://${text}` : ''
  if (!withProto) return ''
  try {
    return normalizePath(new URL(withProto).pathname)
  } catch {
    return ''
  }
}

function decodeHtmlEntities(s) {
  return String(s || '')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
}

function htmlToPlain(html, maxLen = 12000) {
  return decodeHtmlEntities(
    String(html || '')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  ).slice(0, maxLen)
}

function extractMeta(html) {
  const src = String(html || '')
  const title = (src.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || ''
  const metaDesc =
    (src.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || [])[1] ||
    (src.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i) || [])[1] ||
    ''
  const h1 = (src.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || ''
  const keywordsMeta =
    (src.match(/<meta[^>]+name=["']keywords["'][^>]+content=["']([^"']*)["']/i) || [])[1] || ''
  const strip = (s) =>
    decodeHtmlEntities(
      String(s || '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    )
  return {
    title: strip(title).slice(0, 200),
    metaDescription: strip(metaDesc).slice(0, 320),
    h1: strip(h1).slice(0, 200),
    keywordsMeta: strip(keywordsMeta),
  }
}

const STALE_PROCESSING_MS = Number(process.env.SEO_ANALYSIS_STALE_MS || 4 * 60 * 1000) || 240000

async function failStaleAnalyses(pageId) {
  const cutoff = new Date(Date.now() - STALE_PROCESSING_MS)
  const stale = await SeoKeywordAnalysis.find({
    ...(pageId ? { pageId } : {}),
    status: { $in: ['queued', 'processing'] },
    updatedAt: { $lt: cutoff },
  })
  for (const doc of stale) {
    doc.status = 'failed'
    doc.error = 'Timed out or interrupted while processing. Click Analyze SEO again.'
    await doc.save()
    if (doc.pageId) {
      await SeoKeywordPage.updateOne(
        { _id: doc.pageId, analysisStatus: { $in: ['queued', 'processing'] } },
        { $set: { analysisStatus: 'failed' } }
      )
    }
  }
  return stale.length
}

async function fetchPageHtml(url) {
  const parsed = assertAllowedUrl(url)
  const res = await axios.get(parsed.toString(), {
    timeout: 20000,
    maxRedirects: 3,
    maxContentLength: 2_000_000,
    headers: {
      Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
      'User-Agent': 'CompareBazaarSeoResearch/1.0 (+https://www.compare-bazaar.com)',
    },
    validateStatus: (s) => s >= 200 && s < 400,
  })
  // Re-check final URL host after redirects
  if (res.request?.res?.responseUrl) {
    assertAllowedUrl(res.request.res.responseUrl)
  }
  return String(res.data || '')
}

async function fetchSitemapUrls(base) {
  const sitemapUrl = `${base.replace(/\/+$/, '')}/sitemap.xml`
  try {
    assertAllowedUrl(sitemapUrl)
    const res = await axios.get(sitemapUrl, {
      timeout: 25000,
      maxRedirects: 3,
      headers: { 'User-Agent': 'CompareBazaarSeoResearch/1.0' },
      validateStatus: (s) => s >= 200 && s < 400,
    })
    const extractLocs = (xml) => {
      const found = []
      const re = /<loc[^>]*>\s*([^<\s]+)\s*<\/loc>/gi
      let m
      while ((m = re.exec(String(xml || '')))) {
        found.push(m[1].trim())
      }
      return found
    }

    let urls = extractLocs(res.data)

    // Nested sitemap indexes — fetch up to 5 child sitemaps
    const childSitemaps = urls
      .filter((u) => /\.xml(\?|$)/i.test(u))
      .slice(0, 5)
    for (const child of childSitemaps) {
      try {
        assertAllowedUrl(child)
        const childRes = await axios.get(child, {
          timeout: 20000,
          maxRedirects: 2,
          headers: { 'User-Agent': 'CompareBazaarSeoResearch/1.0' },
        })
        urls = urls.concat(extractLocs(childRes.data))
      } catch (e) {
        console.warn('[keywordResearch] child sitemap:', e.message)
      }
    }

    return [...new Set(urls.filter((u) => /^https?:\/\//i.test(u) && !/\.xml(\?|$)/i.test(u)))]
  } catch (e) {
    console.warn('[keywordResearch] sitemap:', e.message)
    return []
  }
}

async function discoverPagesFromCms(base) {
  const items = []
  const origin = base.replace(/\/+$/, '')

  try {
    const blogs = await Blog.find({ status: 'published' })
      .select('title slug keywords metaTitle')
      .sort({ updatedAt: -1 })
      .limit(500)
      .lean()
    for (const b of blogs) {
      if (!b.slug) continue
      items.push({
        path: `/blog/${b.slug}`,
        url: `${origin}/blog/${b.slug}`,
        title: b.metaTitle || b.title || b.slug,
        pageType: 'blog',
        discoveredFrom: 'cms',
      })
    }
  } catch (e) {
    console.warn('[keywordResearch] blogs:', e.message)
  }

  try {
    const comps = await ComparisonPage.find({ status: 'published' })
      .select('slug displayName content')
      .limit(300)
      .lean()
    for (const c of comps) {
      const path = c.content?.canonical || `/${c.slug}`
      const p = normalizePath(path)
      items.push({
        path: p,
        url: `${origin}${p}`,
        title: c.displayName || c.slug,
        pageType: 'comparison',
        discoveredFrom: 'cms',
      })
    }
  } catch (e) {
    console.warn('[keywordResearch] comparisons:', e.message)
  }

  try {
    const quotes = await QuotePageConfig.find({ status: 'published' })
      .select('canonical displayName baseTitle pageKey')
      .limit(200)
      .lean()
    for (const q of quotes) {
      const p = normalizePath(q.canonical || `/${q.pageKey}`)
      items.push({
        path: p,
        url: `${origin}${p}`,
        title: q.displayName || q.baseTitle || q.pageKey,
        pageType: 'quote',
        discoveredFrom: 'cms',
      })
    }
  } catch (e) {
    console.warn('[keywordResearch] quotes:', e.message)
  }

  try {
    const papers = await WhitePaper.find({ status: 'published' })
      .select('title slug seoTitle')
      .limit(100)
      .lean()
    for (const w of papers) {
      if (!w.slug) continue
      items.push({
        path: `/resources/whitepapers/${w.slug}`,
        url: `${origin}/resources/whitepapers/${w.slug}`,
        title: w.seoTitle || w.title || w.slug,
        pageType: 'whitepaper',
        discoveredFrom: 'cms',
      })
    }
  } catch (e) {
    console.warn('[keywordResearch] whitepapers:', e.message)
  }

  return items
}

async function discoverAndUpsertPages() {
  const base = siteBaseUrl()
  const sitemapUrls = await fetchSitemapUrls(base)
  const cmsItems = await discoverPagesFromCms(base)
  const byPath = new Map()

  for (const abs of sitemapUrls) {
    try {
      const u = assertAllowedUrl(abs)
      const path = normalizePath(u.pathname)
      byPath.set(path, {
        path,
        url: `${base}${path === '/' ? '' : path}` || base,
        title: '',
        pageType: classifyPageType(path),
        discoveredFrom: 'sitemap',
      })
    } catch {
      /* skip foreign hosts */
    }
  }

  for (const item of cmsItems) {
    byPath.set(item.path, { ...byPath.get(item.path), ...item })
  }

  // Always include homepage
  if (!byPath.has('/')) {
    byPath.set('/', {
      path: '/',
      url: base,
      title: 'Compare Bazaar Home',
      pageType: 'homepage',
      discoveredFrom: 'sitemap',
    })
  }

  const ops = [...byPath.values()].map((item) => ({
    updateOne: {
      filter: { path: item.path },
      update: {
        $set: {
          url: item.url,
          path: item.path,
          pageType: item.pageType,
          discoveredFrom: item.discoveredFrom,
          ...(item.title ? { title: item.title } : {}),
        },
        $setOnInsert: {
          analysisStatus: 'never',
        },
      },
      upsert: true,
    },
  }))

  if (ops.length) {
    await SeoKeywordPage.bulkWrite(ops, { ordered: false })
  }

  return {
    discovered: ops.length,
    fromSitemap: sitemapUrls.length,
    fromCms: cmsItems.length,
  }
}

async function listPages({ q = '', pageType = '', status = '', page = 1, limit = 50 } = {}) {
  const filter = {}
  if (pageType) filter.pageType = pageType
  if (status) filter.analysisStatus = status
  const exactPath = pathFromSearch(q)
  if (q) {
    const escaped = String(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const or = [
      { title: new RegExp(escaped, 'i') },
      { path: new RegExp(escaped, 'i') },
      { url: new RegExp(escaped, 'i') },
    ]
    if (exactPath) {
      or.push({ path: exactPath })
      const pathEsc = exactPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      or.push({ path: new RegExp(pathEsc, 'i') })
      or.push({ url: new RegExp(pathEsc, 'i') })
    }
    filter.$or = or
  }
  const skip = (Math.max(1, page) - 1) * limit
  const [rows, total] = await Promise.all([
    SeoKeywordPage.find(filter).sort({ path: 1 }).skip(skip).limit(limit).lean(),
    SeoKeywordPage.countDocuments(filter),
  ])
  if (exactPath) {
    const exact = rows.find((row) => row.path === exactPath)
    if (exact) {
      rows.splice(rows.indexOf(exact), 1)
      rows.unshift(exact)
    }
  }
  return {
    data: rows,
    pagination: {
      page: Math.max(1, page),
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
  }
}

async function addManualPage(rawUrl) {
  let input = String(rawUrl || '').trim()
  if (input && !/^https?:\/\//i.test(input)) {
    input = input.startsWith('/') ? `${siteBaseUrl()}${input}` : `https://${input}`
  }
  const parsed = assertAllowedUrl(input)
  const base = siteBaseUrl()
  const path = normalizePath(parsed.pathname)
  const url = `${base}${path === '/' ? '' : path}`
  let title = ''
  try {
    const html = await fetchPageHtml(url)
    title = extractMeta(html).title
  } catch {
    /* optional */
  }
  const doc = await SeoKeywordPage.findOneAndUpdate(
    { path },
    {
      $set: {
        url,
        path,
        title: title || path,
        pageType: classifyPageType(path),
        discoveredFrom: 'manual',
      },
      $setOnInsert: { analysisStatus: 'never' },
    },
    { upsert: true, new: true }
  )
  return doc
}

/**
 * Opportunity score 0–100 from available signals.
 * Documented formula — never invents volume/difficulty when missing.
 */
function computeOpportunityScore(rec) {
  let score = 40
  const notes = []

  const relevance = Number(rec.relevance)
  if (Number.isFinite(relevance)) {
    score += Math.max(0, Math.min(30, relevance * 0.3))
    notes.push('relevance weighted +0–30')
  }

  if (Number.isFinite(Number(rec.searchVolume)) && Number(rec.searchVolume) > 0) {
    const vol = Math.min(20, Math.log10(Number(rec.searchVolume) + 1) * 6)
    score += vol
    notes.push('verified/available volume +0–20')
  } else {
    notes.push('volume unavailable — no demand boost')
  }

  if (Number.isFinite(Number(rec.keywordDifficulty))) {
    const kd = Number(rec.keywordDifficulty)
    score += Math.max(0, (100 - kd) * 0.15)
    notes.push('lower difficulty boosts score')
  }

  if (Number.isFinite(Number(rec.currentRanking))) {
    const rank = Number(rec.currentRanking)
    if (rank >= 4 && rank <= 20) {
      score += 12
      notes.push('ranking improvement opportunity +12')
    } else if (rank > 20 && rank <= 50) {
      score += 6
      notes.push('mid-SERP opportunity +6')
    }
  }

  if (rec.action === 'REMOVE') score = Math.min(score, 35)
  if (rec.action === 'KEEP' && !Number.isFinite(Number(rec.searchVolume))) {
    // Protect valuable existing keywords without volume data
    score = Math.max(score, 55)
    notes.push('KEEP without volume — floor 55 to protect existing terms')
  }

  if (rec.highSearchCandidate && rec.action === 'ADD') {
    score = Math.max(score, 72)
    score += 8
    notes.push('high-search ADD candidate boost')
  }
  if (rec.demandTier === 'high') {
    score += 5
    notes.push('demandTier high +5')
  }

  return {
    score: Math.round(Math.max(0, Math.min(100, score))),
    notes: notes.join('; '),
  }
}

const HIGH_VOLUME_THRESHOLD = Number(process.env.SEO_HIGH_VOLUME_THRESHOLD || 500) || 500

function isHighVolume(vol) {
  return Number.isFinite(Number(vol)) && Number(vol) >= HIGH_VOLUME_THRESHOLD
}

function tryParseJsonObject(text) {
  const raw = String(text || '').trim()
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const body = fenced ? fenced[1].trim() : raw
  const start = body.indexOf('{')
  if (start < 0) return null
  const slice = body.slice(start)
  try {
    return JSON.parse(slice)
  } catch {
    /* continue — try truncate repair */
  }
  // Repair truncated Claude JSON (often cut mid-array when max_tokens hits)
  let repaired = slice
  // Drop trailing incomplete string/property
  repaired = repaired.replace(/,\s*"[^"]*$/s, '')
  repaired = repaired.replace(/,\s*\{[^}]*$/s, '')
  repaired = repaired.replace(/,\s*$/s, '')
  const opens = (repaired.match(/\[/g) || []).length
  const closes = (repaired.match(/\]/g) || []).length
  const openB = (repaired.match(/\{/g) || []).length
  const closeB = (repaired.match(/\}/g) || []).length
  repaired += ']'.repeat(Math.max(0, opens - closes))
  repaired += '}'.repeat(Math.max(0, openB - closeB))
  try {
    return JSON.parse(repaired)
  } catch {
    return null
  }
}

function parseClaudeJson(text) {
  const parsed = tryParseJsonObject(text)
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Claude returned invalid JSON. Retry Analyze SEO.')
  }
  if (!Array.isArray(parsed.recommendations)) parsed.recommendations = []
  if (!Array.isArray(parsed.highSearchAddList)) parsed.highSearchAddList = []
  if (!parsed.seoSuggestions || typeof parsed.seoSuggestions !== 'object') {
    parsed.seoSuggestions = {}
  }
  return parsed
}

async function fetchDataForSeoMetrics(keywords, region) {
  const login = String(process.env.DATAFORSEO_LOGIN || '').trim()
  const password = String(process.env.DATAFORSEO_PASSWORD || '').trim()
  if (!login || !password || !keywords.length) {
    return { map: new Map(), used: false, note: 'DataForSEO not configured' }
  }

  const locationCode = Number(process.env.DATAFORSEO_LOCATION_CODE || 2840) // US default
  const languageCode = String(region?.language || 'en').slice(0, 10)

  try {
    const auth = Buffer.from(`${login}:${password}`).toString('base64')
    const payload = [
      {
        keywords: keywords.slice(0, 40).map((k) => String(k).slice(0, 80)),
        location_code: locationCode,
        language_code: languageCode,
      },
    ]
    const res = await axios.post(
      'https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live',
      payload,
      {
        timeout: 45000,
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    )
    const map = new Map()
    const tasks = res.data?.tasks || []
    for (const task of tasks) {
      for (const row of task?.result || []) {
        const key = String(row.keyword || '')
          .toLowerCase()
          .trim()
        if (!key) continue
        map.set(key, {
          searchVolume: Number.isFinite(Number(row.search_volume)) ? Number(row.search_volume) : null,
          competition: Number.isFinite(Number(row.competition_index))
            ? Number(row.competition_index)
            : null,
        })
      }
    }
    return {
      map,
      used: true,
      note: `DataForSEO Google Ads search volume (location_code=${locationCode}, language=${languageCode})`,
    }
  } catch (e) {
    console.warn('[keywordResearch] DataForSEO:', e.message)
    return { map: new Map(), used: false, note: `DataForSEO error: ${e.message}` }
  }
}

function rankTargetKeywords(recs) {
  const ordered = [...recs].sort((a, b) => {
    const ah = a.highSearchCandidate ? 1 : 0
    const bh = b.highSearchCandidate ? 1 : 0
    if (bh !== ah) return bh - ah
    return String(b.priority || '').localeCompare(String(a.priority || ''))
  })
  const out = []
  const seen = new Set()
  for (const rec of ordered) {
    const kw = String(rec.proposedKeyword || rec.currentKeyword || '').trim()
    const key = kw.toLowerCase()
    if (!kw || seen.has(key)) continue
    seen.add(key)
    out.push(kw)
    if (out.length >= 8) break
  }
  return out
}

/** Live Google organic position for this site. Never invents a rank. */
async function fetchGoogleOrganicRanks(keywords, region) {
  const login = String(process.env.DATAFORSEO_LOGIN || '').trim()
  const password = String(process.env.DATAFORSEO_PASSWORD || '').trim()
  const domain = siteDomain()
  const list = [...new Set((keywords || []).map((k) => String(k || '').trim()).filter(Boolean))].slice(0, 8)
  if (!list.length) return { map: new Map(), used: false, note: '' }
  if (!login || !password) {
    return {
      map: new Map(),
      used: false,
      note: 'Google rank not checked — set DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD',
    }
  }

  const locationCode = Number(process.env.DATAFORSEO_LOCATION_CODE || 2840)
  const languageCode = String(region?.language || 'en').slice(0, 10)

  try {
    const auth = Buffer.from(`${login}:${password}`).toString('base64')
    const payload = list.map((keyword) => ({
      keyword: keyword.slice(0, 80),
      location_code: locationCode,
      language_code: languageCode,
      device: 'desktop',
      os: 'windows',
      depth: 10,
    }))
    const res = await axios.post(
      'https://api.dataforseo.com/v3/serp/google/organic/live/regular',
      payload,
      {
        timeout: 70000,
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    )
    const map = new Map()
    const tasks = res.data?.tasks || []
    tasks.forEach((task, index) => {
      const keyword = String(task?.data?.keyword || list[index] || '')
        .toLowerCase()
        .trim()
      if (!keyword) return
      const items = task?.result?.[0]?.items || []
      let rank = null
      for (const item of items) {
        if (item?.type && item.type !== 'organic') continue
        let host = String(item.domain || '')
        if (!host && item.url) {
          try {
            host = new URL(item.url).hostname
          } catch {
            host = ''
          }
        }
        if (!hostMatchesSite(host, domain)) continue
        const n = Number(item.rank_group || item.rank_absolute)
        if (Number.isFinite(n) && n > 0) {
          rank = n
          break
        }
      }
      map.set(keyword, {
        rank,
        source:
          rank != null
            ? `Google organic live · ${domain}`
            : `Google organic live: not in top 10 · ${domain}`,
      })
    })
    return {
      map,
      used: map.size > 0,
      note: `Google rank checked automatically for ${map.size} keyword(s) (${domain}, top 10)`,
    }
  } catch (e) {
    console.warn('[keywordResearch] Google rank:', e.message)
    return { map: new Map(), used: false, note: `Google rank check failed: ${e.message}` }
  }
}

async function runClaudeAnalysis({ apiKey, pageMeta, plainText, region, existingKeywords }) {
  const anthropic = getAnthropic(apiKey)
  const locationLabel = [
    region.city,
    region.region,
    region.country,
  ]
    .filter(Boolean)
    .join(', ')

  const system = `You are Compare Bazaar's SEO keyword research analyst (B2B software buying guides).
Return ONLY valid JSON (no markdown) matching the schema described by the user.
Never invent numeric search volume, keyword difficulty, impressions, clicks, CTR, or rankings.
If you lack verified metrics, set those fields to null and metricKind to "unavailable".
Protect valuable existing keywords: never recommend REMOVE solely because volume is low or unknown.
Actions must be one of: KEEP, ADD, REPLACE, REMOVE, INVESTIGATE.

HIGH-SEARCH HUNT (required):
- Actively find keywords buyers actually search for in this niche (commercial + transactional + strong informational).
- Prefer phrases like "best …", "… software", "… for small business", "… pricing", "… vs …", "… alternatives".
- If a strong-demand phrase is missing from the page, use action ADD, priority high, highSearchCandidate true, demandTier "high".
- Explain in reasoning WHY demand is likely high (buyer intent, comparison shopping, seasonal/category demand) — without inventing a volume number.
- Include at least 5 ADD recommendations that are highSearchCandidate true when the page has clear topical gaps.
- Do NOT mark every keyword highSearchCandidate — only the strongest demand opportunities.

Target market: ${locationLabel || 'US'} | language: ${region.language || 'en'} | engine: ${region.searchEngine || 'google'}.
Audience: ${region.audience || 'B2B software buyers'}.`

  const user = `Analyze this page and produce keyword recommendations. Hunt for high-search opportunities the page should ADD.

Page URL: ${pageMeta.url}
Page title: ${pageMeta.title}
Meta description: ${pageMeta.metaDescription}
H1: ${pageMeta.h1}
Known existing keywords: ${JSON.stringify(existingKeywords)}

Page content (plain text excerpt):
${plainText.slice(0, 5500)}

JSON schema:
{
  "existingKeywords": ["string"],
  "highSearchAddList": [
    {
      "keyword": "string — high-demand phrase to ADD",
      "whyHighDemand": "string — why searchers look for this",
      "suggestedPlacement": "title|H1|headings|body|internal links",
      "searchIntent": "informational|commercial|transactional|navigational"
    }
  ],
  "recommendations": [
    {
      "action": "KEEP|ADD|REPLACE|REMOVE|INVESTIGATE",
      "currentKeyword": "string",
      "proposedKeyword": "string",
      "searchIntent": "informational|commercial|transactional|navigational",
      "searchVolume": null,
      "keywordDifficulty": null,
      "relevance": 0-100,
      "priority": "high|medium|low",
      "highSearchCandidate": true,
      "demandTier": "high|medium|low",
      "reasoning": "string",
      "suggestedPlacement": "title|H1|headings|body|internal links",
      "metricKind": "unavailable"
    }
  ],
  "seoSuggestions": {
    "title": { "current": "", "proposed": "" },
    "metaDescription": { "current": "", "proposed": "" },
    "h1": { "current": "", "proposed": "" },
    "headingStructure": "",
    "keywordPlacement": "",
    "missingSubtopics": ["string"],
    "internalLinks": ["string"],
    "contentQuality": "",
    "structuredData": ""
  }
}

Rules:
1) highSearchAddList: exactly 5 high-demand ADD keywords missing from the page.
2) Mirror each in recommendations with highSearchCandidate true and priority high.
3) Total recommendations max 10 including those ADDs.
4) Fill seoSuggestions title/meta/h1 before-after briefly.
5) reasoning max 1 short sentence. Return compact valid JSON only — no markdown.`

  async function callOnce(prompt) {
    const response = await anthropic.messages.create({
      model: getAnthropicModel(),
      max_tokens: 4000,
      temperature: 0.2,
      system,
      messages: [{ role: 'user', content: prompt }],
    })
    return (
      response.content?.find((b) => b.type === 'text')?.text ||
      response.content?.[0]?.text ||
      ''
    )
  }

  try {
    return parseClaudeJson(await callOnce(user))
  } catch (firstErr) {
    console.warn('[keywordResearch] Claude JSON parse retry:', firstErr.message)
    const retryPrompt = `${user}

IMPORTANT RETRY: Your previous JSON was invalid/truncated. Reply with ONE compact minified JSON object only.
Max 5 highSearchAddList items and max 8 recommendations. Short strings. Valid JSON.`
    return parseClaudeJson(await callOnce(retryPrompt))
  }
}

async function analyzePage({ pageId, pageUrl, region, apiKey, analyzedBy, force = false }) {
  let pageDoc = null
  if (pageId) {
    pageDoc = await SeoKeywordPage.findById(pageId)
  }
  if (!pageDoc && pageUrl) {
    const parsed = assertAllowedUrl(pageUrl)
    const path = normalizePath(parsed.pathname)
    pageDoc = await SeoKeywordPage.findOne({ path })
    if (!pageDoc) {
      pageDoc = await addManualPage(pageUrl)
    }
  }
  if (!pageDoc) throw new Error('Page not found')

  // Clear jobs stuck after crash/timeout so Analyze can run again
  await failStaleAnalyses(pageDoc._id)

  if (force) {
    await SeoKeywordAnalysis.updateMany(
      { pageId: pageDoc._id, status: { $in: ['queued', 'processing'] } },
      {
        $set: {
          status: 'failed',
          error: 'Superseded by a new analysis run.',
        },
      }
    )
  } else {
    // Prevent duplicate in-flight jobs for same page (only fresh ones)
    const existing = await SeoKeywordAnalysis.findOne({
      pageId: pageDoc._id,
      status: { $in: ['queued', 'processing'] },
    }).sort({ createdAt: -1 })
    if (existing) {
      const age = Date.now() - new Date(existing.updatedAt || existing.createdAt).getTime()
      if (age < STALE_PROCESSING_MS) {
        return existing
      }
      existing.status = 'failed'
      existing.error = 'Timed out or interrupted while processing. Click Analyze SEO again.'
      await existing.save()
    }
  }

  const analysis = await SeoKeywordAnalysis.create({
    pageId: pageDoc._id,
    pageUrl: pageDoc.url,
    pagePath: pageDoc.path,
    pageTitle: pageDoc.title,
    pageType: pageDoc.pageType,
    region: {
      country: region?.country || 'US',
      region: region?.region || '',
      city: region?.city || '',
      language: region?.language || 'en',
      searchEngine: region?.searchEngine || 'google',
      audience: region?.audience || '',
    },
    status: 'processing',
    analyzedBy: analyzedBy || '',
  })

  await SeoKeywordPage.updateOne(
    { _id: pageDoc._id },
    { $set: { analysisStatus: 'processing', lastAnalysisId: analysis._id } }
  )

  // Run crawl + Claude in background so the HTTP request returns immediately
  const jobId = analysis._id
  setImmediate(() => {
    runAnalysisJob(jobId, apiKey).catch((err) => {
      console.error('[keywordResearch] background job:', err?.message || err)
    })
  })

  return analysis
}

async function runAnalysisJob(analysisId, apiKey) {
  const analysis = await SeoKeywordAnalysis.findById(analysisId)
  if (!analysis) return null
  const pageDoc = analysis.pageId ? await SeoKeywordPage.findById(analysis.pageId) : null
  if (!pageDoc) {
    analysis.status = 'failed'
    analysis.error = 'Page record missing'
    await analysis.save()
    return analysis
  }

  try {
    const html = await fetchPageHtml(pageDoc.url)
    const meta = extractMeta(html)
    const plain = htmlToPlain(html)
    if (!plain || plain.length < 80) {
      throw new Error(
        'Could not read enough page text to analyze (empty or blocked HTML). Try another page or check the live URL.'
      )
    }
    if (meta.title) {
      pageDoc.title = meta.title
      await pageDoc.save()
    }

    // Prefer CMS blog keywords when available
    let existingKeywords = []
    if (pageDoc.pageType === 'blog' && pageDoc.path.startsWith('/blog/')) {
      const slug = pageDoc.path.replace(/^\/blog\//, '')
      const blog = await Blog.findOne({ slug }).select('keywords').lean()
      if (blog?.keywords?.length) existingKeywords = blog.keywords.map(String)
    }
    if (meta.keywordsMeta) {
      existingKeywords = [
        ...new Set([
          ...existingKeywords,
          ...meta.keywordsMeta.split(',').map((k) => k.trim()).filter(Boolean),
        ]),
      ]
    }

    const dataNotes = []
    const claude = await runClaudeAnalysis({
      apiKey,
      pageMeta: {
        url: pageDoc.url,
        title: meta.title || pageDoc.title,
        metaDescription: meta.metaDescription,
        h1: meta.h1,
      },
      plainText: plain,
      region: analysis.region,
      existingKeywords,
    })

    const mergedExisting = [
      ...new Set([...(claude.existingKeywords || []), ...existingKeywords].map(String).filter(Boolean)),
    ].slice(0, 40)

    let recs = Array.isArray(claude.recommendations) ? claude.recommendations : []

    // Merge highSearchAddList → ADD recommendations (so high-demand keywords always surface)
    const highList = Array.isArray(claude.highSearchAddList) ? claude.highSearchAddList : []
    const existingProposed = new Set(
      recs.map((r) => String(r.proposedKeyword || r.currentKeyword || '').toLowerCase().trim()).filter(Boolean)
    )
    for (const item of highList) {
      const kw = String(item.keyword || '').trim()
      if (!kw) continue
      const key = kw.toLowerCase()
      if (existingProposed.has(key)) {
        recs = recs.map((r) => {
          const p = String(r.proposedKeyword || r.currentKeyword || '').toLowerCase().trim()
          if (p !== key) return r
          return {
            ...r,
            action: r.action === 'KEEP' ? 'KEEP' : 'ADD',
            highSearchCandidate: true,
            demandTier: 'high',
            priority: 'high',
            reasoning:
              r.reasoning ||
              item.whyHighDemand ||
              'High-demand keyword opportunity for this page topic.',
            suggestedPlacement: r.suggestedPlacement || item.suggestedPlacement || 'H1',
            searchIntent: r.searchIntent || item.searchIntent || 'commercial',
          }
        })
        continue
      }
      existingProposed.add(key)
      recs.unshift({
        action: 'ADD',
        currentKeyword: '',
        proposedKeyword: kw,
        searchIntent: item.searchIntent || 'commercial',
        searchVolume: null,
        keywordDifficulty: null,
        relevance: 88,
        priority: 'high',
        highSearchCandidate: true,
        demandTier: 'high',
        reasoning: item.whyHighDemand || 'High-demand keyword buyers search for in this niche.',
        suggestedPlacement: item.suggestedPlacement || 'title',
        metricKind: 'unavailable',
      })
    }

    const keywordSeeds = [
      ...recs.flatMap((r) => [r.proposedKeyword, r.currentKeyword]),
      ...highList.map((i) => i.keyword),
    ]
      .map((k) => String(k || '').trim())
      .filter(Boolean)

    const dfs = await fetchDataForSeoMetrics(keywordSeeds, analysis.region)
    if (dfs.used) dataNotes.push(dfs.note)
    else if (dfs.note) dataNotes.push(dfs.note)

    const ranks = await fetchGoogleOrganicRanks(rankTargetKeywords(recs), analysis.region)
    if (ranks.note) dataNotes.push(ranks.note)

    const scoringNotes = []
    recs = recs.slice(0, 35).map((r) => {
      const proposed = String(r.proposedKeyword || r.currentKeyword || '').trim()
      const key = proposed.toLowerCase()
      const metrics = dfs.map.get(key)
      const rankHit = ranks.map.get(key)
      const currentRanking = rankHit && Number.isFinite(Number(rankHit.rank)) ? Number(rankHit.rank) : null
      let searchVolume = null
      let searchVolumeSource = ''
      let keywordDifficulty = null
      let keywordDifficultySource = ''
      let metricKind = 'unavailable'

      if (metrics && metrics.searchVolume != null) {
        searchVolume = metrics.searchVolume
        searchVolumeSource = 'DataForSEO Google Ads search_volume'
        metricKind = 'verified'
      }
      if (metrics && metrics.competition != null) {
        keywordDifficulty = metrics.competition
        keywordDifficultySource = 'DataForSEO competition_index (proxy, not KD)'
        if (metricKind === 'unavailable') metricKind = 'verified'
      }

      let highSearchCandidate = Boolean(r.highSearchCandidate)
      let demandTier = ['high', 'medium', 'low'].includes(r.demandTier) ? r.demandTier : ''
      let action = ACTIONS_SAFE(r.action)
      let priority = ['high', 'medium', 'low'].includes(r.priority) ? r.priority : 'medium'

      // Verified high volume → force ADD suggestion when not already on page as KEEP-only term
      if (isHighVolume(searchVolume)) {
        highSearchCandidate = true
        demandTier = 'high'
        priority = 'high'
        if (action !== 'KEEP' && action !== 'REMOVE') action = 'ADD'
      }

      // Never accept Claude-invented volumes
      const scored = computeOpportunityScore({
        ...r,
        action,
        searchVolume,
        keywordDifficulty,
        relevance: r.relevance,
        currentRanking,
        highSearchCandidate,
        demandTier,
      })
      scoringNotes.push(`${proposed}: ${scored.notes}`)

      return {
        action,
        currentKeyword: String(r.currentKeyword || '').trim(),
        proposedKeyword: proposed,
        searchIntent: String(r.searchIntent || '').trim(),
        searchVolume,
        searchVolumeSource,
        keywordDifficulty,
        keywordDifficultySource,
        currentRanking,
        impressions: null,
        clicks: null,
        ctr: null,
        gscSource: rankHit?.source || '',
        relevance: Number.isFinite(Number(r.relevance)) ? Number(r.relevance) : null,
        opportunityScore: scored.score,
        priority,
        highSearchCandidate,
        demandTier,
        reasoning: String(r.reasoning || '').trim().slice(0, 1200),
        suggestedPlacement: String(r.suggestedPlacement || '').trim().slice(0, 200),
        approvalStatus: 'pending',
        metricKind,
        source: 'ai',
      }
    })

    // High-search ADDs first in the saved list
    recs.sort((a, b) => {
      const ah = a.highSearchCandidate && a.action === 'ADD' ? 1 : 0
      const bh = b.highSearchCandidate && b.action === 'ADD' ? 1 : 0
      if (bh !== ah) return bh - ah
      return (b.opportunityScore || 0) - (a.opportunityScore || 0)
    })

    const sug = claude.seoSuggestions || {}
    analysis.existingKeywords = mergedExisting
    analysis.recommendations = recs
    analysis.seoSuggestions = {
      title: {
        current: sug.title?.current || meta.title || '',
        proposed: sug.title?.proposed || '',
      },
      metaDescription: {
        current: sug.metaDescription?.current || meta.metaDescription || '',
        proposed: sug.metaDescription?.proposed || '',
      },
      h1: {
        current: sug.h1?.current || meta.h1 || '',
        proposed: sug.h1?.proposed || '',
      },
      headingStructure: String(sug.headingStructure || ''),
      keywordPlacement: String(sug.keywordPlacement || ''),
      missingSubtopics: Array.isArray(sug.missingSubtopics)
        ? sug.missingSubtopics.map(String).slice(0, 20)
        : [],
      internalLinks: Array.isArray(sug.internalLinks)
        ? sug.internalLinks.map(String).slice(0, 20)
        : [],
      contentQuality: String(sug.contentQuality || ''),
      structuredData: String(sug.structuredData || ''),
    }
    analysis.contentSnapshot = plain.slice(0, 4000)
    analysis.dataSources = {
      claude: true,
      dataForSeo: dfs.used,
      googleAds: false,
      gsc: Boolean(ranks.used),
      notes: dataNotes.filter(Boolean),
    }
    analysis.scoringNotes = [
      'Score = base 40 + relevance(0–30) + log volume(0–20) + (100−KD)*0.15 + SERP opportunity.',
      'Missing metrics are not invented. KEEP without volume gets floor 55.',
      ...scoringNotes.slice(0, 15),
    ].join('\n')
    analysis.status = 'done'
    analysis.completedAt = new Date()
    analysis.pageTitle = meta.title || pageDoc.title || analysis.pageTitle
    analysis.error = ''
    await analysis.save()

    await SeoKeywordPage.updateOne(
      { _id: pageDoc._id },
      {
        $set: {
          analysisStatus: 'done',
          lastAnalyzedAt: new Date(),
          lastAnalysisId: analysis._id,
          title: meta.title || pageDoc.title,
        },
      }
    )

    return analysis
  } catch (err) {
    analysis.status = 'failed'
    analysis.error = String(err.message || err).slice(0, 1000)
    await analysis.save()
    await SeoKeywordPage.updateOne(
      { _id: pageDoc._id },
      { $set: { analysisStatus: 'failed', lastAnalysisId: analysis._id } }
    )
    console.error('[keywordResearch] runAnalysisJob failed:', err?.message || err)
    return analysis
  }
}

function ACTIONS_SAFE(a) {
  const v = String(a || '').toUpperCase()
  return ['KEEP', 'ADD', 'REPLACE', 'REMOVE', 'INVESTIGATE'].includes(v) ? v : 'INVESTIGATE'
}

async function analyzeBulk({ pageIds, region, apiKey, analyzedBy, force = false }) {
  const ids = [...new Set((pageIds || []).map(String))].slice(0, BULK_MAX)
  if (!ids.length) throw new Error('Select at least one page')
  const results = []
  for (const id of ids) {
    try {
      const analysis = await analyzePage({
        pageId: id,
        region,
        apiKey,
        analyzedBy,
        force,
      })
      results.push({ pageId: id, success: true, analysisId: analysis._id, status: analysis.status })
    } catch (e) {
      results.push({ pageId: id, success: false, error: e.message })
    }
  }
  return { results, limit: BULK_MAX }
}

async function listAnalyses({ page = 1, limit = 20, pageId } = {}) {
  const filter = {}
  if (pageId) filter.pageId = pageId
  const skip = (Math.max(1, page) - 1) * limit
  const [rows, total] = await Promise.all([
    SeoKeywordAnalysis.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    SeoKeywordAnalysis.countDocuments(filter),
  ])
  return {
    data: rows,
    pagination: {
      page: Math.max(1, page),
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
  }
}

async function updateRecommendationApproval(analysisId, recommendationId, approvalStatus) {
  if (!['pending', 'approved', 'rejected'].includes(approvalStatus)) {
    throw new Error('Invalid approval status')
  }
  const doc = await SeoKeywordAnalysis.findById(analysisId)
  if (!doc) throw new Error('Analysis not found')
  const rec = doc.recommendations.id(recommendationId)
  if (!rec) throw new Error('Recommendation not found')
  rec.approvalStatus = approvalStatus
  await doc.save()
  return doc.toObject()
}

/**
 * Classify demand: high | medium | low
 * Verified volume wins; else AI flags / score / priority.
 */
function classifySearchDemand(rec) {
  // Number(null) === 0 — missing volume must not count as low
  const hasVol = rec.searchVolume != null && rec.searchVolume !== ''
  if (hasVol) {
    const vol = Number(rec.searchVolume)
    if (Number.isFinite(vol)) {
      if (vol >= HIGH_VOLUME_THRESHOLD) return 'high'
      if (vol >= 100) return 'medium'
      return 'low'
    }
  }
  if (rec.highSearchCandidate === true || rec.demandTier === 'high') return 'high'
  if (rec.demandTier === 'low') return 'low'
  if (rec.demandTier === 'medium') return 'medium'
  if (
    (rec.action === 'ADD' || rec.action === 'REPLACE') &&
    (rec.priority === 'high' || (Number(rec.opportunityScore) || 0) >= 60)
  ) {
    return 'high'
  }
  if (rec.priority === 'high' && (Number(rec.opportunityScore) || 0) >= 65) return 'high'
  if (rec.priority === 'low' || (Number(rec.opportunityScore) || 0) < 40) return 'low'
  return 'medium'
}

function buildKeywordStats(analysis) {
  const recs = analysis?.recommendations || []
  const byDemand = { high: [], medium: [], low: [] }
  for (const r of recs) {
    const tier = classifySearchDemand(r)
    byDemand[tier].push(r)
  }
  const manual = recs.filter((r) => r.source === 'manual')
  const approvedAdds = recs.filter(
    (r) => (r.action === 'ADD' || r.action === 'REPLACE') && r.approvalStatus === 'approved'
  )
  const addCandidates = recs.filter((r) => r.action === 'ADD' || r.action === 'REPLACE')
  return {
    totalKeywords: recs.length,
    totalExisting: (analysis?.existingKeywords || []).length,
    totalManual: manual.length,
    totalApprovedAdds: approvedAdds.length,
    totalAddCandidates: addCandidates.length,
    highSearch: byDemand.high.length,
    mediumSearch: byDemand.medium.length,
    lowSearch: byDemand.low.length,
    highSearchKeywords: byDemand.high.map((r) => ({
      id: r._id,
      keyword: r.proposedKeyword || r.currentKeyword,
      action: r.action,
      searchVolume: r.searchVolume,
      source: r.source || 'ai',
      approvalStatus: r.approvalStatus,
    })),
    lowSearchKeywords: byDemand.low.map((r) => ({
      id: r._id,
      keyword: r.proposedKeyword || r.currentKeyword,
      action: r.action,
      searchVolume: r.searchVolume,
      source: r.source || 'ai',
      approvalStatus: r.approvalStatus,
    })),
    mediumSearchKeywords: byDemand.medium.map((r) => ({
      id: r._id,
      keyword: r.proposedKeyword || r.currentKeyword,
      action: r.action,
      searchVolume: r.searchVolume,
      source: r.source || 'ai',
      approvalStatus: r.approvalStatus,
    })),
  }
}

async function getAnalysis(id) {
  const doc = await SeoKeywordAnalysis.findById(id).lean()
  if (!doc) throw new Error('Analysis not found')
  return { ...doc, keywordStats: buildKeywordStats(doc) }
}

/**
 * Manually add keywords to an analysis (against the page).
 * Body: { keywords: string[] | string } — comma/newline separated OK.
 */
async function addManualKeywords(analysisId, rawKeywords, region) {
  const doc = await SeoKeywordAnalysis.findById(analysisId)
  if (!doc) throw new Error('Analysis not found')
  if (doc.status === 'processing' || doc.status === 'queued') {
    throw new Error('Wait for the current analysis to finish before adding keywords')
  }

  let list = []
  if (Array.isArray(rawKeywords)) {
    list = rawKeywords.map(String)
  } else {
    list = String(rawKeywords || '')
      .split(/[\n,;]+/)
      .map((s) => s.trim())
  }
  list = [...new Set(list.map((k) => k.trim()).filter((k) => k.length >= 2))].slice(0, 25)
  if (!list.length) throw new Error('Enter at least one keyword')

  const existingKeys = new Set(
    doc.recommendations
      .map((r) => String(r.proposedKeyword || r.currentKeyword || '').toLowerCase().trim())
      .filter(Boolean)
  )

  const toAdd = list.filter((k) => !existingKeys.has(k.toLowerCase()))
  if (!toAdd.length) throw new Error('Those keywords are already on this analysis')

  const dfs = await fetchDataForSeoMetrics(toAdd, region || doc.region || {})
  for (const kw of toAdd) {
    const metrics = dfs.map.get(kw.toLowerCase())
    let searchVolume = null
    let searchVolumeSource = ''
    let keywordDifficulty = null
    let keywordDifficultySource = ''
    let metricKind = 'unavailable'
    if (metrics?.searchVolume != null) {
      searchVolume = metrics.searchVolume
      searchVolumeSource = 'DataForSEO Google Ads search_volume'
      metricKind = 'verified'
    }
    if (metrics?.competition != null) {
      keywordDifficulty = metrics.competition
      keywordDifficultySource = 'DataForSEO competition_index'
    }

    const highSearchCandidate = isHighVolume(searchVolume)
    let demandTier = ''
    if (Number.isFinite(Number(searchVolume))) {
      demandTier = classifySearchDemand({ searchVolume, highSearchCandidate }) 
    } else {
      // Without volume: mark medium until verified; user can still see "manual"
      demandTier = 'medium'
    }

    const scored = computeOpportunityScore({
      action: 'ADD',
      searchVolume,
      keywordDifficulty,
      relevance: 70,
      highSearchCandidate,
      demandTier,
    })

    doc.recommendations.unshift({
      action: 'ADD',
      currentKeyword: '',
      proposedKeyword: kw,
      searchIntent: 'commercial',
      searchVolume,
      searchVolumeSource,
      keywordDifficulty,
      keywordDifficultySource,
      relevance: 70,
      opportunityScore: scored.score,
      priority: highSearchCandidate ? 'high' : demandTier === 'low' ? 'low' : 'medium',
      highSearchCandidate,
      demandTier: demandTier || (highSearchCandidate ? 'high' : 'medium'),
      reasoning: highSearchCandidate
        ? 'Manually added — verified high search volume.'
        : Number.isFinite(Number(searchVolume))
          ? `Manually added — search volume ${searchVolume}.`
          : 'Manually added by editor. Volume unavailable until a keyword provider is connected.',
      suggestedPlacement: 'title',
      approvalStatus: 'approved',
      metricKind,
      source: 'manual',
    })

    if (!doc.existingKeywords.includes(kw)) {
      doc.existingKeywords.push(kw)
    }
  }

  if (doc.status === 'failed' || !doc.status) {
    doc.status = 'done'
    doc.error = ''
    doc.completedAt = doc.completedAt || new Date()
  }

  await doc.save()
  const lean = doc.toObject()
  return { ...lean, keywordStats: buildKeywordStats(lean), added: toAdd }
}

async function removeRecommendation(analysisId, recommendationId) {
  const doc = await SeoKeywordAnalysis.findById(analysisId)
  if (!doc) throw new Error('Analysis not found')
  const rec = doc.recommendations.id(recommendationId)
  if (!rec) throw new Error('Recommendation not found')
  const kw = String(rec.proposedKeyword || '').trim()
  rec.deleteOne()
  if (kw) {
    doc.existingKeywords = (doc.existingKeywords || []).filter(
      (k) => String(k).toLowerCase() !== kw.toLowerCase()
    )
  }
  await doc.save()
  const lean = doc.toObject()
  return { ...lean, keywordStats: buildKeywordStats(lean) }
}

function exportAnalysisCsv(analysis) {
  const headers = [
    'action',
    'current_keyword',
    'proposed_keyword',
    'search_intent',
    'search_volume',
    'search_volume_source',
    'keyword_difficulty',
    'keyword_difficulty_source',
    'opportunity_score',
    'priority',
    'relevance',
    'metric_kind',
    'suggested_placement',
    'approval_status',
    'reasoning',
  ]
  const escape = (v) => {
    const s = v == null ? '' : String(v)
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
    return s
  }
  const lines = [headers.join(',')]
  for (const r of analysis.recommendations || []) {
    lines.push(
      [
        r.action,
        r.currentKeyword,
        r.proposedKeyword,
        r.searchIntent,
        r.searchVolume,
        r.searchVolumeSource,
        r.keywordDifficulty,
        r.keywordDifficultySource,
        r.opportunityScore,
        r.priority,
        r.relevance,
        r.metricKind,
        r.suggestedPlacement,
        r.approvalStatus,
        r.reasoning,
      ]
        .map(escape)
        .join(',')
    )
  }
  return lines.join('\n')
}

/**
 * Add manual keywords for a page — uses latest analysis or creates a lightweight one.
 */
async function addManualKeywordsForPage(pageId, rawKeywords, region) {
  const pageDoc = await SeoKeywordPage.findById(pageId)
  if (!pageDoc) throw new Error('Page not found')

  let analysis = await SeoKeywordAnalysis.findOne({
    pageId: pageDoc._id,
    status: { $in: ['done', 'failed'] },
  }).sort({ createdAt: -1 })

  if (!analysis) {
    analysis = await SeoKeywordAnalysis.create({
      pageId: pageDoc._id,
      pageUrl: pageDoc.url,
      pagePath: pageDoc.path,
      pageTitle: pageDoc.title,
      pageType: pageDoc.pageType,
      region: {
        country: region?.country || 'US',
        region: region?.region || '',
        city: region?.city || '',
        language: region?.language || 'en',
        searchEngine: region?.searchEngine || 'google',
        audience: region?.audience || '',
      },
      status: 'done',
      existingKeywords: [],
      recommendations: [],
      completedAt: new Date(),
      dataSources: { claude: false, dataForSeo: false, googleAds: false, gsc: false, notes: ['Manual keywords only'] },
    })
  }

  return addManualKeywords(analysis._id, rawKeywords, region || analysis.region)
}

module.exports = {
  integrationStatus,
  discoverAndUpsertPages,
  listPages,
  addManualPage,
  analyzePage,
  analyzeBulk,
  listAnalyses,
  getAnalysis,
  updateRecommendationApproval,
  exportAnalysisCsv,
  addManualKeywords,
  addManualKeywordsForPage,
  removeRecommendation,
  classifySearchDemand,
  buildKeywordStats,
  computeOpportunityScore,
  BULK_MAX,
  siteBaseUrl,
}
