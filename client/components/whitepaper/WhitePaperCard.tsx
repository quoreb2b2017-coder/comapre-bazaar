'use client'

import Image from 'next/image'
import Link from 'next/link'
import { whitePaperDisplayTitle, whitePaperDisplayDescription } from '@/lib/whitePaperDisplay'
import { whitePaperResourceLabel, whitePaperResourceType } from '@/lib/whitePaperResourceType'

import type { WhitePaperPublic } from '@/lib/whitePaperCms'

type WhitePaperCardProps = {
  paper: WhitePaperPublic
}

/** Flat catalog tile — cover image + text, no card background */
export function WhitePaperCard({ paper }: WhitePaperCardProps) {
  const detailHref = `/resources/whitepapers/${paper.slug}`
  const title = whitePaperDisplayTitle(paper.title, paper.seoTitle)
  const description = whitePaperDisplayDescription(paper)
  const category = paper.metadata?.category?.trim()
  const resourceLabel = whitePaperResourceLabel(whitePaperResourceType(paper.metadata))

  return (
    <article className="group flex h-full flex-col">
      <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden p-1">
        <Image
          src={paper.thumbnailUrl}
          alt={title}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-navy/55 p-4 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-100 max-md:opacity-100">
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

      <div className="mt-3 flex flex-1 flex-col">
        <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gray-500">
            {resourceLabel}
          </p>
          {category ? (
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#1D4ED8]">
              {category}
            </p>
          ) : null}
        </div>

        <h2 className="flex-1">
          <Link
            href={detailHref}
            className="line-clamp-3 font-serif text-[13px] font-normal leading-[1.45] text-navy transition-colors hover:text-cb-orange sm:text-[14px]"
          >
            {title}
          </Link>
        </h2>

        {description ? (
          <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-gray-500">{description}</p>
        ) : null}

        <div className="mt-3 flex items-center justify-between gap-2">
          <Link
            href={detailHref}
            className="text-[11px] font-medium text-gray-500 transition-colors hover:text-navy"
          >
            View report
          </Link>
          <Link
            href={`${detailHref}/download`}
            className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#1D4ED8] transition-colors hover:text-[#1e40af]"
          >
            Free PDF →
          </Link>
        </div>
      </div>
    </article>
  )
}
