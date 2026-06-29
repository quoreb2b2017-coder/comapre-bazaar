import Link from 'next/link'
import type { ComponentType } from 'react'
import { heroCategoryCard } from '@/lib/hero3dStyles'

type Props = {
  href: string
  quotesHref: string
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' }>
  shortTitle: string
  vendors: string
  title: string
  blurb?: string
}

export function HomeCategoryCard({
  href,
  quotesHref,
  icon: Icon,
  shortTitle,
  vendors,
  title,
}: Props) {
  return (
    <article className={heroCategoryCard}>
      <Link href={href} className="flex flex-1 flex-col" aria-label={`${title}, ${vendors} compared`}>
        <Icon
          className="mb-3 h-5 w-5 text-[#F58220] transition-transform duration-300 ease-out group-hover:scale-105"
          aria-hidden={true}
        />
        <h2 className="font-serif text-lg leading-tight text-[#1B2A4A]">{shortTitle}</h2>
        <p className="mt-1 text-sm text-gray-500">{vendors} compared</p>
      </Link>

      <Link
        href={quotesHref}
        className="mt-4 inline-flex w-fit items-center text-sm font-semibold text-[#F58220] transition-colors duration-200 hover:text-[#e67410]"
        aria-label={`Get free quotes for ${shortTitle}`}
      >
        Free quotes →
      </Link>
    </article>
  )
}
