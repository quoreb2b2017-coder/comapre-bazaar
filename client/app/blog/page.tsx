import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { blogPosts } from '@/data/blogPosts'

export const metadata: Metadata = buildMetadata({
  title: 'Compare Bazaar Blog | Software Buying Guides',
  description:
    'Actionable business software buying guides from Compare Bazaar editors. CRM, payroll, marketing, HR, and operations software insights.',
  canonical: '/blog',
})

export default function BlogIndexPage() {
  const [featuredPost, ...latestPosts] = blogPosts

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} className="mb-6" />

      <header className="mb-10 border-b-2 border-navy/10 pb-8">
        <p className="text-xs uppercase tracking-widest font-semibold text-brand mb-2">Editorial Insights</p>
        <h1 className="text-4xl sm:text-5xl text-navy tracking-tight mb-3">Compare Bazaar Blog</h1>
        <p className="text-gray-600 max-w-3xl text-lg leading-relaxed">
          In-depth software buying guidance for founders, operators, and revenue teams. Every article is written to
          help you make faster, lower-risk software decisions.
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr),300px] gap-10">
        <div>
          {featuredPost && (
            <article className="mb-10 pb-8 border-b border-gray-200">
              <div
                className="h-2 w-full rounded-full mb-4"
                style={{ background: `linear-gradient(90deg, ${featuredPost.stripFrom}, ${featuredPost.stripTo})` }}
                aria-hidden="true"
              />
              <p className="text-xs uppercase tracking-widest font-semibold text-brand mb-2">Featured Article</p>
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                {featuredPost.category} · {featuredPost.readTime}
              </p>
              <h2 className="text-3xl sm:text-4xl text-navy tracking-tight mb-3 leading-tight">
                <Link href={`/blog/${featuredPost.slug}`} className="hover:text-brand transition-colors">
                  {featuredPost.title}
                </Link>
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-4 max-w-3xl">{featuredPost.excerpt}</p>
              <p className="text-sm text-gray-500 mb-5">
                Published{' '}
                {new Date(featuredPost.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
                {' · '}By {featuredPost.authorName}
              </p>
              <Link href={`/blog/${featuredPost.slug}`} className="inline-flex text-sm font-semibold text-brand hover:underline">
                Read full article →
              </Link>
            </article>
          )}

          <div className="max-w-4xl">
            <h3 className="text-2xl text-navy tracking-tight mb-5">Latest Articles</h3>
            <div className="divide-y divide-gray-200 border-y border-gray-200">
              {latestPosts.map((post) => (
                <article key={post.slug} className="py-6 pl-0 pr-0 sm:pr-3">
                  <div
                    className="h-1.5 w-full rounded-full mb-3"
                    style={{ background: `linear-gradient(90deg, ${post.stripFrom}, ${post.stripTo})` }}
                    aria-hidden="true"
                  />
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                    {post.category} · {post.readTime}
                  </p>
                  <h4 className="text-2xl text-navy tracking-tight mb-2 leading-snug">
                    <Link href={`/blog/${post.slug}`} className="hover:text-brand transition-colors">
                      {post.title}
                    </Link>
                  </h4>
                  <p className="text-gray-600 mb-3 max-w-3xl">{post.excerpt}</p>
                  <p className="text-sm text-gray-500 mb-3">
                    Published{' '}
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    {' · '}By {post.authorName}
                  </p>
                  <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-brand hover:underline">
                    Continue reading →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 h-fit space-y-8 border-l border-gray-200 pl-6">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-navy mb-3">Browse by Category</h3>
            <div className="flex flex-wrap gap-2">
              {[...new Set(blogPosts.map((p) => p.category))].map((category) => (
                <span
                  key={category}
                  className="inline-flex rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-navy mb-2">Why read our blog?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="border-l-2 border-brand pl-3">Human-written, practical buying guidance</li>
              <li className="border-l-2 border-brand pl-3">Focused on SMB and growth-stage decisions</li>
              <li className="border-l-2 border-brand pl-3">Clear trade-offs, not generic feature lists</li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  )
}
