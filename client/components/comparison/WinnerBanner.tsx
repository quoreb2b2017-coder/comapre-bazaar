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
          ? 'border-l-[3px] border-cb-orange pl-4 sm:pl-5'
          : 'mb-8 border border-gray-200 border-l-[3px] border-l-cb-orange bg-white px-5 py-4 sm:px-6 sm:py-5'
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
