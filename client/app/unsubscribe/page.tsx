import type { Metadata } from 'next'
import Link from 'next/link'
import { UnsubscribePageClient } from '@/components/consent/UnsubscribePageClient'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Unsubscribe from Compare Bazaar emails',
  description:
    'Stop Compare Bazaar blog and product update emails. Enter your email to unsubscribe anytime.',
  canonical: '/unsubscribe',
  index: false,
})

type PageProps = {
  searchParams?: { email?: string | string[] }
}

function safeDecodeEmail(value: string) {
  try {
    return decodeURIComponent(value.trim())
  } catch {
    return value.trim()
  }
}

export default function UnsubscribePage({ searchParams }: PageProps) {
  const raw = searchParams?.email
  const initialEmail = Array.isArray(raw) ? raw[0] || '' : raw || ''

  return (
    <main className="min-h-[70vh] bg-gradient-to-b from-[#EEF2F8] via-white to-white px-4 py-10 sm:py-14">
      <div className="mx-auto mb-6 max-w-[480px] text-center">
        <Link href="/" className="text-sm font-semibold text-[#0B2A6F] hover:text-[#F58220]">
          ← Back to Compare Bazaar
        </Link>
      </div>
      <UnsubscribePageClient initialEmail={safeDecodeEmail(initialEmail)} />
    </main>
  )
}
