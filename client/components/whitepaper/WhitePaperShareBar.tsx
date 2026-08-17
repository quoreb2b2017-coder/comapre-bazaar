'use client'

import { useMemo, useState } from 'react'
import { Check, Link2 } from 'lucide-react'
import { whitePaperPublicShareUrl } from '@/lib/whitePaperMeta'
import { whitePaperShareHeading, type WhitePaperResourceType } from '@/lib/whitePaperTaxonomy'

type Props = {
  slug: string
  title: string
  resourceType?: WhitePaperResourceType
  compact?: boolean
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0z" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05v-2.66c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.09 24 18.1 24 12.07z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85c.15-3.23 1.67-4.77 4.92-4.92 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95C23.73 2.69 21.31.27 16.95.07 15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm6.41-11.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z" />
    </svg>
  )
}

export function WhitePaperShareBar({ slug, title, resourceType = 'whitepaper', compact = false }: Props) {
  const [copied, setCopied] = useState<'link' | 'instagram' | null>(null)
  const shareUrl = useMemo(() => whitePaperPublicShareUrl(slug), [slug])
  const encodedUrl = encodeURIComponent(shareUrl)
  const kind = whitePaperShareHeading(resourceType)

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`

  const copyLink = async (source: 'link' | 'instagram') => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(source)
      window.setTimeout(() => setCopied(null), 1800)
    } catch {
      setCopied(null)
    }
  }

  const shareInstagram = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, url: shareUrl, text: title })
        return
      } catch {
        /* user cancelled or share failed — fall through to copy */
      }
    }
    await copyLink('instagram')
  }

  const icon = compact ? 'h-4 w-4 shrink-0' : 'h-[18px] w-[18px] shrink-0'
  const btn = compact
    ? 'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white transition hover:brightness-110'
    : 'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white transition hover:brightness-110'

  return (
    <div className={compact ? 'mt-3' : 'mt-6'}>
      <p className={`mb-2 font-semibold uppercase tracking-[0.16em] text-gray-500 ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
        {kind}
      </p>
      <div className="flex flex-wrap gap-2">
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btn} bg-[#0A66C2]`}
          aria-label={`Share ${kind} on LinkedIn`}
          title="LinkedIn"
        >
          <LinkedInIcon className={icon} />
        </a>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btn} bg-[#1877F2]`}
          aria-label={`Share ${kind} on Facebook`}
          title="Facebook"
        >
          <FacebookIcon className={icon} />
        </a>
        <button
          type="button"
          onClick={shareInstagram}
          className={`${btn} bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF]`}
          aria-label={`Copy ${kind} link for Instagram`}
          title="Instagram"
        >
          {copied === 'instagram' ? <Check className={icon} /> : <InstagramIcon className={icon} />}
        </button>
        <button
          type="button"
          onClick={() => copyLink('link')}
          className={
            compact
              ? 'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-navy transition hover:border-cb-orange hover:text-cb-orange'
              : 'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-navy transition hover:border-cb-orange hover:text-cb-orange'
          }
          aria-label={`Copy ${kind} link`}
          title="Copy link"
        >
          {copied === 'link' ? <Check className={icon} /> : <Link2 className={icon} />}
        </button>
      </div>
      {compact ? null : (
        <p className="mt-2 text-[11px] leading-relaxed text-gray-400">
          LinkedIn and Facebook show the cover preview automatically. Instagram copies the link so you can paste it in a bio, story, or caption.
        </p>
      )}
    </div>
  )
}
