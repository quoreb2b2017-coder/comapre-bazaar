import Link from 'next/link'
import type { TocItem } from '@/types'
import { CheckIcon } from '@/components/ui/icons'

interface SidebarProps {
  tocItems: TocItem[]
  ctaTitle: string
  ctaBody: string
  ctaSlug: string
}

export function ComparisonSidebar({ tocItems, ctaTitle, ctaBody, ctaSlug }: SidebarProps) {
  return (
    <aside className="space-y-4" aria-label="Page navigation">
      {/* Table of contents */}
      <nav className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-navy mb-4">
          Contents
        </h3>
        <ol className="space-y-2 list-decimal list-inside">
          {tocItems.map((item) => (
            <li key={item.anchor} className="text-sm text-gray-600">
              <a
                href={`#${item.anchor}`}
                className="text-brand hover:underline"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* CTA box */}
      <div className="bg-navy rounded-2xl p-5 text-white">
        <h4 className="font-semibold text-base mb-2">{ctaTitle}</h4>
        <p className="text-sm text-white/70 leading-relaxed mb-4">{ctaBody}</p>
        <Link
          href={ctaSlug}
          className="block text-center bg-accent text-navy text-sm font-bold py-2.5 rounded-xl hover:bg-yellow-400 transition-colors"
        >
          Get free quotes →
        </Link>
      </div>

      {/* Trust badge */}
      <div className="border border-gray-200 rounded-2xl p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Why trust Compare Bazaar?
        </p>
        <ul className="space-y-2">
          {[
            'Independent editorial — no pay-to-rank',
            'Hands-on testing by named experts',
            'Pricing verified April 2026',
            'Updated every 90 days',
          ].map((item) => (
            <li key={item} className="text-xs text-gray-600 flex items-start gap-2">
              <CheckIcon className="w-3.5 h-3.5 text-[#F27F25] flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <Link
          href="/editorial-process"
          className="text-xs text-brand font-medium mt-3 block hover:underline"
        >
          Read our methodology →
        </Link>
      </div>
    </aside>
  )
}
