/**
 * Map blog topic/category → Compare Bazaar vertical comparison + quote URLs,
 * then inject a guaranteed CTA block (button + hyperlinks) into article HTML.
 */

const VERTICALS = [
  {
    id: 'crm',
    keys: ['crm', 'customer crm', 'pipeline crm', 'customer relationship'],
    comparisonHref: '/marketing/best-crm-software',
    quoteHref: '/marketing/best-crm-software/get-free-quotes',
    comparisonTitle: 'Best CRM Software',
    quoteLabel: 'Get Free CRM Quotes',
    categoryLabel: 'CRM software',
    matchTags: ['crm', 'crm software'],
  },
  {
    id: 'payroll',
    keys: ['payroll', 'pay stub', 'paycheck', 'pay roll', 'gusto', 'adp', 'rippling', 'paychex', 'global payroll'],
    comparisonHref: '/human-resources/best-payroll-software',
    quoteHref: '/human-resources/best-payroll-software/get-free-quotes',
    comparisonTitle: 'Best Payroll Software',
    quoteLabel: 'Get Free Payroll Quotes',
    categoryLabel: 'payroll software',
    matchTags: ['payroll', 'payroll software'],
  },
  {
    id: 'email-marketing',
    keys: ['email marketing', 'mailchimp', 'klaviyo', 'newsletter'],
    comparisonHref: '/marketing/best-email-marketing-services',
    quoteHref: '/marketing/best-email-marketing-services/get-free-quotes',
    comparisonTitle: 'Best Email Marketing Services',
    quoteLabel: 'Get Free Email Marketing Quotes',
    categoryLabel: 'email marketing platforms',
    matchTags: ['email marketing', 'email marketing software'],
  },
  {
    id: 'website-building',
    keys: ['website builder', 'website building', 'webflow', 'squarespace', 'wix'],
    comparisonHref: '/marketing/best-website-building-platform',
    quoteHref: '/marketing/best-website-building-platform/get-free-quotes',
    comparisonTitle: 'Best Website Builders',
    quoteLabel: 'Get Free Website Builder Quotes',
    categoryLabel: 'website builders',
    matchTags: ['website builder', 'website building'],
  },
  {
    id: 'business-phone',
    keys: ['voip', 'business phone', 'phone system', 'ucaas', 'cloud phone'],
    comparisonHref: '/technology/business-phone-systems',
    quoteHref: '/technology/business-phone-systems/get-free-quotes',
    comparisonTitle: 'Best Business Phone Systems',
    quoteLabel: 'Get Free Phone System Quotes',
    categoryLabel: 'business phone systems',
    matchTags: ['voip', 'business phone', 'phone system'],
  },
  {
    id: 'gps-fleet',
    keys: ['gps', 'fleet', 'telematics', 'fleet management', 'fleet tracking'],
    comparisonHref: '/technology/gps-fleet-management-software',
    quoteHref: '/technology/gps-fleet-management-software/get-free-quotes',
    comparisonTitle: 'Best Fleet Management Software',
    quoteLabel: 'Get Free Fleet Management Quotes',
    categoryLabel: 'fleet management software',
    matchTags: ['gps', 'fleet', 'fleet management software'],
  },
  {
    id: 'employee-management',
    keys: [
      'employee management',
      'hr software',
      'hris',
      'human resource',
      'human resources',
      'workforce management',
      'bamboohr',
    ],
    comparisonHref: '/human-resources/best-employee-management-software',
    quoteHref: '/human-resources/best-employee-management-software/get-free-quotes',
    comparisonTitle: 'Best Employee Management Software',
    quoteLabel: 'Get Free HR Software Quotes',
    categoryLabel: 'HR software',
    matchTags: ['hr software', 'employee management', 'hr'],
  },
  {
    id: 'call-center',
    keys: ['call center', 'call centers', 'contact center', 'contact centers', 'call centre', 'contact centre', 'cloud call', 'ai agent', 'chatbot'],
    comparisonHref: '/sales/best-call-center-management-software',
    quoteHref: '/sales/best-call-center-management-software/get-free-quotes',
    comparisonTitle: 'Best Call Center Software',
    quoteLabel: 'Get Free Call Center Quotes',
    categoryLabel: 'call center software',
    matchTags: ['call center', 'contact center'],
  },
  {
    id: 'project-management',
    keys: ['project management', 'asana', 'monday.com', 'clickup', 'jira', 'trello'],
    comparisonHref: '/sales/best-project-management-software',
    quoteHref: '/sales/best-project-management-software/get-free-quotes',
    comparisonTitle: 'Best Project Management Software',
    quoteLabel: 'Get Free Project Management Quotes',
    categoryLabel: 'project management software',
    matchTags: ['project management', 'project management software'],
  },
]

const FALLBACK = {
  id: 'general',
  comparisonHref: '/technology/get-free-quotes',
  quoteHref: '/technology/get-free-quotes',
  comparisonTitle: 'Compare Business Software',
  quoteLabel: 'Get Free Software Quotes',
  categoryLabel: 'business software',
  matchTags: ['business software'],
}

const CTA_MARK = 'data-blog-vertical-cta'

