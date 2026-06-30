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
          ? 'border-l-[3px] border-cb-orange pl-3.5 sm:pl-4'
          : 'mb-6 border border-gray-200 border-l-[3px] border-l-cb-orange bg-white px-5 py-3.5 sm:px-6 sm:py-4'
      }
      role="note"
      aria-label="Top pick summary"
    >
      <p
        className="text-[14px] leading-[1.75] text-gray-700 [&_strong]:font-semibold [&_strong]:text-navy"
        dangerouslySetInnerHTML={{ __html: summary }}
      />
    </div>
  )
}
