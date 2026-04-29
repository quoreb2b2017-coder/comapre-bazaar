import { TrophyIcon } from '@/components/ui/icons'

interface WinnerBannerProps {
  summary: string
}

export function WinnerBanner({ summary }: WinnerBannerProps) {
  return (
    <div
      className="bg-green-50 border border-green-200 rounded-2xl px-6 py-5 flex flex-wrap items-start gap-3 mb-8"
      role="note"
      aria-label="Top pick summary"
    >
      <span className="bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded tracking-wide uppercase flex-shrink-0 mt-0.5 inline-flex items-center gap-1.5">
        <TrophyIcon className="w-3.5 h-3.5" />
        Top Pick
      </span>
      <p
        className="text-sm text-green-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: summary }}
      />
    </div>
  )
}
