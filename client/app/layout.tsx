import type { Metadata } from 'next'
import './globals.css'
import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { DisclosureBanner } from '@/components/layout/DisclosureBanner'
import { RouteLoadingIndicator } from '@/components/layout/RouteLoadingIndicator'
import ArrowNavigation from '@/components/ArrowNavigation'
import { CompareBazaarChat } from '@/components/chatbot/CompareBazaarChat'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildOrganizationSchema, buildWebSiteSchema } from '@/lib/seo'
import logoIcon from '@/components/icon.png'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.compare-bazaar.com'),
  title: {
    default: 'Best Business Software Comparisons & Reviews 2026 | Compare Bazaar',
    template: '%s | Compare Bazaar',
  },
  description:
    'Compare the best CRM, payroll, email marketing, and HR software for your business. Independent reviews, side-by-side pricing comparisons, and expert recommendations — updated for 2026.',
  openGraph: {
    siteName: 'Compare Bazaar',
    type: 'website',
  },
  icons: {
    icon: [{ url: logoIcon.src }],
    shortcut: [{ url: logoIcon.src }],
    apple: [{ url: logoIcon.src }],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <JsonLd schema={buildOrganizationSchema()} />
        <JsonLd schema={buildWebSiteSchema()} />
      </head>
      <body className="flex flex-col min-h-screen overflow-x-hidden">
        <RouteLoadingIndicator />
        <DisclosureBanner />
        <SiteNav />
        <main className="flex-1">{children}</main>
        <ArrowNavigation />
        <CompareBazaarChat />
        <SiteFooter />
      </body>
    </html>
  )
}
