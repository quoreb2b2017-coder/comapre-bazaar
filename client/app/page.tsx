import type { Metadata } from 'next'
import { buildMetadata, buildItemListSchema, buildFaqSchema, SITE_URL } from '@/lib/seo'
import { HOME_CATEGORIES } from '@/data/homeCategories'
import { HomeHeroSection } from '@/components/home/HomeHeroSection'
import { HomePageBody } from '@/components/home/HomePageBody'
import { loadHomeBlogPreview } from '@/lib/blogCms'

export const metadata: Metadata = buildMetadata({
  title: 'Best Business Software Comparisons & Reviews 2026',
  description:
    'Independent reviews, side by side pricing, and ranked picks across CRM, payroll, HR, email marketing, and more. Trusted by 50,000 business buyers.',
  canonical: '/',
  ogTitle: 'Best Business Software Comparisons & Reviews 2026 | Compare Bazaar',
  ogUrl: 'https://www.compare-bazaar.com',
})

const FAQS = [
  {
    q: 'How does Compare Bazaar make money?',
    a: 'Compare Bazaar earns affiliate commissions when readers purchase software through our links. Some vendors also pay for clearly labeled sponsored placements. Neither of these arrangements influences our editorial rankings. Our scoring is based on hands on testing and structured criteria. You can read full details on our Advertising Disclosure page.',
  },
  {
    q: 'How often are your software reviews updated?',
    a: 'Most of our software reviews are updated monthly to reflect pricing changes, new features, and shifts in the competitive landscape. Pricing data is verified directly with vendors and dated on each review page so you can see how current the information is. Categories with faster moving markets like CRM and email marketing are reviewed more frequently.',
  },
  {
    q: 'Can vendors pay to be ranked higher in your comparisons?',
    a: 'No. Vendor payments have zero influence on rankings. Every platform is scored using a weighted methodology across 12 or more criteria such as features, pricing, ease of use, and integrations. Some vendors have affiliate relationships with us, but this does not affect score or position in any comparison. Sponsored placements are clearly labeled and kept separate from editorial rankings.',
  },
  {
    q: 'What criteria do you use to score software?',
    a: 'Every platform is evaluated across 12 or more criteria by a subject matter expert. Core criteria include ease of use, feature depth, pricing transparency, integration options, customer support quality, and scalability for different business sizes. Scoring is category specific. For example, payroll tools are judged on tax compliance and contractor support, while CRM tools are scored on pipeline management and automation. You can read our complete scoring framework on the Editorial Process page.',
  },
  {
    q: 'How do you verify software pricing?',
    a: 'We contact vendors directly to confirm pricing before publishing. All pricing data is clearly dated on each review so you know when it was last verified. We also flag hidden fees, per user charges, and contract requirements that may not be obvious from headline pricing.',
  },
]

const itemListSchema = buildItemListSchema(
  'Business Software Categories',
  HOME_CATEGORIES.map((c) => ({ name: c.title, href: c.href, description: c.desc }))
)

const homeFaqSchema = buildFaqSchema(
  FAQS.map((f) => ({ question: f.q, answer: f.a })),
  SITE_URL
)

export default async function HomePage() {
  const recentBlogPosts = await loadHomeBlogPreview(3)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {homeFaqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }}
        />
      ) : null}

      <HomeHeroSection />
      <HomePageBody faqs={FAQS} recentBlogPosts={recentBlogPosts} />
    </>
  )
}
