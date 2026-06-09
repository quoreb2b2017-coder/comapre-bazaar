import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Browse All Software Categories',
  description:
    'Browse every software category on Compare Bazaar. From CRM and payroll to fleet tracking and email marketing, expert reviews in one place.',
  canonical: '/browse-all-software',
})

export default function BrowseAllSoftwareLayout({ children }: { children: React.ReactNode }) {
  return children
}
