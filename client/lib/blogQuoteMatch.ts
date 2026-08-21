import type { ReviewQuotePopupKind } from '@/lib/reviewQuotePopup'

export type BlogQuoteMatch = {
  kind: ReviewQuotePopupKind | null
  label: string
  href: string
  popupTitle: string
  categoryLabel: string
}

const QUOTE_ENTRIES: Array<{
  keywords: string[]
  kind: ReviewQuotePopupKind
  label: string
  href: string
  categoryLabel: string
}> = [
  {
    keywords: ['crm', 'sales crm', 'pipeline', 'salesforce', 'hubspot', 'zoho', 'pipedrive'],
    kind: 'crm',
    label: 'Get Free CRM Quotes',
    href: '/marketing/best-crm-software/get-free-quotes',
    categoryLabel: 'CRM software',
  },
  {
    keywords: ['payroll', 'pay stub', 'paycheck', 'gusto', 'adp', 'onpay', 'rippling', 'papaya'],
    kind: 'payroll',
    label: 'Get Free Payroll Quotes',
    href: '/human-resources/best-payroll-software/get-free-quotes',
    categoryLabel: 'payroll software',
  },
  {
    keywords: ['email marketing', 'mailchimp', 'klaviyo', 'activecampaign', 'campaign monitor', 'newsletter'],
    kind: 'email-marketing',
    label: 'Get Free Email Marketing Quotes',
    href: '/marketing/best-email-marketing-services/get-free-quotes',
    categoryLabel: 'email marketing platforms',
  },
  {
    keywords: ['website builder', 'wix', 'squarespace', 'shopify', 'webflow', 'landing page'],
    kind: 'website-building',
    label: 'Get Free Website Builder Quotes',
    href: '/marketing/best-website-building-platform/get-free-quotes',
    categoryLabel: 'website builders',
  },
  {
    keywords: ['voip', 'business phone', 'phone system', 'ringcentral', 'nextiva', 'ooma', 'zoom phone'],
    kind: 'business-phone',
    label: 'Get Free Phone System Quotes',
    href: '/technology/business-phone-systems/get-free-quotes',
    categoryLabel: 'business phone systems',
  },
  {
    keywords: ['gps', 'fleet', 'telematics', 'samsara', 'motive', 'verizon connect', 'fleetio'],
    kind: 'gps-fleet',
    label: 'Get Free Fleet Management Quotes',
    href: '/technology/gps-fleet-management-software/get-free-quotes',
    categoryLabel: 'fleet management software',
  },
  {
    keywords: ['employee management', 'hr software', 'hris', 'bamboohr', 'workday', 'workforce', 'human resource', 'human resources', ' hr ', 'hr'],
    kind: 'employee-management',
    label: 'Get Free HR Software Quotes',
    href: '/human-resources/best-employee-management-software/get-free-quotes',
    categoryLabel: 'HR software',
  },
  {
    keywords: ['call center', 'contact center', 'talkdesk', 'genesys', 'twilio', 'freshdesk', 'cloud call'],
    kind: 'call-center',
    label: 'Get Free Call Center Quotes',
    href: '/sales/best-call-center-management-software/get-free-quotes',
    categoryLabel: 'call center software',
  },
  {
    keywords: ['project management', 'monday', 'asana', 'clickup', 'jira', 'notion', 'trello'],
    kind: 'project-management',
    label: 'Get Free Project Management Quotes',
    href: '/sales/best-project-management-software/get-free-quotes',
    categoryLabel: 'project management software',
  },
  {
    keywords: ['ai agent', 'chatbot', 'automation', 'llm'],
    kind: 'call-center',
    label: 'Get Free AI Support Quotes',
    href: '/sales/best-call-center-management-software/get-free-quotes',
    categoryLabel: 'AI support platforms',
  },
]

export function buildBlogQuoteCorpus(opts: {
  topic?: string
  tags?: string[]
  slug?: string
  title?: string
}): string {
  return [
    opts.topic || '',
    opts.title || '',
    ...(opts.tags || []),
    (opts.slug || '').replace(/-/g, ' '),
  ]
    .join(' ')
    .toLowerCase()
}

export function resolveBlogQuoteMatch(opts: {
  topic?: string
  tags?: string[]
  slug?: string
  title?: string
}): BlogQuoteMatch {
  const corpus = ` ${buildBlogQuoteCorpus(opts)} `

  for (const entry of QUOTE_ENTRIES) {
    const hit = entry.keywords.some((kw) => {
      const needle = kw.trim().toLowerCase()
      if (!needle) return false
      if (needle === 'hr') {
        return /(?<![\w-])hr(?![\w-])/i.test(corpus)
      }
      return corpus.includes(needle)
    })
    if (hit) {
      return {
        kind: entry.kind,
        label: entry.label,
        href: entry.href,
        popupTitle: entry.label.replace(/^Get Free /i, 'Compare '),
        categoryLabel: entry.categoryLabel,
      }
    }
  }

  return {
    kind: null,
    label: 'Get Free Software Quotes',
    href: '/technology/get-free-quotes',
    popupTitle: 'Get matched with software vendors',
    categoryLabel: 'business software',
  }
}

export function blogQuoteDismissKey(slug: string) {
  return `cb-blog-quote-dismissed-${slug}`
}

export function blogChecklistStorageKey(slug: string) {
  return `cb-blog-checklist-${slug}`
}
