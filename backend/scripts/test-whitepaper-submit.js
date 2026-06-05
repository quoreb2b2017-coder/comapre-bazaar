/**
 * Run: cd backend && node scripts/test-whitepaper-submit.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const https = require('https')
const mongoose = require('mongoose')
const WhitePaper = require('../src/models/whitePaper.model')
const {
  generateWhitePaperSeo,
  uploadPdfToCloudinary,
  uploadThumbnailToCloudinary,
  extractPdfText,
} = require('../src/services/blogAdmin.whitePaper.service')

const steps = []

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = []
      res.on('data', (c) => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
    }).on('error', reject)
  })
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI)
  steps.push('mongo')

  const pdfBuf = await fetchBuffer('https://bitcoin.org/bitcoin.pdf')
  const pdfText = await extractPdfText(pdfBuf)
  steps.push('pdf-text')

  const pdfUp = await uploadPdfToCloudinary(pdfBuf)
  const pngBuf = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64'
  )
  const thumbUp = await uploadThumbnailToCloudinary(pngBuf)
  steps.push('cloudinary')

  const title = 'Test Whitepaper Debug'
  const description = 'Test description for pipeline.'
  const metadata = { offeredBy: 'Compare Bazaar', author: 'Test', category: 'Test' }

  let draft = await WhitePaper.create({
    title,
    description,
    metadata,
    status: 'processing',
    pdfUrl: pdfUp.url,
    pdfPublicId: pdfUp.publicId,
    thumbnailUrl: thumbUp.url,
    thumbnailPublicId: thumbUp.publicId,
  })
  steps.push('create')

  const seo = await generateWhitePaperSeo({ title, description, metadata, pdfText })
  steps.push('seo')

  draft.slug = seo.slug || draft.slug
  draft.seoTitle = seo.seoTitle || title
  draft.metaTitle = seo.metaTitle || title.slice(0, 70)
  draft.metaDescription = seo.metaDescription || description.slice(0, 160)
  draft.metaKeywords = seo.metaKeywords
  draft.ogTitle = seo.ogTitle
  draft.ogDescription = seo.ogDescription
  draft.structuredSeoContent = seo.structuredSeoContent
  draft.status = 'published'
  draft.publishedAt = new Date()
  await draft.save()
  steps.push('save')

  await WhitePaper.findByIdAndDelete(draft._id)
  console.log('OK:', steps.join(' -> '))
  await mongoose.disconnect()
}

run().catch((e) => {
  console.error('FAIL after:', steps.join(' -> '))
  console.error(e.message)
  if (e.errors) console.error(JSON.stringify(e.errors, null, 2))
  process.exit(1)
})
