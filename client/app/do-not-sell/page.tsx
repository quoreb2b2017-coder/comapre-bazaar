import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata: Metadata = buildMetadata({
  title: 'Do Not Sell or Share My Personal Information | Compare Bazaar',
  description: 'California residents and others can opt out of the sale or sharing of personal information. Submit your request here or learn about your privacy rights.',
  canonical: '/do-not-sell',
})

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Use', href: '/terms-of-use' },
  { label: 'Advertising Disclosure', href: '/advertising-disclosure' },
  { label: 'Accessibility', href: '/accessibility' },
]

const RIGHTS = [
  { title: 'Right to know', body: 'You have the right to know what categories of personal information we have collected about you and the purposes for which it is used.' },
  { title: 'Right to delete', body: 'You have the right to request that we delete your personal information, subject to certain exceptions.' },
  { title: 'Right to correct', body: 'You have the right to request that we correct inaccurate personal information we hold about you.' },
  { title: 'Right to opt out', body: 'You have the right to opt out of the sale or sharing of your personal information with third parties for cross-context behavioural advertising.' },
  { title: 'Right to limit use of sensitive data', body: 'You have the right to limit our use and disclosure of sensitive personal information to that which is necessary to perform the services or provide the goods you requested.' },
  { title: 'Right to non-discrimination', body: 'We will not discriminate against you for exercising any of your privacy rights. You will not receive a different level of service or different prices as a result of submitting a privacy request.' },
]

export default function DoNotSellPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Do Not Sell My Info' }]} className="mb-6" />

      <h1 className="font-serif text-3xl sm:text-4xl text-navy tracking-tight mb-2">
        Do Not Sell or Share My Personal Information
      </h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: April 1, 2026</p>

      {/* CTA box */}
      <div className="bg-brand-light border border-blue-200 rounded-2xl p-6 mb-10">
        <h2 className="font-serif text-xl text-navy mb-2">Submit an opt-out request</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          To opt out of the sale or sharing of your personal information, please contact us using one of the methods below. We will process your request within 15 business days.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="mailto:privacy@compare-bazaar.com?subject=Do%20Not%20Sell%20My%20Personal%20Information"
            className="inline-flex items-center gap-2 bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-navy transition-colors"
          >
            Email your request →
          </a>
          <a
            href="tel:+13322310404"
            className="inline-flex items-center gap-2 border border-brand text-brand text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-light transition-colors"
          >
            Call +1 332-231-0404
          </a>
        </div>
      </div>

      <div className="prose-editorial">
        <h2>About this page</h2>
        <p>
          This page is provided in accordance with the California Consumer Privacy Act (CCPA), as amended by the California Privacy Rights Act (CPRA), and other applicable state privacy laws. It allows California residents and other eligible individuals to opt out of the sale or sharing of their personal information.
        </p>

        <h2>Do we sell or share personal information?</h2>
        <p>
          Compare Bazaar does not sell personal information in the traditional sense — we do not exchange your data for money with third parties. However, under the broad definitions in certain state privacy laws (including the CCPA/CPRA), some of our activities may constitute &ldquo;sharing&rdquo; of personal information, including:
        </p>
        <ul>
          <li><strong>Affiliate tracking:</strong> When you click vendor links on our Site, we use affiliate tracking technologies that may share certain browsing data with our affiliate network partners for commission attribution and advertising measurement purposes.</li>
          <li><strong>Analytics and advertising technologies:</strong> We use analytics tools (such as Google Analytics) and may use advertising technologies that involve sharing pseudonymised identifiers with third parties for audience measurement and cross-context behavioural advertising.</li>
          <li><strong>Quote request referrals:</strong> When you voluntarily submit a &ldquo;Get Free Quotes&rdquo; request, we share your contact information and inquiry details with relevant software vendors. This sharing is based on your consent and is not considered a &ldquo;sale&rdquo; under applicable law.</li>
        </ul>
        <p>
          You have the right to opt out of this sharing at any time.
        </p>

        <h2>How to opt out</h2>
        <p>You can opt out of the sale or sharing of your personal information by:</p>
        <ul>
          <li><strong>Emailing us:</strong> Send a request to <a href="mailto:privacy@compare-bazaar.com">privacy@compare-bazaar.com</a> with the subject line &ldquo;Do Not Sell My Personal Information.&rdquo; Please include your full name and email address so we can identify your data.</li>
          <li><strong>Calling us:</strong> Contact us at <a href="tel:+13322310404">+1 332-231-0404</a> during business hours (Monday–Friday, 9 AM–5 PM ET).</li>
          <li><strong>Adjusting browser or cookie settings:</strong> You can opt out of interest-based advertising through your browser&apos;s privacy settings, the Digital Advertising Alliance&apos;s opt-out tool at <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer">optout.aboutads.info</a>, or the Network Advertising Initiative at <a href="https://optout.networkadvertising.org" target="_blank" rel="noopener noreferrer">optout.networkadvertising.org</a>.</li>
          <li><strong>Global Privacy Control (GPC):</strong> If your browser transmits a Global Privacy Control signal, we will treat this as a valid opt-out request for the browser or device sending the signal.</li>
        </ul>

        <h2>Your California privacy rights</h2>
        <p>If you are a California resident, you have the following rights under the CCPA/CPRA:</p>
      </div>

      {/* Rights grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {RIGHTS.map(({ title, body }) => (
          <div key={title} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h3 className="font-semibold text-navy text-sm mb-1">{title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
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

        <h2>Contact information</h2>
        <p>For all privacy-related requests or questions, please contact us:</p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:privacy@compare-bazaar.com">privacy@compare-bazaar.com</a></li>
          <li><strong>Phone:</strong> <a href="tel:+13322310404">+1 332-231-0404</a></li>
          <li><strong>Address:</strong> Compare Bazaar, New York, NY, United States</li>
        </ul>
        <p>For more information about how we collect, use, and protect your personal information, please read our full <Link href="/privacy-policy">Privacy Policy</Link>.</p>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-sm font-semibold text-navy mb-3">Related legal pages</p>
        <div className="flex flex-wrap gap-3">
          {LEGAL_LINKS.map(({ label, href }) => (
            <Link key={href} href={href} className="text-sm text-brand border border-brand/30 px-4 py-2 rounded-lg hover:bg-brand-light transition-colors">{label}</Link>
          ))}
        </div>
      </div>
    </div>
  )
}
