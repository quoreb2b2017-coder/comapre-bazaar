import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata: Metadata = buildMetadata({
  title: 'About Compare Bazaar — Independent Business Software Reviews',
  description:
    'Compare Bazaar is a team of former software buyers and industry specialists producing independent business software comparisons and buying guides.',
  canonical: '/about',
})

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb
        items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]}
        className="mb-6"
      />

      <h1 className="text-3xl sm:text-4xl lg:text-[40px] text-navy tracking-tight mb-4">
        About Compare Bazaar
      </h1>
      <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-2xl">
        We&apos;re a team of former software buyers, consultants, and industry specialists who got
        tired of biased &ldquo;best of&rdquo; lists that were really just ads. We built Compare
        Bazaar to do it properly.
      </p>

      <div className="prose-editorial">
        <h2>Our mission</h2>
        <p>
          Compare Bazaar&apos;s mission is to help business owners and decision-makers find the right
          software with confidence — without spending weeks in vendor demos or reading marketing copy
          disguised as reviews.
        </p>
        <p>
          We do this by testing software ourselves, scoring it against a published framework, and
          writing about what we actually found — good and bad.
        </p>

        <h2>Who we serve</h2>
        <p>
          Our readers are typically business owners, operations managers, and department heads at
          small to mid-size businesses who are evaluating software for the first time or switching
          from a tool that no longer fits. We also serve IT procurement teams at larger organisations
          who use our comparisons as a starting point for their own due diligence.
        </p>

        <h2>How we make money</h2>
        <p>
          Compare Bazaar earns affiliate commissions when readers purchase software through our
          links, and revenue from clearly labelled &ldquo;Featured Partner&rdquo; placements. Our
          editorial rankings are never influenced by commercial relationships — see our full{' '}
          <Link href="/editorial-process">editorial process</Link> and{' '}
          <Link href="/advertising-disclosure">advertising disclosure</Link>.
        </p>

        <h2>Contact us</h2>
        <p>
          For editorial inquiries, corrections, or partnership questions, reach us at{' '}
          <a href="mailto:marketing@compare-bazaar.com">marketing@compare-bazaar.com</a> or by phone
          at <a href="tel:+13322310404">+1 332-231-0404</a>.
        </p>
        <p>Compare Bazaar is based in New York, NY.</p>
      </div>
    </div>
  )
}
