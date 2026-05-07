import { TrophyIcon } from '@/components/ui/icons'

interface WinnerBannerProps {
  summary: string
  variant?: 'default' | 'marketing-smooth' | 'technology-smooth' | 'sales-smooth' | 'hr-smooth'
}

export function WinnerBanner({ summary, variant = 'default' }: WinnerBannerProps) {
  const isMarketingSmooth = variant === 'marketing-smooth'
  const isTechnologySmooth = variant === 'technology-smooth'
  const isSalesSmooth = variant === 'sales-smooth'
  const isHrSmooth = variant === 'hr-smooth'
  return (
    <div
      className={
        isMarketingSmooth
          ? 'bg-gradient-to-br from-emerald-50 via-white to-orange-50 border border-emerald-200 rounded-2xl px-6 py-5 flex flex-wrap items-start gap-3 mb-8 shadow-[0_18px_38px_-24px_rgba(16,185,129,0.45)]'
          : isTechnologySmooth
            ? 'bg-gradient-to-br from-cyan-50 via-white to-blue-50 border border-cyan-200 rounded-2xl px-6 py-5 flex flex-wrap items-start gap-3 mb-8 shadow-[0_18px_38px_-24px_rgba(14,116,144,0.38)]'
            : isSalesSmooth
              ? 'bg-gradient-to-br from-indigo-50 via-white to-violet-50 border border-indigo-200 rounded-2xl px-6 py-5 flex flex-wrap items-start gap-3 mb-8 shadow-[0_18px_38px_-24px_rgba(79,70,229,0.38)]'
              : isHrSmooth
                ? 'bg-gradient-to-br from-emerald-50 via-white to-teal-50 border border-emerald-200 rounded-2xl px-6 py-5 flex flex-wrap items-start gap-3 mb-8 shadow-[0_18px_38px_-24px_rgba(16,185,129,0.35)]'
          : 'bg-green-50 border border-green-200 rounded-2xl px-6 py-5 flex flex-wrap items-start gap-3 mb-8'
      }
      role="note"
      aria-label="Top pick summary"
    >
      <span className="bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full tracking-wide uppercase flex-shrink-0 mt-0.5 inline-flex items-center gap-1.5 shadow-[0_10px_24px_-16px_rgba(22,163,74,0.9)]">
        <TrophyIcon className="w-3.5 h-3.5" />
        Top Pick
      </span>
      <p
        className="text-sm text-green-900 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: summary }}
      />
    </div>
  )
}
