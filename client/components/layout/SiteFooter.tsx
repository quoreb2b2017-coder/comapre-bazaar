import Link from 'next/link'

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
  { label: 'Whitepaper', href: '/resources/whitepaper' },
  { label: 'Editorial Process', href: '/editorial-process' },
  { label: 'Advertising Disclosure', href: '/advertising-disclosure' },
  { label: 'Start a Business', href: '/start-a-business' },
  { label: 'Business Planning', href: '/business-planning' },
]

const LEGAL = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Use', href: '/terms-of-use' },
  { label: 'Accessibility', href: '/accessibility' },
  { label: 'Do Not Sell My Info', href: '/do-not-sell' },
  { label: 'Limit the Use', href: '/limit-the-use' },
  { label: 'Copyright Policy', href: '/copyright-policy' },
]

export function SiteFooter() {
  return (
    <footer className="bg-[#0B2A6F] text-white mt-16 border-t-2 border-[#081F52] w-full self-stretch">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 mb-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <p className="font-serif text-[22px] text-white mb-3 tracking-tight">
              Compare<span className="text-[#F58220]">Bazaar</span>
            </p>
            <p className="text-sm text-white/90 leading-relaxed max-w-xs">
              Independent business software comparisons and buying guides. We help B2B
              decision-makers find the right tools without the vendor noise.
            </p>
            <p className="text-sm text-white/90 mt-4">
              <a href="mailto:marketing@compare-bazaar.com" className="hover:text-[#FFE9CF] transition-colors whitespace-nowrap">
                marketing@compare-bazaar.com
              </a>
            </p>
            <p className="text-sm text-white/90 mt-3 max-w-xs">
              539 W. Commerce St #2577
              <br />
              Dallas, TX 75208
            </p>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-widest text-[#F58220] mb-4">
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
            <h5 className="text-xs font-semibold uppercase tracking-widest text-[#F58220] mb-4">
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
            <h5 className="text-xs font-semibold uppercase tracking-widest text-[#F58220] mb-4">
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
            <h5 className="text-xs font-semibold uppercase tracking-widest text-[#F58220] mb-4">
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

        <div className="border-t border-white/35 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-white/90">
          <p className="text-left">© {new Date().getFullYear()} CompareBazaar.com · All Rights Reserved</p>
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
