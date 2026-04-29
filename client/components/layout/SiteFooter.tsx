import Link from 'next/link'

const CATEGORIES = [
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
  { label: 'Blog', href: '/blog' },
]

const LEGAL = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Use', href: '/terms-of-use' },
  { label: 'Accessibility', href: '/accessibility' },
  { label: 'Do Not Sell My Info', href: '/do-not-sell' },
]

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#FFB161] via-[#F58220] to-[#CB5C00] text-white mt-16 border-t-2 border-[#FCE7D0]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_15%,rgba(255,236,212,0.18),transparent_54%)]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_70%,rgba(255,192,126,0.25),transparent_60%)]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_45%,rgba(123,44,0,0.16)_100%)]" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <p className="font-serif text-[22px] text-white mb-3 tracking-tight">
              Compare<span className="text-[#FCE7D0]">Bazaar</span>
            </p>
            <p className="text-sm text-white/90 leading-relaxed max-w-xs">
              Independent business software comparisons and buying guides. We help B2B
              decision-makers find the right tools without the vendor noise.
            </p>
            <p className="text-sm text-white/90 mt-4">
              <a href="mailto:marketing@compare-bazaar.com" className="hover:text-[#FFE9CF] transition-colors">
                marketing@compare-bazaar.com
              </a>
              <br />
              <a href="tel:+13322310404" className="hover:text-[#FFE9CF] transition-colors">
                +1 332-231-0404
              </a>
            </p>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">
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
            <h5 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">
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

          {/* Legal */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">
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
            <a
              href="https://www.linkedin.com/company/comparebazaar/"
              rel="noopener noreferrer"
              target="_blank"
              className="text-sm text-white/90 hover:text-[#FFE9CF] transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div className="border-t border-white/35 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/90">
          <p>© {new Date().getFullYear()} CompareBazaar.com · All Rights Reserved</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy-policy" className="hover:text-[#FFE9CF] transition-colors">Privacy</Link>
            <Link href="/terms-of-use" className="hover:text-[#FFE9CF] transition-colors">Terms</Link>
            <Link href="/advertising-disclosure" className="hover:text-[#FFE9CF] transition-colors">Advertising</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
