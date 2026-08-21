const mongoose = require('mongoose')

const blogExcelQueueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    /** Slug key from Excel category (any value), e.g. voip, hr-software */
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    /** Display label as written in Excel */
    categoryLabel: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['queued', 'processing', 'done', 'failed', 'skipped'],
      default: 'queued',
      index: true,
    },
    batchId: {
      type: String,
      index: true,
    },
    sourceFileName: {
      type: String,
      default: '',
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      default: null,
    },
    blogSlug: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: '',
    },
    processedAt: {
      type: Date,
      default: null,
    },
    uploadedBy: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

blogExcelQueueSchema.index({ status: 1, category: 1, createdAt: 1 })

module.exports = mongoose.model('BlogExcelQueue', blogExcelQueueSchema)
