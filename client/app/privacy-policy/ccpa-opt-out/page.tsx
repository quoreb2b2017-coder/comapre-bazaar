import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { CcpaOptOutForm } from './CcpaOptOutForm'
import {
  Clock,
  Mail,
  Scale,
  Shield,
  ShieldCheck,
  UserCheck,
} from 'lucide-react'
import './ccpa-opt-out.css'

export const dynamic = 'force-static'
export const revalidate = 86400

export const metadata: Metadata = buildMetadata({
  title: 'California – Do Not Sell My Info',
  description:
    'California residents can opt out of the sale or sharing of personal information. Submit your CCPA request and learn about your privacy rights.',
  canonical: '/privacy-policy/ccpa-opt-out',
})

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Use', href: '/terms-of-use' },
  { label: 'Advertising Disclosure', href: '/advertising-disclosure' },
  { label: 'Accessibility', href: '/accessibility' },
]

const TRUST_BADGES = [
  { icon: Clock, label: '15 business days', sub: 'Typical processing time' },
  { icon: ShieldCheck, label: 'CCPA / CPRA', sub: 'California compliant' },
  { icon: UserCheck, label: 'No discrimination', sub: 'Rights protected' },
]

const RIGHTS = [
  { title: 'Right to know', body: 'You have the right to know what categories of personal information we have collected about you and the purposes for which it is used.' },
  { title: 'Right to delete', body: 'You have the right to request that we delete your personal information, subject to certain exceptions.' },
  { title: 'Right to correct', body: 'You have the right to request that we correct inaccurate personal information we hold about you.' },
  { title: 'Right to opt out', body: 'You have the right to opt out of the sale or sharing of your personal information with third parties for cross-context behavioural advertising.' },
  { title: 'Right to limit use of sensitive data', body: 'You have the right to limit our use and disclosure of sensitive personal information to that which is necessary to perform the services or provide the goods you requested.' },
  { title: 'Right to non-discrimination', body: 'We will not discriminate against you for exercising any of your privacy rights. You will not receive a different level of service or different prices as a result of submitting a privacy request.' },
]

const OPT_OUT_METHODS = [
  {
    title: 'Submit the form',
    body: 'Complete the request form on this page with your contact details.',
    highlight: true,
  },
  {
    title: 'Email us',
    body: 'Send a request to privacy@compare-bazaar.com with the subject line “Do Not Sell My Personal Information.”',
    href: 'mailto:privacy@compare-bazaar.com?subject=Do%20Not%20Sell%20My%20Personal%20Information',
  },
]

