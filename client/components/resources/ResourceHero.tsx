import type { ReactNode } from 'react'
import { BookOpen, FileText, Newspaper } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export type ResourcePillar = {
  icon: LucideIcon
  label: string
  sub: string
}

type Crumb = { label: string; href?: string }

export function ResourcePageShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F8F9FC]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[620px] bg-[radial-gradient(ellipse_88%_72%_at_50%_-10%,rgba(29,78,216,0.09),transparent_70%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,31,61,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,31,61,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,white,transparent_85%)]"
        aria-hidden
      />
      {children}
    </main>
  )
}

export function ResourceHero({
  crumbs,
  eyebrow = 'Compare Bazaar · Research Library',
  title,
  description,
  pillars,
  visual,
}: {
  crumbs: Crumb[]
  eyebrow?: string
  title: string
  description: string
  pillars: readonly ResourcePillar[]
  visual: ReactNode
}) {
  return (
    <div className="relative border-b border-gray-200/80 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto max-w-[1140px] px-4 py-6 sm:px-5 sm:py-8 lg:px-6 lg:py-10">
        <Breadcrumb items={crumbs} className="mb-8 text-sm" />
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(300px,420px)] lg:gap-12 xl:gap-16">
          <header className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#1D4ED8]/12 bg-[#F5F8FF] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1D4ED8]">
                <BookOpen className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                {eyebrow}
              </span>
            </div>
            <h1 className="max-w-[16ch] font-serif text-[2rem] font-normal leading-[1.06] tracking-tight text-navy sm:text-[2.5rem] lg:text-[2.625rem]">
              {title}
            </h1>
            <p className="mt-5 max-w-[56ch] text-[16px] leading-[1.78] text-gray-600 sm:text-[17px]">
              {description}
            </p>
            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
              {pillars.map(({ icon: Icon, label, sub }) => (
                <li key={label} className="rounded-xl border border-gray-200/80 bg-[#FAFBFD] px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#1D4ED8] ring-1 ring-gray-200/80">
                      <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                    </span>
                    <span className="text-[13px] font-semibold leading-snug text-navy">{label}</span>
                  </div>
                  <p className="mt-2 text-[12px] leading-relaxed text-gray-500">{sub}</p>
                </li>
              ))}
            </ul>
          </header>
          <div className="order-first lg:order-none lg:pb-6">{visual}</div>
        </div>
      </div>
    </div>
  )
}

export function ResourceHubVisual() {
  const cards = [
    { label: 'Blogs', icon: Newspaper, className: 'left-[4%] top-[18%] z-10 w-[58%] -rotate-[5deg]' },
    { label: 'White papers', icon: FileText, className: 'right-[2%] top-[8%] z-20 w-[60%] rotate-[6deg]' },
    { label: 'Reports', icon: BookOpen, className: 'left-[16%] top-[2%] z-30 w-[64%] -rotate-[1deg]' },
  ] as const

  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[400px]" aria-hidden>
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-[#EEF2FF] via-[#F8FAFF] to-[#FFF7EF]" />
      <div className="absolute -right-6 top-8 h-40 w-40 rounded-full bg-[#1D4ED8]/10 blur-3xl" />
      <div className="absolute -left-4 bottom-6 h-32 w-32 rounded-full bg-[#F58220]/10 blur-3xl" />
      <div className="relative h-full w-full">
        {cards.map(({ label, icon: Icon, className }) => (
          <div
            key={label}
            className={`absolute rounded-2xl border border-gray-200/80 bg-white px-4 py-4 shadow-[0_18px_40px_-24px_rgba(15,31,61,0.45)] ${className}`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#1D4ED8]">
              <Icon className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <p className="mt-3 text-[13px] font-semibold text-navy">{label}</p>
            <div className="mt-2 h-1.5 w-16 rounded-full bg-[#1D4ED8]/20" />
            <div className="mt-1.5 h-1.5 w-24 rounded-full bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  )
}
