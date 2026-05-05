const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed },
    category: {
      type: String,
      enum: ["api", "telegram", "email", "website", "general"],
      default: "general",
    },
    isEncrypted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
