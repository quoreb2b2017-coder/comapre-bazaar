const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    excerpt: {
      type: String,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },
    slug: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "published"],
      default: "pending",
    },
    metaTitle: {
      type: String,
      maxlength: [70, "Meta title cannot exceed 70 characters"],
    },
    metaDescription: {
      type: String,
      maxlength: [160, "Meta description cannot exceed 160 characters"],
    },
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    topic: { type: String },
    tone: {
      type: String,
      enum: ["professional", "casual", "seo-optimized"],
      default: "professional",
    },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    publishedAt: { type: Date },
    rejectionReason: { type: String },
    telegramMessageId: { type: String },
    approvalEmailSent: { type: Boolean, default: false },
    wordCount: { type: Number, default: 0 },
    readingTime: { type: Number, default: 0 },
    tags: [{ type: String, trim: true }],
    /** Public article page visits (incremented via POST …/public/blogs/:slug/view) */
    viewCount: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
  }
);

// Mongoose 8+: async save hooks must not use `next`; calling next() throws "next is not a function".
blogSchema.pre("save", async function () {
  if (this.isModified("title") || this.isNew) {
    let slug = slugify(this.title, { lower: true, strict: true });
    const existing = await this.constructor.findOne({ slug, _id: { $ne: this._id } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }
    this.slug = slug;
  }

  if (this.isModified("content")) {
    const words = this.content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
    this.wordCount = words;
    this.readingTime = Math.ceil(words / 200);
  }

  if (this.isModified("content") && !this.excerpt) {
    const plainText = this.content.replace(/<[^>]*>/g, "");
    this.excerpt = plainText.substring(0, 200).trim() + (plainText.length > 200 ? "..." : "");
  }
});

blogSchema.index({ title: "text", content: "text", keywords: "text" });
blogSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Blog", blogSchema);
