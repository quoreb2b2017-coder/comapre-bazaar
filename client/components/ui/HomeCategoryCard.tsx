import Link from 'next/link'
import type { ComponentType } from 'react'

type Props = {
  href: string
  quotesHref: string
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' }>
  shortTitle: string
  vendors: string
  title: string
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
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-[#1e3a6a]/90 border-t-[3px] border-t-[#F58220] bg-[#0c2147] p-4 sm:p-5 lg:p-4 transition-all duration-300 hover:border-[#F58220] hover:bg-[#0f2854] hover:shadow-[0_0_0_1px_#F58220,0_12px_28px_-14px_rgba(245,130,32,0.35)]">
      <Link href={href} className="flex flex-1 flex-col" aria-label={`${title}, ${vendors}`}>
        <Icon className="h-6 w-6 text-[#F58220] lg:h-5 lg:w-5" aria-hidden={true} />
        <div className="mt-3 lg:mt-2">
          <h2 className="text-base font-semibold text-white mb-0.5 lg:text-[15px]">{shortTitle}</h2>
          <p className="text-xs text-[#F58220]/90">{vendors}</p>
        </div>
      </Link>

      <Link
        href={quotesHref}
        className="mt-3 inline-flex w-fit items-center justify-center rounded-md bg-[#F58220] px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#e67410]"
        aria-label={`Get free quotes for ${shortTitle}`}
      >
        Free Quotes
      </Link>
    </div>
  )
}
