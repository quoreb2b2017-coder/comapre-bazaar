/**
 * Debug whitepaper POST pipeline (run from backend/: node scripts/test-whitepaper-submit.mjs)
 */
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import https from 'https'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const steps = []

async function run() {
  const { default: mongoose } = await import('mongoose')
  const pdfParse = (await import('pdf-parse')).default
  const { uploadBufferToCloudinary } = await import('../src/utils/cloudinary-upload.js').catch(() => ({
    uploadBufferToCloudinary: null,
  }))

  // Use require for CJS modules
  const req = await import('module')
  const createRequire = req.createRequire
  const require = createRequire(import.meta.url)

  const WhitePaper = require('../src/models/whitePaper.model')
  const {
    generateWhitePaperSeo,
    uploadPdfToCloudinary,
    uploadThumbnailToCloudinary,
    extractPdfText,
  } = require('../src/services/blogAdmin.whitePaper.service')

  await mongoose.connect(process.env.MONGODB_URI)
  steps.push('mongo connected')

  const pdfBuf = await fetchBuffer('https://bitcoin.org/bitcoin.pdf')
  steps.push(`pdf downloaded ${pdfBuf.length} bytes`)

  const pdfText = await extractPdfText(pdfBuf)
  steps.push(`pdf text ${pdfText.length} chars`)

  const pdfUp = await uploadPdfToCloudinary(pdfBuf)
  steps.push(`cloudinary pdf ${pdfUp.url}`)

  // tiny png
  const pngBuf = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64'
  )
  const thumbUp = await uploadThumbnailToCloudinary(pngBuf)
  steps.push(`cloudinary thumb ${thumbUp.url}`)

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
  steps.push(`draft created ${draft._id} slug=${draft.slug}`)

  const seo = await generateWhitePaperSeo({ title, description, metadata, pdfText })
  steps.push(`seo slug=${seo.slug}`)

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
  steps.push('published ok')

  await WhitePaper.findByIdAndDelete(draft._id)
  steps.push('cleanup done')

  console.log('ALL OK:\n' + steps.join('\n'))
  await mongoose.disconnect()
}

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = []
      res.on('data', (c) => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
    }).on('error', reject)
  })
}

run().catch((e) => {
  console.error('FAILED at:', steps.join(' -> '))
  console.error(e.message)
  console.error(e.stack)
  process.exit(1)
})
