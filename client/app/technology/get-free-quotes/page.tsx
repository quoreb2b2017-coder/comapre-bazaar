"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react"

const quoteGroups = [
  {
    title: "Marketing",
    services: [
      { label: "CRM Software Quotes", href: "/marketing/best-crm-software/get-free-quote" },
      { label: "Email Marketing Quotes", href: "/marketing/best-email-marketing-services/get-free-quotes" },
      { label: "Website Builder Quotes", href: "/marketing/best-website-building-platform/get-free-quotes" },
    ],
  },
  {
    title: "Technology",
    services: [
      { label: "Payroll Software Quotes", href: "/technology/best-payroll-system/get-free-quotes" },
      { label: "Business Phone System Quotes", href: "/technology/business-phone-systems/get-free-quotes" },
      { label: "GPS Fleet Management Quotes", href: "/technology/gps-fleet-management-software/get-free-quotes" },
      { label: "Employee Management Quotes", href: "/technology/best-employee-management-software/get-free-quotes" },
    ],
  },
  {
    title: "Sales",
    services: [
      { label: "Sales CRM Quotes", href: "/sales/best-crm-software/get-free-quotes" },
      { label: "Call Center Quotes", href: "/sales/best-call-center-management-software/get-free-quotes" },
      { label: "Project Management Quotes", href: "/sales/best-project-management-software/get-free-quotes" },
    ],
  },
]

export default function TechnologyGetFreeQuotesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fff8ef] via-white to-white px-4 py-10 sm:py-14">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-3xl border border-[#f2ddc8] overflow-hidden bg-white shadow-sm">
          <section className="relative px-6 sm:px-10 py-10 sm:py-12 bg-gradient-to-r from-[#F78230] via-[#EB7A23] to-[#D96A08] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_5%,rgba(255,255,255,0.22),transparent_55%)]" />
            <div className="relative">
              <p className="text-xs tracking-[0.16em] uppercase text-white/80 mb-2">Get Free Quotes</p>
              <h1 className="text-3xl sm:text-4xl font-semibold leading-tight max-w-3xl">
                Compare all software categories and get expert-matched quotes
              </h1>
              <p className="mt-3 text-white/90 max-w-3xl">
                Access dedicated quote forms for Marketing, Technology, and Sales tools from one place.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-white/20 border border-white/35">No commitment</span>
                <span className="px-3 py-1 rounded-full bg-white/20 border border-white/35">Fast matching</span>
                <span className="px-3 py-1 rounded-full bg-white/20 border border-white/35">Independent guidance</span>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr]">
            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose any quote form</h2>
              <div className="space-y-6">
                {quoteGroups.map((group) => (
                  <div key={group.title}>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9C4302] mb-3">{group.title}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {group.services.map((service) => (
                        <Link
                          key={service.href}
                          href={service.href}
                          className="group rounded-2xl border border-[#efd8c2] bg-[#fffaf5] hover:bg-white hover:border-[#e8c6a8] p-5 transition-all hover:shadow-sm"
                        >
                          <p className="text-sm font-semibold text-gray-900">{service.label}</p>
                          <p className="mt-2 text-xs text-[#9C4302] inline-flex items-center gap-1.5">
                            Open form <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="border-t lg:border-t-0 lg:border-l border-[#f1dcc8] bg-[#fffaf5] p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Why use Compare Bazaar?</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-[#c35b0a]" /> One form, multiple vendor matches.</p>
                <p className="flex items-start gap-2"><Sparkles className="w-4 h-4 mt-0.5 text-[#c35b0a]" /> Personalized shortlist by your goals.</p>
                <p className="flex items-start gap-2"><ShieldCheck className="w-4 h-4 mt-0.5 text-[#c35b0a]" /> Secure and privacy-first process.</p>
              </div>
              <Link
                href="/browse-all-software"
                className="mt-6 inline-flex items-center text-sm font-semibold text-[#9C4302] hover:text-[#7a3300]"
              >
                Browse all software <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </aside>
          </section>
        </div>
      </div>
    </main>
  )
}
