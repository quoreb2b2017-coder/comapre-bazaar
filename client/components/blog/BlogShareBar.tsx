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
    </div>
  )
}
