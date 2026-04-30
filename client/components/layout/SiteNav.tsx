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
      { label: 'Best Payroll Software', href: '/human-resources/best-payroll-software', description: 'Tax and compliance tools' },
      { label: 'Best VoIP Systems', href: '/technology/business-phone-systems', description: 'Cloud calling platforms' },
      { label: 'GPS Fleet Management', href: '/technology/gps-fleet-management-software', description: 'Tracking and telematics' },
      { label: 'Employee Management', href: '/human-resources/best-employee-management-software', description: 'Workforce operations' },
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
      { label: 'Best Employee Management', href: '/human-resources/best-employee-management-software', description: 'People and HR workflows' },
      { label: 'Best Payroll Software', href: '/human-resources/best-payroll-software', description: 'Payroll and benefits' },
    ],
  },
  { label: 'Blog', href: '/blog' },
]

const QUOTE_SERVICES = [
  { label: 'All Software Quotes', href: '/technology/get-free-quotes', description: 'Tell us your needs and get matched' },
  { label: 'CRM Software Quotes', href: '/marketing/best-crm-software/get-free-quote', description: 'HubSpot, Zoho, Salesforce, more' },
  { label: 'Payroll Software Quotes', href: '/human-resources/best-payroll-software/get-free-quotes', description: 'ADP, Gusto, OnPay, Rippling' },
  { label: 'Business Phone System Quotes', href: '/technology/business-phone-systems/get-free-quotes', description: 'VoIP and cloud phone platforms' },
  { label: 'GPS Fleet Quotes', href: '/technology/gps-fleet-management-software/get-free-quotes', description: 'Fleet tracking and telematics tools' },
  { label: 'Employee Management Quotes', href: '/human-resources/best-employee-management-software/get-free-quotes', description: 'HR and workforce management solutions' },
  { label: 'Email Marketing Quotes', href: '/marketing/best-email-marketing-services/get-free-quotes', description: 'Campaign and automation platforms' },
  { label: 'Website Builder Quotes', href: '/marketing/best-website-building-platform/get-free-quotes', description: 'Wix, Squarespace, Shopify and more' },
  { label: 'Sales CRM Quotes', href: '/sales/best-crm-software/get-free-quotes', description: 'Pipeline, forecasting and deal workflows' },
  { label: 'Call Center Quotes', href: '/sales/best-call-center-management-software/get-free-quotes', description: 'Contact center and agent operations tools' },
  { label: 'Project Management Quotes', href: '/sales/best-project-management-software/get-free-quotes', description: 'Asana, Monday, ClickUp, Jira' },
]

export function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [quotesOpen, setQuotesOpen] = useState(false)

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
                    <div className="w-[20rem] bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                      <p className="px-4 pt-1 pb-2 text-[11px] font-semibold tracking-wider uppercase text-[#9C4302] border-b border-gray-100">
                        {item.label} Services
                      </p>
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 hover:bg-[#FFF8F2] transition-colors border-b border-gray-50 last:border-b-0"
                        >
                          <span className="block text-sm text-gray-700 hover:text-[#9C4302]">{child.label}</span>
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
            <div
              className="relative hidden sm:block"
              onMouseEnter={() => setQuotesOpen(true)}
              onMouseLeave={() => setQuotesOpen(false)}
            >
              <Link
                href="/technology/get-free-quotes"
                className="inline-flex items-center gap-1.5 bg-brand hover:bg-brand-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                Get Free Quotes
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 9 6 6 6-6" />
                </svg>
              </Link>

              {quotesOpen && (
                <div className="absolute right-0 top-full pt-2 z-50">
                  <div className="w-[20rem] bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                    <p className="px-4 pt-1 pb-2 text-[11px] font-semibold tracking-wider uppercase text-[#9C4302] border-b border-gray-100">
                      Quote Services
                    </p>
                    {QUOTE_SERVICES.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        className="block px-4 py-2.5 hover:bg-[#FFF8F2] transition-colors border-b border-gray-50 last:border-b-0"
                      >
                        <span className="block text-sm text-gray-700 hover:text-[#9C4302]">{service.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
                  className="block px-9 py-2.5 text-sm text-gray-600 border-b border-gray-50 hover:bg-[#FFF8F2] hover:text-[#9C4302] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="block">{child.label}</span>
                </Link>
              ))}
            </div>
          ))}
          <div className="px-6 py-4">
            <Link
              href="/technology/get-free-quotes"
              className="block text-center bg-brand text-white text-sm font-semibold px-4 py-2 rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              Get Free Quotes
            </Link>
            <div className="mt-3 border border-gray-200 rounded-lg bg-white py-2">
              <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-[#9C4302] border-b border-gray-100">
                Quote Services
              </p>
              {QUOTE_SERVICES.map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-[#FFF8F2] hover:text-[#9C4302] transition-colors border-b border-gray-50 last:border-b-0"
                  onClick={() => setMobileOpen(false)}
                >
                  {service.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
