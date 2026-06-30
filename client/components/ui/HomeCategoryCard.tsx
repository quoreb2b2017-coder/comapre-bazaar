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
  variant?: 'light' | 'navy'
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
          <span className="mt-2 flex items-center gap-1 pt-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#F58220] transition-all duration-300 group-hover:gap-1.5">
            Compare +
            <ArrowUpRight
              className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px"
              aria-hidden
            />
          </span>
        ) : null}
      </Link>

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
