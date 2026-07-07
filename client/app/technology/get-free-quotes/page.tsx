export const revalidate = 3600
import type { Metadata } from 'next'
import Link from "next/link"
import { ArrowRight, CheckCircle2, Clock3, ShieldCheck, Sparkles } from "lucide-react"
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Get Free Software Quotes',
  description:
    'Get matched with top software providers across marketing, technology, sales, and HR categories. Compare free quotes in one place.',
  canonical: '/technology/get-free-quotes',
})

const quoteGroups = [
  {
    title: "Marketing",
    services: [
      { label: "CRM Software Quotes", href: "/marketing/best-crm-software/get-free-quotes", desc: "Pipeline, automation & integrations" },
      { label: "Email Marketing Quotes", href: "/marketing/best-email-marketing-services/get-free-quotes", desc: "Campaigns, deliverability & lists" },
      { label: "Website Builder Quotes", href: "/marketing/best-website-building-platform/get-free-quotes", desc: "Templates, hosting & commerce" },
    ],
  },
  {
    title: "Technology & HR",
    services: [
      { label: "Payroll Software Quotes", href: "/human-resources/best-payroll-software/get-free-quotes", desc: "Pay runs, tax & compliance" },
      { label: "Business Phone System Quotes", href: "/technology/business-phone-systems/get-free-quotes", desc: "VoIP, UCaaS & desk phones" },
      { label: "GPS Fleet Management Quotes", href: "/technology/gps-fleet-management-software/get-free-quotes", desc: "Tracking, routing & ELD" },
      { label: "Employee Management Quotes", href: "/human-resources/best-employee-management-software/get-free-quotes", desc: "HRIS, scheduling & onboarding" },
    ],
  },
  {
    title: "Sales",
    services: [
      { label: "Sales CRM Quotes", href: "/sales/best-crm-software/get-free-quotes", desc: "Deals, forecasting & outreach" },
      { label: "Call Center Quotes", href: "/sales/best-call-center-management-software/get-free-quotes", desc: "Queues, IVR & agent tools" },
      { label: "Project Management Quotes", href: "/sales/best-project-management-software/get-free-quotes", desc: "Tasks, timelines & collaboration" },
    ],
  },
]

const trustPoints = [
  { icon: CheckCircle2, text: "One form, multiple vendor matches" },
  { icon: Sparkles, text: "Shortlists aligned to your goals" },
  { icon: ShieldCheck, text: "Secure, privacy-first process" },
  { icon: Clock3, text: "Most buyers hear back within 24 hours" },
]

export default function TechnologyGetFreeQuotesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#eef3fb] via-white to-[#fffaf5]">
      <div className="border-b border-[#c5d4ee] bg-gradient-to-r from-[#eef3fb] to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#0B2A6F]">Home</Link>
          <span className="mx-2 text-gray-300">›</span>
          <span className="text-[#0B2A6F] font-semibold">Get Free Quotes</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="rounded-3xl border border-[#c5d4ee] overflow-hidden bg-white shadow-[0_28px_56px_-32px_rgba(11,42,111,0.22)]">
          <section className="relative px-6 sm:px-10 py-10 sm:py-14 bg-gradient-to-br from-[#0B2A6F] via-[#0f3480] to-[#1549a8] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_90%_0%,rgba(245,130,32,0.22),transparent_55%)]" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F58220] to-[#ffb366]" />
            <div className="relative max-w-3xl">
              <p className="inline-flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase font-bold text-white/85 mb-3 px-3 py-1 rounded-full border border-white/25 bg-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F58220]" />
                Compare Bazaar Quotes
              </p>
              <h1 className="font-serif text-3xl sm:text-[2.65rem] font-bold leading-tight tracking-tight">
                Compare software categories and get expert-matched quotes
              </h1>
              <p className="mt-4 text-white/88 text-base sm:text-lg leading-relaxed">
                Access dedicated quote forms for Marketing, Technology, Sales, and HR tools — each built around our independent reviews.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
                {["No commitment", "Fast matching", "Independent guidance"].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 rounded-full bg-white/12 border border-white/30 backdrop-blur-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr]">
            <div className="p-6 sm:p-9">
              <h2 className="font-serif text-2xl font-bold text-[#0B2A6F] mb-1">Choose a quote form</h2>
              <p className="text-sm text-gray-500 mb-6">Pick your category — each form takes about two minutes.</p>
              <div className="space-y-8">
                {quoteGroups.map((group) => (
                  <div key={group.title}>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0B2A6F] mb-3 flex items-center gap-2">
                      <span className="w-4 h-0.5 rounded-full bg-[#F58220]" />
                      {group.title}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {group.services.map((service) => (
                        <Link
                          key={service.href}
                          href={service.href}
                          className="group rounded-2xl border border-[#d8e2f2] bg-gradient-to-br from-white to-[#f8fafc] hover:border-[#0B2A6F]/25 hover:shadow-md p-5 transition-all"
                        >
                          <p className="text-sm font-bold text-[#0B2A6F] group-hover:text-[#1549a8]">{service.label}</p>
                          <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">{service.desc}</p>
                          <p className="mt-3 text-xs font-bold text-[#F58220] inline-flex items-center gap-1.5">
                            Open form <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="border-t lg:border-t-0 lg:border-l border-[#d8e2f2] bg-gradient-to-b from-[#f4f7fc] to-white p-6 sm:p-9">
              <h3 className="font-serif text-xl font-bold text-[#0B2A6F] mb-5">Why Compare Bazaar?</h3>
              <div className="space-y-4 text-sm text-gray-700">
                {trustPoints.map(({ icon: Icon, text }) => (
                  <p key={text} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#c5d4ee] bg-white text-[#0B2A6F]">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="pt-1">{text}</span>
                  </p>
                ))}
              </div>
              <Link
                href="/browse-all-software"
                className="mt-8 inline-flex items-center text-sm font-bold text-[#0B2A6F] hover:text-[#F58220] transition-colors"
              >
                Browse all software <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </aside>
          </section>
        </div>
      </div>
    </main>
  )
}
