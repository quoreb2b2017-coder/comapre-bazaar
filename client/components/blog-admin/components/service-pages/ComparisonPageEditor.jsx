import { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp, MapPin } from 'lucide-react'

export function inputClass(extra = '') {
  return `w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 ${extra}`
}

export function Field({ label, hint, example, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</span>
      {hint ? <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{hint}</p> : null}
      {example ? (
        <p className="rounded-lg bg-gray-50 px-2.5 py-1.5 text-[11px] italic text-gray-400 dark:bg-gray-800/60">
          Example: {example}
        </p>
      ) : null}
      {children}
    </label>
  )
}

function MetaLengthHint({ value, min = 120, max = 160 }) {
  const len = (value || '').length
  const ok = len >= min && len <= max
  return (
    <p className={`mt-1 text-xs ${ok ? 'text-emerald-600' : len > max ? 'text-red-500' : 'text-amber-600'}`}>
      {len} characters {ok ? '· Good length for Google' : len > max ? `· Too long (max ${max})` : `· Aim for ${min}–${max} chars`}
    </p>
  )
}

function Section({ id, title, description, liveHint, step, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div id={id} className="scroll-mt-28 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-gray-50/90 to-white px-4 py-3.5 text-left dark:border-gray-800 dark:from-gray-800/50 dark:to-gray-900"
      >
        <div className="flex min-w-0 items-start gap-3">
          {step != null ? (
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
              {step}
            </span>
          ) : null}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-navy dark:text-white">{title}</p>
            {description ? <p className="mt-0.5 text-xs text-gray-500">{description}</p> : null}
            {liveHint ? (
              <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-brand/80">
                <MapPin className="h-3 w-3 shrink-0" />
                Live site: {liveHint}
              </p>
            ) : null}
          </div>
        </div>
        {open ? <ChevronUp className="h-4 w-4 shrink-0 text-gray-400" /> : <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />}
      </button>
      {open ? <div className="space-y-4 p-4">{children}</div> : null}
    </div>
  )
}

function StringListEditor({ label, items = [], onChange, placeholder = 'Add item…' }) {
  const updateItem = (index, value) => {
    const next = [...items]
    next[index] = value
    onChange(next)
  }
  const removeItem = (index) => onChange(items.filter((_, i) => i !== index))
  const addItem = () => onChange([...items, ''])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
        <button type="button" onClick={addItem} className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline">
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            className={inputClass()}
            value={item}
            placeholder={placeholder}
            onChange={(e) => updateItem(index, e.target.value)}
          />
          <button type="button" onClick={() => removeItem(index)} className="rounded-xl border border-gray-200 p-2 text-gray-400 hover:text-red-500 dark:border-gray-700">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      {items.length === 0 ? <p className="text-xs text-gray-400">No items — click Add</p> : null}
    </div>
  )
}

