"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

const categories = [
  {
    title: "Marketing Software",
    description: "CRM, email marketing, and website builder tools.",
    links: [
      { label: "Best CRM Software", href: "/marketing/best-crm-software" },
      { label: "Best Email Marketing Services", href: "/marketing/best-email-marketing-services" },
      { label: "Best Website Building Platform", href: "/marketing/best-website-building-platform" },
    ],
  },
  {
    title: "Technology Software",
    description: "Payroll, VoIP, GPS fleet, and employee management platforms.",
    links: [
      { label: "Best Payroll System", href: "/technology/best-payroll-system" },
      { label: "Business Phone Systems", href: "/technology/business-phone-systems" },
      { label: "GPS Fleet Management Software", href: "/technology/gps-fleet-management-software" },
      { label: "Best Employee Management Software", href: "/technology/best-employee-management-software" },
    ],
  },
  {
    title: "Sales Software",
    description: "CRM, call center, and project management solutions.",
    links: [
      { label: "Best CRM Software", href: "/sales/best-crm-software" },
      { label: "Best Call Center Management Software", href: "/sales/best-call-center-management-software" },
      { label: "Best Project Management Software", href: "/sales/best-project-management-software" },
    ],
  },
]

export default function BrowseAllSoftwarePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fff8ef] via-white to-white px-4 py-10 sm:py-14">
      <div className="max-w-6xl mx-auto">
        <section className="rounded-3xl overflow-hidden border border-[#f2ddc8] bg-white shadow-sm">
          <div className="px-6 sm:px-10 py-10 bg-gradient-to-r from-[#F78230] via-[#EB7A23] to-[#D96A08] text-white">
            <p className="text-xs uppercase tracking-[0.16em] text-white/75 mb-2">Software Directory</p>
            <h1 className="text-3xl sm:text-4xl font-semibold leading-tight">Browse all software categories</h1>
            <p className="mt-3 text-white/90 max-w-3xl">
              Explore curated software comparisons by category and jump directly to the right tools for your business.
            </p>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
            {categories.map((category) => (
              <div key={category.title} className="rounded-2xl border border-[#efd8c2] bg-[#fffaf5] p-5">
                <h2 className="text-lg font-semibold text-gray-900">{category.title}</h2>
                <p className="text-sm text-gray-600 mt-1 mb-4">{category.description}</p>
                <div className="space-y-2.5">
                  {category.links.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group flex items-center justify-between rounded-lg border border-[#f3e3d3] bg-white px-3 py-2 text-sm text-gray-700 hover:text-[#9C4302] hover:border-[#e8c6a8] transition-colors"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
