'use client'

import { useMemo, useState } from 'react'

type Props = {
  title: string
  slug: string
}

function buildAbsoluteUrl(slug: string) {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/blog/${slug}`
  }
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.compare-bazaar.com'
  return `${base.replace(/\/$/, '')}/blog/${slug}`
}

export function BlogShareBar({ title, slug }: Props) {
  const [copied, setCopied] = useState(false)
  const encodedTitle = encodeURIComponent(title)
  const shareUrl = useMemo(() => buildAbsoluteUrl(slug), [slug])
  const encodedUrl = encodeURIComponent(shareUrl)

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
    <div className="mt-5 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50/90 p-3 sm:p-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">Share article</span>

        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A66C2] px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110"
          aria-label="Share on LinkedIn"
        >
          LinkedIn
        </a>

        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
          aria-label="Share on X"
        >
          X
        </a>

        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
          aria-label="Share on Facebook"
        >
          Facebook
        </a>

        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#F27F25]/40 bg-[#FFF7F0] px-3 py-1.5 text-xs font-semibold text-[#D86E1E] transition hover:border-[#F27F25] hover:bg-[#FFF1E6]"
          aria-label="Copy article link"
        >
          {copied ? 'Link Copied' : 'Copy Link'}
        </button>
      </div>
    </div>
  )
}
