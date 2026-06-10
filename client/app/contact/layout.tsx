import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Contact Us',
  description:
    'Got a question or want to list your software? Reach out to the Compare Bazaar team and we will get back to you shortly.',
  canonical: '/contact',
  ogTitle: 'Contact Compare Bazaar',
  ogUrl: 'https://www.compare-bazaar.com/contact',
})

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
