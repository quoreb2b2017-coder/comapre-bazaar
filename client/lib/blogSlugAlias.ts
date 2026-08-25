import { normalizeBlogSlug } from '@/lib/content-map'
import { topicToSlug } from '@/lib/blogTopicHubs'

const STOP = new Set([
  'a',
  'an',
  'the',
  'for',
  'in',
  'of',
  'and',
  'to',
  'vs',
  'with',
  'your',
  'what',
  'is',
  'why',
  'complete',
  'guide',
  'edition',
  'year',
  'which',
  'that',
  'dont',
  'does',
  'decoded',
])

function slugTokens(value: string) {
  return topicToSlug(
    normalizeBlogSlug(String(value || ''))
      .replace(/andamp/g, 'and')
      .replace(/businesses/g, 'business')
      .replace(/beginners/g, 'beginner'),
  )
    .split('-')
    .filter((part) => part && !STOP.has(part))
}

function overlapScore(requested: string, liveSlug: string) {
  const req = new Set(slugTokens(requested))
  const live = new Set(slugTokens(liveSlug))
  if (req.size < 3 || live.size < 3) return 0
  let shared = 0
  for (const token of req) {
    if (live.has(token)) shared += 1
  }
  if (shared < 3) return 0
  return shared / req.size
}

/** Map an old/404 blog slug to a live published slug when the match is unique. */
export function resolveLiveBlogSlug(requested: string, posts: Array<{ slug: string }>): string | null {
  const raw = decodeURIComponent(String(requested || '')).trim()
  if (!raw) return null

  const cleaned = normalizeBlogSlug(raw).replace(/andamp/g, 'and')
  const exact = posts.find((post) => post.slug === raw || post.slug === cleaned)
  if (exact) return exact.slug

  const ranked = posts
    .map((post) => ({ slug: post.slug, score: overlapScore(cleaned, post.slug) }))
    .filter((row) => row.score >= 0.72)
    .sort((a, b) => b.score - a.score)

  if (ranked.length === 0) return null
  if (ranked.length > 1 && ranked[0].score - ranked[1].score < 0.08) return null
  return ranked[0].slug
}