function ProductEditor({ product, index, onChange, onRemove }) {
  const update = (field, value) => onChange({ ...product, [field]: value })

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/30">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-navy dark:text-white">
          Product #{index + 1}: {product.name || 'Untitled'}
        </p>
        <button type="button" onClick={onRemove} className="inline-flex items-center gap-1 text-xs text-red-500 hover:underline">
          <Trash2 className="h-3 w-3" /> Remove
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="ID (slug)" hint="Internal identifier — used in compare URLs. Do not change unless needed.">
          <input className={inputClass()} value={product.id || ''} onChange={(e) => update('id', e.target.value)} />
        </Field>
        <Field label="Logo initials" hint="2–3 letters shown in the vendor card box." example="HS for HubSpot">
          <input className={inputClass()} value={product.logo || ''} onChange={(e) => update('logo', e.target.value)} />
        </Field>
        <Field label="Product name" hint="Full vendor name on the card heading.">
          <input className={inputClass()} value={product.name || ''} onChange={(e) => update('name', e.target.value)} />
        </Field>
        <Field label="Tagline" hint="One-line summary under the product name.">
          <input className={inputClass()} value={product.tagline || ''} onChange={(e) => update('tagline', e.target.value)} />
        </Field>
        <Field label="Expert score" hint="Rating out of 5.0 — shown in the score badge.">
          <input className={inputClass()} value={product.score || ''} onChange={(e) => update('score', e.target.value)} />
        </Field>
        <Field label="Review count" hint="Number of reviews (optional).">
          <input className={inputClass()} type="number" value={product.reviewCount ?? ''} onChange={(e) => update('reviewCount', Number(e.target.value) || 0)} />
        </Field>
        <Field label="Pricing label" hint="Text before the price." example="Starts from">
          <input className={inputClass()} value={product.pricingLabel || ''} onChange={(e) => update('pricingLabel', e.target.value)} />
        </Field>
        <Field label="Pricing amount" hint="Price number or text." example="$45">
          <input className={inputClass()} value={product.pricingAmount || ''} onChange={(e) => update('pricingAmount', e.target.value)} />
        </Field>
        <Field label="Pricing period" hint="Billing period after the price." example="/user/mo">
          <input className={inputClass()} value={product.pricingPeriod || ''} onChange={(e) => update('pricingPeriod', e.target.value)} />
        </Field>
        <Field label="Review slug" hint="Link to full review page on Compare Bazaar.">
          <input className={inputClass()} value={product.reviewSlug || ''} onChange={(e) => update('reviewSlug', e.target.value)} />
        </Field>
        <Field label="Vendor website URL" hint="Affiliate link for Visit website button.">
          <input className={inputClass()} value={product.vendorUrl || ''} onChange={(e) => update('vendorUrl', e.target.value)} />
        </Field>
        <Field label="Quote URL (optional)" hint="Override quote link for this product only.">
          <input className={inputClass()} value={product.quoteUrl || ''} onChange={(e) => update('quoteUrl', e.target.value)} />
        </Field>
        <label className="flex items-center gap-2 rounded-xl border border-cb-orange/20 bg-cb-orange/5 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300">
          <input type="checkbox" checked={Boolean(product.isTopPick)} onChange={(e) => update('isTopPick', e.target.checked)} />
          <span>
            <span className="font-medium">Editor&apos;s pick</span>
            <span className="block text-xs text-gray-500">Highlights this product as #1 with orange badge</span>
          </span>
        </label>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <StringListEditor label="Pros" items={product.pros || []} onChange={(pros) => update('pros', pros)} placeholder="Add a pro…" />
        <StringListEditor label="Cons" items={product.cons || []} onChange={(cons) => update('cons', cons)} placeholder="Add a con…" />
      </div>
    </div>
  )
}

function FaqEditor({ faqs = [], onChange }) {
  const updateFaq = (index, field, value) => {
    const next = [...faqs]
    next[index] = { ...next[index], [field]: value }
    onChange(next)
  }
  const addFaq = () => onChange([...faqs, { question: '', answer: '' }])
  const removeFaq = (index) => onChange(faqs.filter((_, i) => i !== index))

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div key={index} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500">FAQ #{index + 1}</p>
            <button type="button" onClick={() => removeFaq(index)} className="text-xs text-red-500 hover:underline">
              Remove
            </button>
          </div>
          <Field label="Question">
            <input className={inputClass()} value={faq.question || ''} onChange={(e) => updateFaq(index, 'question', e.target.value)} />
          </Field>
          <Field label="Answer">
            <textarea className={inputClass('mt-2 min-h-[80px]')} value={faq.answer || ''} onChange={(e) => updateFaq(index, 'answer', e.target.value)} />
          </Field>
        </div>
      ))}
      <button type="button" onClick={addFaq} className="inline-flex items-center gap-1 rounded-xl border border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-brand hover:bg-brand/5 dark:border-gray-600">
        <Plus className="h-4 w-4" /> Add FAQ
      </button>
    </div>
  )
}

