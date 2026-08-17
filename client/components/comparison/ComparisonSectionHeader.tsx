import { cn } from '@/lib/utils'

type ComparisonSectionHeaderProps = {
  id: string
  title: string
  description?: string
  step?: number
}

export function ComparisonSectionHeader({ id, title, description, step }: ComparisonSectionHeaderProps) {
  return (
    <div className="border-b border-gray-100 pb-3">
      <div className="flex items-start gap-3">
        {step != null ? (
          <span
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-serif text-sm tabular-nums shadow-sm',
              step === 1
                ? 'bg-cb-orange text-white shadow-cb-orange/25'
                : 'border border-gray-200 bg-white text-navy'
            )}
            aria-hidden
          >
            {step}
          </span>
        ) : null}
        <div className="min-w-0">
          <h2 id={id} className="font-serif text-[1.3rem] font-normal tracking-tight text-cb-orange sm:text-[1.4rem]">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-[13px] leading-relaxed text-gray-500">{description}</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
