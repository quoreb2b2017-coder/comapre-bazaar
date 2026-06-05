const mongoose = require('mongoose')

const whitePaperLeadSchema = new mongoose.Schema(
  {
    whitePaperId: { type: mongoose.Schema.Types.ObjectId, ref: 'WhitePaper', required: true, index: true },
    slug: { type: String, required: true, trim: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    jobTitle: { type: String, trim: true },
    workPhone: { type: String, trim: true },
    companyStreet: { type: String, trim: true },
    companySuite: { type: String, trim: true },
    companyPostal: { type: String, trim: true },
    companyCity: { type: String, trim: true },
    companyState: { type: String, trim: true },
    companyCountry: { type: String, trim: true },
    marketingConsent: { type: Boolean, default: false },
    /** Answers to admin-configured download form questions */
    customAnswers: [
      {
        question: { type: String, trim: true, maxlength: 500 },
        answer: { type: String, trim: true, maxlength: 500 },
      },
    ],
    profileCompleted: { type: Boolean, default: false },
    downloadedAt: { type: Date },
  },
  { timestamps: true }
)

whitePaperLeadSchema.index({ whitePaperId: 1, email: 1 })

module.exports = mongoose.model('WhitePaperLead', whitePaperLeadSchema)
