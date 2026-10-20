'use client'

import Link from 'next/link'
import { PUBLIC_PUBLISHER_NAME } from '@/lib/publicEditorDisplay'

const linkClass = 'font-semibold underline decoration-white/80 underline-offset-2 hover:decoration-white'

/** Orange disclosure strip fixed to the bottom of whitepaper pages. */
export function WhitePaperSponsorBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[120] bg-cb-orange text-white shadow-[0_-6px_18px_rgba(245,130,32,0.28)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-6">
        <p className="text-[12px] leading-snug text-white sm:text-[13px]">
          This white paper is brought to you through {PUBLIC_PUBLISHER_NAME}. {PUBLIC_PUBLISHER_NAME} is a
          library of software buying guides. Read our{' '}
          <Link href="/privacy-policy" className={linkClass}>
            privacy statement
          </Link>
          .
        </p>
        <p className="flex shrink-0 items-center gap-3 text-[12px] sm:text-[13px]">
          <Link href="/unsubscribe" className={linkClass}>
            Unsubscribe
          </Link>
          <span className="text-white/55" aria-hidden>
            |
          </span>
          <Link href="/do-not-sell" className={linkClass}>
            Do Not Sell My Data
          </Link>
        </p>
      </div>
    </div>
  )
}
