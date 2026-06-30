import Image from 'next/image'
import { FileText, Newspaper } from 'lucide-react'
import type { UnifiedBlogCard } from '@/lib/blogCms'

function EditorialIllustration() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full" aria-hidden>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FFF7EF] via-white to-[#F8F4EE]" />
      <div className="absolute -right-4 top-4 h-28 w-28 rounded-full bg-cb-orange/12 blur-2xl" />
      <div className="absolute -left-2 bottom-2 h-20 w-20 rounded-full bg-navy/[0.06] blur-2xl" />

      <svg
        viewBox="0 0 360 270"
        className="absolute inset-0 h-full w-full p-4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="48" y="40" width="168" height="200" rx="8" fill="white" stroke="#E8E0D6" strokeWidth="1.25" />
        <rect x="64" y="60" width="64" height="5" rx="2.5" fill="#F58220" fillOpacity="0.5" />
        <rect x="64" y="74" width="128" height="3.5" rx="1.75" fill="#CBD5E1" />
        <rect x="64" y="84" width="120" height="3.5" rx="1.75" fill="#E2E8F0" />
        <rect x="64" y="104" width="72" height="52" rx="4" fill="#FFF3E7" stroke="#F3D6BD" strokeWidth="1" />
        <rect x="88" y="32" width="184" height="212" rx="10" fill="white" fillOpacity="0.95" stroke="#F3D6BD" strokeWidth="1.25" />
        <rect x="104" y="52" width="72" height="5" rx="2.5" fill="#F58220" fillOpacity="0.65" />
        <rect x="104" y="66" width="144" height="3.5" rx="1.75" fill="#CBD5E1" />
        <rect x="104" y="76" width="136" height="3.5" rx="1.75" fill="#E2E8F0" />
        <rect x="104" y="86" width="140" height="3.5" rx="1.75" fill="#E2E8F0" />
        <rect x="104" y="106" width="80" height="60" rx="5" fill="#FFF7EF" />
        <path
          d="M112 152 L128 128 L144 138 L160 118 L176 152 Z"
          stroke="#F58220"
          strokeWidth="1.5"
          strokeLinejoin="round"
          fill="#F58220"
          fillOpacity="0.12"
        />
      </svg>

      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg border border-gray-200/80 bg-white/90 px-2.5 py-2 shadow-sm backdrop-blur-sm">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-cb-orange/10 text-cb-orange">
          <Newspaper className="h-3.5 w-3.5" strokeWidth={1.75} />
        </span>
        <span className="text-[11px] font-semibold text-navy">Editorial guides</span>
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
      <div className="relative w-full">
        <div className="pointer-events-none absolute -right-4 top-0 h-32 w-32 rounded-full bg-cb-orange/10 blur-2xl" aria-hidden />
        <div className="relative overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200/80">
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={post.coverUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 80vw, 340px"
              priority
            />
          </div>
          <div className="border-t border-gray-100 bg-white px-3 py-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-cb-orange">{post.category}</p>
            <p className="mt-0.5 line-clamp-2 font-serif text-[13px] leading-snug text-navy">{post.title}</p>
          </div>
        </div>
        <div className="absolute -bottom-2 left-2 z-10 flex items-center gap-1.5 rounded-lg border border-gray-200/80 bg-white/95 px-2.5 py-1.5 text-[11px] font-semibold text-navy shadow-sm">
          <FileText className="h-3.5 w-3.5 text-cb-orange" strokeWidth={1.75} aria-hidden />
          Latest guide
        </div>
      </div>
    )
  }

  const positions =
    featured.length === 2
      ? (['left-[2%] top-[16%] z-10 w-[58%] -rotate-[5deg]', 'right-[0%] top-[6%] z-20 w-[60%] rotate-[4deg]'] as const)
      : (['left-[0%] top-[14%] z-10 w-[56%] -rotate-[6deg]', 'right-[0%] top-[8%] z-20 w-[58%] rotate-[5deg]', 'left-[18%] top-[2%] z-30 w-[62%] -rotate-[1deg]'] as const)

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute -right-6 top-0 h-36 w-36 rounded-full bg-cb-orange/10 blur-2xl" aria-hidden />
      <div className="pointer-events-none absolute -left-4 bottom-0 h-28 w-28 rounded-full bg-navy/[0.05] blur-2xl" aria-hidden />

      <div className="relative aspect-[4/3] w-full">
        {featured.map((post, index) => {
          const pos = positions[Math.min(index, positions.length - 1)]
          return (
            <div
              key={post.slug}
              className={`absolute ${pos} overflow-hidden rounded-lg bg-white ring-1 ring-gray-200/90 shadow-[0_12px_32px_-16px_rgba(15,31,61,0.35)]`}
            >
              <div className="relative aspect-[16/10] w-full bg-gray-100">
                <Image
                  src={post.coverUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="220px"
                  priority={index === 0}
                />
              </div>
              <div className="hidden border-t border-gray-100 bg-white px-2 py-1.5 sm:block">
                <p className="truncate text-[8px] font-semibold uppercase tracking-[0.12em] text-cb-orange">
                  {post.category}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="absolute -bottom-1 left-0 z-10 flex items-center gap-1.5 rounded-lg border border-gray-200/80 bg-white/95 px-2.5 py-1.5 shadow-sm">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-cb-orange/10 text-cb-orange">
          <Newspaper className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
        </span>
        <span className="text-[11px] font-semibold text-navy">Buying guides</span>
      </div>
    </div>
  )
}
