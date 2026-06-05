/** @typedef {{
 *   seoTitle: string
 *   metaTitle: string
 *   metaDescription: string
 *   metaKeywords: string
 *   slug: string
 *   ogTitle: string
 *   ogDescription: string
 *   structuredSeoContent: string
 * }} WhitePaperSeoForm
 */

export const emptySeoForm = () => ({
  seoTitle: '',
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  slug: '',
  ogTitle: '',
  ogDescription: '',
  structuredSeoContent: '',
})

/** @param {Record<string, unknown> | null | undefined} paper */
export function seoFormFromPaper(paper) {
  if (!paper) return emptySeoForm()
  const keywords = Array.isArray(paper.metaKeywords)
    ? paper.metaKeywords.join(', ')
    : String(paper.metaKeywords || '')
  return {
    seoTitle: String(paper.seoTitle || ''),
    metaTitle: String(paper.metaTitle || ''),
    metaDescription: String(paper.metaDescription || ''),
    metaKeywords: keywords,
    slug: String(paper.slug || ''),
    ogTitle: String(paper.ogTitle || ''),
    ogDescription: String(paper.ogDescription || ''),
    structuredSeoContent: String(paper.structuredSeoContent || ''),
  }
}

/** @param {WhitePaperSeoForm} seo */
export function seoFormToPayload(seo) {
  return {
    seoTitle: seo.seoTitle.trim(),
    metaTitle: seo.metaTitle.trim(),
    metaDescription: seo.metaDescription.trim(),
    metaKeywords: seo.metaKeywords
      .split(/[,;\n]/)
      .map((k) => k.trim())
      .filter(Boolean),
    slug: seo.slug.trim(),
    ogTitle: seo.ogTitle.trim(),
    ogDescription: seo.ogDescription.trim(),
    structuredSeoContent: seo.structuredSeoContent.trim(),
  }
}

/**
 * @param {{
 *   seo: WhitePaperSeoForm
 *   onChange: (next: WhitePaperSeoForm) => void
 *   disabled?: boolean
 * }} props
 */
export function WhitePaperSeoFields({ seo, onChange, disabled = false }) {
  const set = (key, value) => onChange({ ...seo, [key]: value })

  return (
    <div className="space-y-4 rounded-lg border border-brand/20 bg-brand/[0.03] p-4 dark:border-brand/30 dark:bg-brand/5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">SEO (Claude generated)</p>
        <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
          Google (meta title, description, keywords) and Open Graph (social share) fields. Review keywords before
          publishing.
        </p>
      </div>

      <SeoField
        label="Page H1 / SEO title"
        value={seo.seoTitle}
        onChange={(v) => set('seoTitle', v)}
        disabled={disabled}
        maxLength={70}
      />
      <SeoField
        label="Google meta title"
        hint="SERP title · max 60 chars"
        value={seo.metaTitle}
        onChange={(v) => set('metaTitle', v)}
        disabled={disabled}
        maxLength={70}
        counter={`${seo.metaTitle.length}/60`}
      />
      <SeoField
        label="Google meta description"
        hint="SERP snippet · 150–160 chars"
        value={seo.metaDescription}
        onChange={(v) => set('metaDescription', v)}
        disabled={disabled}
        textarea
        maxLength={160}
        counter={`${seo.metaDescription.length}/160`}
      />
      <SeoField
        label="Meta keywords"
        hint="Comma-separated — used for Google context & social/OG discovery"
        value={seo.metaKeywords}
        onChange={(v) => set('metaKeywords', v)}
        disabled={disabled}
        textarea
        rows={3}
      />
      <SeoField
        label="URL slug"
        value={seo.slug}
        onChange={(v) => set('slug', v)}
        disabled={disabled}
        mono
        maxLength={120}
      />

      <p className="border-t border-gray-200 pt-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-700">
        Open Graph (Facebook, LinkedIn, WhatsApp)
      </p>
      <SeoField
        label="OG title"
        hint="Social share headline · max 70 chars"
        value={seo.ogTitle}
        onChange={(v) => set('ogTitle', v)}
        disabled={disabled}
        maxLength={70}
      />
      <SeoField
        label="OG description"
        hint="Social preview text · max 200 chars"
        value={seo.ogDescription}
        onChange={(v) => set('ogDescription', v)}
        disabled={disabled}
        textarea
        maxLength={200}
        counter={`${seo.ogDescription.length}/200`}
      />
      <SeoField
        label="Public intro (structured)"
        hint="Short intro on detail page"
        value={seo.structuredSeoContent}
        onChange={(v) => set('structuredSeoContent', v)}
        disabled={disabled}
        textarea
        maxLength={280}
        counter={`${seo.structuredSeoContent.length}/280`}
      />
    </div>
  )
}

function SeoField({ label, hint, value, onChange, disabled, textarea, mono, maxLength, counter, rows = 2 }) {
  const className = `input py-2.5 text-sm ${mono ? 'font-mono text-xs' : ''}`
  return (
    <div className="space-y-1.5">
      <label className="label">{label}</label>
      {textarea ? (
        <textarea
          className={`${className} min-h-[56px] resize-y`}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          maxLength={maxLength}
          readOnly={disabled}
        />
      ) : (
        <input
          type="text"
          className={className}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          maxLength={maxLength}
          readOnly={disabled}
        />
      )}
      <div className="flex justify-between gap-2">
        {hint ? <p className="text-xs text-gray-400">{hint}</p> : <span />}
        {counter ? <p className="shrink-0 text-xs text-gray-400">{counter}</p> : null}
      </div>
    </div>
  )
}
