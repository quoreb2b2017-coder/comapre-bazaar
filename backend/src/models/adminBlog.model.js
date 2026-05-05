const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      default: "Admin",
    },
    role: {
      type: String,
      enum: ["super_admin", "admin", "editor"],
      default: "admin",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: { type: Date },
    loginCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000),
    },
    attempts: {
      type: Number,
      default: 0,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Admin = mongoose.model("Admin", adminSchema);
const OTP = mongoose.model("OTP", otpSchema);

module.exports = { Admin, OTP };
