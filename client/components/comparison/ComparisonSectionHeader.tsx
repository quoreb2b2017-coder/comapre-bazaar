type ComparisonSectionHeaderProps = {
  id: string
  title: string
  description?: string
  step?: number
}

export function ComparisonSectionHeader({ id, title, description, step }: ComparisonSectionHeaderProps) {
  return (
    <div className="border-b border-gray-200 bg-[#FAFBFD] px-5 py-4 sm:px-6 sm:py-5">
      <div className="flex items-start gap-4">
        {step != null ? (
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white font-serif text-sm tabular-nums text-navy"
            aria-hidden
          >
            {step}
          </span>
        ) : null}
        <div className="min-w-0">
          <h2 id={id} className="font-serif text-[1.35rem] font-normal tracking-tight text-navy sm:text-[1.45rem]">
            {title}
          </h2>
          {description ? (
            <p className="mt-1.5 text-[13px] leading-relaxed text-gray-500">{description}</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
