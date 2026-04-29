import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy | Compare Bazaar',
  description: 'Compare Bazaar privacy policy — how we collect, use, and protect your personal information when you use our business software comparison platform.',
  canonical: '/privacy-policy',
})

const LEGAL_LINKS = [
  { label: 'Terms of Use', href: '/terms-of-use' },
  { label: 'Advertising Disclosure', href: '/advertising-disclosure' },
  { label: 'Accessibility Statement', href: '/accessibility' },
  { label: 'Do Not Sell My Info', href: '/do-not-sell' },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]} className="mb-6" />
      <h1 className="font-serif text-3xl sm:text-4xl text-navy tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: April 1, 2026</p>
      <div className="prose-editorial">
        <p>Compare Bazaar operates the website at www.compare-bazaar.com (the &ldquo;Site&rdquo;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our Site.</p>
        <h2>1. Information We Collect</h2>
        <h3>Information you provide directly</h3>
        <p>We may collect information you voluntarily submit, including when you fill out a &ldquo;Get Free Quotes&rdquo; form, subscribe to our newsletter, or contact us. This may include your name, email address, phone number, company name, job title, and software inquiry details.</p>
        <h3>Information collected automatically</h3>
        <p>When you visit our Site, we automatically collect certain technical information including your IP address and approximate geographic location, browser type and operating system, pages visited and time spent, device type, and cookie identifiers.</p>
        <h3>Cookies and tracking technologies</h3>
        <p>We use cookies, web beacons, and similar technologies to personalise your experience, analyse Site traffic, and serve relevant content. Types of cookies we use:</p>
        <ul>
          <li><strong>Strictly necessary cookies:</strong> Required for the Site to function. Cannot be disabled.</li>
          <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with the Site (e.g., Google Analytics).</li>
          <li><strong>Advertising/affiliate cookies:</strong> Used to track referrals and affiliate commission attribution when you click vendor links.</li>
          <li><strong>Preference cookies:</strong> Store your settings and preferences for future visits.</li>
        </ul>
        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to operate and improve the Site, respond to your inquiries, send newsletters or updates you have opted into, match you with relevant software vendors when you request free quotes, analyse Site usage, track affiliate referrals, comply with legal obligations, and detect and prevent fraudulent activity.</p>
        <h2>3. How We Share Your Information</h2>
        <p>We do not sell your personal information to third parties. We may share your information in the following limited circumstances:</p>
        <ul>
          <li><strong>Software vendors (with your consent):</strong> If you submit a quote request, we share your information with relevant vendors so they can contact you. By submitting a quote request, you consent to this sharing.</li>
          <li><strong>Service providers:</strong> We may share information with trusted third-party service providers who assist us in operating the Site. These providers are contractually bound to use your information only for services provided to us.</li>
          <li><strong>Affiliate networks:</strong> We work with affiliate networks that may place cookies to track clicks on vendor links for commission tracking purposes.</li>
          <li><strong>Legal compliance:</strong> We may disclose information if required by law, court order, or government authority, or to protect the rights, property, or safety of Compare Bazaar, our users, or others.</li>
          <li><strong>Business transfers:</strong> In the event of a merger, acquisition, or asset sale, your information may be transferred to the acquiring entity.</li>
        </ul>
        <h2>4. Advertising Disclosure</h2>
        <p>Compare Bazaar participates in affiliate marketing programmes. When you click vendor links, we may earn a commission. This does not affect our editorial rankings or recommendations. For full details, see our <Link href="/advertising-disclosure">Advertising Disclosure</Link>.</p>
        <h2>5. Data Retention</h2>
        <p>We retain personal information for as long as necessary to fulfil the purposes outlined in this policy, unless a longer retention period is required by law. Quote request information is typically retained for up to 12 months. Analytics data is retained in accordance with our analytics providers&apos; policies (typically 26 months for Google Analytics).</p>
        <h2>6. Your Rights and Choices</h2>
        <p>Depending on your location, you may have the following rights:</p>
        <ul>
          <li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
          <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information.</li>
          <li><strong>Deletion:</strong> Request deletion of your personal information, subject to certain legal exceptions.</li>
          <li><strong>Opt-out of marketing:</strong> Unsubscribe from marketing emails at any time using the link in our emails or by contacting us directly.</li>
          <li><strong>Do Not Sell / Do Not Share:</strong> California residents may opt out of the sale or sharing of personal information. See our <Link href="/do-not-sell">Do Not Sell My Info</Link> page.</li>
          <li><strong>Cookie preferences:</strong> Control cookies through your browser settings.</li>
        </ul>
        <p>To exercise any of these rights, contact us at <a href="mailto:privacy@compare-bazaar.com">privacy@compare-bazaar.com</a>.</p>
        <h2>7. Children&apos;s Privacy</h2>
        <p>Our Site is not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child under 16, we will take steps to delete it promptly.</p>
        <h2>8. Third-Party Links</h2>
        <p>Our Site contains links to third-party websites, including software vendor websites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies before providing any personal information.</p>
        <h2>9. Data Security</h2>
        <p>We implement industry-standard technical and organisational measures to protect your personal information against unauthorised access, disclosure, alteration, or destruction. However, no method of internet transmission is 100% secure, and we cannot guarantee absolute security.</p>
        <h2>10. International Transfers</h2>
        <p>Our Site is operated in the United States. If you are located outside the United States, your information may be transferred to and processed in the United States or other countries where our service providers operate. By using our Site, you consent to such transfer.</p>
        <h2>11. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on this page with a new &ldquo;Last updated&rdquo; date. We encourage you to review this policy periodically.</p>
        <h2>12. Contact Us</h2>
        <p>If you have questions or requests regarding this Privacy Policy, please contact us:</p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:privacy@compare-bazaar.com">privacy@compare-bazaar.com</a></li>
          <li><strong>Phone:</strong> <a href="tel:+13322310404">+1 332-231-0404</a></li>
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
