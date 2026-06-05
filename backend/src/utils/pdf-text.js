const pdfParse = require('pdf-parse')

/** Extract plain text from a PDF buffer (capped for Claude prompts). */
async function extractPdfText(buffer, maxChars = 28000) {
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0) {
    return ''
  }

  try {
    const data = await pdfParse(buffer, { max: 0 })
const text = String(data?.text || '')
      .replace(/\r\n/g, '\n')
      .replace(/[^\S\n]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
    if (!text) return ''
    if (text.length <= maxChars) return text
    return `${text.slice(0, maxChars)}…`
  } catch (err) {
    console.warn('PDF text extraction failed:', err?.message || err)
    return ''
  }
}

module.exports = { extractPdfText }
