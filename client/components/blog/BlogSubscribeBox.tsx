'use client'

import { NewsletterSubscribeForm } from '@/components/ui/NewsletterSubscribeForm'

type Props = {
  slug: string
  compact?: boolean
  variant?: 'default' | 'editorial'
}

export function BlogSubscribeBox({ slug, compact = false, variant = 'default' }: Props) {
  return <NewsletterSubscribeForm sourceSlug={slug} compact={compact} variant={variant} />
}
