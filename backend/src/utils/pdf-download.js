/** Force browser download from Cloudinary raw URLs */
function cloudinaryForceDownloadUrl(url) {
  const raw = String(url || '').trim()
  if (!raw) return ''
  if (!raw.includes('res.cloudinary.com')) return raw
  if (raw.includes('fl_attachment')) return raw
  return raw.replace('/upload/', '/upload/fl_attachment/')
}

function safePdfFileName(slug, title) {
  const base = String(slug || title || 'whitepaper')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${base || 'whitepaper'}.pdf`
}

module.exports = { cloudinaryForceDownloadUrl, safePdfFileName }
