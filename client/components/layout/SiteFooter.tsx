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
    <footer className="bg-gradient-to-r from-[#F78230] via-[#F27F25] to-[#ED8105] text-white mt-16 border-t-2 border-[#FCE7D0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <p className="font-serif text-[22px] text-white mb-3 tracking-tight">
              Compare<span className="text-[#FCE7D0]">Bazaar</span>
            </p>
            <p className="text-sm leading-relaxed max-w-xs">
              Independent business software comparisons and buying guides. We help B2B
              decision-makers find the right tools without the vendor noise.
            </p>
            <p className="text-sm mt-4">
              <a href="mailto:marketing@compare-bazaar.com" className="hover:text-white transition-colors">
                marketing@compare-bazaar.com
              </a>
              <br />
              <a href="tel:+13322310404" className="hover:text-white transition-colors">
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
                  <Link href={href} className="text-sm hover:text-white transition-colors">
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
                  <Link href={href} className="text-sm hover:text-white transition-colors">
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
                  <Link href={href} className="text-sm hover:text-white transition-colors">
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
              className="text-sm hover:text-white transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div className="border-t border-white/35 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} CompareBazaar.com · All Rights Reserved</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms-of-use" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/advertising-disclosure" className="hover:text-white transition-colors">Advertising</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
