'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import type { Product } from '@/types'
import { cn } from '@/lib/utils'
import { getVendorLogoSources, isRemoteIconUrl } from '@/lib/vendorLogo'

type ProductLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'table'

const SIZE: Record<
  ProductLogoSize,
  { box: string; text: string; px: number; padding: string }
> = {
  xs: { box: 'h-7 w-7', text: 'text-[9px]', px: 28, padding: 'p-1' },
  sm: { box: 'h-9 w-9', text: 'text-[10px]', px: 36, padding: 'p-1' },
  md: { box: 'h-12 w-12', text: 'text-xs', px: 48, padding: 'p-1.5' },
  lg: { box: 'h-14 w-14', text: 'text-sm', px: 56, padding: 'p-1.5' },
  xl: { box: 'h-16 w-16', text: 'text-base', px: 64, padding: 'p-2' },
  table: { box: 'h-10 w-10', text: 'text-[11px]', px: 40, padding: 'p-1' },
}

type ProductLogoProps = {
  product: Pick<Product, 'id' | 'name' | 'logo' | 'vendorUrl' | 'logoUrl'>
  size?: ProductLogoSize
  className?: string
  highlighted?: boolean
  /** For navy compare table headers */
  onDark?: boolean
  /** Minimal styling on dark hero backgrounds */
  flat?: boolean
}

export function ProductLogo({
  product,
  size = 'md',
  className,
  highlighted = false,
  onDark = false,
  flat = false,
}: ProductLogoProps) {
  const sources = useMemo(() => getVendorLogoSources(product), [product])
  const [sourceIndex, setSourceIndex] = useState(0)
  const spec = SIZE[size]
  const showInitials = sourceIndex >= sources.length || sources.length === 0
  const src = sources[sourceIndex]

  const boxClass = cn(
    'relative shrink-0 overflow-hidden',
    spec.box,
    flat
      ? 'rounded-md border border-white/20 bg-white/90 shadow-none'
      : cn(
          'rounded-xl border shadow-sm',
          onDark
            ? 'border-white/25 bg-white'
            : highlighted
              ? 'border-cb-orange/25 bg-gradient-to-br from-white to-cb-orange/[0.06]'
              : 'border-gray-200/90 bg-white'
        ),
    className
  )

  if (showInitials) {
    return (
      <div
        className={cn(
          boxClass,
          'flex items-center justify-center font-bold text-navy',
          spec.text,
          onDark && 'text-navy'
        )}
        aria-label={`${product.name} logo`}
      >
        {product.logo}
      </div>
    )
  }

  return (
    <div className={boxClass} aria-label={`${product.name} logo`}>
      <Image
        src={src}
        alt=""
        width={spec.px}
        height={spec.px}
        unoptimized={isRemoteIconUrl(src)}
        className={cn('h-full w-full object-contain', spec.padding)}
        onError={() => setSourceIndex((index) => index + 1)}
      />
    </div>
  )
}
