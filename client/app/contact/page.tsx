import type { Metadata } from 'next'
import { ContactFaqSection } from '@/components/contact/ContactFaqSection'
import { buildMetadata, SITE_URL } from '@/lib/seo'
import { ContactPageClient } from './ContactPageClient'

export const metadata: Metadata = buildMetadata({
  title: 'Contact Us',
  description:
    'Got a question or want to list your software? Reach out to the Compare Bazaar team and we will get back to you shortly.',
  canonical: '/contact',
  openGraphType: 'website',
  ogTitle: 'Contact Compare Bazaar',
  ogUrl: `${SITE_URL}/contact`,
})

export default function ContactPage() {
  return (
    <>
      <ContactPageClient />
      <ContactFaqSection />
    </>
  )
}
