import { cn } from '@/lib/utils'
import { isWhitelistedVendor } from '@/lib/activeFullReviews'

type Props = {
  reviewSlug: string
  reviewName: string
  vendorUrl: string
  className?: string
}

/** Outbound vendor link — active only for whitelisted vendors (ADP, Deel, etc.). */
export function ReviewVendorVisitButton({ reviewSlug, reviewName, vendorUrl, className }: Props) {
  const active = isWhitelistedVendor(reviewSlug, reviewName)
  const label = `Visit ${reviewName.split(' ')[0]}`

  if (active && vendorUrl) {
    return (
      <a
        href={vendorUrl}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className={cn(
          'bg-brand hover:bg-brand-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors',
          className
        )}
      >
        {label}
      </a>
    )
  }

  return (
    <span
      className={cn(
        'inline-block cursor-not-allowed select-none rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white opacity-50',
        className
      )}
      aria-disabled="true"
      title="Official vendor link coming soon"
    >
      {label}
    </span>
  )
}
