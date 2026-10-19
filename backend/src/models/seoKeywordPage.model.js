const mongoose = require('mongoose')

const PAGE_TYPES = [
  'homepage',
  'category',
  'comparison',
  'product',
  'blog',
  'landing',
  'quote',
  'whitepaper',
  'other',
]

const ANALYSIS_STATUS = ['never', 'queued', 'processing', 'done', 'failed']

const seoKeywordPageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    path: { type: String, required: true, trim: true, index: true },
    title: { type: String, trim: true, default: '' },
    pageType: {
      type: String,
      enum: PAGE_TYPES,
      default: 'other',
      index: true,
    },
    discoveredFrom: {
      type: String,
      enum: ['sitemap', 'cms', 'manual', 'internal'],
      default: 'sitemap',
    },
    analysisStatus: {
      type: String,
      enum: ANALYSIS_STATUS,
      default: 'never',
      index: true,
    },
    lastAnalyzedAt: { type: Date, default: null },
    lastAnalysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SeoKeywordAnalysis',
      default: null,
    },
  },
  { timestamps: true }
)

seoKeywordPageSchema.index({ url: 1 }, { unique: true })
seoKeywordPageSchema.index({ title: 'text', path: 'text', url: 'text' })

module.exports = mongoose.model('SeoKeywordPage', seoKeywordPageSchema)
module.exports.PAGE_TYPES = PAGE_TYPES
module.exports.ANALYSIS_STATUS = ANALYSIS_STATUS
