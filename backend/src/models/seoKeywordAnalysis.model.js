const mongoose = require('mongoose')

const ACTIONS = ['KEEP', 'ADD', 'REPLACE', 'REMOVE', 'INVESTIGATE']

const recommendationSchema = new mongoose.Schema(
  {
    action: { type: String, enum: ACTIONS, required: true },
    currentKeyword: { type: String, trim: true, default: '' },
    proposedKeyword: { type: String, trim: true, default: '' },
    searchIntent: { type: String, trim: true, default: '' },
    searchVolume: { type: Number, default: null },
    searchVolumeSource: { type: String, trim: true, default: '' },
    keywordDifficulty: { type: Number, default: null },
    keywordDifficultySource: { type: String, trim: true, default: '' },
    currentRanking: { type: Number, default: null },
    impressions: { type: Number, default: null },
    clicks: { type: Number, default: null },
    ctr: { type: Number, default: null },
    gscSource: { type: String, trim: true, default: '' },
    relevance: { type: Number, default: null },
    opportunityScore: { type: Number, default: null },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    reasoning: { type: String, trim: true, default: '' },
    suggestedPlacement: { type: String, trim: true, default: '' },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    metricKind: {
      type: String,
      enum: ['verified', 'estimate', 'unavailable'],
      default: 'unavailable',
    },
    /** True when demand looks strong (verified high volume OR AI commercial-demand flag). */
    highSearchCandidate: { type: Boolean, default: false },
    demandTier: {
      type: String,
      enum: ['high', 'medium', 'low', ''],
      default: '',
    },
    /** ai = Claude suggestion, manual = user typed */
    source: {
      type: String,
      enum: ['ai', 'manual'],
      default: 'ai',
    },
  },
  { _id: true }
)

const seoKeywordAnalysisSchema = new mongoose.Schema(
  {
    pageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SeoKeywordPage',
      default: null,
      index: true,
    },
    pageUrl: { type: String, required: true, trim: true, index: true },
    pagePath: { type: String, trim: true, default: '' },
    pageTitle: { type: String, trim: true, default: '' },
    pageType: { type: String, trim: true, default: 'other' },
    region: {
      country: { type: String, trim: true, default: 'US' },
      region: { type: String, trim: true, default: '' },
      city: { type: String, trim: true, default: '' },
      language: { type: String, trim: true, default: 'en' },
      searchEngine: { type: String, trim: true, default: 'google' },
      audience: { type: String, trim: true, default: '' },
    },
    status: {
      type: String,
      enum: ['queued', 'processing', 'done', 'failed'],
      default: 'queued',
      index: true,
    },
    existingKeywords: [{ type: String, trim: true }],
    recommendations: [recommendationSchema],
    seoSuggestions: {
      title: {
        current: { type: String, default: '' },
        proposed: { type: String, default: '' },
      },
      metaDescription: {
        current: { type: String, default: '' },
        proposed: { type: String, default: '' },
      },
      h1: {
        current: { type: String, default: '' },
        proposed: { type: String, default: '' },
      },
      headingStructure: { type: String, default: '' },
      keywordPlacement: { type: String, default: '' },
      missingSubtopics: [{ type: String }],
      internalLinks: [{ type: String }],
      contentQuality: { type: String, default: '' },
      structuredData: { type: String, default: '' },
    },
    contentSnapshot: { type: String, default: '' },
    dataSources: {
      claude: { type: Boolean, default: false },
      dataForSeo: { type: Boolean, default: false },
      googleAds: { type: Boolean, default: false },
      gsc: { type: Boolean, default: false },
      notes: [{ type: String }],
    },
    scoringNotes: { type: String, default: '' },
    error: { type: String, default: '' },
    analyzedBy: { type: String, default: '' },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

seoKeywordAnalysisSchema.index({ createdAt: -1 })
seoKeywordAnalysisSchema.index({ status: 1, createdAt: -1 })

module.exports = mongoose.model('SeoKeywordAnalysis', seoKeywordAnalysisSchema)
module.exports.ACTIONS = ACTIONS
