import Link from 'next/link'
import { cn } from '@/lib/utils'
import { fullReviewHref } from '@/lib/activeFullReviews'

type Props = {
  reviewSlug: string
  productName?: string
  className?: string
  linkClassName?: string
  label?: string
}

/** Always links to the editorial review page. */
export function FullReviewLink({
  reviewSlug,
  productName,
  className,
  linkClassName,
  label = 'Full Review',
}: Props) {
  return (
    <Link
      href={fullReviewHref(reviewSlug)}
      prefetch
      className={cn(linkClassName, className)}
      aria-label={`Read full ${productName || 'product'} review`}
    >
      {label}
    </Link>
  )
}
