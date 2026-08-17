/** Narrow shape needed for cover resolution (matches CMS summaries). */
export type BlogCoverInput = {
  slug: string
  title?: string
  topic?: string
  tags?: string[]
  keywords?: string[]
  metaTitle?: string
  metaDescription?: string
  coverImageUrl?: string
}

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`

const ALLOWED_COVER_HOSTS = new Set(['images.unsplash.com', 'res.cloudinary.com', 'www.compare-bazaar.com'])

/** Verified Unsplash IDs — HTTP 200 checked; no duplicates across buckets where possible. */
const GENERIC_COVER_URLS: readonly string[] = [
  UNSPLASH('photo-1460925895917-afdab827c52f'),
  UNSPLASH('photo-1551434678-e076c223a692'),
  UNSPLASH('photo-1522071820081-009f0129c71c'),
  UNSPLASH('photo-1504384308090-c894fdcc538d'),
  UNSPLASH('photo-1486312338219-ce68d2c6f44d'),
  UNSPLASH('photo-1517245386807-bb43f82c33c4'),
  UNSPLASH('photo-1553877522-43269d4ea984'),
  UNSPLASH('photo-1556761175-5973dc0f32e7'),
  UNSPLASH('photo-1541746972996-4e0b0f43e02a'),
  UNSPLASH('photo-1560264280-88b68371db39'),
  UNSPLASH('photo-1521737604893-d14cc237f11d'),
  UNSPLASH('photo-1606857521015-7f9fcf423740'),
]

type TopicBucket = {
  /** Higher = wins when multiple buckets match */
  priority: number
  test: (corpus: string) => boolean
  urls: readonly string[]
}

/**
 * One best bucket per post (highest priority match). URLs are topic-specific stock imagery.
 * Order: most specific verticals first.
 */
const TOPIC_BUCKETS: TopicBucket[] = [
  {
    priority: 100,
    test: (c) =>
      /\bmisclassification\b|independent contractor|employer of record|\beor\b|1099 worker|dol rule|wage and hour|labor law/i.test(
        c,
      ),
    urls: [
      UNSPLASH('photo-1589829545856-d10d557cf95f'),
      UNSPLASH('photo-1450101499163-c8848c66ca85'),
      UNSPLASH('photo-1521791136064-7986c2920216'),
      UNSPLASH('photo-1507679799987-c73779587ccf'),
      UNSPLASH('photo-1454165804606-c3d57bc86b40'),
      UNSPLASH('photo-1765868017186-18a3fc4c2942'),
    ],
  },
  {
    priority: 95,
    test: (c) => /\bpayroll\b|pay stub|paycheck|w-?2\b|payroll error|global payroll|gusto|adp|paychex|rippling|deel\b/i.test(c),
    urls: [
      UNSPLASH('photo-1554224155-6726b3ff858f'),
      UNSPLASH('photo-1579621970563-ebec7560ff3e'),
      UNSPLASH('photo-1707902665498-a202981fb5ac'),
      UNSPLASH('photo-1628348068343-c6a848d2b6dd'),
      UNSPLASH('photo-1707157284454-553ef0a4ed0d'),
      UNSPLASH('photo-1709880945165-d2208c6ad2ec'),
      UNSPLASH('photo-1626266061368-46a8f578ddd6'),
      UNSPLASH('photo-1564939558297-fc396f18e5c7'),
      UNSPLASH('photo-1554224155-3a58922a22c3'),
      UNSPLASH('photo-1767423802472-f5fd07dfdb10'),
    ],
  },
  {
    priority: 90,
    test: (c) =>
      /\bhr software\b|hris\b|hr pricing|per user pricing|per employee pricing|employee onboarding|benefits admin|human resources\b/i.test(
        c,
      ),
    urls: [
      UNSPLASH('photo-1507679799987-c73779587ccf'),
      UNSPLASH('photo-1551836022-d5d88e9218df'),
      UNSPLASH('photo-1542744173-8e7e53415bb0'),
      UNSPLASH('photo-1629904869392-ae2a682d4d01'),
      UNSPLASH('photo-1521737604893-d14cc237f11d'),
      UNSPLASH('photo-1600880292203-757bb62b4baf'),
    ],
  },
  {
    priority: 88,
    test: (c) => /\bfleet management\b|gps fleet|vehicle tracking|telematics|fleet tracking|smart gps/i.test(c),
    urls: [
      UNSPLASH('photo-1586528116311-ad8dd3c8310d'),
      UNSPLASH('photo-1566576912321-d58ddd7a6088'),
      UNSPLASH('photo-1494412574643-ff11b0a5c1c3'),
      UNSPLASH('photo-1695222833131-54ee679ae8e5'),
      UNSPLASH('photo-1720811559395-3ed8d1b16649'),
      UNSPLASH('photo-1575136279047-feaf41cb9b82'),
    ],
  },
  {
    priority: 85,
    test: (c) => /\bfleet\b|trucking|commercial vehicle|delivery fleet|dispatch\b/i.test(c),
    urls: [
      UNSPLASH('photo-1586528116311-ad8dd3c8310d'),
      UNSPLASH('photo-1766785368863-f2188a8c8b32'),
      UNSPLASH('photo-1711942179703-fce59b6afac6'),
      UNSPLASH('photo-1614124760016-5fe39bdf27db'),
    ],
  },
  {
    priority: 82,
    test: (c) => /\bvoip\b|business phone|ucaas|cloud phone|ringcentral|phone system|phone cost/i.test(c),
    urls: [
      UNSPLASH('photo-1556761175-b413da4baf72'),
      UNSPLASH('photo-1516321318423-f06f85e504b3'),
      UNSPLASH('photo-1587825140708-dfaf72ae4b04'),
      UNSPLASH('photo-1587560699334-cc4ff634909a'),
      UNSPLASH('photo-1587560699334-bea93391dcef'),
      UNSPLASH('photo-1626863905121-3b0c0ed7b94c'),
      UNSPLASH('photo-1525182008055-f88b95ff7980'),
      UNSPLASH('photo-1537511446984-935f663eb1f4'),
      UNSPLASH('photo-1671797069008-d02b371a6493'),
      UNSPLASH('photo-1612447733386-a93717f1fb2a'),
    ],
  },
  {
    priority: 80,
    test: (c) => /\bcall center\b|contact center|cloud call/i.test(c),
    urls: [
      UNSPLASH('photo-1521791136064-7986c2920216'),
      UNSPLASH('photo-1603714228681-b399854b8f80'),
      UNSPLASH('photo-1766066014237-00645c74e9c6'),
      UNSPLASH('photo-1712159018726-4564d92f3ec2'),
    ],
  },
  {
    priority: 78,
    test: (c) => /\bcrm\b|customer relationship|sales pipeline|hubspot|salesforce|zoho crm|sales crm/i.test(c),
    urls: [
      UNSPLASH('photo-1552664730-d307ca884978'),
      UNSPLASH('photo-1557804506-669a67965ba0'),
      UNSPLASH('photo-1542744095-fcf48d80b0fd'),
      UNSPLASH('photo-1560264280-88b68371db39'),
      UNSPLASH('photo-1556761175-b413da4baf72'),
      UNSPLASH('photo-1541746972996-4e0b0f43e02a'),
    ],
  },
  {
    priority: 75,
    test: (c) => /\bai agent|machine learning|generative ai|chatbot|ai-powered crm/i.test(c),
    urls: [
      UNSPLASH('photo-1677442136019-21780ecad995'),
      UNSPLASH('photo-1620712943543-bcc4688e7485'),
      UNSPLASH('photo-1485827404703-89b55fcc595e'),
      UNSPLASH('photo-1677442135136-760c813028c0'),
    ],
  },
  {
    priority: 72,
    test: (c) => /\bmarketing automation\b|email marketing|digital marketing|\bseo\b|content marketing/i.test(c),
    urls: [
      UNSPLASH('photo-1533750516457-a7f992034fec'),
      UNSPLASH('photo-1432888498266-38ffec3eaf0a'),
      UNSPLASH('photo-1557838923-2985c318be48'),
    ],
  },
  {
    priority: 70,
    test: (c) => /\baccounting\b|bookkeeping|invoice|accounts payable|\berp\b/i.test(c),
    urls: [
      UNSPLASH('photo-1554224155-6726b3ff858f'),
      UNSPLASH('photo-1450101499163-c8848c66ca85'),
      UNSPLASH('photo-1554224154-22dec7ec8818'),
      UNSPLASH('photo-1628348068343-c6a848d2b6dd'),
    ],
  },
  {
    priority: 68,
    test: (c) => /\bproject management\b|task management|agile\b|kanban\b/i.test(c),
    urls: [
      UNSPLASH('photo-1517245386807-bb43f82c33c4'),
      UNSPLASH('photo-1504384308090-c894fdcc538d'),
      UNSPLASH('photo-1486312338219-ce68d2c6f44d'),
    ],
  },
  {
    priority: 65,
    test: (c) => /\bcybersecurity\b|endpoint security|\bsiem\b|data breach|ransomware/i.test(c),
    urls: [
      UNSPLASH('photo-1563986768609-322da13575f3'),
      UNSPLASH('photo-1550751827-4bd374c3f58b'),
      UNSPLASH('photo-1557838923-2985c318be48'),
    ],
  },
  {
    priority: 62,
    test: (c) => /\be-?commerce\b|online store|shopping cart|\bpos\b|point of sale|retail software/i.test(c),
    urls: [
      UNSPLASH('photo-1556742049-0cfed4f6a45d'),
      UNSPLASH('photo-1556740758-90de374c12ad'),
      UNSPLASH('photo-1472851294608-062f824d29cc'),
    ],
  },
  {
    priority: 60,
    test: (c) => /\bwebsite builder\b|web design|landing page|wordpress/i.test(c),
    urls: [
      UNSPLASH('photo-1467232004584-a241de8bcf5d'),
      UNSPLASH('photo-1547658719-da2b51169166'),
      UNSPLASH('photo-1555066931-4365d14bab8c'),
    ],
  },
  {
    priority: 58,
    test: (c) => /\binventory\b|warehouse|supply chain|\bwms\b/i.test(c),
    urls: [
      UNSPLASH('photo-1554224154-22dec7ec8818'),
      UNSPLASH('photo-1586528116311-ad8dd3c8310d'),
      UNSPLASH('photo-1494412574643-ff11b0a5c1c3'),
    ],
  },
  {
    priority: 55,
    test: (c) => /\bremote work\b|video conferenc|team chat|collaboration/i.test(c),
    urls: [
      UNSPLASH('photo-1522071820081-009f0129c71c'),
      UNSPLASH('photo-1523240795612-9a054b0db644'),
      UNSPLASH('photo-1600880292203-757bb62b4baf'),
    ],
  },
  {
    priority: 52,
    test: (c) => /\blearning management\b|\blms\b|training software|e-learning/i.test(c),
    urls: [
      UNSPLASH('photo-1501504905252-473c47e087f8'),
      UNSPLASH('photo-1434030216411-0b793f4b4173'),
      UNSPLASH('photo-1523240795612-9a054b0db644'),
    ],
  },
  {
    priority: 50,
    test: (c) => /\bemployee\b|workforce|scheduling|timesheet|time clock/i.test(c),
    urls: [
      UNSPLASH('photo-1522071820081-009f0129c71c'),
      UNSPLASH('photo-1553877522-43269d4ea984'),
      UNSPLASH('photo-1556761175-5973dc0f32e7'),
    ],
  },
  {
    priority: 48,
    test: (c) => /\bgps\b|route optimization/i.test(c),
    urls: [
      UNSPLASH('photo-1524661135-423995f22d0b'),
      UNSPLASH('photo-1554224154-22dec7ec8818'),
      UNSPLASH('photo-1695222833131-54ee679ae8e5'),
    ],
  },
]

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
  'free', 'paid', 'business', 'companies', 'company', 'modern', 'need', 'needs',
])

function hashSlug(slug: string): number {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h + slug.charCodeAt(i) * (i + 1)) % 1000000
  return h
}

function buildCorpus(b: BlogCoverInput): string {
  const chunks = [
    b.topic || '',
    ...(b.tags || []),
    ...(b.keywords || []),
    b.title || '',
    (b.slug || '').replace(/-/g, ' '),
    b.metaTitle || '',
    b.metaDescription || '',
  ]
  return chunks.join(' ').toLowerCase()
}

export function normalizeCoverUrl(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  const base = trimmed.split('?')[0]
  return `${base}?auto=format&fit=crop&w=1200&q=80`
}

export function isValidCoverUrl(raw: string | undefined | null): boolean {
  if (!raw || typeof raw !== 'string') return false
  try {
    const url = new URL(raw.trim())
    if (url.protocol !== 'https:') return false
    if (!ALLOWED_COVER_HOSTS.has(url.hostname)) return false
    if (url.hostname === 'images.unsplash.com' && !url.pathname.includes('/photo-')) return false
    return true
  } catch {
    return false
  }
}

function pickBestBucket(corpus: string): TopicBucket | null {
  let best: TopicBucket | null = null
  for (const bucket of TOPIC_BUCKETS) {
    if (!bucket.test(corpus)) continue
    if (!best || bucket.priority > best.priority) best = bucket
  }
  return best
}

function pickFromPool(pool: readonly string[], slug: string, exclude?: Set<string>): string {
  if (!pool.length) return GENERIC_COVER_URLS[0]
  const start = hashSlug(slug) % pool.length
  for (let i = 0; i < pool.length; i++) {
    const url = pool[(start + i) % pool.length]
    if (!exclude?.has(url)) return url
  }
  for (let i = 0; i < GENERIC_COVER_URLS.length; i++) {
    const url = GENERIC_COVER_URLS[(start + i) % GENERIC_COVER_URLS.length]
    if (!exclude?.has(url)) return url
  }
  return pool[0]
}

/** Sync fallback: single best topic bucket → stable slug-based pick; skips excluded URLs. */
export function pickTopicCoverUrl(b: BlogCoverInput, exclude?: Set<string>): string {
  const corpus = buildCorpus(b)
  const bucket = pickBestBucket(corpus)
  const pool = bucket?.urls?.length ? bucket.urls : GENERIC_COVER_URLS
  return pickFromPool(pool, b.slug, exclude)
}

/** Prefer saved CMS cover when valid; otherwise topic bucket. */
export function resolveCoverUrlFromCms(b: BlogCoverInput, exclude?: Set<string>): string {
  const saved = b.coverImageUrl?.trim()
  if (saved && isValidCoverUrl(saved)) {
    const normalized = normalizeCoverUrl(saved)
    if (!exclude?.has(normalized)) return normalized
  }
  return pickTopicCoverUrl(b, exclude)
}

/** Ensure every post in a listing gets a unique cover URL. */
export function assignUniqueBlogCovers<T extends { slug: string; coverUrl: string }>(
  posts: T[],
  getInput: (post: T) => BlogCoverInput,
): T[] {
  const used = new Set<string>()
  return posts.map((post) => {
    const input = getInput(post)
    let coverUrl = resolveCoverUrlFromCms(input, used)
    if (used.has(coverUrl)) {
      coverUrl = pickTopicCoverUrl(input, used)
    }
    used.add(coverUrl)
    return { ...post, coverUrl }
  })
}

/** Short query for Unsplash Search API (optional). */
export function buildUnsplashSearchQuery(b: BlogCoverInput): string {
  const corpus = buildCorpus(b)
  const bucket = pickBestBucket(corpus)
  if (bucket) {
    if (/\bpayroll\b/i.test(corpus)) return 'payroll accounting finance office'
    if (/\bcrm\b/i.test(corpus)) return 'CRM software sales team office'
    if (/\bvoip\b|phone/i.test(corpus)) return 'business phone call center headset'
    if (/\bfleet\b|gps/i.test(corpus)) return 'fleet management GPS logistics trucks'
    if (/\bhr\b|human resources/i.test(corpus)) return 'HR software team office'
  }

  const topic = b.topic?.trim()
  if (topic && topic.length >= 3) return `${topic} business technology`

  const tag = (b.tags || []).find((t) => String(t).trim().length > 2)
  if (tag) return `${String(tag).trim()} software workspace`

  const titleWords = (b.title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w))
    .slice(0, 5)

  const combined = [...new Set(titleWords)].slice(0, 5).join(' ')
  if (combined.length >= 3) return `${combined} professional office`
  return 'modern business technology workspace'
}

async function fetchUnsplashSearchCover(query: string, accessKey: string, page = 1): Promise<string | null> {
  const q = encodeURIComponent(query.slice(0, 80))
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${q}&per_page=5&page=${page}&orientation=landscape&content_filter=high`,
      {
        headers: { Authorization: `Client-ID ${accessKey}` },
        next: { revalidate: 86400 },
      },
    )
    if (!res.ok) return null
    const json = (await res.json()) as {
      results?: { urls?: { regular?: string; small?: string } }[]
    }
    const idx = hashSlug(query) % Math.max(json?.results?.length || 1, 1)
    const raw = json?.results?.[idx]?.urls?.regular || json?.results?.[0]?.urls?.small
    if (!raw || typeof raw !== 'string') return null
    return normalizeCoverUrl(raw)
  } catch {
    return null
  }
}

/**
 * Prefer Unsplash API search when `UNSPLASH_ACCESS_KEY` is set.
 * Otherwise uses curated topic buckets — no keys required.
 */
export async function resolveBlogCoverUrl(b: BlogCoverInput, exclude?: Set<string>): Promise<string> {
  const saved = b.coverImageUrl?.trim()
  if (saved && isValidCoverUrl(saved)) {
    const normalized = normalizeCoverUrl(saved)
    if (!exclude?.has(normalized)) return normalized
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY?.trim()
  if (accessKey) {
    const query = buildUnsplashSearchQuery(b)
    const page = 1 + (hashSlug(b.slug) % 3)
    const remote = await fetchUnsplashSearchCover(query, accessKey, page)
    if (remote && !exclude?.has(remote)) return remote
  }
  return pickTopicCoverUrl(b, exclude)
}
