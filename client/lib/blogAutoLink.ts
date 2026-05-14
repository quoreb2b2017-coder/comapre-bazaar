/**
 * Auto-injects contextual internal links into blog HTML.
 * Scans rendered HTML for topic keywords and wraps the FIRST match
 * of each keyword with a relevant comparison/quote page link.
 * Safe: skips text already inside <a>, <h1-6>, or existing links.
 */

type LinkRule = {
  /** Phrases to match (case-insensitive, whole-word boundary) */
  phrases: string[]
  href: string
  title: string
}

const LINK_RULES: LinkRule[] = [
  {
    phrases: ['payroll software', 'payroll system', 'payroll tool', 'payroll platform', 'payroll solution'],
    href: '/human-resources/best-payroll-software',
    title: 'Best Payroll Software',
  },
  {
    phrases: ['crm software', 'crm tool', 'crm platform', 'crm system', 'customer relationship management'],
    href: '/marketing/best-crm-software',
    title: 'Best CRM Software',
  },
  {
    phrases: ['email marketing software', 'email marketing tool', 'email marketing platform', 'email marketing service'],
    href: '/marketing/best-email-marketing-services',
    title: 'Best Email Marketing Services',
  },
  {
    phrases: ['website builder', 'website building platform', 'website building tool'],
    href: '/marketing/best-website-building-platform',
    title: 'Best Website Builders',
  },
  {
    phrases: ['voip', 'business phone system', 'business phone', 'cloud phone system', 'phone system'],
    href: '/technology/business-phone-systems',
    title: 'Best Business Phone Systems',
  },
  {
    phrases: ['gps fleet', 'fleet management software', 'fleet tracking software', 'fleet management system', 'fleet management tool'],
    href: '/technology/gps-fleet-management-software',
    title: 'Best GPS Fleet Management Software',
  },
  {
    phrases: ['employee management software', 'employee management system', 'workforce management software', 'hr software', 'hris'],
    href: '/human-resources/best-employee-management-software',
    title: 'Best Employee Management Software',
  },
  {
    phrases: ['call center software', 'call centre software', 'contact center software', 'contact centre software'],
    href: '/sales/best-call-center-management-software',
    title: 'Best Call Center Software',
  },
  {
    phrases: ['project management software', 'project management tool', 'project management platform'],
    href: '/sales/best-project-management-software',
    title: 'Best Project Management Software',
  },
]

/**
 * Splits HTML into text nodes vs tag/entity tokens so we only
 * modify visible text, never attribute values or tag names.
 */
function tokenize(html: string): string[] {
  // Split on tags and HTML entities — keep delimiters
  return html.split(/(<[^>]+>|&[^;]+;)/g)
}

export function injectBlogAutoLinks(html: string): string {
  if (!html) return html

  const tokens = tokenize(html)
  // Track which rules have already been used (first-match-only per rule)
  const used = new Set<number>()
  // Track nesting depth inside <a> and headings to skip those
  let insideLink = 0
  let insideHeading = 0

  const result = tokens.map((token) => {
    // It's a tag token
    if (token.startsWith('<')) {
      const tag = token.match(/^<\/?([a-z][a-z0-9]*)/i)?.[1]?.toLowerCase() ?? ''
      const isClosing = token.startsWith('</')
      if (tag === 'a') insideLink += isClosing ? -1 : 1
      if (/^h[1-6]$/.test(tag)) insideHeading += isClosing ? -1 : 1
      return token
    }

    // It's an entity or plain text — skip if inside link or heading
    if (insideLink > 0 || insideHeading > 0) return token
    if (token.startsWith('&')) return token

    let text = token

    for (let i = 0; i < LINK_RULES.length; i++) {
      if (used.has(i)) continue
      const rule = LINK_RULES[i]

      for (const phrase of rule.phrases) {
        // Word-boundary aware regex (handles start/end of string too)
        const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const re = new RegExp(`(?<![\\w-])(${escaped})(?![\\w-])`, 'i')
        const match = re.exec(text)
        if (match) {
          const before = text.slice(0, match.index)
          const matched = match[1]
          const after = text.slice(match.index + matched.length)
          text =
            before +
            `<a href="${rule.href}" title="${rule.title}" class="blog-auto-link">` +
            matched +
            `</a>` +
            after
          used.add(i)
          break
        }
      }
    }

    return text
  })

  return result.join('')
}
