'use client'

import Image from 'next/image'
import { useCallback, useState } from 'react'
import { pickTopicCoverUrl, type BlogCoverInput } from '@/lib/blogTopicCovers'

type Props = {
  src: string
  alt: string
  coverInput: BlogCoverInput
  className?: string
  fill?: boolean
  priority?: boolean
  sizes?: string
}

export function BlogCoverImage({ src, alt, coverInput, className, fill = true, priority, sizes }: Props) {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [attempt, setAttempt] = useState(0)

  const handleError = useCallback(() => {
    if (attempt >= 2) return
    const next =
      attempt === 0
        ? pickTopicCoverUrl(coverInput)
        : pickTopicCoverUrl({ ...coverInput, slug: `${coverInput.slug}-retry-${attempt}` })
    if (next && next !== currentSrc) {
      setCurrentSrc(next)
      setAttempt((n) => n + 1)
    }
  }, [attempt, coverInput, currentSrc])

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill={fill}
      priority={priority}
      sizes={sizes}
      className={className}
      onError={handleError}
    />
  )
}
