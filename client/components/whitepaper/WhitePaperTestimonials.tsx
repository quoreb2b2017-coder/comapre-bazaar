import { cleanDisplayText } from '@/lib/cleanDisplayText'

export type WhitePaperTestimonial = {
  quote: string
  name: string
  initials: string
  role: string
  company: string
}

type Props = {
  heading?: string
  items?: WhitePaperTestimonial[]
  className?: string
  layout?: 'vertical' | 'horizontal'
}

const AVATAR_COLORS = [
  { bg: 'bg-blue-100', text: 'text-blue-700' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { bg: 'bg-amber-100', text: 'text-amber-700' },
]

function Stars() {
  return (
    <div className="text-[13px] leading-none tracking-[0.12em] text-amber-400" aria-label="5 out of 5 stars">
      ★★★★★
    </div>
  )
}

export function WhitePaperTestimonials({
  heading,
  items = [],
  className = '',
  layout = 'vertical',
}: Props) {
  const testimonials = items.filter((t) => t?.quote && t?.name).slice(0, 3)
  if (!testimonials.length) return null

  const title = cleanDisplayText(String(heading || 'Trusted by operations teams').trim())
  const isHorizontal = layout === 'horizontal'

  return (
    <section className={`text-left ${className}`}>
      <div className={isHorizontal ? '' : 'border-t border-gray-200 pt-5'}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">{title}</p>
      </div>

      <div
        className={
          isHorizontal
            ? 'mt-4 flex gap-4 overflow-x-auto pb-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible'
            : 'mt-4 space-y-5'
        }
      >
        {testimonials.map((item, index) => {
          const color = AVATAR_COLORS[index % AVATAR_COLORS.length]
          const roleLine = [item.role, item.company].filter(Boolean).join(', ')
          return (
            <article
              key={`${index}-${item.name}`}
              className={
                isHorizontal
                  ? 'min-w-[260px] shrink-0 snap-start rounded-lg border border-gray-100 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:min-w-[280px] lg:min-w-0'
                  : 'border-b border-gray-100 pb-5 last:border-b-0 last:pb-0'
              }
            >
              <Stars />
              <blockquote
                className={`leading-relaxed text-gray-700 ${isHorizontal ? 'mt-2.5 text-[12px] line-clamp-5' : 'mt-2.5 text-[13px]'}`}
              >
                &ldquo;{cleanDisplayText(item.quote)}&rdquo;
              </blockquote>
              <div className="mt-3 flex items-center gap-2.5">
                <span
                  className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${color.bg} ${color.text}`}
                >
                  {item.initials || item.name.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-navy">{cleanDisplayText(item.name)}</p>
                  {roleLine ? (
                    <p className="text-[11px] leading-snug text-gray-500">{cleanDisplayText(roleLine)}</p>
                  ) : null}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
