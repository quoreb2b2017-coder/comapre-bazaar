const mongoose = require('mongoose')
const slugify = require('slugify')

const whitePaperSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 300 },
    description: { type: String, required: true, maxlength: 280 },
    /** Admin-entered metadata (author, offeredBy, category, etc.) */
    metadata: {
      offeredBy: { type: String, trim: true, default: 'Compare Bazaar' },
      author: { type: String, trim: true },
      category: { type: String, trim: true },
      extra: { type: String, trim: true },
    },
    slug: { type: String, unique: true, index: true },
    status: {
      type: String,
      enum: ['processing', 'published', 'unpublished', 'failed'],
      default: 'processing',
    },
    viewCount: { type: Number, default: 0, min: 0 },
    downloadCount: { type: Number, default: 0, min: 0 },
    pdfUrl: { type: String, required: true },
    pdfPublicId: { type: String },
    thumbnailUrl: { type: String, required: true },
    thumbnailPublicId: { type: String },
    /** Claude-generated SEO */
    seoTitle: { type: String },
    metaTitle: { type: String, maxlength: 70 },
    metaDescription: { type: String, maxlength: 160 },
    metaKeywords: [{ type: String, trim: true }],
    ogTitle: { type: String },
    ogDescription: { type: String },
    structuredSeoContent: { type: String },
    pdfTextExcerpt: { type: String },
    publishedAt: { type: Date },
    processingError: { type: String },
    /** Overview paragraph from PDF analysis (public left column) */
    insideOverview: { type: String, maxlength: 600 },
    /** Auto-generated “What’s inside” sections from PDF analysis */
    insideSections: [
      {
        title: { type: String, trim: true, maxlength: 120 },
        summary: { type: String, trim: true, maxlength: 320 },
        body: { type: String, trim: true, maxlength: 1000 },
        pages: { type: String, trim: true, maxlength: 24 },
      },
    ],
    /** Legacy flat bullets — kept for older records */
    insidePoints: {
      type: [{ type: String, trim: true, maxlength: 700 }],
      default: [],
    },
    /** Admin-entered questions shown on download forms */
    highlightQuestions: {
      type: [{ type: String, trim: true, maxlength: 500 }],
      default: [],
    },
    /** PDF-derived social proof quotes (Claude-generated on publish) */
    testimonialsHeading: { type: String, trim: true, maxlength: 80 },
    testimonials: [
      {
        quote: { type: String, trim: true, maxlength: 420 },
        name: { type: String, trim: true, maxlength: 60 },
        initials: { type: String, trim: true, maxlength: 4 },
        role: { type: String, trim: true, maxlength: 80 },
        company: { type: String, trim: true, maxlength: 100 },
      },
    ],
  },
  { timestamps: true }
)

whitePaperSchema.pre('save', async function ensureUniqueSlug() {
  if (!this.isModified('slug') && !this.isNew) return
  let base = this.slug || slugify(this.title, { lower: true, strict: true })
  if (!base) base = `whitepaper-${Date.now()}`
  let candidate = base
  let n = 0
  while (await this.constructor.findOne({ slug: candidate, _id: { $ne: this._id } })) {
    n += 1
    candidate = `${base}-${n}`
  }
  this.slug = candidate
})

module.exports = mongoose.model('WhitePaper', whitePaperSchema)
