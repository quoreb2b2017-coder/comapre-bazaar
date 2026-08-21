import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, FileText, Newspaper } from 'lucide-react'
import type { UnifiedBlogCard } from '@/lib/blogCms'

function EditorialIllustration() {
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-h-[280px]" aria-hidden>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-[#FFF7EF] to-[#F0F4FF] ring-1 ring-slate-200/80" />
      <svg
        viewBox="0 0 400 320"
        className="absolute inset-0 h-full w-full p-6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="56" y="48" width="180" height="220" rx="10" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
        <rect x="76" y="72" width="80" height="6" rx="3" fill="#F58220" fillOpacity="0.55" />
        <rect x="76" y="88" width="140" height="4" rx="2" fill="#CBD5E1" />
        <rect x="76" y="100" width="128" height="4" rx="2" fill="#E2E8F0" />
        <rect x="120" y="36" width="200" height="240" rx="12" fill="white" stroke="#F58220" strokeOpacity="0.25" strokeWidth="1.5" />
        <rect x="140" y="60" width="88" height="6" rx="3" fill="#0B2A6F" fillOpacity="0.15" />
        <rect x="140" y="78" width="160" height="4" rx="2" fill="#CBD5E1" />
        <rect x="140" y="92" width="152" height="4" rx="2" fill="#E2E8F0" />
        <rect x="140" y="116" width="96" height="72" rx="6" fill="#FFF7EF" />
        <path
          d="M152 172 L168 140 L188 152 L208 124 L228 172 Z"
          stroke="#F58220"
          strokeWidth="2"
          strokeLinejoin="round"
          fill="#F58220"
          fillOpacity="0.15"
        />
      </svg>
      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-xl border border-white/80 bg-white/95 px-3 py-2 shadow-md backdrop-blur-sm">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F58220]/10 text-[#F58220]">
          <Newspaper className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <span className="text-[12px] font-semibold text-navy">Editorial research</span>
      </div>
    </div>
  )
}

type Props = {
  posts: UnifiedBlogCard[]
}

export function BlogLibraryHeroVisual({ posts }: Props) {
  const featured = posts.slice(0, 3)

  if (!featured.length) {
    return <EditorialIllustration />
  }

  if (featured.length === 1) {
    const post = featured[0]
    return (
      <Link href={`/blog/${post.slug}`} className="group relative block w-full">
        <div className="overflow-hidden rounded-xl bg-white ring-1 ring-slate-200/90 shadow-[0_16px_48px_-20px_rgba(11,42,111,0.35)] transition group-hover:shadow-[0_20px_56px_-18px_rgba(11,42,111,0.4)]">
          <div className="relative aspect-[16/10] w-full bg-slate-100">
            <Image
              src={post.coverUrl}
              alt={post.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 90vw, 400px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          </div>
          <div className="border-t border-slate-100 bg-white px-4 py-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#F58220]">{post.category}</p>
            <p className="mt-1 line-clamp-2 font-serif text-[14px] leading-snug text-navy group-hover:text-[#0B2A6F]">
              {post.title}
            </p>
          </div>
        </div>
        <div className="absolute -bottom-2 left-3 z-10 flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-[11px] font-semibold text-navy shadow-md">
          <FileText className="h-3.5 w-3.5 text-[#F58220]" strokeWidth={1.75} aria-hidden />
          Latest blog
          <ArrowUpRight className="h-3 w-3 text-slate-400" aria-hidden />
        </div>
      </Link>
    )
  }

  const positions =
    featured.length === 2
      ? (['left-[0%] top-[18%] z-10 w-[62%] -rotate-[4deg]', 'right-[0%] top-[4%] z-20 w-[64%] rotate-[5deg]'] as const)
      : ([
          'left-[0%] top-[16%] z-10 w-[58%] -rotate-[5deg]',
          'right-[0%] top-[6%] z-20 w-[60%] rotate-[6deg]',
          'left-[16%] top-[0%] z-30 w-[64%] -rotate-[1deg]',
        ] as const)

  const lead = featured[featured.length >= 3 ? 2 : featured.length - 1]

  return (
    <div className="relative w-full">
      <div className="relative aspect-[5/4] w-full min-h-[220px] sm:min-h-[260px]">
        {featured.map((post, index) => {
          const pos = positions[Math.min(index, positions.length - 1)]
          const isFront = index === (featured.length >= 3 ? 2 : featured.length - 1)
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={`group absolute ${pos} block overflow-hidden rounded-xl bg-white ring-1 ring-slate-200/90 shadow-[0_14px_40px_-16px_rgba(11,42,111,0.4)] transition hover:z-40 hover:scale-[1.02] hover:shadow-[0_20px_48px_-14px_rgba(11,42,111,0.45)]`}
            >
              <div className="relative aspect-[16/10] w-full bg-slate-100">
                <Image
                  src={post.coverUrl}
                  alt={post.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  sizes="240px"
                  priority={index <= 1}
                />
              </div>
              {isFront ? (
                <div className="border-t border-slate-100 bg-white px-2.5 py-2">
                  <p className="truncate text-[8px] font-bold uppercase tracking-[0.14em] text-[#F58220]">
                    {post.category}
                  </p>
                  <p className="mt-0.5 line-clamp-1 font-serif text-[11px] leading-tight text-navy">{post.title}</p>
                </div>
              ) : null}
            </Link>
          )
        })}
      </div>

      <Link
        href={`/blog/${lead.slug}`}
        className="absolute -bottom-1 left-0 z-20 flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white/95 px-3 py-2 shadow-md backdrop-blur-sm transition hover:border-[#F58220]/30 hover:bg-white"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F58220]/10 text-[#F58220]">
          <Newspaper className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </span>
        <span className="text-[12px] font-semibold text-navy">Featured blogs</span>
        <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
      </Link>
    </div>
  )
}
