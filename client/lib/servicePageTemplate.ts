export function downloadTextFile(filename: string, content: string, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function downloadJsonTemplate(filename: string, data: object) {
  downloadTextFile(filename, JSON.stringify(data, null, 2), 'application/json;charset=utf-8')
}

export function buildComparisonMarkdownTemplate(content: Record<string, unknown> = {}) {
  const author = (content.author || {}) as Record<string, string>
  const products = JSON.stringify(content.products || [], null, 2)
  const table = JSON.stringify(content.table || { headers: [], rows: [] }, null, 2)
  const faqs = JSON.stringify(content.faqs || [], null, 2)
  const toc = JSON.stringify(content.tocItems || [], null, 2)
  const breadcrumbs = JSON.stringify(content.breadcrumbs || [], null, 2)

  return `COMPARE BAZAAR — SERVICE PAGE TEMPLATE
Edit this file in Word, Google Docs, or any text editor, then upload as .docx, .pdf, .txt, or .md

=== SLUG ===
${content.slug || ''}

=== CANONICAL URL ===
${content.canonical || ''}

=== SEO TITLE ===
${content.title || ''}

=== META DESCRIPTION ===
${content.metaDescription || ''}

=== H1 ===
${content.h1 || ''}

=== INTRO ===
${content.intro || ''}

=== WINNER SUMMARY ===
${content.winnerSummary || ''}

=== AUTHOR INITIALS ===
${author.initials || ''}

=== AUTHOR NAME ===
${author.name || ''}

=== AUTHOR CREDENTIAL ===
${author.credential || ''}

=== REVIEWER ===
${content.reviewer || ''}

=== LAST REVIEWED ===
${content.lastReviewed || ''}

=== CTA TITLE ===
${content.ctaTitle || ''}

=== CTA BODY ===
${content.ctaBody || ''}

=== CTA LINK ===
${content.ctaSlug || ''}

=== BREADCRUMBS (JSON) ===
${breadcrumbs}

=== PRODUCTS (JSON) ===
${products}

=== COMPARISON TABLE (JSON) ===
${table}

=== FAQS (JSON) ===
${faqs}

=== TABLE OF CONTENTS (JSON) ===
${toc}
`
}

export function buildQuoteMarkdownTemplate(config: Record<string, unknown> = {}) {
  return `COMPARE BAZAAR — QUOTE PAGE TEMPLATE
Edit this file in Word, Google Docs, or any text editor, then upload as .docx, .pdf, .txt, or .md

=== CANONICAL URL ===
${config.canonical || ''}

=== SEO TITLE ===
${config.baseTitle || ''}

=== META DESCRIPTION ===
${config.baseDescription || ''}

=== H1 ===
${config.baseH1 || ''}

=== VENDOR CATEGORY LABEL ===
${config.vendorCategoryLabel || ''}

=== VENDOR H1 CATEGORY ===
${config.vendorH1Category || ''}

=== VENDOR TITLE SUFFIX ===
${config.vendorTitleSuffix || ''}
`
}

export function downloadWordTemplate(filename: string, markdown: string) {
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Service Page Template</title></head>
<body style="font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; max-width: 800px; margin: 24px;">
<pre style="white-space: pre-wrap; font-family: Consolas, 'Courier New', monospace; font-size: 10pt;">${markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')}</pre>
</body></html>`
  downloadTextFile(filename.replace(/\.md$/, '.doc'), html, 'application/msword;charset=utf-8')
}
