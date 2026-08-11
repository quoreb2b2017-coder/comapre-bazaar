const mongoose = require('mongoose')

const quotePageConfigSchema = new mongoose.Schema(
  {
    pageKey: { type: String, required: true, unique: true, index: true, trim: true },
    vertical: { type: String, trim: true, default: 'general' },
    displayName: { type: String, trim: true, maxlength: 200 },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
    baseTitle: { type: String, trim: true, maxlength: 120 },
    canonical: { type: String, trim: true, maxlength: 300 },
    baseDescription: { type: String, trim: true, maxlength: 320 },
    vendorCategoryLabel: { type: String, trim: true, maxlength: 120 },
    vendorTitleSuffix: { type: String, trim: true, maxlength: 120 },
    baseH1: { type: String, trim: true, maxlength: 200 },
    vendorH1Category: { type: String, trim: true, maxlength: 120 },
    landingContent: { type: mongoose.Schema.Types.Mixed, default: null },
    updatedBy: { type: String, trim: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('QuotePageConfig', quotePageConfigSchema)
