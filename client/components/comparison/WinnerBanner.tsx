interface WinnerBannerProps {
  summary: string
  embedded?: boolean
  variant?: 'default' | 'marketing-smooth' | 'technology-smooth' | 'sales-smooth' | 'hr-smooth'
}

export function WinnerBanner({ summary, embedded = false }: WinnerBannerProps) {
  return (
    <div
      className={
        embedded
          ? 'relative overflow-hidden rounded-xl border border-cb-orange/15 bg-gradient-to-br from-cb-orange/5 via-white to-[#FFFBF7] p-4 sm:p-5'
          : 'relative mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-cb-orange/5 via-white to-[#FFFBF7] p-5 shadow-sm sm:p-6'
      }
      role="note"
      aria-label="Top pick summary"
    >
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-cb-orange to-cb-orange-hover" aria-hidden />
      <div className="flex gap-3 pl-2">
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cb-orange/10 text-sm"
          aria-hidden
        >
          🏆
        </span>
        <p
          className="text-[14px] leading-[1.75] text-gray-700 [&_strong]:font-semibold [&_strong]:text-navy"
          dangerouslySetInnerHTML={{ __html: summary }}
        />
      </div>
    </div>
  )
}
