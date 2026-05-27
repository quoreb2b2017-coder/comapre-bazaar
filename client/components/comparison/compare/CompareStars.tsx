import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function formatReviewCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return String(count)
}

export function CompareStars({
  score,
  size = 'md',
  className,
}: {
  score: string
  size?: 'sm' | 'md'
  className?: string
}) {
  const numeric = Number(score) || 0
  const fullStars = Math.max(0, Math.min(5, Math.round(numeric)))
  const starClass = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            starClass,
            i < fullStars ? 'fill-cb-orange text-cb-orange' : 'text-gray-300'
          )}
          strokeWidth={1.8}
        />
      ))}
    </div>
  )
}

export function CompareScoreLine({
  score,
  reviewCount,
}: {
  score: string
  reviewCount: number
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CompareStars score={score} />
      <span className="text-sm text-gray-600">
        {score}/5 · {formatReviewCount(reviewCount)} reviews
      </span>
    </div>
  )
}
