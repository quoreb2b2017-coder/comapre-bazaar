const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { Admin, OTP } = require("../models/adminBlog.model");
const { sendOTPEmail } = require("../services/blogAdmin.email.service");
const { protect } = require("../middlewares/blogAdminAuth.middleware");
const rateLimit = require('express-rate-limit')

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many OTP requests. Please try again in 15 minutes.' },
})

// @route   POST /api/auth/request-otp
// @desc    Request OTP for login
const generateOTP = () => crypto.randomInt(100000, 999999).toString()

router.post('/request-otp', otpLimiter, async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' })

    const normalizedEmail = email.toLowerCase().trim()
    const allowedEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim()

    // Check if email is authorized
    if (allowedEmail && normalizedEmail !== allowedEmail) {
      return res.status(403).json({
        success: false,
        message: 'This email is not authorized to access the admin dashboard.',
      })
    }

    // Find or create admin
    let admin = await Admin.findOne({ email: normalizedEmail })
    if (!admin) {
      admin = await Admin.create({
        email: normalizedEmail,
        name: 'Admin',
        role: 'super_admin',
      })
    }

    if (!admin.isActive) {
      return res.status(403).json({ success: false, message: 'Admin account is disabled.' })
    }

    // Invalidate existing OTPs
    await OTP.deleteMany({ email: normalizedEmail })

    // Generate and save OTP
    const otp = generateOTP()
    await OTP.create({ email: normalizedEmail, otp })

    // Send OTP email
    const emailResult = await sendOTPEmail(normalizedEmail, otp)

    if (!emailResult.success) {
      // In development, log OTP to console
      if (process.env.NODE_ENV === 'development') {
        console.log(`\n🔑 DEV OTP for ${normalizedEmail}: ${otp}\n`)
        return res.json({ success: true, message: `OTP sent! (Dev mode: check console)`, dev_otp: otp })
      }
      return res.status(500).json({ success: false, message: 'Failed to send OTP email. Check Resend settings.' })
    }

    res.json({ success: true, message: `OTP sent to ${normalizedEmail}. Check your inbox.` })
  } catch (error) {
    console.error('Request OTP error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// @route   POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const otpRecord = await OTP.findOne({ email: normalizedEmail, isUsed: false }).sort({ createdAt: -1 })

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'OTP not found or already used. Request a new one.' })
    }

    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id })
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' })
    }

    // Increment attempts
    otpRecord.attempts += 1
    if (otpRecord.attempts > 5) {
      await OTP.deleteOne({ _id: otpRecord._id })
      return res.status(400).json({ success: false, message: 'Too many failed attempts. Please request a new OTP.' })
    }

    if (otpRecord.otp !== otp.trim()) {
      await otpRecord.save()
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining.`,
      })
    }

    // Mark OTP as used
    otpRecord.isUsed = true
    await otpRecord.save()

    // Update admin login info
    const admin = await Admin.findOneAndUpdate(
      { email: normalizedEmail },
      { lastLogin: new Date(), $inc: { loginCount: 1 } },
      { new: true }
    )

    // Generate JWT
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    )

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    })
  } catch (error) {
    console.error('Verify OTP error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// @route   GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, admin: req.admin })
})

// @route   POST /api/auth/logout
router.post('/logout', protect, async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' })
})

module.exports = router
