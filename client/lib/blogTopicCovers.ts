/** Narrow shape needed for cover resolution (matches CMS summaries). */
export type BlogCoverInput = {
  slug: string
  title?: string
  topic?: string
  tags?: string[]
  keywords?: string[]
  metaTitle?: string
  metaDescription?: string
}

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`

/** Rotated when no topic bucket matches — same stable URLs as before. */
const GENERIC_COVER_URLS: readonly string[] = [
  UNSPLASH('photo-1460925895917-afdab827c52f'),
  UNSPLASH('photo-1551434678-e076c223a692'),
  UNSPLASH('photo-1522071820081-009f0129c71c'),
  UNSPLASH('photo-1504384308090-c894fdcc538d'),
  UNSPLASH('photo-1486312338219-ce68d2c6f44d'),
  UNSPLASH('photo-1517245386807-bb43f82c33c4'),
  UNSPLASH('photo-1553877522-43269d4ea984'),
  UNSPLASH('photo-1556761175-5973dc0f32e7'),
]

type TopicBucket = { keywords: readonly string[]; urls: readonly string[] }

/**
 * Longer phrases first (handled by sort). Match if phrase appears anywhere in corpus.
 * Imagery is editorial stock (Unsplash) — aligned to verticals on the site.
 */
const TOPIC_COVER_BUCKETS: TopicBucket[] = [
  {
    keywords: ['fleet management', 'gps fleet', 'vehicle tracking', 'telematics', 'fleet tracking'],
    urls: [
      UNSPLASH('photo-1586528116311-ad8dd3c8310d'),
      UNSPLASH('photo-1566576912321-d58ddd7a6088'),
      UNSPLASH('photo-1494412574643-ff11b0a5c1c3'),
    ],
  },
  {
    keywords: ['fleet', 'trucking', 'commercial vehicle', 'delivery fleet'],
    urls: [
      UNSPLASH('photo-1586528116311-ad8dd3c8310d'),
      UNSPLASH('photo-1566576912321-d58ddd7a6088'),
      UNSPLASH('photo-1494412574643-ff11b0a5c1c3'),
    ],
  },
  {
    keywords: ['gps', 'route optimization', 'dispatch'],
    urls: [
      UNSPLASH('photo-1524661135-423995f22d0b'),
      UNSPLASH('photo-1486312338219-ce68d2c6f44d'),
      UNSPLASH('photo-1554224154-22dec7ec8818'),
    ],
  },
  {
    keywords: ['payroll', 'pay stub', 'paycheck', 'w2', 'w-2', 'tax withholding'],
    urls: [
      UNSPLASH('photo-1554224155-6726b3ff858f'),
      UNSPLASH('photo-1454165804606-c3d57bc86b40'),
      UNSPLASH('photo-1556742049-0cfed4f6a45d'),
    ],
  },
  {
    keywords: ['human resources', 'hr software', 'hris', 'employee onboarding', 'benefits admin'],
    urls: [
      UNSPLASH('photo-1507679799987-c73779587ccf'),
      UNSPLASH('photo-1551836022-d5d88e9218df'),
      UNSPLASH('photo-1542744173-8e7e53415bb0'),
    ],
  },
  {
    keywords: ['employee', 'workforce', 'scheduling', 'timesheet', 'time clock'],
    urls: [
      UNSPLASH('photo-1522071820081-009f0129c71c'),
      UNSPLASH('photo-1553877522-43269d4ea984'),
      UNSPLASH('photo-1556761175-5973dc0f32e7'),
    ],
  },
  {
    keywords: ['crm', 'customer relationship', 'sales pipeline', 'sales force automation'],
    urls: [
      UNSPLASH('photo-1552664730-d307ca884978'),
      UNSPLASH('photo-1460925895917-afdab827c52f'),
      UNSPLASH('photo-1553877522-43269d4ea984'),
    ],
  },
  {
    keywords: ['voip', 'business phone', 'ucaas', 'cloud phone', 'contact center', 'call center'],
    urls: [
      UNSPLASH('photo-1551434678-e076c223a692'),
      UNSPLASH('photo-1516321318423-f06f85e504b3'),
      UNSPLASH('photo-1587825140708-dfaf72ae4b04'),
    ],
  },
  {
    keywords: ['marketing automation', 'email marketing', 'marketing software'],
    urls: [
      UNSPLASH('photo-1533750516457-a7f992034fec'),
      UNSPLASH('photo-1432888498266-38ffec3eaf0a'),
      UNSPLASH('photo-1460925895917-afdab827c52f'),
    ],
  },
  {
    keywords: ['seo', 'content marketing', 'digital marketing', 'social media marketing'],
    urls: [
      UNSPLASH('photo-1432888498266-38ffec3eaf0a'),
      UNSPLASH('photo-1557838923-2985c318be48'),
      UNSPLASH('photo-1556761175-b413da4baf72'),
    ],
  },
  {
    keywords: ['accounting', 'bookkeeping', 'invoice', 'accounts payable', 'erp'],
    urls: [
      UNSPLASH('photo-1554224155-6726b3ff858f'),
      UNSPLASH('photo-1450101499163-c8848c66ca85'),
      UNSPLASH('photo-1554224154-22dec7ec8818'),
    ],
  },
  {
    keywords: ['project management', 'task management', 'agile', 'kanban'],
    urls: [
      UNSPLASH('photo-1517245386807-bb43f82c33c4'),
      UNSPLASH('photo-1504384308090-c894fdcc538d'),
      UNSPLASH('photo-1486312338219-ce68d2c6f44d'),
    ],
  },
  {
    keywords: ['cybersecurity', 'endpoint security', 'siem', 'data breach', 'ransomware'],
    urls: [
      UNSPLASH('photo-1563986768609-322da13575f3'),
      UNSPLASH('photo-1550751827-4bd374c3f58b'),
      UNSPLASH('photo-1557838923-2985c318be48'),
    ],
  },
  {
    keywords: ['ai software', 'machine learning', 'generative ai', 'chatbot'],
    urls: [
      UNSPLASH('photo-1677442136019-21780ecad995'),
      UNSPLASH('photo-1620712943543-bcc4688e7485'),
      UNSPLASH('photo-1485827404703-89b55fcc595e'),
    ],
  },
  {
    keywords: ['ecommerce', 'e-commerce', 'online store', 'shopping cart'],
    urls: [
      UNSPLASH('photo-1556742049-0cfed4f6a45d'),
      UNSPLASH('photo-1556740758-90de374c12ad'),
      UNSPLASH('photo-1472851294608-062f824d29cc'),
    ],
  },
  {
    keywords: ['pos', 'point of sale', 'retail software'],
    urls: [
      UNSPLASH('photo-1472851294608-062f824d29cc'),
      UNSPLASH('photo-1556740758-90de374c12ad'),
      UNSPLASH('photo-1556742049-0cfed4f6a45d'),
    ],
  },
  {
    keywords: ['collaboration', 'remote work', 'video conferencing', 'team chat'],
    urls: [
      UNSPLASH('photo-1522071820081-009f0129c71c'),
      UNSPLASH('photo-1523240795612-9a054b0db644'),
      UNSPLASH('photo-1600880292203-757bb62b4baf'),
    ],
  },
  {
    keywords: ['inventory', 'warehouse', 'supply chain', 'wms'],
    urls: [
      UNSPLASH('photo-1554224154-22dec7ec8818'),
      UNSPLASH('photo-1586528116311-ad8dd3c8310d'),
      UNSPLASH('photo-1494412574643-ff11b0a5c1c3'),
    ],
  },
  {
    keywords: ['learning management', 'lms', 'training software', 'e-learning'],
    urls: [
      UNSPLASH('photo-1501504905252-473c47e087f8'),
      UNSPLASH('photo-1434030216411-0b793f4b4173'),
      UNSPLASH('photo-1523240795612-9a054b0db644'),
    ],
  },
  {
    keywords: ['document management', 'contract management', 'esign', 'e-sign'],
    urls: [
      UNSPLASH('photo-1450101499163-c8848c66ca85'),
      UNSPLASH('photo-1454165804606-c3d57bc86b40'),
      UNSPLASH('photo-1507679799987-c73779587ccf'),
    ],
  },
]

const STOPWORDS = new Set([
  'the',
  'a',
  'an',
  'and',
  'or',
  'for',
  'to',
  'of',
  'in',
  'on',
  'at',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'do',
  'does',
  'did',
  'will',
  'would',
  'could',
  'should',
  'may',
  'might',
  'must',
  'shall',
  'can',
  'need',
  'how',
  'what',
  'why',
  'when',
  'who',
  'which',
  'where',
  'your',
  'our',
  'their',
  'its',
  'my',
  'his',
  'her',
  'them',
  'they',
  'we',
  'you',
  'it',
  'this',
  'that',
  'these',
  'those',
  'best',
  'top',
  'guide',
  'guides',
  'tips',
  'review',
  'reviews',
  'ultimate',
  'complete',
  'software',
  'systems',
  'system',
  'solution',
  'solutions',
  'tool',
  'tools',
  'platform',
  'platforms',
  'vs',
  'versus',
  'year',
  'years',
  'new',
  'get',
  'make',
  'just',
  'into',
  'from',
  'with',
  'without',
  'about',
  'more',
  'most',
  'some',
  'any',
  'each',
  'every',
  'all',
  'than',
  'then',
  'also',
  'only',
  'such',
  'same',
  'using',
  'use',
  'used',
  'based',
  'free',
  'paid',
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

/** Sync fallback: match topic/tags/title/slug keywords to curated stock URLs. */
export function pickTopicCoverUrl(b: BlogCoverInput): string {
  const corpus = buildCorpus(b)
  const sorted = [...TOPIC_COVER_BUCKETS].sort((a, b) => {
    const maxB = Math.max(...b.keywords.map((k) => k.length), 0)
    const maxA = Math.max(...a.keywords.map((k) => k.length), 0)
    return maxB - maxA
  })

  for (const bucket of sorted) {
    for (const kw of bucket.keywords) {
      if (kw.length >= 2 && corpus.includes(kw)) {
        const urls = bucket.urls
        return urls[hashSlug(b.slug) % urls.length]
      }
    }
  }

  const g = GENERIC_COVER_URLS
  return g[hashSlug(b.slug) % g.length]
}

/** Short query for Unsplash Search API (optional). */
export function buildUnsplashSearchQuery(b: BlogCoverInput): string {
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

  const kw = (b.keywords || [])
    .map((k) => String(k).toLowerCase().trim())
    .filter((k) => k.length > 2 && !STOPWORDS.has(k))
    .slice(0, 3)

  const combined = [...new Set([...kw, ...titleWords])].slice(0, 5).join(' ')
  if (combined.length >= 3) return `${combined} professional office`
  return 'modern business technology workspace'
}

async function fetchUnsplashSearchCover(query: string, accessKey: string): Promise<string | null> {
  const q = encodeURIComponent(query.slice(0, 80))
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${q}&per_page=1&orientation=landscape&content_filter=high`,
      {
        headers: { Authorization: `Client-ID ${accessKey}` },
        next: { revalidate: 86400 },
      }
    )
    if (!res.ok) return null
    const json = (await res.json()) as {
      results?: { urls?: { regular?: string; small?: string } }[]
    }
    const raw = json?.results?.[0]?.urls?.regular || json?.results?.[0]?.urls?.small
    if (!raw || typeof raw !== 'string') return null
    const base = raw.split('?')[0]
    return `${base}?auto=format&fit=crop&w=1200&q=80`
  } catch {
    return null
  }
}

/**
 * Prefer Unsplash API search when `UNSPLASH_ACCESS_KEY` is set (free tier; respects topic/tags/title).
 * Otherwise uses curated topic buckets — no keys required.
 *
 * Note: Google Image Search (Custom Search JSON API) returns arbitrary third-party URLs, which break
 * Next.js `images.remotePatterns`. Freepik requires a paid API. Unsplash/Pexels-style licensed stock is the practical fit.
 */
export async function resolveBlogCoverUrl(b: BlogCoverInput): Promise<string> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY?.trim()
  if (accessKey) {
    const query = buildUnsplashSearchQuery(b)
    const remote = await fetchUnsplashSearchCover(query, accessKey)
    if (remote) return remote
  }
  return pickTopicCoverUrl(b)
}
