import { BlogCoverImage } from '@/components/blog/BlogCoverImage'

type Props = {
  title: string
  eyebrow?: string
  subtitle?: string
  pills?: string[]
  coverUrl: string
  coverInput?: { slug: string; title: string; topic?: string; tags?: string[] }
}

export function BlogArticleHero({ title, eyebrow, subtitle, pills = [], coverUrl, coverInput }: Props) {
  return (
    <section className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-[#0B2A6F] text-white shadow-[0_8px_32px_-12px_rgba(11,42,111,0.45)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, #F58220 0%, transparent 50%), radial-gradient(circle at 80% 20%, #fff 0%, transparent 40%)',
        }}
        aria-hidden
      />
      <div className="relative grid md:grid-cols-[minmax(0,1.15fr)_minmax(220px,0.85fr)]">
        <div className="relative z-10 flex flex-col justify-center px-4 py-5 sm:px-6 sm:py-6">
          {eyebrow ? (
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F58220]">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-serif text-[1.55rem] leading-[1.15] tracking-tight sm:text-[1.9rem]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-[50ch] text-[14px] leading-relaxed text-white/80">{subtitle}</p>
          ) : null}
          {pills.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {pills.map((pill) => (
                <li
                  key={pill}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[12px] font-medium text-white/90"
                >
                  {pill}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="relative min-h-[180px] md:min-h-[240px]">
          <BlogCoverImage
            src={coverUrl}
            alt=""
            coverInput={coverInput || { slug: title, title }}
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 420px"
          />
          <div
            className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-[#0B2A6F] via-[#0B2A6F]/35 to-transparent md:block"
            aria-hidden
          />
        </div>
      </div>
    </section>
  )
}
