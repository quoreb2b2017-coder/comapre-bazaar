'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { resolveBlogQuoteMatch } from '@/lib/blogQuoteMatch'
import { useBlogQuoteOptional } from '@/components/blog/BlogQuoteProvider'

type Props = {
  title: string
  slug: string
  topic?: string
  tags?: string[]
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
  const quoteCtx = useBlogQuoteOptional()
  const shareUrl = useMemo(() => buildAbsoluteUrl(slug), [slug])
  const encodedUrl = encodeURIComponent(shareUrl)
  const quoteCta = useMemo(
    () => quoteCtx?.match ?? resolveBlogQuoteMatch({ topic, tags, slug, title }),
    [quoteCtx?.match, topic, tags, slug, title]
  )

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const handleQuoteClick = () => {
    if (quoteCtx?.match.kind) {
      quoteCtx.openQuotePopup()
      return
    }
  }

  return (
    <div className="mt-4">
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
        {quoteCtx?.match.kind ? (
          <button
            type="button"
            onClick={handleQuoteClick}
            className="flex w-full items-center justify-between gap-2 rounded-xl bg-gradient-to-r from-[#F58220] to-[#ec7416] px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:brightness-105 sm:text-sm"
          >
            {quoteCta.label}
            <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <Link
            href={quoteCta.href}
            className="flex items-center justify-between gap-2 rounded-xl bg-gradient-to-r from-[#F58220] to-[#ec7416] px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:brightness-105 sm:text-sm"
          >
            {quoteCta.label}
            <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  )
}
