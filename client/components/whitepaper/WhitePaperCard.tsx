'use client'

import Image from 'next/image'
import Link from 'next/link'
import { whitePaperDisplayTitle } from '@/lib/whitePaperDisplay'

import type { WhitePaperPublic } from '@/lib/whitePaperCms'

type WhitePaperCardProps = {
  paper: WhitePaperPublic
}

/** Flat catalog tile — hover overlay with Download + View details */
export function WhitePaperCard({ paper }: WhitePaperCardProps) {
  const detailHref = `/resources/whitepaper/${paper.slug}`
  const title = whitePaperDisplayTitle(paper.title, paper.seoTitle)
  const category = paper.metadata?.category

  return (
    <article className="group flex h-full flex-col rounded-md border border-[#e4e7ef] bg-white shadow-sm transition-all hover:border-[#1D4ED8]/30 hover:shadow-md">
      <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-t-md bg-[#f4f6fb] p-3">
        <Image
          src={paper.thumbnailUrl}
          alt={title}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-[#1a1a1a]/50 p-4 opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-100 max-md:opacity-100">
          <Link
            href={`${detailHref}/download`}
            className="w-full max-w-[168px] bg-cb-orange px-3 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-cb-orange-hover sm:text-[11px]"
          >
            Download now
          </Link>
          <Link
            href={detailHref}
            className="w-full max-w-[168px] border border-white/80 bg-transparent px-3 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-white/10 sm:text-[11px]"
          >
            View details
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-3 py-3 sm:px-3.5 sm:py-3.5">
        {category && (
          <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#1D4ED8]">{category}</p>
        )}
        <h2 className="flex-1">
          <Link
            href={detailHref}
            className="line-clamp-3 text-[13px] font-normal leading-[1.4] text-[#1a1a2e] transition-colors hover:text-cb-orange sm:text-[14px]"
          >
            {title}
          </Link>
        </h2>
        <div className="mt-3 border-t border-gray-100 pt-3">
          <Link
            href={`${detailHref}/download`}
            className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#1D4ED8] transition-colors hover:text-[#1e40af]"
          >
            Free Download →
          </Link>
        </div>
      </div>
    </article>
  )
}
