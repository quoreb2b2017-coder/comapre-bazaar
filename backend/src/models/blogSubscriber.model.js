const mongoose = require("mongoose");

const blogSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 320,
    },
    isActive: { type: Boolean, default: true },
    subscribedFrom: { type: String, default: "" },
    sourceBlogId: { type: String, default: "" },
    sourceBlogSlug: { type: String, default: "" },
    sourceBlogTitle: { type: String, default: "" },
    lastNotifiedAt: { type: Date, default: null },
    totalNotifications: { type: Number, default: 0 },
  },
  { timestamps: true }
);

blogSubscriberSchema.index({ createdAt: -1 });
blogSubscriberSchema.index({ isActive: 1, createdAt: -1 });
blogSubscriberSchema.index({ sourceBlogId: 1, createdAt: -1 });
blogSubscriberSchema.index({ sourceBlogSlug: 1, createdAt: -1 });

module.exports = mongoose.model("BlogSubscriber", blogSubscriberSchema);
