import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { blogPosts } from '@/data/blogPosts'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const post = blogPosts.find((item) => item.slug === params.slug)
  if (!post) {
    return buildMetadata({
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
      canonical: '/blog',
    })
  }
  return buildMetadata({
    title: `${post.title} | Compare Bazaar Blog`,
    description: post.excerpt,
    canonical: `/blog/${post.slug}`,
  })
}

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts.find((item) => item.slug === params.slug)
  if (!post) notFound()
  const relatedPosts = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3)

  const publishedLabel = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const headingMap = [
    'Why this matters',
    'How to evaluate your options',
    'Where most teams make mistakes',
    'Practical recommendation',
    'Implementation checklist',
    'Final decision framework',
  ]

  const sections = post.content.map((para, idx) => ({
    id: `section-${idx + 1}`,
    heading: headingMap[idx] ?? `Key consideration ${idx + 1}`,
    body: para,
  }))

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: post.title },
        ]}
        className="mb-6"
      />

      <header className="mb-8 pb-8 border-b border-gray-200">
        <div
          className="h-2.5 w-full rounded-full mb-5"
          style={{ background: `linear-gradient(90deg, ${post.stripFrom}, ${post.stripTo})` }}
          aria-hidden="true"
        />
        <p className="text-xs uppercase tracking-widest font-semibold text-brand mb-2">Compare Bazaar Editorial</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl text-navy tracking-tight leading-tight mb-4">{post.title}</h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mb-6">{post.excerpt}</p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <span className="inline-flex rounded-full bg-brand-light px-3 py-1 text-brand font-semibold">
            {post.category}
          </span>
          <span>{post.readTime}</span>
          <span>Published {publishedLabel}</span>
          <span>By {post.authorName}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr),280px] gap-10">
        <article className="pr-0 lg:pr-4">
          <section className="border-l-4 border-brand bg-brand-light/40 p-5 mb-10 max-w-3xl">
            <h2 className="text-lg font-semibold text-navy mb-3">Key Takeaways</h2>
            <ul className="space-y-2 text-sm text-gray-700 leading-relaxed">
              {post.content.slice(0, 3).map((point) => (
                <li key={point}>• {point}</li>
              ))}
            </ul>
          </section>

          <div className="prose prose-gray max-w-3xl prose-headings:text-navy prose-headings:tracking-tight prose-p:leading-8 prose-p:text-[17px]">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="mb-10">
                <h2 className="text-2xl mb-3 border-l-4 border-[#F58220] pl-3">{section.heading}</h2>
                <div className="h-px w-full mb-4 bg-gradient-to-r from-[#1D4ED8]/40 via-[#F58220]/30 to-transparent" aria-hidden="true" />
                <p>{section.body}</p>
              </section>
            ))}
          </div>

          <section className="max-w-3xl mt-10 mb-10 border border-gray-200 rounded-2xl p-5 bg-white">
            <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Author Bio</h3>
            <p className="text-lg text-navy font-semibold">{post.authorName}</p>
            <p className="text-sm text-brand font-medium mb-2">{post.authorRole}</p>
            <p className="text-sm text-gray-700 leading-relaxed">{post.authorBio}</p>
          </section>

          <section className="max-w-3xl mt-10">
            <h3 className="text-xl text-navy tracking-tight mb-4">Related Articles</h3>
            <div className="space-y-4">
              {relatedPosts.map((item) => (
                <article key={item.slug} className="pb-4 border-b border-gray-200">
                  <div
                    className="h-1.5 w-full rounded-full mb-2"
                    style={{ background: `linear-gradient(90deg, ${item.stripFrom}, ${item.stripTo})` }}
                    aria-hidden="true"
                  />
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                    {item.category} · {item.readTime}
                  </p>
                  <h4 className="text-lg text-navy tracking-tight mb-1">
                    <Link href={`/blog/${item.slug}`} className="hover:text-brand transition-colors">
                      {item.title}
                    </Link>
                  </h4>
                  <p className="text-sm text-gray-600">{item.excerpt}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-10 pt-6 border-t border-gray-200 flex flex-wrap gap-3 max-w-3xl">
            <Link href="/blog" className="text-sm font-semibold text-brand hover:underline">
              ← Back to Blog
            </Link>
            <Link href="/marketing" className="text-sm font-semibold text-brand hover:underline">
              Explore Software Categories →
            </Link>
          </div>
        </article>

        <aside className="lg:sticky lg:top-24 h-fit space-y-6 border-l border-gray-200 pl-6">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">In this article</h3>
            <nav className="space-y-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block text-sm text-gray-700 hover:text-brand transition-colors"
                >
                  {section.heading}
                </a>
              ))}
            </nav>
          </div>

          <div className="border-t border-gray-200 pt-5">
            <h3 className="text-base font-semibold text-navy mb-2">Need quotes now?</h3>
            <p className="text-sm text-gray-600 mb-3">
              Compare top-rated tools and get matched with providers for your business.
            </p>
            <Link
              href="/technology/get-free-quotes"
              className="inline-flex text-sm font-semibold text-white bg-brand hover:bg-brand-hover px-4 py-2 rounded-lg transition-colors"
            >
              Get Free Quotes
            </Link>
          </div>
        </aside>
      </div>
    </main>
  )
}
