'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { BlogTopicEntry } from '@/lib/blogCms'

type Props = {
  topics: BlogTopicEntry[]
  activeTopicSlug?: string
}

function topicLinkClass(active: boolean) {
  return [
    'inline-flex shrink-0 whitespace-nowrap border-b-2 pb-2.5 pt-1 text-[13px] font-medium transition-colors',
    active
      ? 'border-[#F58220] text-[#F58220]'
      : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-navy',
  ].join(' ')
}

function TopicLinks({
  topics,
  activeTopicSlug,
  ariaHidden = false,
}: {
  topics: BlogTopicEntry[]
  activeTopicSlug?: string
  ariaHidden?: boolean
}) {
  return (
    <>
      <Link
        href="/blog"
        className={topicLinkClass(!activeTopicSlug)}
        aria-current={!activeTopicSlug ? 'page' : undefined}
        aria-hidden={ariaHidden}
        tabIndex={ariaHidden ? -1 : undefined}
      >
        All
      </Link>
      {topics.map((topic) => {
        const active = activeTopicSlug === topic.slug
        return (
          <Link
            key={`${ariaHidden ? 'dup-' : ''}${topic.slug}`}
            href={`/blog?topic=${encodeURIComponent(topic.slug)}#blog-articles`}
            className={topicLinkClass(active)}
            aria-current={active ? 'page' : undefined}
            aria-hidden={ariaHidden}
            tabIndex={ariaHidden ? -1 : undefined}
          >
            {topic.label}
          </Link>
        )
      })}
    </>
  )
}

export function BlogTopicsMarquee({ topics, activeTopicSlug }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canScroll, setCanScroll] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setPrefersReducedMotion(mq.matches)
    updateMotion()
    mq.addEventListener('change', updateMotion)

    const track = trackRef.current
    if (!track) return () => mq.removeEventListener('change', updateMotion)

    const check = () => {
      setCanScroll(track.scrollWidth > track.clientWidth + 8)
    }
    check()

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(check) : null
    ro?.observe(track)
    window.addEventListener('resize', check)

    return () => {
      mq.removeEventListener('change', updateMotion)
      ro?.disconnect()
      window.removeEventListener('resize', check)
    }
  }, [topics.length])

  const useMarquee = canScroll && !prefersReducedMotion

  return (
    <div className="relative min-w-0 flex-1">
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-white to-transparent ${useMarquee ? '' : 'hidden'}`}
        aria-hidden
      />
      <div
        className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent ${useMarquee ? '' : 'hidden'}`}
        aria-hidden
      />

      {useMarquee ? (
        <div
          ref={trackRef}
          className="overflow-hidden pb-0.5"
          aria-label="Blog topics"
        >
          <div className="blog-topics-marquee-track flex w-max items-end gap-5 sm:gap-6">
            <div className="flex items-end gap-5 sm:gap-6" role="list">
              <TopicLinks topics={topics} activeTopicSlug={activeTopicSlug} />
            </div>
            <div className="flex items-end gap-5 sm:gap-6" aria-hidden="true">
              <TopicLinks topics={topics} activeTopicSlug={activeTopicSlug} ariaHidden />
            </div>
          </div>
        </div>
      ) : (
        <div
          ref={trackRef}
          className="flex items-end gap-5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-6 [&::-webkit-scrollbar]:hidden"
          role="list"
          aria-label="Blog topics"
        >
          <TopicLinks topics={topics} activeTopicSlug={activeTopicSlug} />
        </div>
      )}
    </div>
  )
}
