export function topicToSlug(topic: string): string {
  return String(topic || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export type BlogTopicPost = {
  slug: string
  title?: string
  category?: string
  topic?: string
  tags?: string[]
}

export type BlogTopicHub = {
  slug: string
  label: string
  aliases: string[]
  keys: string[]
}

export type BlogTopicResolution =
  | { kind: 'hub'; hub: BlogTopicHub; posts: BlogTopicPost[]; canonicalPath: string }
  | { kind: 'redirect'; href: string }

const STOP = new Set(['a', 'an', 'the', 'for', 'in', 'of', 'and', 'to', 'vs', 'with', 'your'])

export const BLOG_TOPIC_HUBS: BlogTopicHub[] = [
  {
    slug: 'crm-software',
    label: 'CRM Software',
    aliases: [
      'crm',
      'crm-software',
      'crm-buying-guide',
      'crm-comparison',
      'best-crm-2026',
      'sales-automation',
      'ai-sales-tools',
      'hubspot-vs-zoho-crm',
    ],
    keys: ['crm', 'salesforce', 'hubspot', 'zoho crm', 'pipedrive', 'sales automation'],
  },
  {
    slug: 'payroll-software',
    label: 'Payroll Software',
    aliases: [
      'payroll',
      'payroll-software',
      'small-business-payroll',
      'payroll-compliance',
      'payroll-compliance-software',
      'payroll-tax-penalties',
      'international-payroll-software',
      'enterprise-payroll-software',
      'employer-of-record',
      'rippling-vs-deel',
      'gusto-vs-adp',
    ],
    keys: ['payroll', 'gusto', 'adp', 'paychex', 'rippling', 'deel', 'employer of record'],
  },
  {
    slug: 'hr-software',
    label: 'HR Software',
    aliases: ['hr', 'hr-software', 'hr-automation', 'startup-hr-tools', 'hr-software-comparison', 'hr-software-pricing'],
    keys: ['hr software', 'hris', 'employee management', 'human resource', 'bamboohr'],
  },
  {
    slug: 'business-phone-systems',
    label: 'Business Phone Systems',
    aliases: ['voip', 'voip-cost', 'voip-for-small-business', 'cloud-phone', 'business-phone-systems', 'ringcentral'],
    keys: ['voip', 'business phone', 'phone system', 'cloud phone', 'ringcentral', 'nextiva'],
  },
  {
    slug: 'fleet-management-software',
    label: 'Fleet Management Software',
    aliases: ['gps', 'fleet', 'fleet-tracking-software', 'driver-safety-monitoring', 'route-optimisation', 'route-optimization'],
    keys: ['gps', 'fleet', 'telematics', 'fleet tracking', 'fleet management'],
  },
  {
    slug: 'call-center-software',
    label: 'Call Center Software',
    aliases: ['call-center', 'contact-center-software', 'cloud-call-centers'],
    keys: ['call center', 'contact center', 'call centre'],
  },
  {
    slug: 'ai-agents',
    label: 'AI Agents',
    aliases: ['ai-agents', 'agentic-ai'],
    keys: ['ai agent', 'agentic', 'workflow automation', 'business automation'],
  },
]

function corpusHasKey(corpus: string, key: string) {
  const needle = key.trim().toLowerCase()
  if (!needle) return false
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(?<![\\w-])${escaped}(?![\\w-])`, 'i').test(corpus)
}

export function topicSlugCore(value: string) {
  return topicToSlug(value)
    .replace(/beginners/g, 'beginner')
    .split('-')
    .filter((part) => part && !STOP.has(part))
    .join('-')
}

export function findHubByTopicSlug(slug: string): BlogTopicHub | null {
  const key = topicToSlug(slug)
  if (!key) return null
  return (
    BLOG_TOPIC_HUBS.find((hub) => hub.slug === key || hub.aliases.includes(key)) || null
  )
}

export function resolveHubFromCorpus(corpus: string): BlogTopicHub | null {
  const text = ` ${String(corpus || '').toLowerCase()} `
  let best: BlogTopicHub | null = null
  let bestLen = -1
  for (const hub of BLOG_TOPIC_HUBS) {
    for (const key of hub.keys) {
      if (!corpusHasKey(text, key)) continue
      if (key.length > bestLen) {
        best = hub
        bestLen = key.length
      }
    }
  }
  return best
}

export function resolveHubFromPost(post: BlogTopicPost): BlogTopicHub | null {
  return resolveHubFromCorpus(
    [post.category, post.topic, post.title, ...(post.tags || []), String(post.slug || '').replace(/-/g, ' ')].join(
      ' ',
    ),
  )
}

/** Stable listing/chip label so we do not link unique article tags as topic URLs. */
export function blogHubCategoryLabel(input: BlogTopicPost): string {
  return resolveHubFromPost(input)?.label || input.category || input.topic || 'Editorial'
}

export function blogTopicHref(label: string): string {
  const hub = findHubByTopicSlug(label) || resolveHubFromCorpus(label)
  const slug = hub?.slug || topicToSlug(label)
  if (!slug) return '/blog#blog-articles'
  return `/blog?topic=${encodeURIComponent(slug)}#blog-articles`
}

function postMatchesHub(post: BlogTopicPost, hub: BlogTopicHub) {
  const resolved = resolveHubFromPost(post)
  if (resolved?.slug === hub.slug) return true
  const labels = [post.category, post.topic, ...(post.tags || [])]
  return labels.some((label) => {
    const slug = topicToSlug(label || '')
    return slug === hub.slug || hub.aliases.includes(slug)
  })
}

function postsMatchingLabelSlug(slug: string, posts: BlogTopicPost[]) {
  const key = topicToSlug(slug)
  return posts.filter((post) => {
    if (topicToSlug(post.slug) === key) return true
    return [post.category, post.topic, ...(post.tags || [])].some((label) => topicToSlug(label || '') === key)
  })
}

export function findPostByTopicSlug(slug: string, posts: BlogTopicPost[]): BlogTopicPost | null {
  const key = topicToSlug(slug)
  const core = topicSlugCore(slug)
  if (!key) return null

  const exact = posts.find((post) => topicToSlug(post.slug) === key || topicSlugCore(post.slug) === core)
  if (exact) return exact

  if (core.length < 28) return null
  return (
    posts.find((post) => {
      const postCore = topicSlugCore(post.slug)
      if (postCore.length < 20) return false
      return core.includes(postCore) || postCore.includes(core)
    }) || null
  )
}

export function resolveBlogTopicRequest(topicParam: string, posts: BlogTopicPost[]): BlogTopicResolution {
  const slug = topicToSlug(topicParam)
  if (!slug) return { kind: 'redirect', href: '/blog' }

  const article = findPostByTopicSlug(slug, posts)
  if (article) return { kind: 'redirect', href: `/blog/${article.slug}` }

  const hub = findHubByTopicSlug(slug)
  if (hub) {
    const hubPosts = posts.filter((post) => postMatchesHub(post, hub))
    const canonicalPath = `/blog?topic=${encodeURIComponent(hub.slug)}`
    if (slug !== hub.slug) return { kind: 'redirect', href: canonicalPath }
    if (hubPosts.length === 0) return { kind: 'redirect', href: '/blog' }
    return { kind: 'hub', hub, posts: hubPosts, canonicalPath }
  }

  const tagged = postsMatchingLabelSlug(slug, posts)
  if (tagged.length === 1) return { kind: 'redirect', href: `/blog/${tagged[0].slug}` }
  if (tagged.length > 1) {
    const label = tagged[0].category || tagged[0].topic || slug
    return {
      kind: 'hub',
      hub: { slug, label, aliases: [slug], keys: [] },
      posts: tagged,
      canonicalPath: `/blog?topic=${encodeURIComponent(slug)}`,
    }
  }

  return { kind: 'redirect', href: '/blog' }
}
