import type { Metadata } from 'next'
import './globals.css'
import { SiteChrome } from '@/components/layout/SiteChrome'
import { buildOrganizationSchema, buildWebSiteSchema, SITE_URL } from '@/lib/seo'

/** Stable absolute URLs — Google avoids hashed /icon.png?xxx from app/icon file convention. */
const FAVICON_PNG = `${SITE_URL}/favicon.png`
const FAVICON_48 = `${SITE_URL}/favicon-48.png`
const FAVICON_ICO = `${SITE_URL}/favicon.ico`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Best Business Software Reviews 2026 | Compare Bazaar',
    template: '%s | Compare Bazaar',
  },
  description:
    'Compare the best CRM, payroll, HR, and marketing software. Independent expert reviews, side-by-side pricing comparisons, and ranked recommendations — updated for 2026.',
  openGraph: {
    siteName: 'Compare Bazaar',
    type: 'website',
  },
  icons: {
    icon: [
      { url: FAVICON_ICO, sizes: 'any' },
      { url: FAVICON_48, type: 'image/png', sizes: '48x48' },
      { url: FAVICON_PNG, type: 'image/png', sizes: '192x192' },
    ],
    shortcut: FAVICON_ICO,
    apple: FAVICON_PNG,
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Explicit stable favicon links for Google Search (no cache-busting query strings) */}
        <link rel="icon" href={FAVICON_ICO} sizes="any" />
        <link rel="icon" href={FAVICON_48} type="image/png" sizes="48x48" />
        <link rel="icon" href={FAVICON_PNG} type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href={FAVICON_PNG} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebSiteSchema()) }}
        />
      </head>
      <body className="flex flex-col min-h-screen overflow-x-hidden">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}
