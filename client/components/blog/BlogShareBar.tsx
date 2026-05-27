'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

type Props = {
  title: string
  slug: string
  topic?: string
  tags?: string[]
}

const TOPIC_QUOTE_MAP: Array<{ keywords: string[]; label: string; href: string }> = [
  { keywords: ['crm', 'sales crm', 'pipeline', 'salesforce', 'hubspot', 'zoho'], label: 'Get Free CRM Quotes', href: '/marketing/best-crm-software/get-free-quote' },
  { keywords: ['payroll', 'pay stub', 'paycheck', 'gusto', 'adp', 'onpay', 'rippling'], label: 'Get Free Payroll Quotes', href: '/human-resources/best-payroll-software/get-free-quotes' },
  { keywords: ['email marketing', 'mailchimp', 'klaviyo', 'activecampaign', 'campaign monitor', 'newsletter'], label: 'Get Free Email Marketing Quotes', href: '/marketing/best-email-marketing-services/get-free-quotes' },
  { keywords: ['website builder', 'wix', 'squarespace', 'shopify', 'webflow', 'landing page'], label: 'Get Free Website Builder Quotes', href: '/marketing/best-website-building-platform/get-free-quotes' },
  { keywords: ['voip', 'business phone', 'phone system', 'ringcentral', 'nextiva', 'ooma', 'zoom phone'], label: 'Get Free Phone System Quotes', href: '/technology/business-phone-systems/get-free-quotes' },
  { keywords: ['gps', 'fleet', 'telematics', 'samsara', 'motive', 'verizon connect', 'fleetio'], label: 'Get Free Fleet Management Quotes', href: '/technology/gps-fleet-management-software/get-free-quotes' },
  { keywords: ['employee management', 'hr software', 'hris', 'bamboohr', 'rippling', 'workday', 'workforce'], label: 'Get Free HR Software Quotes', href: '/human-resources/best-employee-management-software/get-free-quotes' },
  { keywords: ['call center', 'contact center', 'talkdesk', 'genesys', 'twilio', 'freshdesk'], label: 'Get Free Call Center Quotes', href: '/sales/best-call-center-management-software/get-free-quotes' },
  { keywords: ['project management', 'monday', 'asana', 'clickup', 'jira', 'notion', 'trello'], label: 'Get Free Project Management Quotes', href: '/sales/best-project-management-software/get-free-quotes' },
]

function resolveQuoteCta(topic?: string, tags?: string[], slug?: string): { label: string; href: string } {
  const corpus = [
    topic || '',
    ...(tags || []),
    (slug || '').replace(/-/g, ' '),
  ].join(' ').toLowerCase()

  for (const entry of TOPIC_QUOTE_MAP) {
    if (entry.keywords.some((kw) => corpus.includes(kw))) {
      return { label: entry.label, href: entry.href }
    }
  }
  return { label: 'Get Free Software Quotes', href: '/technology/get-free-quotes' }
}

function buildAbsoluteUrl(slug: string) {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/blog/${slug}`
  }
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.compare-bazaar.com'
  return `${base.replace(/\/$/, '')}/blog/${slug}`
}

export function BlogShareBar({ title, slug, topic, tags }: Props) {
  const [copied, setCopied] = useState(false)
  const encodedTitle = encodeURIComponent(title)
  const shareUrl = useMemo(() => buildAbsoluteUrl(slug), [slug])
  const encodedUrl = encodeURIComponent(shareUrl)
  const quoteCta = useMemo(() => resolveQuoteCta(topic, tags, slug), [topic, tags, slug])

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  const xUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="mt-5 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50/95 p-4 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.35)]">
      <div className="grid grid-cols-2 gap-2.5">
        <span className="col-span-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
          Share article
        </span>

        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 w-full min-w-0 items-center justify-center whitespace-nowrap rounded-xl bg-[#0A66C2] px-2 text-[13px] font-semibold leading-none text-white transition hover:brightness-110 sm:text-sm"
          aria-label="Share on LinkedIn"
        >
          LinkedIn
          
        </a>

        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 w-full min-w-0 items-center justify-center whitespace-nowrap rounded-xl border border-gray-300 bg-white px-2 text-[13px] font-semibold leading-none text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 sm:text-sm"
          aria-label="Share on X"
        >
          X
        </a>

        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 w-full min-w-0 items-center justify-center whitespace-nowrap rounded-xl border border-gray-300 bg-white px-2 text-[13px] font-semibold leading-none text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 sm:text-sm"
          aria-label="Share on Facebook"
        >
          Facebook
        </a>

        <button
          type="button"
          onClick={copyLink}
          className="inline-flex h-10 w-full min-w-0 items-center justify-center whitespace-nowrap rounded-xl border border-[#F27F25]/40 bg-[#FFF7F0] px-2 text-[13px] font-semibold leading-none text-[#D86E1E] transition hover:border-[#F27F25] hover:bg-[#FFF1E6] sm:text-sm"
          aria-label="Copy article link"
        >
          {copied ? 'Link Copied' : 'Copy Link'}
        </button>
      </div>

      <div className="mt-3 border-t border-gray-100 pt-3">
        <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
          Get matched with vendors
        </span>
        <Link
          href={quoteCta.href}
          className="flex items-center justify-between gap-2 rounded-xl bg-gradient-to-r from-[#F58220] to-[#ec7416] px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:brightness-105 sm:text-sm"
        >
          {quoteCta.label}
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
