import Link from 'next/link'

export function DisclosureBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 py-2.5 px-4 text-center text-xs text-amber-800">
      <strong>Advertising disclosure:</strong> Compare Bazaar earns commissions from affiliate
      links. Sponsored placements are clearly marked. Our rankings are editorially independent.{' '}
      <Link href="/advertising-disclosure" className="underline font-medium hover:text-amber-900">
        Learn more
      </Link>
    </div>
  )
}
