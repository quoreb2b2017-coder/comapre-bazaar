'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import logoIcon from '../icon.png'

const NAV_ITEMS = [
  {
    label: 'Marketing',
    href: '/marketing',
    children: [
      { label: 'Best CRM Software', href: '/marketing/best-crm-software', description: 'Sales and pipeline tools' },
      { label: 'Best Email Marketing', href: '/marketing/best-email-marketing-services', description: 'Automation and campaigns' },
      { label: 'Best Website Builders', href: '/marketing/best-website-building-platform', description: 'Sites and landing pages' },
    ],
  },
  {
    label: 'Technology',
    href: '/technology',
    children: [
      { label: 'Best Payroll Software', href: '/technology/best-payroll-system', description: 'Tax and compliance tools' },
      { label: 'Best VoIP Systems', href: '/technology/business-phone-systems', description: 'Cloud calling platforms' },
      { label: 'GPS Fleet Management', href: '/technology/gps-fleet-management-software', description: 'Tracking and telematics' },
      { label: 'Employee Management', href: '/technology/best-employee-management-software', description: 'Workforce operations' },
    ],
  },
  {
    label: 'Sales',
    href: '/sales',
    children: [
      { label: 'Best Sales CRM', href: '/sales/best-crm-software', description: 'Lead and deal workflows' },
      { label: 'Call Centre Software', href: '/sales/best-call-center-management-software', description: 'Customer support systems' },
      { label: 'Project Management', href: '/sales/best-project-management-software', description: 'Planning and collaboration' },
    ],
  },
  {
    label: 'HR Software',
    href: '/human-resources',
    children: [
      { label: 'Best Employee Management', href: '/technology/best-employee-management-software', description: 'People and HR workflows' },
      { label: 'Best Payroll Software', href: '/technology/best-payroll-system', description: 'Payroll and benefits' },
    ],
  },
  { label: 'Blog', href: '/blog' },
]

export function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="inline-flex items-center gap-0.5 font-serif text-[24px] text-navy tracking-tight"
            aria-label="Compare Bazaar — Home"
          >
            <Image
              src={logoIcon}
              alt="Compare Bazaar icon"
              width={60}
              height={60}
              className="h-16 w-16 object-contain"
              priority
            />
            <span>
              Compare<span className="ml-0.5 text-[#F27F25]">Bazaar</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-6 list-none" role="list">
            {NAV_ITEMS.map((item) => (
              <li
                key={item.href}
                className="relative group"
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <div
                  className="text-sm font-medium text-gray-600 hover:text-navy transition-colors py-2 inline-flex items-center gap-1"
                >
                  <Link href={item.href} className="hover:text-navy transition-colors">{item.label}</Link>
                  {item.children && (
                    <svg className="w-3.5 h-3.5 text-[#F27F25]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 9 6 6 6-6" />
                    </svg>
                  )}
                </div>

                {item.children && openDropdown === item.label && (
                  <div className="absolute top-full left-0 pt-2 z-50">
                    <div className="w-[18rem] bg-white/95 backdrop-blur border border-gray-200 rounded-xl shadow-xl py-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 hover:bg-[#fff4eb] transition-colors border-l-2 border-transparent hover:border-[#F27F25]"
                        >
                          <span className="block text-sm font-medium text-gray-700">{child.label}</span>
                          {child.description && <span className="block text-xs text-gray-500 mt-0.5">{child.description}</span>}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/get-free-quotes"
              className="hidden sm:inline-flex items-center bg-brand hover:bg-brand-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Get Free Quotes
            </Link>
            {/* Mobile burger */}
            <button
              className="md:hidden p-2 text-gray-600"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          {NAV_ITEMS.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className="block px-6 py-3 text-sm font-semibold text-navy border-b border-gray-100"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
              {item.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="block px-9 py-2.5 text-sm text-gray-600 border-b border-gray-50"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="block">{child.label}</span>
                  {child.description && <span className="block text-xs text-gray-400 mt-0.5">{child.description}</span>}
                </Link>
              ))}
            </div>
          ))}
          <div className="px-6 py-4">
            <Link
              href="/get-free-quotes"
              className="block text-center bg-brand text-white text-sm font-semibold px-4 py-2 rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              Get Free Quotes
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
