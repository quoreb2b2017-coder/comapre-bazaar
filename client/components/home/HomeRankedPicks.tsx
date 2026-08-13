import Link from 'next/link'
import { comparisonPages } from '@/data/comparisons'
import { HOME_CATEGORIES } from '@/data/homeCategories'
import { ProductLogo } from '@/components/comparison/ProductLogo'
import { HomeRotatingRankings } from '@/components/home/HomeRotatingRankings'
import type { ComparisonPageData, Product } from '@/types'

function pageByCanonical(canonical: string): ComparisonPageData | undefined {
  return comparisonPages.find((p) => p.canonical === canonical)
}

function ranked(products: Product[], limit: number) {
  return [...products]
    .sort((a, b) => parseFloat(b.score) - parseFloat(a.score) || b.reviewCount - a.reviewCount)
    .slice(0, limit)
}

function winner(products: Product[]) {
  return products.find((p) => p.isTopPick) || ranked(products, 1)[0]
}

function quotesFor(canonical: string) {
  return HOME_CATEGORIES.find((c) => c.href === canonical)?.quotesHref || `${canonical}/get-free-quotes`
}

function ScoreMeter({ score }: { score: string }) {
  const value = Math.min(5, Math.max(0, parseFloat(score) || 0))
  const pct = (value / 5) * 100
  return (
    <div className="min-w-[120px]">
      <div className="mb-1 flex items-baseline gap-1.5">
        <span className="text-base font-bold text-navy">{score}</span>
        <span className="text-[11px] text-slate-400">/ 5</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-[#F58220]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

const WINNER_CANONICALS = [
  '/human-resources/best-payroll-software',
  '/technology/business-phone-systems',
  '/technology/gps-fleet-management-software',
  '/marketing/best-email-marketing-services',
  '/sales/best-call-center-management-software',
  '/sales/best-project-management-software',
]

export function HomeRankedPicks() {
  const winnerPages = WINNER_CANONICALS.map((canonical) => {
    const page = pageByCanonical(canonical)
    if (!page) return null
    const pick = winner(page.products)
    if (!pick) return null
    return { page, pick, quotesHref: quotesFor(canonical) }
  }).filter(Boolean) as { page: ComparisonPageData; pick: Product; quotesHref: string }[]

  return (
    <div className="space-y-12">
      <HomeRotatingRankings />
      <p className="mt-3 text-center text-[12px] text-slate-400">
        Rankings are editorial. Affiliate links may earn us a commission.{' '}
        <Link href="/advertising-disclosure" className="font-semibold text-navy hover:text-[#F58220]">
          Advertising disclosure
        </Link>
      </p>

      {winnerPages.length > 0 ? (
        <div>
          <div className="mb-6 text-center">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F58220]">
              Category winners
            </p>
            <h2 className="font-serif text-2xl tracking-tight text-navy sm:text-3xl">
              #1 pick in every hub
            </h2>
            <Link
              href="/browse-all-software"
              className="mt-3 inline-block text-sm font-semibold text-navy hover:text-[#F58220]"
            >
              Browse all software →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {winnerPages.map(({ page, pick, quotesHref }) => (
              <article
                key={page.canonical}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_32px_-20px_rgba(15,31,61,0.22)] transition-shadow hover:shadow-[0_18px_40px_-20px_rgba(15,31,61,0.32)]"
              >
                <div className="flex items-center justify-between bg-[#0B2A6F] px-4 py-2.5">
                  <p className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
                    {page.breadcrumbs[page.breadcrumbs.length - 1]?.label || 'Category'}
                  </p>
                  <span className="shrink-0 rounded bg-[#F58220] px-1.5 py-0.5 text-[10px] font-bold text-white">
                    #1
                  </span>
                </div>
                <div className="p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <ProductLogo product={pick} size="md" highlighted />
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-navy group-hover:text-[#F58220]">{pick.name}</h3>
                      <ScoreMeter score={pick.score} />
                    </div>
                  </div>
                  <p className="line-clamp-2 min-h-[40px] text-[13px] leading-relaxed text-slate-500">{pick.tagline}</p>
                  <div className="mt-4 flex gap-2">
                    <Link
                      href={page.canonical}
                      className="flex-1 rounded-lg border border-slate-200 py-2 text-center text-[12px] font-semibold text-navy hover:border-[#F58220] hover:text-[#F58220]"
                    >
                      Compare
                    </Link>
                    <Link
                      href={quotesHref}
                      className="flex-1 rounded-lg bg-[#F58220] py-2 text-center text-[12px] font-semibold text-white hover:bg-[#e07418]"
                    >
                      Get quotes
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
