import Image from 'next/image'
import { FileText, TrendingUp } from 'lucide-react'
import { whitePaperDisplayTitle } from '@/lib/whitePaperDisplay'
import type { WhitePaperPublic } from '@/lib/whitePaperCms'

function LibraryIllustration() {
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[400px]" aria-hidden>
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-[#EEF2FF] via-[#F8FAFF] to-[#E8EEF8]" />
      <div className="absolute -right-6 top-8 h-40 w-40 rounded-full bg-[#1D4ED8]/10 blur-3xl" />
      <div className="absolute -left-4 bottom-6 h-32 w-32 rounded-full bg-[#F58220]/10 blur-3xl" />

      <svg
        viewBox="0 0 400 320"
        className="absolute inset-0 h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="88" y="48" width="168" height="220" rx="8" fill="white" stroke="#DDE3F0" strokeWidth="1.5" />
        <rect x="108" y="72" width="88" height="6" rx="3" fill="#1D4ED8" fillOpacity="0.35" />
        <rect x="108" y="88" width="128" height="4" rx="2" fill="#CBD5E1" />
        <rect x="108" y="100" width="120" height="4" rx="2" fill="#E2E8F0" />
        <rect x="108" y="112" width="124" height="4" rx="2" fill="#E2E8F0" />
        <rect x="108" y="136" width="56" height="44" rx="4" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1" />
        <rect x="172" y="136" width="64" height="44" rx="4" fill="#FFF7ED" stroke="#FED7AA" strokeWidth="1" />
        <path d="M116 156 L148 172 L148 148 Z" fill="#1D4ED8" fillOpacity="0.2" />
        <rect x="124" y="68" width="200" height="236" rx="10" fill="white" fillOpacity="0.92" stroke="#C7D2FE" strokeWidth="1.5" />
        <rect x="144" y="96" width="96" height="6" rx="3" fill="#1D4ED8" fillOpacity="0.5" />
        <rect x="144" y="114" width="156" height="4" rx="2" fill="#CBD5E1" />
        <rect x="144" y="126" width="148" height="4" rx="2" fill="#E2E8F0" />
        <rect x="144" y="138" width="152" height="4" rx="2" fill="#E2E8F0" />
        <rect x="144" y="162" width="72" height="56" rx="5" fill="#EEF2FF" />
        <path d="M152 202 L168 186 L184 194 L200 170 L216 202 Z" stroke="#1D4ED8" strokeWidth="2" strokeLinejoin="round" fill="#1D4ED8" fillOpacity="0.12" />
        <circle cx="292" cy="88" r="28" fill="#1D4ED8" fillOpacity="0.08" stroke="#93C5FD" strokeWidth="1" />
        <path d="M280 96 L292 84 L304 96" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

type Props = {
  papers: WhitePaperPublic[]
}

export function WhitePaperLibraryHeroVisual({ papers }: Props) {
  const featured = papers.slice(0, 3)

  if (featured.length === 1) {
    const paper = featured[0]
    const title = whitePaperDisplayTitle(paper.title, paper.seoTitle)
    return (
      <div className="relative mx-auto w-full max-w-[320px] lg:max-w-none">
        <div className="pointer-events-none absolute -right-6 top-0 h-40 w-40 rounded-full bg-[#1D4ED8]/12 blur-3xl" aria-hidden />
        <div className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_24px_60px_-28px_rgba(15,31,61,0.4)] ring-1 ring-gray-200/60">
          <div className="relative aspect-[4/5] w-full bg-gradient-to-b from-[#f6f8fc] to-[#e8edf5] p-4">
            <Image
              src={paper.thumbnailUrl}
              alt={title}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 70vw, 320px"
              priority
            />
          </div>
        </div>
        <div className="absolute -bottom-2 left-0 z-10 flex items-center gap-2 rounded-xl border border-gray-200/90 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#1D4ED8]">
            <FileText className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </span>
          <span className="text-[13px] font-semibold text-navy">Free PDF reports</span>
        </div>
      </div>
    )
  }

  if (!featured.length) {
    return <LibraryIllustration />
  }

  const positions =
    featured.length === 2
      ? (['left-[4%] top-[14%] z-10 w-[56%] -rotate-[6deg]', 'right-[2%] top-[4%] z-20 w-[58%] rotate-[5deg]'] as const)
      : (['left-[2%] top-[10%] z-10 w-[54%] -rotate-[7deg]', 'right-[0%] top-[6%] z-20 w-[58%] rotate-[5deg]', 'left-[22%] top-[0] z-30 w-[62%] -rotate-[1deg]'] as const)

  return (
    <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
      <div
        className="pointer-events-none absolute -right-8 top-0 h-48 w-48 rounded-full bg-[#1D4ED8]/12 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-6 bottom-4 h-36 w-36 rounded-full bg-[#F58220]/10 blur-3xl"
        aria-hidden
      />

      <div className="relative aspect-[5/4] w-full">
        {featured.map((paper, index) => {
          const title = whitePaperDisplayTitle(paper.title, paper.seoTitle)
          const pos = positions[Math.min(index, positions.length - 1)]

          return (
            <div
              key={paper.slug}
              className={`absolute ${pos} overflow-hidden rounded-xl border border-white/80 bg-white shadow-[0_20px_50px_-24px_rgba(15,31,61,0.45)] ring-1 ring-gray-200/80 transition-transform duration-500 hover:z-40 hover:scale-[1.02]`}
            >
              <div className="relative aspect-[4/5] w-full bg-gradient-to-b from-[#f6f8fc] to-[#e8edf5] p-2.5 sm:p-3">
                <Image
                  src={paper.thumbnailUrl}
                  alt={title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 45vw, 240px"
                  priority={index === 0}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="absolute -bottom-2 left-0 z-40 flex items-center gap-2 rounded-xl border border-gray-200/90 bg-white/95 px-3 py-2 shadow-[0_12px_32px_-20px_rgba(15,31,61,0.35)] backdrop-blur-sm sm:left-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#1D4ED8]">
          <FileText className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </span>
        <span className="text-left">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
            Research library
          </span>
          <span className="block text-[13px] font-semibold text-navy">Free PDF reports</span>
        </span>
      </div>

      <div className="absolute -right-1 top-2 z-40 hidden items-center gap-1.5 rounded-full border border-[#1D4ED8]/15 bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-[#1D4ED8] shadow-sm backdrop-blur-sm sm:flex">
        <TrendingUp className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        Independent benchmarks
      </div>
    </div>
  )
}
