import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import {
  loadUnifiedBlogIndex,
  stripGradientForSlug,
} from '@/lib/blogCms'
import { BlogFeaturedCard, BlogGridCard } from '@/components/blog/BlogListingCards'
import { BlogSubscribeBox } from '@/components/blog/BlogSubscribeBox'

export async function generateMetadata(): Promise<Metadata> {
  const titleBase = 'Compare Bazaar Blog | Software Buying Guides'
  const description =
    'Actionable business software buying guides from Compare Bazaar editors. CRM, payroll, marketing, HR, and operations software insights.'
  return buildMetadata({
    title: titleBase,
    description,
    canonical: '/blog',
  })
}

export default async function BlogIndexPage() {
  const allPosts = await loadUnifiedBlogIndex()
  const posts = allPosts
  const hasPosts = posts.length > 0
  const featuredPost = posts[0]
  const latestPosts = posts.slice(1)

  const categories = [...new Set(allPosts.map((p) => p.category))]
  const indexStrip = stripGradientForSlug('compare-bazaar-blog')
  const heroStrip =
    featuredPost != null
      ? { stripFrom: featuredPost.stripFrom, stripTo: featuredPost.stripTo }
      : indexStrip

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} className="mb-10 sm:mb-12" />

        <section className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,48rem)_minmax(200px,260px)] lg:gap-14 xl:gap-16">
          <div className="min-w-0 w-full">
            <header className="mb-12 border-b border-gray-200 pb-10 sm:mb-14 sm:pb-12">
              <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
                <div className="min-w-0 flex-1">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-gray-400">
                    Compare Bazaar · Editorial
                  </p>
                  <div
                    className="mb-6 h-[3px] w-14 sm:w-16"
                    style={{ background: `linear-gradient(90deg, ${heroStrip.stripFrom}, ${heroStrip.stripTo})` }}
                    aria-hidden
                  />
                  <h1 className="font-serif text-[2.5rem] leading-[1.05] tracking-tight text-navy sm:text-[2.875rem] lg:text-[3.125rem]">
                    Blog
                  </h1>
                  <p className="mt-6 max-w-[54ch] text-[17px] leading-[1.7] text-gray-600 sm:text-[1.125rem]">
                    Independent buying guides for business software—structured research, clear trade-offs, and practical
                    shortlists.
                  </p>
                </div>
                <div className="hidden max-w-[240px] shrink-0 border-l border-gray-200 pl-8 lg:block xl:pl-10">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">Reading guide</p>
                  <p className="mt-4 text-[13px] leading-[1.65] text-gray-600">
                    Start with the featured guide, then scan numbered articles below. Topics and publication standards
                    are in the column →
                  </p>
                </div>
              </div>
            </header>

            {!hasPosts ? (
              <div className="border-t border-gray-100 py-16 text-center">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  No articles yet
                </p>
                <p className="mb-3 font-serif text-xl text-navy">Coming soon</p>
                <p className="mx-auto mb-8 max-w-md text-[15px] leading-relaxed text-gray-600">
                  Publish from blog admin to show guides here.
                </p>
                <Link
                  href="/"
                  className="text-sm font-medium text-brand underline underline-offset-4 hover:text-brand-hover"
                >
                  Return home
                </Link>
              </div>
            ) : (
              <>
                {featuredPost ? <BlogFeaturedCard post={featuredPost} /> : null}

                {latestPosts.length > 0 ? (
                  <div>
                    <div className="mb-1 flex flex-col gap-3 border-b border-gray-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-400">
                          Archive
                        </p>
                        <h2 className="font-serif text-[1.5rem] tracking-tight text-navy sm:text-[1.625rem]">
                          Latest articles
                        </h2>
                      </div>
                      <p className="max-w-[42ch] text-[14px] leading-relaxed text-gray-500">
                        Same criteria we use in product comparisons—written for teams choosing vendors under time pressure.
                      </p>
                    </div>
                    <ul className="divide-y divide-gray-100">
                      {latestPosts.map((post, i) => (
                        <li key={post.slug}>
                          <BlogGridCard post={post} index={i + 1} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <BlogSubscribeBox slug="blog-index" variant="editorial" />
              </>
            )}
          </div>

          <aside className="space-y-12 border-gray-200 lg:sticky lg:top-28 lg:border-l lg:pl-9 xl:pl-10">
            <div>
              <h3 className="mb-5 border-b border-gray-100 pb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                Topics
              </h3>
              {categories.length > 0 ? (
                <ul className="space-y-3">
                  {categories.map((category) => (
                    <li
                      key={category}
                      className="border-l-2 border-gray-100 pl-3 text-[15px] font-medium leading-snug text-navy"
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">—</p>
              )}
            </div>
            <div>
              <h3 className="mb-5 border-b border-gray-100 pb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                Our standard
              </h3>
              <ul className="space-y-5 text-[14px] leading-[1.65] text-gray-600">
                <li className="border-l-2 border-gray-200 pl-4 leading-snug">
                  Structured criteria and repeatable scoring—not sponsored blurbs.
                </li>
                <li className="border-l-2 border-gray-200 pl-4 leading-snug">
                  Written for operators making purchase decisions under time pressure.
                </li>
                <li className="border-l-2 border-gray-200 pl-4 leading-snug">
                  We foreground trade-offs so you can disqualify vendors faster.
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}