function buildCorpus(opts = {}) {
  return [
    opts.topic,
    opts.category,
    opts.categoryLabel,
    opts.title,
    ...(opts.tags || []),
    ...(opts.keywords || []),
    String(opts.slug || '').replace(/-/g, ' '),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function corpusHasKey(corpus, key) {
  const needle = String(key || '')
    .toLowerCase()
    .trim()
  if (!needle) return false
  // Word-boundary match so short keys like "hr" do not hit "through"
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(?<![\\w-])${escaped}(?![\\w-])`, 'i').test(corpus)
}

function resolveVerticalCta(opts = {}) {
  const categoryToken = String(opts.categoryLabel || opts.category || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
  if (categoryToken === 'hr' || categoryToken === 'human resources') {
    return { ...VERTICALS.find((v) => v.id === 'employee-management') }
  }

  const primaryCorpus = [
    opts.topic,
    opts.category,
    opts.categoryLabel,
    opts.title,
    String(opts.slug || '').replace(/-/g, ' '),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  const secondaryCorpus = [...(opts.tags || []), ...(opts.keywords || [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  let best = null
  let bestScore = -1

  for (const vertical of VERTICALS) {
    for (const key of vertical.keys) {
      const inPrimary = corpusHasKey(primaryCorpus, key)
      const inSecondary = !inPrimary && corpusHasKey(secondaryCorpus, key)
      if (!inPrimary && !inSecondary) continue
      // Prefer title/category/slug matches over noisy tags
      const score = String(key).length + (inPrimary ? 100 : 0)
      if (score > bestScore) {
        best = vertical
        bestScore = score
      }
    }
  }

  return best ? { ...best } : { ...FALLBACK }
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildVerticalCtaHtml(vertical) {
  const v = vertical || FALLBACK
  const label = escapeHtml(v.categoryLabel)
  const comparisonTitle = escapeHtml(v.comparisonTitle)
  const quoteLabel = escapeHtml(v.quoteLabel)

  return `
<section class="blog-vertical-cta not-prose" ${CTA_MARK}="true" style="margin:2.5rem 0 1.5rem;padding:1.35rem 1.4rem;border-radius:16px;border:1px solid #dbe4f3;background:linear-gradient(135deg,#f8fbff 0%,#fff7f0 100%);box-shadow:0 12px 28px -22px rgba(11,42,111,0.35);">
  <p style="margin:0 0 0.35rem;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#F58220;">Next step</p>
  <h2 style="margin:0 0 0.55rem;font-size:1.2rem;line-height:1.3;color:#0B2A6F;font-family:Georgia,serif;">Compare ${label} on Compare Bazaar</h2>
  <p style="margin:0 0 1rem;font-size:0.95rem;line-height:1.65;color:#475569;">
    Review our
    <a href="${v.comparisonHref}" title="${comparisonTitle}" class="blog-auto-link" style="color:#0B2A6F;font-weight:600;text-decoration:underline;text-underline-offset:3px;">${comparisonTitle}</a>
    guide, then get matched vendor quotes with no obligation.
  </p>
  <p style="margin:0;display:flex;flex-wrap:wrap;gap:0.65rem;align-items:center;">
    <a href="${v.quoteHref}" class="blog-vertical-cta-btn" style="display:inline-flex;align-items:center;justify-content:center;padding:0.7rem 1.15rem;border-radius:999px;background:#0B2A6F;color:#fff;font-weight:700;font-size:0.92rem;text-decoration:none;">${quoteLabel}</a>
    <a href="${v.comparisonHref}" class="blog-vertical-cta-secondary" style="display:inline-flex;align-items:center;justify-content:center;padding:0.65rem 1rem;border-radius:999px;border:1px solid #c5d2e8;background:#fff;color:#0B2A6F;font-weight:600;font-size:0.9rem;text-decoration:none;">${comparisonTitle} →</a>
  </p>
</section>`.trim()
}

function hasVerticalCta(html) {
  return new RegExp(CTA_MARK, 'i').test(String(html || ''))
}

function hasVerticalHref(html, vertical) {
  const raw = String(html || '')
  if (!vertical) return false
  return (
    raw.includes(vertical.comparisonHref) ||
    raw.includes(vertical.quoteHref)
  )
}

/**
 * Append or replace CTA so the resolved vertical links are always present.
 */
function injectVerticalCta(html, opts = {}) {
  const content = String(html || '')
  if (!content.trim()) return content

  const vertical = opts.vertical || resolveVerticalCta(opts)
  const block = buildVerticalCtaHtml(vertical)

  if (hasVerticalCta(content)) {
    const replaced = content.replace(
      /<section\b[^>]*\bdata-blog-vertical-cta\b[^>]*>[\s\S]*?<\/section>/i,
      block
    )
    // If regex missed (malformed HTML), append a fresh block
    if (replaced === content) return `${content.trim()}\n\n${block}`
    return replaced
  }

  if (hasVerticalHref(content, vertical)) {
    return content
  }

  return `${content.trim()}\n\n${block}`
}

function mergeVerticalTags(tags = [], vertical) {
  const v = vertical || FALLBACK
  return Array.from(
    new Set(
      [...(Array.isArray(tags) ? tags : []), ...(v.matchTags || []), v.categoryLabel]
        .map((t) => String(t || '').trim())
        .filter(Boolean)
    )
  ).slice(0, 12)
}

function verticalPromptInstructions(vertical) {
  const v = vertical || FALLBACK
  return `Required CTA (end of article, after conclusion): include a short closing paragraph with (1) a hyperlink to ${v.comparisonHref} labeled "${v.comparisonTitle}" and (2) a clear CTA button/link to ${v.quoteHref} labeled "${v.quoteLabel}". Use real <a href="..."> tags with those exact paths. Do not invent other domains.`
}

module.exports = {
  VERTICALS,
  FALLBACK,
  resolveVerticalCta,
  buildVerticalCtaHtml,
  injectVerticalCta,
  mergeVerticalTags,
  verticalPromptInstructions,
  hasVerticalCta,
}
