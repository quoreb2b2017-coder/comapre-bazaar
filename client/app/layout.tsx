import type { Metadata } from 'next'
import './globals.css'
import { SiteChrome } from '@/components/layout/SiteChrome'
import { GA_MEASUREMENT_ID } from '@/lib/googleAnalytics'
import { buildOrganizationSchema, buildWebSiteSchema, SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Best Business Software Reviews 2026 | Compare Bazaar',
    template: '%s | Compare Bazaar',
  },
  description:
    'Independent reviews, side by side pricing, and ranked picks across CRM, payroll, HR, email marketing, and more. Trusted by 80,000 business buyers.',
  openGraph: {
    siteName: 'Compare Bazaar',
    type: 'website',
  },
  // Google Search favicon: square PNG multiples of 48px + real /favicon.ico (not a PNG rewrite).
  icons: {
    icon: [
      { url: '/favicon-48.png', type: 'image/png', sizes: '48x48' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-96.png', type: 'image/png', sizes: '96x96' },
      { url: '/favicon.png', type: 'image/png', sizes: '192x192' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
        {GA_MEASUREMENT_ID ? (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('consent', 'default', {
                    'analytics_storage': 'denied',
                    'ad_storage': 'denied',
                    'ad_user_data': 'denied',
                    'ad_personalization': 'denied',
                    'wait_for_update': 500
                  });
                  gtag('config', '${GA_MEASUREMENT_ID}');
                `,
              }}
            />
          </>
        ) : null}
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
