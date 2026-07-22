/**
 * Fetch a topic-relevant cover image from Unsplash Search API.
 * Requires UNSPLASH_ACCESS_KEY in backend/.env (free tier ~50 req/hr).
 */

const GENERIC_FALLBACK = 'modern business technology workspace'

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'for', 'to', 'of', 'in', 'on', 'at', 'is', 'are', 'was', 'were',
  'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'how', 'what', 'why', 'when', 'who',
  'which', 'where', 'your', 'our', 'their', 'its', 'my', 'his', 'her', 'them', 'they', 'we', 'you',
  'it', 'this', 'that', 'these', 'those', 'best', 'top', 'guide', 'guides', 'tips', 'review',
  'reviews', 'ultimate', 'complete', 'software', 'systems', 'system', 'solution', 'solutions',
  'tool', 'tools', 'platform', 'platforms', 'vs', 'versus', 'year', 'years', 'new', 'get', 'make',
  'just', 'into', 'from', 'with', 'without', 'about', 'more', 'most', 'some', 'any', 'each',
  'every', 'all', 'than', 'then', 'also', 'only', 'such', 'same', 'using', 'use', 'used', 'based',
  'free', 'paid', 'hubspot', 'salesforce', 'gusto', 'adp', 'paychex', 'quickbooks', 'which',
  'right', 'business', 'companies', 'company',
])

/** Vertical → stock-photo-friendly Unsplash queries (brand names in titles often return 0 results). */
const VERTICAL_QUERIES = [
  { re: /\bcrm\b|customer relationship|sales pipeline|sales force/i, query: 'CRM software sales team office' },
  { re: /\bpayroll\b|pay stub|paycheck|w-?2\b|hris\b|human resources\b|\bhr\b/i, query: 'payroll accounting finance office' },
  { re: /\bfleet\b|gps|telematics|vehicle tracking|trucking|dispatch/i, query: 'fleet management GPS logistics trucks' },
  { re: /\bvoip\b|business phone|ucaas|contact center|call center/i, query: 'business phone call center headset' },
  { re: /\bmarketing automation\b|email marketing|digital marketing|seo\b/i, query: 'digital marketing analytics laptop' },
  { re: /\baccounting\b|bookkeeping|invoice|accounts payable|\berp\b/i, query: 'accounting finance spreadsheet desk' },
  { re: /\bproject management\b|task management|agile\b|kanban\b/i, query: 'project management team whiteboard' },
  { re: /\bcybersecurity\b|endpoint security|\bsiem\b|data breach|ransomware/i, query: 'cybersecurity network server technology' },
  { re: /\bai agents?\b|machine learning|generative ai|chatbot/i, query: 'artificial intelligence technology workspace' },
  { re: /\be-?commerce\b|online store|shopping cart|retail software|\bpos\b/i, query: 'ecommerce online shopping retail' },
  { re: /\binventory\b|warehouse|supply chain|\bwms\b/i, query: 'warehouse inventory logistics boxes' },
  { re: /\bremote work\b|video conferenc|team chat|collaboration/i, query: 'remote team video conference laptop' },
  { re: /\blms\b|learning management|e-learning|training software/i, query: 'online learning education laptop' },
]

function normalizeCoverBase(url) {
  if (!url || typeof url !== 'string') return ''
  return url.split('?')[0].trim()
}

function toCoverUrl(raw) {
  const base = normalizeCoverBase(raw)
  if (!base) return null
  return `${base}?auto=format&fit=crop&w=1200&q=80`
}

function extractTopicPhrase(topic, title) {
  const source = String(topic || title || '').trim()
  if (!source) return ''

  const words = source
    .toLowerCase()
    .replace(/\bvs\.?\b/gi, ' ')
    .replace(/\bin 20\d{2}\b/gi, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w))

  return words.slice(0, 5).join(' ')
}

function detectVerticalQuery(corpus) {
  for (const { re, query } of VERTICAL_QUERIES) {
    if (re.test(corpus)) return query
  }
  return null
}

/**
 * Build Unsplash queries ordered by topic relevance (most specific first).
 * @param {object} opts
 * @param {boolean} [opts.topicOnly] — omit generic fallback (regenerate must stay on-topic)
 */