export default function CcpaOptOutPage() {
  return (
    <div className="ccpa-page">
      {/* Hero */}
      <section className="ccpa-hero relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#EEF3FB] via-white to-[#FFFAF5]" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#F58220]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[#0B2A6F]/8 blur-3xl" />

        <div className="relative ccpa-hero-inner px-4 sm:px-6 pt-8 pb-10 sm:pt-12 sm:pb-14">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'California – Do Not Sell My Info' },
            ]}
            className="ccpa-breadcrumb mb-6"
          />

          <div className="ccpa-hero-meta">
            <span className="ccpa-pill">
              <Scale className="h-3.5 w-3.5" aria-hidden />
              California Privacy
            </span>
            <span className="text-xs text-gray-400">Last updated: April 1, 2026</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-[2.5rem] text-navy tracking-tight leading-[1.12] mb-3">
            California <span className="ccpa-title-dash">–</span> Do Not Sell My Info
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 max-w-xl mx-auto">
            Exercise your right to opt out of the sale or sharing of your personal information under the California Consumer Privacy Act (CCPA) and CPRA.
          </p>

          <div className="ccpa-trust-grid">
            {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="ccpa-trust-card">
                <Icon className="h-4 w-4 text-[#F58220] shrink-0" aria-hidden />
                <div>
                  <p className="text-sm font-bold text-navy leading-tight">{label}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form section */}
      <section className="ccpa-form-section relative z-10">
        <div className="ccpa-form-section-inner">
          <div className="ccpa-form-intro text-center">
            <h2 className="font-serif text-lg sm:text-xl text-navy tracking-tight">
              Your California privacy rights
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-gray-500 leading-snug">
              Submit your opt-out request below.
            </p>
          </div>
          <CcpaOptOutForm />
        </div>
      </section>

      {/* Content */}
      <section className="ccpa-content border-t border-gray-100 bg-gradient-to-b from-gray-50/80 to-white">
        <div className="ccpa-content-inner">
          <div className="prose-editorial">
            <h2>About this page</h2>
            <p>
              This page is provided in accordance with the California Consumer Privacy Act (CCPA), as amended by the California Privacy Rights Act (CPRA), and other applicable state privacy laws. It allows California residents and other eligible individuals to opt out of the sale or sharing of their personal information.
            </p>

            <h2>Do we sell or share personal information?</h2>
            <p>
              Compare Bazaar does not sell personal information in the traditional sense; we do not exchange your data for money with third parties. However, under the broad definitions in certain state privacy laws (including the CCPA/CPRA), some of our activities may constitute &ldquo;sharing&rdquo; of personal information, including:
            </p>
          </div>

          <ul className="ccpa-info-list my-8">
            <li>
              <strong>Affiliate tracking</strong>
              <span>When you click vendor links on our Site, we use affiliate tracking technologies that may share certain browsing data with our affiliate network partners for commission attribution and advertising measurement purposes.</span>
            </li>
            <li>
              <strong>Analytics and advertising technologies</strong>
              <span>We use analytics tools (such as Google Analytics) and may use advertising technologies that involve sharing pseudonymised identifiers with third parties for audience measurement and cross-context behavioural advertising.</span>
            </li>
            <li>
              <strong>Quote request referrals</strong>
              <span>When you voluntarily submit a &ldquo;Get Free Quotes&rdquo; request, we share your contact information and inquiry details with relevant software vendors. This sharing is based on your consent and is not considered a &ldquo;sale&rdquo; under applicable law.</span>
            </li>
          </ul>

          <p className="text-gray-600 leading-relaxed mb-10">
            You have the right to opt out of this sharing at any time.
          </p>

          <h2 className="font-serif text-2xl text-navy tracking-tight mb-2">How to opt out</h2>
          <p className="text-gray-600 mb-6">You can opt out of the sale or sharing of your personal information by:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {OPT_OUT_METHODS.map((method) => (
              <div
                key={method.title}
                className={`ccpa-method-card ${method.highlight ? 'ccpa-method-card--highlight' : ''}`}
              >
                <h3 className="font-semibold text-navy text-sm mb-1.5">{method.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{method.body}</p>
                {method.href ? (
                  <a
                    href={method.href}
                    target={method.external ? '_blank' : undefined}
                    rel={method.external ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-brand hover:underline"
                  >
                    {method.external ? 'Visit opt-out tool →' : 'Send email →'}
                  </a>
                ) : null}
              </div>
            ))}
          </div>

          <h2 className="font-serif text-2xl text-navy tracking-tight mb-2">Your California privacy rights</h2>
          <p className="text-gray-600 mb-6">If you are a California resident, you have the following rights under the CCPA/CPRA:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {RIGHTS.map(({ title, body }, i) => (
              <div key={title} className="ccpa-right-card group">
                <span className="ccpa-right-num" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-semibold text-navy text-sm mb-1.5 group-hover:text-[#123d92] transition-colors">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="prose-editorial">
            <h2>Authorised agents</h2>
            <p>You may designate an authorised agent to submit a privacy request on your behalf. The authorised agent must provide written proof of authorisation, and we may verify the request directly with you to confirm the agent&apos;s authority.</p>

            <h2>Verification of requests</h2>
            <p>To protect your privacy and security, we may need to verify your identity before processing your request. We will ask you to provide information that matches what we have on file. We will not use information submitted for verification for any other purpose.</p>

            <h2>Response timeline</h2>
            <p>We will acknowledge receipt of your request within 10 business days and respond to your request within 45 calendar days. If we require additional time, we will notify you in writing and may extend the response period by an additional 45 days.</p>
          </div>

          {/* Contact card */}
          <div className="ccpa-contact-card mt-10">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF3FB] border border-[#C5D4EE]">
                <Mail className="h-5 w-5 text-navy" aria-hidden />
              </div>
              <div>
                <h2 className="font-serif text-xl text-navy mb-2">Contact information</h2>
                <p className="text-sm text-gray-600 mb-4">For all privacy-related requests or questions, please contact us:</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <strong className="text-navy">Email:</strong>{' '}
                    <a href="mailto:privacy@compare-bazaar.com" className="text-brand hover:underline">privacy@compare-bazaar.com</a>
                  </li>
                  <li>
                    <strong className="text-navy">Address:</strong> Compare Bazaar, New York, NY, United States
                  </li>
                </ul>
                <p className="mt-4 text-sm text-gray-500">
                  For more information, read our full{' '}
                  <Link href="/privacy-policy" className="text-brand font-medium hover:underline">Privacy Policy</Link>.
                </p>
              </div>
            </div>
          </div>

          {/* Related links */}
          <div className="mt-14 pt-10 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-5">
              <Shield className="h-4 w-4 text-navy" aria-hidden />
              <p className="text-sm font-bold text-navy uppercase tracking-wide">Related legal pages</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {LEGAL_LINKS.map(({ label, href }) => (
                <Link key={href} href={href} className="ccpa-legal-link">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