function TableEditor({ table = { headers: [], rows: [] }, onChange }) {
  const headers = table.headers || []
  const rows = table.rows || []

  const updateHeader = (index, value) => {
    const nextHeaders = [...headers]
    nextHeaders[index] = value
    onChange({ headers: nextHeaders, rows })
  }

  const addHeader = () => {
    onChange({ headers: [...headers, 'New column'], rows: rows.map((r) => ({ cells: [...(r.cells || []), ''] })) })
  }

  const removeHeader = (index) => {
    onChange({
      headers: headers.filter((_, i) => i !== index),
      rows: rows.map((r) => ({ cells: (r.cells || []).filter((_, i) => i !== index) })),
    })
  }

  const updateCell = (rowIndex, cellIndex, value) => {
    const nextRows = rows.map((r, ri) => {
      if (ri !== rowIndex) return r
      const cells = [...(r.cells || [])]
      cells[cellIndex] = value
      return { cells }
    })
    onChange({ headers, rows: nextRows })
  }

  const addRow = () => onChange({ headers, rows: [...rows, { cells: headers.map(() => '') }] })
  const removeRow = (index) => onChange({ headers, rows: rows.filter((_, i) => i !== index) })

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Table headers</p>
          <button type="button" onClick={addHeader} className="text-xs font-medium text-brand hover:underline">
            + Add column
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {headers.map((header, index) => (
            <div key={index} className="flex min-w-[140px] flex-1 gap-1">
              <input className={inputClass()} value={header} onChange={(e) => updateHeader(index, e.target.value)} />
              <button type="button" onClick={() => removeHeader(index)} className="rounded-lg p-2 text-gray-400 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Table rows</p>
          <button type="button" onClick={addRow} className="text-xs font-medium text-brand hover:underline">
            + Add row
          </button>
        </div>
        <div className="space-y-2">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="rounded-xl border border-gray-200 p-3 dark:border-gray-700">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs text-gray-500">Row {rowIndex + 1}</p>
                <button type="button" onClick={() => removeRow(rowIndex)} className="text-xs text-red-500 hover:underline">
                  Remove row
                </button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {headers.map((header, cellIndex) => (
                  <Field key={cellIndex} label={header || `Col ${cellIndex + 1}`}>
                    <input
                      className={inputClass()}
                      value={(row.cells || [])[cellIndex] || ''}
                      onChange={(e) => updateCell(rowIndex, cellIndex, e.target.value)}
                    />
                  </Field>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BreadcrumbEditor({ breadcrumbs = [], onChange }) {
  const update = (index, field, value) => {
    const next = [...breadcrumbs]
    next[index] = { ...next[index], [field]: value }
    onChange(next)
  }
  const add = () => onChange([...breadcrumbs, { label: '', href: '' }])
  const remove = (index) => onChange(breadcrumbs.filter((_, i) => i !== index))

  return (
    <div className="space-y-2">
      {breadcrumbs.map((crumb, index) => (
        <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <input className={inputClass()} placeholder="Label" value={crumb.label || ''} onChange={(e) => update(index, 'label', e.target.value)} />
          <input className={inputClass()} placeholder="Href (optional)" value={crumb.href || ''} onChange={(e) => update(index, 'href', e.target.value)} />
          <button type="button" onClick={() => remove(index)} className="rounded-xl border border-gray-200 p-2 text-gray-400 hover:text-red-500 dark:border-gray-700">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className="text-xs font-medium text-brand hover:underline">
        + Add breadcrumb
      </button>
    </div>
  )
}

function TocEditor({ tocItems = [], onChange }) {
  const update = (index, field, value) => {
    const next = [...tocItems]
    next[index] = { ...next[index], [field]: value }
    onChange(next)
  }
  const add = () => onChange([...tocItems, { label: '', anchor: '' }])
  const remove = (index) => onChange(tocItems.filter((_, i) => i !== index))

  return (
    <div className="space-y-2">
      {tocItems.map((item, index) => (
        <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <input className={inputClass()} placeholder="Label" value={item.label || ''} onChange={(e) => update(index, 'label', e.target.value)} />
          <input className={inputClass()} placeholder="Anchor id" value={item.anchor || ''} onChange={(e) => update(index, 'anchor', e.target.value)} />
          <button type="button" onClick={() => remove(index)} className="rounded-xl border border-gray-200 p-2 text-gray-400 hover:text-red-500 dark:border-gray-700">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className="text-xs font-medium text-brand hover:underline">
        + Add TOC item
      </button>
    </div>
  )
}

const EMPTY_PRODUCT = {
  id: '',
  logo: '',
  name: '',
  tagline: '',
  score: '4.0',
  reviewCount: 0,
  badges: [],
  pros: [],
  cons: [],
  pricingLabel: 'Starts from',
  pricingAmount: '',
  pricingPeriod: '',
  vendorUrl: '',
  reviewSlug: '',
}

export function ComparisonPageEditor({ content, onChange }) {
  if (!content) return null

  const update = (field, value) => onChange({ ...content, [field]: value })

  const updateProducts = (products) => update('products', products)
  const addProduct = () => updateProducts([...(content.products || []), { ...EMPTY_PRODUCT, id: `product-${Date.now()}` }])

  return (
    <div className="max-h-[calc(100vh-10rem)] space-y-4 overflow-y-auto pr-1">
      <Section
        id="section-seo"
        step={1}
        title="SEO & metadata"
        description="Controls how the page appears in Google search results"
        liveHint="Browser tab title, search snippet, and canonical URL"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="SEO title" hint="Shows in Google results and browser tab. Keep under 60 characters." example="Best CRM Software 2026 | Compare Bazaar">
            <input className={inputClass()} value={content.title || ''} onChange={(e) => update('title', e.target.value)} />
          </Field>
          <Field label="Canonical URL" hint="The official URL for this page. Usually do not change.">
            <input className={inputClass()} value={content.canonical || ''} onChange={(e) => update('canonical', e.target.value)} />
          </Field>
          <div className="md:col-span-2">
            <Field label="H1 heading" hint="Main headline visitors see at the top of the page.">
              <input className={inputClass()} value={content.h1 || ''} onChange={(e) => update('h1', e.target.value)} />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Meta description" hint="Short summary shown in Google search results below the title.">
              <textarea className={inputClass('min-h-[88px]')} value={content.metaDescription || ''} onChange={(e) => update('metaDescription', e.target.value)} />
              <MetaLengthHint value={content.metaDescription} />
            </Field>
          </div>
        </div>
      </Section>

      <Section
        id="section-hero"
        step={2}
        title="Hero & intro"
        description="Top of page — breadcrumb, intro paragraph, author trust bar"
        liveHint="Hero section below the site header"
      >
        <Field label="Intro paragraph" hint="2–3 sentences explaining what this page compares and who it is for.">
          <textarea className={inputClass('min-h-[120px]')} value={content.intro || ''} onChange={(e) => update('intro', e.target.value)} />
        </Field>
        <Field label="Breadcrumbs" hint="Navigation trail at top. Label = text shown, Href = link path.">
          <BreadcrumbEditor breadcrumbs={content.breadcrumbs || []} onChange={(breadcrumbs) => update('breadcrumbs', breadcrumbs)} />
        </Field>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Author initials" hint="Shown in author avatar circle.">
            <input className={inputClass()} value={content.author?.initials || ''} onChange={(e) => update('author', { ...(content.author || {}), initials: e.target.value })} />
          </Field>
          <Field label="Author name" hint="Full name in the author bar.">
            <input className={inputClass()} value={content.author?.name || ''} onChange={(e) => update('author', { ...(content.author || {}), name: e.target.value })} />
          </Field>
          <Field label="Author credential" hint="Job title or expertise line.">
            <input className={inputClass()} value={content.author?.credential || ''} onChange={(e) => update('author', { ...(content.author || {}), credential: e.target.value })} />
          </Field>
          <Field label="Reviewer" hint="Name of person who fact-checked the page.">
            <input className={inputClass()} value={content.reviewer || ''} onChange={(e) => update('reviewer', e.target.value)} />
          </Field>
          <Field label="Last reviewed" hint="Date shown as trust signal." example="March 2026">
            <input className={inputClass()} value={content.lastReviewed || ''} onChange={(e) => update('lastReviewed', e.target.value)} />
          </Field>
        </div>
      </Section>

      <Section
        id="section-verdict"
        step={3}
        title="Quick verdict"
        description="Short summary of the winner — first thing readers see"
        liveHint="Quick verdict box at top of content area"
      >
        <Field label="Winner summary" hint="1–2 sentences. Use <strong> tags to bold the winner name." example="<strong>HubSpot</strong> is our top pick for…">
          <textarea className={inputClass('min-h-[100px]')} value={content.winnerSummary || ''} onChange={(e) => update('winnerSummary', e.target.value)} />
        </Field>
      </Section>

      <Section
        id="section-products"
        step={4}
        title={`Products (${(content.products || []).length})`}
        description="Vendor cards ranked #1, #2, #3… with score, pros, cons, pricing"
        liveHint="Our top picks section — one card per vendor"
      >
        <div className="space-y-4">
          {(content.products || []).map((product, index) => (
            <ProductEditor
              key={product.id || index}
              product={product}
              index={index}
              onChange={(updated) => {
                const next = [...content.products]
                next[index] = updated
                updateProducts(next)
              }}
              onRemove={() => updateProducts(content.products.filter((_, i) => i !== index))}
            />
          ))}
          <button type="button" onClick={addProduct} className="inline-flex items-center gap-1 rounded-xl border border-dashed border-gray-300 px-4 py-2.5 text-sm font-medium text-brand hover:bg-brand/5 dark:border-gray-600">
            <Plus className="h-4 w-4" /> Add product
          </button>
        </div>
      </Section>

      <Section
        id="section-table"
        step={5}
        title="Comparison table"
        description="Side-by-side feature and pricing comparison"
        liveHint="Full comparison table section"
      >
        <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
          Tip: Use ✓ for yes and ✗ for no in table cells. First column is usually the feature name.
        </p>
        <TableEditor table={content.table || { headers: [], rows: [] }} onChange={(table) => update('table', table)} />
      </Section>

      <Section
        id="section-faqs"
        step={6}
        title={`FAQs (${(content.faqs || []).length})`}
        description="Questions and answers for SEO and reader trust"
        liveHint="FAQ accordion at bottom of page"
      >
        <FaqEditor faqs={content.faqs || []} onChange={(faqs) => update('faqs', faqs)} />
      </Section>

      <Section
        id="section-cta"
        step={7}
        title="Call to action"
        description="Sidebar quote box — drives readers to get free quotes"
        liveHint="Sticky sidebar CTA on the right"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="CTA title" hint="Bold headline in the sidebar box." example="Get free CRM quotes">
            <input className={inputClass()} value={content.ctaTitle || ''} onChange={(e) => update('ctaTitle', e.target.value)} />
          </Field>
          <Field label="CTA link" hint="Page path for the quote form." example="/marketing/best-crm-software/get-free-quotes">
            <input className={inputClass()} value={content.ctaSlug || ''} onChange={(e) => update('ctaSlug', e.target.value)} />
          </Field>
          <div className="md:col-span-2">
            <Field label="CTA body" hint="Short paragraph explaining the quote service.">
              <textarea className={inputClass('min-h-[88px]')} value={content.ctaBody || ''} onChange={(e) => update('ctaBody', e.target.value)} />
            </Field>
          </div>
        </div>
      </Section>

      <Section
        id="section-toc"
        step={8}
        title="Table of contents"
        description="Sidebar jump links — usually leave as default"
        liveHint="On this page links in sidebar"
        defaultOpen={false}
      >
        <TocEditor tocItems={content.tocItems || []} onChange={(tocItems) => update('tocItems', tocItems)} />
      </Section>
    </div>
  )
}

export function QuotePageEditor({ config, onChange }) {
  if (!config) return null

  const update = (field, value) => onChange({ ...config, [field]: value })

  return (
    <div className="max-h-[calc(100vh-10rem)] space-y-4 overflow-y-auto pr-1">
      <Section
        id="section-quote-seo"
        step={1}
        title="SEO & metadata"
        description="How the quote page appears in Google and browser tab"
        liveHint="Search results and page header"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="SEO title" hint="Browser tab and Google title. Include year and benefit.">
            <input className={inputClass()} value={config.baseTitle || ''} onChange={(e) => update('baseTitle', e.target.value)} />
          </Field>
          <Field label="Canonical URL" hint="Official URL — usually do not change.">
            <input className={inputClass()} value={config.canonical || ''} onChange={(e) => update('canonical', e.target.value)} />
          </Field>
          <div className="md:col-span-2">
            <Field label="H1 heading" hint="Main headline on the quote landing page.">
              <input className={inputClass()} value={config.baseH1 || ''} onChange={(e) => update('baseH1', e.target.value)} />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Meta description" hint="Google search snippet — aim for 120–160 characters.">
              <textarea className={inputClass('min-h-[88px]')} value={config.baseDescription || ''} onChange={(e) => update('baseDescription', e.target.value)} />
              <MetaLengthHint value={config.baseDescription} />
            </Field>
          </div>
        </div>
      </Section>

      <Section
        id="section-quote-vendor"
        step={2}
        title="Vendor-specific copy"
        description="Text changes when visitor arrives with ?vendor= in the URL"
        liveHint="Dynamic headline on quote form page"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Vendor category label" hint="Category name used in vendor-specific titles." example="CRM software">
            <input className={inputClass()} value={config.vendorCategoryLabel || ''} onChange={(e) => update('vendorCategoryLabel', e.target.value)} />
          </Field>
          <Field label="Vendor H1 category" hint="Part of the H1 when a vendor is selected.">
            <input className={inputClass()} value={config.vendorH1Category || ''} onChange={(e) => update('vendorH1Category', e.target.value)} />
          </Field>
          <Field label="Vendor title suffix" hint="Appended to SEO title for vendor pages.">
            <input className={inputClass()} value={config.vendorTitleSuffix || ''} onChange={(e) => update('vendorTitleSuffix', e.target.value)} />
          </Field>
        </div>
      </Section>
    </div>
  )
}