function buildSearchQueries({ topic, title, tags = [], keywords = [] }, opts = {}) {
  const { topicOnly = false } = opts
  const queries = []
  const corpus = [topic, title, ...(tags || []), ...(keywords || [])].join(' ')

  const vertical = detectVerticalQuery(corpus)
  if (vertical) queries.push(vertical)

  const topicPhrase = extractTopicPhrase(topic, title)
  if (topicPhrase.length >= 3) {
    queries.push(`${topicPhrase} professional workspace`)
    queries.push(`${topicPhrase} technology office`)
  }

  for (const raw of [...(tags || []), ...(keywords || [])]) {
    const s = String(raw).trim()
    if (s.length < 3 || /\bvs\.?\b/i.test(s)) continue
    const words = s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w))
      .slice(0, 4)
      .join(' ')
    if (words.length >= 3) queries.push(`${words} professional office`)
  }

  const t = String(topic || '').trim()
  if (t.length >= 3 && !/\bvs\.?\b/i.test(t)) {
    queries.push(`${t} business technology`)
  }

  if (!topicOnly) {
    queries.push(GENERIC_FALLBACK)
  }

  return [...new Set(queries)].filter(Boolean)
}

/** @deprecated use buildSearchQueries */
function buildSearchQuery(input) {
  return buildSearchQueries(input)[0]
}

async function fetchUnsplashCover(query, accessKey, opts = {}) {
  const {
    excludeUrls = [],
    randomPick = false,
    startPage = 1,
    maxPages = 3,
  } = opts

  const excluded = new Set(excludeUrls.map(normalizeCoverBase).filter(Boolean))
  const q = encodeURIComponent(String(query).slice(0, 80))
  const perPage = 30
  const allCandidates = []

  for (let pageOffset = 0; pageOffset < maxPages; pageOffset += 1) {
    const page = startPage + pageOffset
    const url = `https://api.unsplash.com/search/photos?query=${q}&per_page=${perPage}&page=${page}&orientation=landscape&content_filter=high`

    const res = await fetch(url, {
      headers: { Authorization: `Client-ID ${accessKey}` },
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      throw new Error(`Unsplash API ${res.status}: ${errText.slice(0, 120) || res.statusText}`)
    }

    const json = await res.json()
    const results = Array.isArray(json?.results) ? json.results : []
    if (!results.length) break

    for (const r of results) {
      const raw = r?.urls?.regular || r?.urls?.small
      if (!raw || excluded.has(normalizeCoverBase(raw))) continue
      const cover = toCoverUrl(raw)
      if (cover) allCandidates.push(cover)
    }

    if (results.length < perPage) break
  }

  if (!allCandidates.length) return null
  if (randomPick) {
    return allCandidates[Math.floor(Math.random() * allCandidates.length)]
  }
  return allCandidates[0]
}

/**
 * Resolve cover URL + the Unsplash query that matched (for topic-locked regenerate).
 */
async function resolveBlogCoverImageUrl({
  topic,
  title,
  tags = [],
  keywords = [],
  excludeCoverUrl = null,
  preferDifferent = false,
  lockedSearchQuery = null,
}) {
  const accessKey = (process.env.UNSPLASH_ACCESS_KEY || '').trim()
  if (!accessKey) {
    console.warn('[blogAdmin.unsplash] UNSPLASH_ACCESS_KEY not set — skipping cover fetch')
    return null
  }

  const excludeUrls = excludeCoverUrl ? [excludeCoverUrl] : []
  const topicOnly = preferDifferent || !!lockedSearchQuery

  let queries
  if (lockedSearchQuery) {
    queries = [lockedSearchQuery]
  } else if (preferDifferent) {
    queries = buildSearchQueries({ topic, title, tags, keywords }, { topicOnly: true })
  } else {
    queries = buildSearchQueries({ topic, title, tags, keywords })
  }

  if (!queries.length) {
    console.warn('[blogAdmin.unsplash] No topic queries built for:', topic || title)
    return null
  }

  const startPage = preferDifferent ? 1 + Math.floor(Math.random() * 2) : 1
  const maxPages = preferDifferent ? 8 : 2

  try {
    for (const query of queries) {
      const url = await fetchUnsplashCover(query, accessKey, {
        excludeUrls,
        randomPick: preferDifferent || excludeUrls.length > 0,
        startPage,
        maxPages,
      })
      if (url) {
        console.log(
          '[blogAdmin.unsplash] Cover found for topic query:',
          query,
          preferDifferent ? '(different, same topic)' : ''
        )
        return { coverImageUrl: url, searchQuery: query }
      }
    }

    if (topicOnly && !lockedSearchQuery) {
      console.warn('[blogAdmin.unsplash] No on-topic alternates for:', queries.join(' | '))
    } else {
      console.warn('[blogAdmin.unsplash] No results for queries:', queries.join(' | '))
    }
    return null
  } catch (err) {
    console.warn('[blogAdmin.unsplash] Fetch failed:', err.message)
    return null
  }
}

module.exports = {
  resolveBlogCoverImageUrl,
  buildSearchQuery,
  buildSearchQueries,
  normalizeCoverBase,
}
