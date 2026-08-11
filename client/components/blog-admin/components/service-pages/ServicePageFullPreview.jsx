import { resolveComparisonTocItems } from '@/lib/comparisonToc'

function PreviewSection({ title, children, className = '' }) {
  return (
    <section className={`border-b border-gray-100 pb-6 last:border-0 last:pb-0 dark:border-gray-800 ${className}`}>
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-brand">{title}</h3>
      {children}
    </section>
  )
}

function PreviewLabel({ children, className = '' }) {
  return <p className={`mb-1 text-xs font-medium text-gray-400 ${className}`}>{children}</p>
}

export function ComparisonFullPreview({ content, expanded = false }) {
  if (!content) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/50">
        Select a page to preview full content
      </div>
    )
  }

  const products = content.products || []
  const faqs = content.faqs || []
  const table = content.table || {}

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="border-b border-gray-100 bg-gradient-to-r from-navy/5 to-brand/5 px-5 py-4 dark:border-gray-800">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-brand">Live site preview</p>
        <p className="mt-1 text-xs text-gray-500">How this page will look on the public website after you Save & publish</p>
      </div>

      <div
        className={`space-y-6 overflow-y-auto p-5 sm:p-6 ${
          expanded ? '' : 'max-h-[calc(100vh-10rem)]'
        }`}
      >
        <PreviewSection title="SEO & metadata">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <PreviewLabel>Title tag</PreviewLabel>
              <p className="text-sm font-medium text-navy dark:text-gray-100">{content.title || '—'}</p>
            </div>
            <div>
              <PreviewLabel>Canonical URL</PreviewLabel>
              <p className="break-all text-sm text-gray-600 dark:text-gray-300">{content.canonical || '—'}</p>
            </div>
            <div className="sm:col-span-2">
              <PreviewLabel>Meta description ({(content.metaDescription || '').length} chars)</PreviewLabel>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{content.metaDescription || '—'}</p>
            </div>
          </div>
        </PreviewSection>

        <PreviewSection title="Hero & H1">
          {content.breadcrumbs?.length ? (
            <p className="mb-3 text-xs text-gray-500">
              {content.breadcrumbs.map((b) => b.label).join(' › ')}
            </p>
          ) : null}
          <span className="inline-flex rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
            H1
          </span>
          <h2 className="mt-2 font-serif text-2xl leading-snug text-navy dark:text-white">{content.h1 || '—'}</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{content.intro || '—'}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
            <span>Author: {content.author?.name || '—'}</span>
            <span>·</span>
            <span>Reviewer: {content.reviewer || '—'}</span>
            <span>·</span>
            <span>Last reviewed: {content.lastReviewed || '—'}</span>
          </div>
          {content.author?.credential ? (
            <p className="mt-1 text-xs text-gray-400">{content.author.credential}</p>
          ) : null}
        </PreviewSection>

        <PreviewSection title="Quick verdict">
          {content.winnerSummary ? (
            <div
              className="prose prose-sm max-w-none text-gray-700 dark:prose-invert dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: content.winnerSummary }}
            />
          ) : (
            <p className="text-sm text-gray-400">No winner summary</p>
          )}
        </PreviewSection>

        <PreviewSection title={`Products (${products.length})`}>
          <div className="space-y-4">
            {products.map((product, index) => (
              <div
                key={product.id || index}
                className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 dark:border-gray-700 dark:bg-gray-800/50"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-brand">#{index + 1}{product.isTopPick ? ' · Top Pick' : ''}</p>
                    <p className="text-base font-semibold text-navy dark:text-white">
                      {product.logo ? `${product.logo} · ` : ''}{product.name || 'Unnamed product'}
                    </p>
                    <p className="text-sm text-gray-500">{product.tagline || '—'}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-semibold text-navy dark:text-white">Score: {product.score || '—'}/5</p>
                    <p className="text-gray-500">{product.reviewCount?.toLocaleString?.() || 0} reviews</p>
                    <p className="mt-1 font-medium text-brand">
                      {product.pricingLabel} {product.pricingAmount}{product.pricingPeriod}
                    </p>
                  </div>
                </div>
                {product.badges?.length ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {product.badges.map((badge, i) => (
                      <span key={i} className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-gray-600 ring-1 ring-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-600">
                        {badge.label}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">Pros</p>
                    <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-gray-600 dark:text-gray-300">
                      {(product.pros || []).map((pro, i) => (
                        <li key={i}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-red-500">Cons</p>
                    <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-gray-600 dark:text-gray-300">
                      {(product.cons || []).map((con, i) => (
                        <li key={i}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="mt-2 break-all text-[10px] text-gray-400">Review: /reviews/{product.reviewSlug || '—'}</p>
              </div>
            ))}
            {products.length === 0 ? <p className="text-sm text-gray-400">No products</p> : null}
          </div>
        </PreviewSection>

        <PreviewSection title="Comparison table">
          {table.headers?.length ? (
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    {table.headers.map((header, i) => (
                      <th key={i} className="whitespace-nowrap px-3 py-2 font-semibold text-navy dark:text-gray-100">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {(table.rows || []).map((row, ri) => (
                    <tr key={ri} className="bg-white dark:bg-gray-900">
                      {(row.cells || []).map((cell, ci) => (
                        <td key={ci} className="whitespace-nowrap px-3 py-2 text-gray-600 dark:text-gray-300">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No comparison table</p>
          )}
        </PreviewSection>

        <PreviewSection title={`FAQs (${faqs.length})`}>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-gray-200 p-3 dark:border-gray-700">
                <p className="text-sm font-semibold text-navy dark:text-white">{faq.question}</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
            {faqs.length === 0 ? <p className="text-sm text-gray-400">No FAQs</p> : null}
          </div>
        </PreviewSection>

        <PreviewSection title="Call to action">
          <div className="rounded-xl bg-navy/5 p-4 dark:bg-navy/20">
            <p className="text-sm font-semibold text-navy dark:text-white">{content.ctaTitle || '—'}</p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{content.ctaBody || '—'}</p>
            <p className="mt-2 break-all text-xs text-brand">{content.ctaSlug || '—'}</p>
          </div>
        </PreviewSection>

        {content ? (
          <PreviewSection title="Table of contents (live sidebar)">
            <ul className="list-disc space-y-1 pl-4 text-sm text-gray-600 dark:text-gray-300">
              {resolveComparisonTocItems(content).map((item) => (
                <li key={item.anchor}>
                  {item.label}{' '}
                  <span className="text-xs text-brand">
                    → {content.canonical || ''}#{item.anchor}
                  </span>
                </li>
              ))}
            </ul>
          </PreviewSection>
        ) : null}
      </div>
    </div>
  )
}

export function QuoteFullPreview({ config, expanded = false }) {
  if (!config) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/50">
        Select a quote page to preview full content
      </div>
    )
  }

  const vendorH1Example = config.vendorH1Category
    ? `Get a Free ${config.vendorH1Category} Quote from HubSpot`
    : '—'

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="border-b border-gray-100 bg-gradient-to-r from-navy/5 to-brand/5 px-5 py-4 dark:border-gray-800">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-brand">Full page preview</p>
        <p className="mt-1 text-xs text-gray-500">All SEO & copy fields for the quote landing page</p>
      </div>

      <div
        className={`space-y-6 overflow-y-auto p-5 sm:p-6 ${
          expanded ? '' : 'max-h-[calc(100vh-10rem)]'
        }`}
      >
        <PreviewSection title="SEO & metadata">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <PreviewLabel>SEO title (default)</PreviewLabel>
              <p className="text-sm font-medium text-navy dark:text-gray-100">{config.baseTitle || '—'}</p>
            </div>
            <div>
              <PreviewLabel>Canonical URL</PreviewLabel>
              <p className="break-all text-sm text-gray-600 dark:text-gray-300">{config.canonical || '—'}</p>
            </div>
            <div className="sm:col-span-2">
              <PreviewLabel>Meta description ({(config.baseDescription || '').length} chars)</PreviewLabel>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{config.baseDescription || '—'}</p>
            </div>
          </div>
        </PreviewSection>

        <PreviewSection title="Hero & H1">
          <span className="inline-flex rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
            H1 (default)
          </span>
          <h2 className="mt-2 font-serif text-2xl leading-snug text-navy dark:text-white">{config.baseH1 || '—'}</h2>
        </PreviewSection>

        <PreviewSection title="Vendor-specific copy">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <PreviewLabel>Vendor category label</PreviewLabel>
              <p className="text-sm text-gray-700 dark:text-gray-200">{config.vendorCategoryLabel || '—'}</p>
            </div>
            <div>
              <PreviewLabel>Vendor H1 category</PreviewLabel>
              <p className="text-sm text-gray-700 dark:text-gray-200">{config.vendorH1Category || '—'}</p>
            </div>
            <div>
              <PreviewLabel>Vendor title suffix</PreviewLabel>
              <p className="text-sm text-gray-700 dark:text-gray-200">{config.vendorTitleSuffix || '—'}</p>
            </div>
          </div>
        </PreviewSection>

        <PreviewSection title="Vendor URL preview (when ?vendor= is set)">
          <PreviewLabel>Example H1 with vendor param</PreviewLabel>
          <h2 className="font-serif text-xl text-navy dark:text-white">{vendorH1Example}</h2>
          <PreviewLabel className="mt-4">Example SEO title with vendor</PreviewLabel>
          <p className="text-sm text-gray-700 dark:text-gray-200">
            [Vendor Name] {config.vendorTitleSuffix || 'Quote'}
          </p>
          <PreviewLabel className="mt-4">Example meta description with vendor</PreviewLabel>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Ready to try [Vendor]? Get a free quote today and see if it is the right {config.vendorCategoryLabel || 'software'} for your business.
          </p>
        </PreviewSection>
      </div>
    </div>
  )
}
