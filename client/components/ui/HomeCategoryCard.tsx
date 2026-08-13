import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { ComponentType } from 'react'
import { cn } from '@/lib/utils'
import { heroCategoryCard, heroNavyCategoryCard, heroNavyIconTile } from '@/lib/hero3dStyles'

type Props = {
  href: string
  quotesHref: string
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' }>
  shortTitle: string
  vendors: string
  title: string
  cardTagline?: string
  blurb?: string
  variant?: 'light' | 'navy' | 'panel'
}

export function HomeCategoryCard({
  href,
  quotesHref,
  icon: Icon,
  shortTitle,
  vendors,
  title,
  cardTagline,
  variant = 'light',
}: Props) {
  const isNavy = variant === 'navy'
  const isPanel = variant === 'panel'

  if (isPanel) {
    return (
      <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 border-l-[4px] border-l-[#0B2A6F] bg-white p-4 shadow-[0_6px_18px_-12px_rgba(15,31,61,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-14px_rgba(15,31,61,0.28)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-[#0B2A6F]" aria-hidden />
        <Link href={href} className="flex flex-1 flex-col" aria-label={`${title}, ${vendors}`}>
          <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8EEF8] ring-1 ring-[#0B2A6F]/15">
            <Icon className="h-4 w-4 text-[#0B2A6F]" aria-hidden={true} />
          </span>
          <h3 className="text-[15px] font-semibold leading-snug text-navy group-hover:text-[#0B2A6F]">
            {shortTitle}
          </h3>
          <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            {vendors}
          </p>
          {cardTagline ? (
            <p className="mt-2.5 line-clamp-2 border-l-2 border-[#0B2A6F] pl-2.5 text-[12px] leading-relaxed text-slate-500">
              {cardTagline}
            </p>
          ) : null}
        </Link>
        <div className="mt-4 flex gap-2">
          <Link
            href={href}
            className="flex-1 rounded-lg border border-slate-200 bg-[#F8FAFC] py-1.5 text-center text-[11px] font-semibold text-navy hover:border-[#0B2A6F] hover:text-[#0B2A6F]"
          >
            Compare
          </Link>
          <Link
            href={quotesHref}
            className="flex-1 rounded-lg bg-[#0B2A6F] py-1.5 text-center text-[11px] font-semibold text-white hover:bg-[#0a2460]"
            aria-label={`Get free quotes for ${shortTitle}`}
          >
            Get quotes
          </Link>
        </div>
      </article>
    )
  }

  return (
    <article className={isNavy ? heroNavyCategoryCard : heroCategoryCard}>
      {isNavy ? (
        <>
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[3px] bg-[#F58220]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-[3px] h-12 bg-gradient-to-b from-white/[0.05] to-transparent"
            aria-hidden
          />
        </>
      ) : null}

      <Link href={href} className="relative flex flex-1 flex-col" aria-label={`${title}, ${vendors}`}>
        {isNavy ? (
          <div className={heroNavyIconTile}>
            <Icon className="h-4 w-4 text-[#F58220]" aria-hidden={true} />
          </div>
        ) : (
          <Icon
            className="mb-3 h-5 w-5 text-[#F58220] transition-transform duration-300 ease-out group-hover:scale-105"
            aria-hidden={true}
          />
        )}

        <h2
          className={cn(
            'leading-tight',
            isNavy
              ? 'text-[14px] font-semibold tracking-tight text-white sm:text-[15px]'
              : 'font-serif text-lg text-[#1B2A4A]'
          )}
        >
          {shortTitle}
        </h2>

        <p
          className={cn(
            'mt-0.5',
            isNavy
              ? 'text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40'
              : 'text-sm text-gray-500'
          )}
        >
          {isNavy ? vendors : `${vendors} compared`}
        </p>

        {isNavy && cardTagline ? (
          <p className="mt-2 border-l-2 border-[#F58220]/60 pl-2 text-[10px] leading-snug text-white/65 sm:text-[11px]">
            {cardTagline}
          </p>
        ) : null}

        {isNavy ? (
          <span className="mt-auto flex items-center gap-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#F58220] transition-all duration-300 group-hover:gap-1.5">
            Compare
            <ArrowUpRight
              className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px"
              aria-hidden
            />
          </span>
        ) : null}
      </Link>

      {isNavy ? (
        <Link
          href={quotesHref}
          className="relative z-10 mt-2 text-[11px] font-semibold text-white/70 hover:text-[#F58220]"
          aria-label={`Get free quotes for ${shortTitle}`}
        >
          Get quotes →
        </Link>
      ) : null}

      {!isNavy ? (
        <Link
          href={quotesHref}
          className="mt-4 inline-flex w-fit items-center text-sm font-semibold text-[#F58220] transition-colors duration-200 hover:text-[#e67410]"
          aria-label={`Get free quotes for ${shortTitle}`}
        >
          Free quotes →
        </Link>
      ) : null}
    </article>
  )
}
