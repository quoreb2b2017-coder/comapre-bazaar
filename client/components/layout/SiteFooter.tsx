'use client'

import Link from 'next/link'
import { CookiePreferencesTrigger } from '@/components/consent/CookiePreferencesTrigger'
import { NewsletterSubscribeForm } from '@/components/ui/NewsletterSubscribeForm'
import { FACEBOOK_PAGE_URL, LINKEDIN_COMPANY_URL } from '@/lib/seo'

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0z" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05v-2.66c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.09 24 18.1 24 12.07z" />
    </svg>
  )
}

const CATEGORIES = [
  { label: 'All Software Quotes', href: '/technology/get-free-quotes' },
  { label: 'Marketing Hub', href: '/marketing' },
  { label: 'Technology Hub', href: '/technology' },
  { label: 'Sales Hub', href: '/sales' },
  { label: 'HR Software Hub', href: '/human-resources' },
]

const COMPANY = [
  { label: 'About Us', href: '/about' },
  { label: 'Editorial Process', href: '/editorial-process' },
  { label: 'Advertising Disclosure', href: '/advertising-disclosure' },
  { label: 'Contact', href: '/contact' },
  { label: 'Careers', href: '/contact-us/careers' },
  { label: 'Advertise With Us', href: '/advertise' },
]

const RESOURCES = [
  { label: 'Resources Hub', href: '/resources' },
  { label: 'Our Blogs', href: '/blog' },
  { label: 'Whitepaper', href: '/resources/whitepapers' },
  { label: 'Editorial Process', href: '/editorial-process' },
  { label: 'Advertising Disclosure', href: '/advertising-disclosure' },
  { label: 'Start a Business', href: '/start-a-business' },
  { label: 'Business Planning', href: '/business-planning' },
]

const LEGAL = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Use', href: '/terms-of-use' },
  { label: 'Accessibility', href: '/accessibility' },
  { label: 'California – Do Not Sell My Info', href: '/do-not-sell' },
  { label: 'Limit the Use', href: '/limit-the-use' },
  { label: 'Copyright Policy', href: '/copyright-policy' },
]

export function SiteFooter({ className = '' }: { className?: string }) {
  return (
    <footer
      className={`bg-[#0B2A6F] text-white mt-8 border-t-2 border-[#081F52] w-full self-stretch ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-10">
        <div className="mb-10 grid grid-cols-2 items-start gap-8 sm:gap-10 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <p className="mb-4 text-xs font-semibold uppercase leading-none tracking-widest text-white">
              Compare<span className="text-[#F58220]">Bazaar</span>
            </p>
            <p className="text-sm text-white/90 leading-relaxed max-w-xs">
              Independent business software comparisons and buying guides. We help B2B
              decision-makers find the right tools without the vendor noise.
            </p>
            <p className="text-sm text-white/90 mt-4">
              <Link href="/contact" className="hover:text-[#FFE9CF] transition-colors whitespace-nowrap">
                Contact Support
              </Link>
            </p>
            <p className="text-sm text-white/90 mt-3 max-w-xs">
              539 W. Commerce St #2577
              <br />
              Dallas, TX 75208
            </p>
            <NewsletterSubscribeForm sourceSlug="footer" variant="footer" />
          </div>

          {/* Categories */}
          <div>
            <h5 className="mb-4 text-xs font-semibold uppercase leading-none tracking-widest text-[#F58220]">
              Software Categories
            </h5>
            <ul className="space-y-2">
              {CATEGORIES.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/90 hover:text-[#FFE9CF] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5 className="mb-4 text-xs font-semibold uppercase leading-none tracking-widest text-[#F58220]">
              Company
            </h5>
            <ul className="space-y-2">
              {COMPANY.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/90 hover:text-[#FFE9CF] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h5 className="mb-4 text-xs font-semibold uppercase leading-none tracking-widest text-[#F58220]">
              Resources
            </h5>
            <ul className="space-y-2">
              {RESOURCES.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/90 hover:text-[#FFE9CF] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="mb-4 text-xs font-semibold uppercase leading-none tracking-widest text-[#F58220]">
              Legal
            </h5>
            <ul className="space-y-2">
              {LEGAL.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/90 hover:text-[#FFE9CF] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <h5 className="text-xs font-semibold uppercase tracking-widest text-white mt-6 mb-4">
              Follow Us
            </h5>
            <div className="flex flex-col gap-2.5">
              <a
                href={LINKEDIN_COMPANY_URL}
                rel="noopener noreferrer"
                target="_blank"
                className="inline-flex items-center gap-2.5 text-sm text-white/90 transition-colors hover:text-[#FFE9CF]"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                  <LinkedInIcon className="h-3.5 w-3.5" />
                </span>
                LinkedIn
              </a>
              <a
                href={FACEBOOK_PAGE_URL}
                rel="noopener noreferrer"
                target="_blank"
                className="inline-flex items-center gap-2.5 text-sm text-white/90 transition-colors hover:text-[#FFE9CF]"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                  <FacebookIcon className="h-3.5 w-3.5" />
                </span>
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/35 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-white/90">
          <p className="text-left">© {new Date().getFullYear()} CompareBazaar.com · All Rights Reserved</p>
          <div className="flex flex-wrap gap-4 items-center">
            <Link href="/privacy-policy" className="hover:text-[#FFE9CF] transition-colors">Privacy</Link>
            <Link href="/terms-of-use" className="hover:text-[#FFE9CF] transition-colors">Terms</Link>
            <Link href="/advertising-disclosure" className="hover:text-[#FFE9CF] transition-colors">Advertising</Link>
            <CookiePreferencesTrigger className="text-white/90 hover:text-[#FFE9CF] transition-colors text-xs bg-transparent border-0 p-0 cursor-pointer font-inherit" />
          </div>
        </div>
      </div>
    </footer>
  )
}
