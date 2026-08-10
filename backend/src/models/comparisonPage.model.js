const mongoose = require('mongoose')

const comparisonPageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    vertical: { type: String, trim: true, default: 'general' },
    displayName: { type: String, trim: true, maxlength: 200 },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
    /** Full ComparisonPageData payload */
    content: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedBy: { type: String, trim: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('ComparisonPage', comparisonPageSchema)
