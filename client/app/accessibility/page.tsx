import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import {
  ClipboardIcon,
  CompassIcon,
  FileTextIcon,
  KeyboardIcon,
  PaletteIcon,
  TextIcon,
  FilmIcon,
  GlobeIcon,
} from '@/components/ui/icons'

export const metadata: Metadata = buildMetadata({
  title: 'Accessibility Statement | Compare Bazaar',
  description: 'Compare Bazaar is committed to making our website accessible to all users. Learn about our accessibility standards, known issues, and how to contact us for support.',
  canonical: '/accessibility',
})

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Use', href: '/terms-of-use' },
  { label: 'Advertising Disclosure', href: '/advertising-disclosure' },
  { label: 'Do Not Sell My Info', href: '/do-not-sell' },
]

const STANDARDS = [
  { iconKey: 'semantic', title: 'Semantic HTML', body: 'We use semantic HTML5 elements (headings, lists, landmarks, nav, main, footer) to create a clear document structure that assistive technologies can parse accurately.' },
  { iconKey: 'keyboard', title: 'Keyboard navigation', body: 'All interactive elements — navigation menus, links, buttons, form fields, and accordion components — are fully operable via keyboard alone, with visible focus indicators.' },
  { iconKey: 'palette', title: 'Colour contrast', body: 'We maintain a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text, meeting WCAG 2.1 AA requirements. Critical information is never conveyed by colour alone.' },
  { iconKey: 'fileText', title: 'Alternative text', body: 'All meaningful images include descriptive alt text. Decorative images use empty alt attributes so screen readers skip them correctly.' },
  { iconKey: 'text', title: 'Scalable text', body: 'Text can be resized up to 200% using browser controls without loss of content or functionality. We use relative font units (rem/em) throughout.' },
  { iconKey: 'clipboard', title: 'Form accessibility', body: 'All form fields have visible, associated labels. Required fields are clearly marked. Error messages are descriptive and programmatically associated with the relevant input.' },
  { iconKey: 'film', title: 'No autoplay media', body: 'We do not use autoplay audio or video. Any time-based media we include provides pause/stop controls and does not flash more than three times per second.' },
  { iconKey: 'compass', title: 'Skip navigation', body: 'A &ldquo;Skip to main content&rdquo; link is available at the top of every page, allowing keyboard and screen reader users to bypass repetitive navigation.' },
]

const iconMap = {
  semantic: GlobeIcon,
  keyboard: KeyboardIcon,
  palette: PaletteIcon,
  fileText: FileTextIcon,
  text: TextIcon,
  clipboard: ClipboardIcon,
  film: FilmIcon,
  compass: CompassIcon,
}

export default function AccessibilityPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Accessibility' }]} className="mb-6" />
      <h1 className="font-serif text-3xl sm:text-4xl text-navy tracking-tight mb-2">Accessibility Statement</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: April 1, 2026</p>

      <div className="prose-editorial">
        <p>Compare Bazaar is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards to achieve this.</p>

        <h2>Our conformance status</h2>
        <p>We aim to conform to the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> standard. These guidelines explain how to make web content more accessible to people with disabilities. Conformance with these guidelines helps make the web more user-friendly for all people.</p>
        <p>We believe our Site is <strong>substantially conformant</strong> with WCAG 2.1 AA. We are actively working to address any remaining gaps and will update this statement as we make improvements.</p>

        <h2>Technical specifications</h2>
        <p>Accessibility of our Site relies on the following technologies to work with the combination of web browser and any assistive technologies or plugins installed on your computer:</p>
        <ul>
          <li>HTML5</li>
          <li>CSS3</li>
          <li>JavaScript (WAI-ARIA where applicable)</li>
        </ul>
        <p>These technologies are relied upon for conformance with the accessibility standards used.</p>
      </div>

      {/* Standards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
        {STANDARDS.map(({ iconKey, title, body }) => {
          const Icon = iconMap[iconKey as keyof typeof iconMap]
          return (
          <div key={title} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="mb-2" aria-hidden="true"><Icon className="w-6 h-6 text-[#F27F25]" /></div>
            <h3 className="font-semibold text-navy text-sm mb-1">{title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: body }} />
          </div>
        )})}
      </div>

      <div className="prose-editorial">
        <h2>Known limitations</h2>
        <p>Despite our best efforts to ensure accessibility, there may be some limitations. Below is a description of known limitations, and potential solutions:</p>
        <ul>
          <li><strong>Third-party vendor content:</strong> Some pages link to third-party vendor websites that may not meet the same accessibility standards. We have no control over these sites and encourage affected users to contact the relevant vendor directly.</li>
          <li><strong>PDF documents:</strong> Any PDF documents we make available may not be fully accessible. If you require information from a PDF in an alternative format, please contact us and we will do our best to assist.</li>
          <li><strong>Legacy embedded content:</strong> Some older embedded content (e.g., third-party widgets) may not fully meet WCAG 2.1 AA standards. We are actively working to replace these with accessible alternatives.</li>
        </ul>
        <p>If you encounter a limitation not listed here, please contact us so we can investigate and work to resolve it.</p>

        <h2>Feedback and contact information</h2>
        <p>We welcome your feedback on the accessibility of the Compare Bazaar website. If you experience any accessibility barriers, or if you need information in an alternative format, please contact us:</p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:accessibility@compare-bazaar.com">accessibility@compare-bazaar.com</a></li>
          <li><strong>Phone:</strong> <a href="tel:+13322310404">+1 332-231-0404</a></li>
          <li><strong>Address:</strong> Compare Bazaar, New York, NY, United States</li>
        </ul>
        <p>We aim to respond to accessibility feedback within <strong>5 business days</strong> and to provide a solution or workaround within <strong>10 business days</strong>.</p>

        <h2>Assessment approach</h2>
        <p>Compare Bazaar assesses the accessibility of the Site through the following approaches:</p>
        <ul>
          <li>Self-evaluation against WCAG 2.1 AA criteria during development</li>
          <li>Automated testing using accessibility checking tools</li>
          <li>Manual keyboard navigation and screen reader testing</li>
          <li>User feedback and reported issues</li>
        </ul>
        <p>We conduct a full accessibility review with each significant Site update and at least annually.</p>

        <h2>Formal complaints</h2>
        <p>If you are not satisfied with our response to your accessibility feedback, you may contact the relevant authority in your jurisdiction. In the United States, you may file a complaint with the <a href="https://www.ada.gov/" target="_blank" rel="noopener noreferrer">U.S. Department of Justice ADA Information Line</a>.</p>

        <h2>Ongoing commitment</h2>
        <p>Accessibility is an ongoing effort. We are committed to continuously improving the accessibility of our Site and welcome all feedback that helps us serve our users better. This statement will be updated as we make improvements.</p>
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
