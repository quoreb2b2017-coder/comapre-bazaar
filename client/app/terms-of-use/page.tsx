import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Use | Compare Bazaar',
  description: 'Terms of use for Compare Bazaar — the rules and conditions governing your use of our business software comparison platform.',
  canonical: '/terms-of-use',
})

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Advertising Disclosure', href: '/advertising-disclosure' },
  { label: 'Accessibility Statement', href: '/accessibility' },
  { label: 'Do Not Sell My Info', href: '/do-not-sell' },
]

export default function TermsOfUsePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Terms of Use' }]} className="mb-6" />
      <h1 className="font-serif text-3xl sm:text-4xl text-navy tracking-tight mb-2">Terms of Use</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: April 1, 2026</p>
      <div className="prose-editorial">
        <p>Please read these Terms of Use (&ldquo;Terms&rdquo;) carefully before using the Compare Bazaar website located at www.compare-bazaar.com (the &ldquo;Site&rdquo;). By accessing or using the Site, you agree to be bound by these Terms. If you do not agree, please do not use the Site.</p>

        <h2>1. Acceptance of Terms</h2>
        <p>These Terms constitute a legally binding agreement between you and Compare Bazaar (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We reserve the right to update these Terms at any time. Continued use of the Site after any changes constitutes your acceptance of the revised Terms.</p>

        <h2>2. Use of the Site</h2>
        <p>You may use the Site for lawful, personal, and non-commercial purposes only. You agree not to:</p>
        <ul>
          <li>Use the Site in any way that violates applicable local, national, or international laws or regulations</li>
          <li>Reproduce, duplicate, copy, sell, resell, or exploit any portion of the Site without our express written permission</li>
          <li>Use automated tools (bots, scrapers, spiders) to access, harvest, or collect data from the Site without prior written consent</li>
          <li>Upload, transmit, or distribute any content that is unlawful, defamatory, infringing, harmful, or otherwise objectionable</li>
          <li>Attempt to gain unauthorised access to any portion of the Site or its related systems</li>
          <li>Interfere with or disrupt the integrity or performance of the Site</li>
          <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity</li>
        </ul>

        <h2>3. Intellectual Property</h2>
        <p>All content on the Site — including text, graphics, logos, images, data compilations, software, and the overall &ldquo;look and feel&rdquo; — is the property of Compare Bazaar or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, modify, distribute, or create derivative works from our content without express written permission.</p>
        <p>Limited permission is granted to access and display content on the Site solely for your personal, non-commercial use, provided you do not modify the content and retain all copyright and proprietary notices.</p>

        <h2>4. Affiliate Relationships and Advertising</h2>
        <p>Compare Bazaar participates in affiliate marketing programmes. We may earn a commission when you click certain links on our Site and subsequently purchase a product or service. Affiliate relationships do not influence our editorial rankings or recommendations. All paid placements are clearly labelled. For full details, see our <Link href="/advertising-disclosure">Advertising Disclosure</Link>.</p>

        <h2>5. Accuracy of Information</h2>
        <p>We strive to ensure the information on this Site — including software reviews, pricing, and feature comparisons — is accurate and up to date. However, we make no warranties or representations of any kind regarding the completeness, accuracy, reliability, suitability, or availability of any information on the Site. Pricing, features, and availability of third-party software products may change without notice.</p>
        <p>Always verify critical information directly with the relevant software vendor before making a purchase decision. Nothing on the Site constitutes professional legal, financial, or technical advice.</p>

        <h2>6. Third-Party Links and Services</h2>
        <p>The Site contains links to third-party websites, including software vendor websites and affiliate partners. These links are provided for your convenience only. We have no control over the content, privacy practices, or availability of those sites, and we accept no responsibility or liability for them or for any loss or damage arising from your use of them.</p>
        <p>Inclusion of a link does not imply endorsement of the linked site or its content.</p>

        <h2>7. Quote Requests and Vendor Introductions</h2>
        <p>When you submit a &ldquo;Get Free Quotes&rdquo; request through our Site, you authorise Compare Bazaar to share the information you provide with relevant third-party software vendors. Those vendors may contact you via email, phone, or other means to discuss their products and services. Compare Bazaar is not a party to any agreement you enter into with a vendor and accepts no responsibility for vendor conduct.</p>

        <h2>8. Disclaimer of Warranties</h2>
        <p>THE SITE IS PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SITE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.</p>

        <h2>9. Limitation of Liability</h2>
        <p>TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, COMPARE BAZAAR AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND LICENSORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF OR INABILITY TO USE THE SITE OR ANY CONTENT THEREON.</p>
        <p>IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THESE TERMS OR THE SITE EXCEED THE AMOUNT YOU PAID TO US IN THE TWELVE MONTHS PRECEDING THE CLAIM, OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS GREATER.</p>

        <h2>10. Indemnification</h2>
        <p>You agree to defend, indemnify, and hold harmless Compare Bazaar and its officers, directors, employees, agents, and licensors from and against any claims, liabilities, damages, losses, costs, and expenses (including reasonable legal fees) arising out of or relating to your use of the Site, your violation of these Terms, or your violation of any rights of a third party.</p>

        <h2>11. Governing Law and Dispute Resolution</h2>
        <p>These Terms shall be governed by and construed in accordance with the laws of the State of New York, United States, without regard to its conflict of law provisions. Any disputes arising out of or relating to these Terms or the Site shall be subject to the exclusive jurisdiction of the courts located in New York County, New York. You waive any objection to such jurisdiction and venue.</p>

        <h2>12. Privacy</h2>
        <p>Your use of the Site is also governed by our <Link href="/privacy-policy">Privacy Policy</Link>, which is incorporated into these Terms by reference.</p>

        <h2>13. Severability</h2>
        <p>If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect.</p>

        <h2>14. Entire Agreement</h2>
        <p>These Terms, together with our Privacy Policy and Advertising Disclosure, constitute the entire agreement between you and Compare Bazaar regarding your use of the Site and supersede all prior agreements and understandings.</p>

        <h2>15. Contact Us</h2>
        <p>If you have questions about these Terms, please contact us:</p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:legal@compare-bazaar.com">legal@compare-bazaar.com</a></li>
          <li><strong>Address:</strong> Compare Bazaar, New York, NY, United States</li>
        </ul>
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
