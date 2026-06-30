type ComparisonSectionHeaderProps = {
  id: string
  title: string
  description?: string
  step?: number
}

export function ComparisonSectionHeader({ id, title, description, step }: ComparisonSectionHeaderProps) {
  return (
    <div className="border-b border-gray-200 bg-[#FAFBFD] px-5 py-3.5 sm:px-6 sm:py-4">
      <div className="flex items-start gap-3">
        {step != null ? (
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white font-serif text-[13px] tabular-nums text-navy"
            aria-hidden
          >
            {step}
          </span>
        ) : null}
        <div className="min-w-0">
          <h2 id={id} className="font-serif text-[1.25rem] font-normal tracking-tight text-navy sm:text-[1.35rem]">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-[13px] leading-snug text-gray-500">{description}</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
