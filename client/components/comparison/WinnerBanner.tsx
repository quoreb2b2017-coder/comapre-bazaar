import { Award } from 'lucide-react'

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
          ? 'relative border-l-2 border-cb-orange bg-[#FFFBF7]/60 py-1 pl-4 sm:pl-5'
          : 'relative mb-6 border-l-2 border-cb-orange bg-[#FFFBF7]/60 py-2 pl-5 sm:pl-6'
      }
      role="note"
      aria-label="Top pick summary"
    >
      <div className="flex gap-3">
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cb-orange/10 text-cb-orange"
          aria-hidden
        >
          <Award className="h-4 w-4" strokeWidth={2.25} />
        </span>
        <p
          className="text-[14px] leading-[1.75] text-gray-700 [&_strong]:font-semibold [&_strong]:text-cb-orange"
          dangerouslySetInnerHTML={{ __html: summary }}
        />
      </div>
    </div>
  )
}
