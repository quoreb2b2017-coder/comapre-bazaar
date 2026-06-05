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

export function WhitePaperTestimonials({ heading, items = [], className = '' }: Props) {
  const testimonials = items.filter((t) => t?.quote && t?.name).slice(0, 3)
  if (!testimonials.length) return null

  const title = cleanDisplayText(String(heading || 'Trusted by operations teams').trim())

  return (
    <section className={`text-left ${className}`}>
      <div className="border-t border-gray-200 pt-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">{title}</p>
      </div>

      <div className="mt-4 space-y-5">
        {testimonials.map((item, index) => {
          const color = AVATAR_COLORS[index % AVATAR_COLORS.length]
          const roleLine = [item.role, item.company].filter(Boolean).join(', ')
          return (
            <article
              key={`${index}-${item.name}`}
              className="border-b border-gray-100 pb-5 last:border-b-0 last:pb-0"
            >
              <Stars />
              <blockquote className="mt-2.5 text-[13px] leading-relaxed text-gray-700">
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
