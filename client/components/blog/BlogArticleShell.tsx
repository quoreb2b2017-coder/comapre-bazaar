'use client'

import type { ReactNode } from 'react'
import { BlogQuoteProvider } from '@/components/blog/BlogQuoteProvider'

type Props = {
  slug: string
  topic?: string
  tags?: string[]
  title?: string
  children: ReactNode
}

/** Client wrapper: topic-matched quote popup + context for checklist CTAs. */
export function BlogArticleShell({ slug, topic, tags, title, children }: Props) {
  return (
    <BlogQuoteProvider slug={slug} topic={topic} tags={tags} title={title}>
      {children}
    </BlogQuoteProvider>
  )
}
