import Image from 'next/image'
import Link from 'next/link'
import { BuyerZoneSplit } from '@/components/quotes/BuyerZoneSplit'
import { BuyerZoneWidget } from '@/components/quotes/BuyerZoneWidget'

type SideHighlight = {
  title: string
  body: string
}

type SideStat = {
  value: string
  label: string
}

type BuyerZoneQuotePageProps = {
  title: string
  description: string
  categoryId: string
  sideImageUrl: string
  sideImageAlt: string
  sideEyebrow: string
  sideHeading: string
  sideBody: string
  sideHighlights: SideHighlight[]
  sideStats: SideStat[]
  breadcrumbs: { label: string; href?: string }[]
}

export function BuyerZoneQuotePage({
  title,
  description,
  categoryId,
  sideImageUrl,
  sideImageAlt,
  sideEyebrow,
  sideHeading,
  sideBody,
  sideHighlights,
  sideStats,
  breadcrumbs,
}: BuyerZoneQuotePageProps) {
  return (
    <main className="min-h-screen bg-[#F7F8FB]">
      <div className="bg-[#0B2A6F]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <nav aria-label="Breadcrumb" className="mb-3 text-sm text-white/70">
            {breadcrumbs.map((item, index) => (
              <span key={`${item.label}-${index}`}>
                {index > 0 ? <span className="mx-2 text-white/35">›</span> : null}
                {item.href ? (
                  <Link href={item.href} className="hover:text-cb-orange">
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-medium text-white">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cb-orange">
            Get free quotes
          </p>
          <h1 className="mt-2 font-serif text-[1.75rem] leading-tight text-cb-orange sm:text-3xl lg:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/90 sm:text-base">
            {description}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <BuyerZoneSplit
          form={<BuyerZoneWidget categoryId={categoryId} />}
          panel={
            <aside className="flex h-full min-h-full flex-col overflow-hidden rounded-2xl bg-[#0B2A6F]">
              <div className="relative min-h-[180px] flex-1">
                <Image
                  src={sideImageUrl}
                  alt={sideImageAlt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-center"
                  priority
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#0B2A6F] via-[#0B2A6F]/40 to-transparent"
                  aria-hidden
                />
              </div>

              <div className="shrink-0 px-6 py-6 sm:px-8 sm:py-7">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cb-orange">
                  {sideEyebrow}
                </p>
                <h2 className="mt-2 font-serif text-[1.45rem] leading-snug text-white sm:text-[1.65rem]">
                  {sideHeading}
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-white/85 sm:text-[15px]">{sideBody}</p>

                <ul className="mt-5 space-y-3.5">
                  {sideHighlights.map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cb-orange text-[11px] font-bold text-white"
                        aria-hidden
                      >
                        ✓
                      </span>
                      <div>
                        <p className="text-[14px] font-semibold text-white">{item.title}</p>
                        <p className="mt-0.5 text-[13px] leading-relaxed text-white/75">{item.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-white/15 pt-5">
                  {sideStats.map((stat) => (
                    <div key={stat.label}>
                      <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">
                        {stat.label}
                      </dt>
                      <dd className="mt-1 font-serif text-xl text-cb-orange sm:text-2xl">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          }
        />
      </div>
    </main>
  )
}
