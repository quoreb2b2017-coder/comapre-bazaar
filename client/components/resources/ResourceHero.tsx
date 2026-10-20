import type { ReactNode } from 'react'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
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
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0B2A6F] via-[#F58220] to-[#0B2A6F]"
        aria-hidden
      />
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

const HUB_INDEX = ['Blogs', 'White papers', 'Reports', 'Case studies', 'Guides', 'Webinars'] as const

export function ResourceHubVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[380px]" aria-hidden>
      <div className="pointer-events-none absolute -right-8 -top-6 h-36 w-36 rounded-full bg-[#1D4ED8]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-6 h-32 w-32 rounded-full bg-[#F58220]/15 blur-3xl" />
      <div className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_24px_60px_-28px_rgba(15,31,61,0.4)]">
        <div className="flex items-center justify-between border-b border-gray-100 bg-[#F7F9FC] px-5 py-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1D4ED8]">Library index</p>
          <span className="text-[11px] font-medium text-gray-400">6 sections</span>
        </div>
        <ul>
          {HUB_INDEX.map((label, index) => (
            <li
              key={label}
              className="flex items-center gap-3 border-b border-gray-100 px-5 py-3 last:border-b-0"
            >
              <span className="w-7 font-serif text-[15px] tabular-nums text-[#F58220]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-[14px] font-semibold text-navy">{label}</span>
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#0B2A6F]/25" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function ResourceEmptyState({
  title,
  body,
}: {
  title: string
  body: ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_18px_48px_-32px_rgba(15,31,61,0.35)]">
      <div className="h-1 bg-gradient-to-r from-[#0B2A6F] via-[#F58220] to-[#0B2A6F]" aria-hidden />
      <div className="px-6 py-12 sm:px-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F58220]">Coming soon</p>
        <p className="mt-2 font-serif text-2xl text-navy">{title}</p>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-gray-500">{body}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-lg bg-navy px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#0a2560]"
          >
            Read the blog
          </Link>
          <Link
            href="/resources/whitepapers?type=whitepaper"
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-navy transition hover:border-[#F6D1AF]"
          >
            Browse white papers
          </Link>
        </div>
      </div>
    </div>
  )
}
