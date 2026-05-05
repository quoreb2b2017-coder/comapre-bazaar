import { Suspense } from 'react'
import { RouteContentFallback } from './RouteContentFallback'

/** Wrap each lazy page so Suspense sits directly above the component that may suspend */
export function RouteSuspense({ children }) {
  return <Suspense fallback={<RouteContentFallback />}>{children}</Suspense>
}
