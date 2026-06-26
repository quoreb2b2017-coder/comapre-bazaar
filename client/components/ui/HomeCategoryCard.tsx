import Link from 'next/link'
import type { ComponentType } from 'react'
import { heroBtn3d, heroCard3d } from '@/lib/hero3dStyles'

type Props = {
  href: string
  quotesHref: string
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' }>
  shortTitle: string
  vendors: string
  title: string
  blurb: string
}

export function HomeCategoryCard({
  href,
  quotesHref,
  icon: Icon,
  shortTitle,
  vendors,
  title,
  blurb,
}: Props) {
  return (
    <div className={`group flex min-h-[132px] flex-col p-2.5 sm:min-h-[136px] sm:p-3 lg:min-h-[128px] lg:p-2.5 ${heroCard3d}`}>
      <Link href={href} className="flex flex-1 flex-col" aria-label={`${title}, ${vendors}`}>
        <Icon
          className="h-6 w-6 text-[#F58220] transition-transform duration-300 ease-out group-hover:scale-105 lg:h-5 lg:w-5"
          aria-hidden={true}
        />
        <div className="mt-2 lg:mt-1.5">
          <h2 className="text-base font-semibold text-white mb-0.5 lg:text-[15px]">{shortTitle}</h2>
          <p className="text-xs text-[#F58220]/90">{vendors}</p>
        </div>
        <p className="mt-2 flex-1 text-[11px] leading-relaxed text-white/75 sm:text-xs">{blurb}</p>
      </Link>

      <Link
        href={quotesHref}
        className={`mt-2.5 inline-flex w-fit items-center justify-center rounded-md px-2 py-1 text-[11px] font-semibold text-white ${heroBtn3d}`}
        aria-label={`Get free quotes for ${shortTitle}`}
      >
        Free Quotes
      </Link>
    </div>
  )
}
