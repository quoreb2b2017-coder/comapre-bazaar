const express = require('express')
const router = express.Router()
const axios = require('axios')
const Settings = require("../models/blogAdminSettings.model");
const { protect } = require("../middlewares/blogAdminAuth.middleware");

const SETTINGS_KEYS = [
  { key: 'claude_api_key', category: 'api', label: 'Claude API Key', sensitive: true },
  { key: 'telegram_bot_token', category: 'telegram', label: 'Telegram Bot Token', sensitive: true },
  { key: 'telegram_chat_id', category: 'telegram', label: 'Telegram Chat ID', sensitive: false },
  { key: 'resend_api_key', category: 'email', label: 'Resend API Key', sensitive: true },
  { key: 'resend_from_email', category: 'email', label: 'From Email', sensitive: false },
  { key: 'approval_email', category: 'email', label: 'Approval Notification Email', sensitive: false },
  { key: 'website_url', category: 'website', label: 'Website URL', sensitive: false },
  { key: 'website_api_key', category: 'website', label: 'Website API Key', sensitive: true },
]

// @route   GET /api/settings
router.get('/', protect, async (req, res) => {
  try {
    const settings = await Settings.find()
    const settingsMap = {}
    settings.forEach((s) => {
      const config = SETTINGS_KEYS.find((k) => k.key === s.key)
      settingsMap[s.key] = {
        value: config?.sensitive && s.value ? '••••••••' : s.value,
        category: s.category,
        hasValue: !!s.value,
      }
    })
    res.json({ success: true, settings: settingsMap, keys: SETTINGS_KEYS })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// @route   PUT /api/settings
router.put('/', protect, async (req, res) => {
  try {
    const { settings } = req.body
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ success: false, message: 'Settings object required' })
    }

    const ops = Object.entries(settings).map(([key, value]) => {
      const config = SETTINGS_KEYS.find((k) => k.key === key)
      if (!config) return null
      // Don't overwrite with masked value
      if (value === '••••••••') return null
      return {
        updateOne: {
          filter: { key },
          update: { $set: { key, value, category: config.category } },
          upsert: true,
        },
      }
    }).filter(Boolean)

    if (ops.length > 0) await Settings.bulkWrite(ops)

    res.json({ success: true, message: 'Settings saved successfully!' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// @route   POST /api/settings/test-telegram
router.post('/test-telegram', protect, async (req, res) => {
  try {
    const { botToken, chatId } = req.body
    const axios = require('axios')
    const response = await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: '✅ Blog Admin Dashboard — Telegram connected successfully!',
    }, { timeout: 5000 })
    res.json({ success: true, message: 'Test message sent to Telegram!' })
  } catch (error) {
    res.status(400).json({ success: false, message: `Telegram test failed: ${error.response?.data?.description || error.message}` })
  }
})

// @route   POST /api/settings/test-email
router.post('/test-email', protect, async (req, res) => {
  try {
    const { resendApiKey, resendFromEmail, testTo } = req.body
    if (!resendApiKey || !resendFromEmail || !testTo) {
      return res.status(400).json({ success: false, message: 'Resend API key, from email, and test recipient are required' })
    }

    await axios.post('https://api.resend.com/emails', {
      from: resendFromEmail,
      to: [testTo],
      subject: 'Blog Admin — Email Configuration Test',
      html: '<h2>✅ Email configuration working correctly!</h2><p>Your Blog Admin Dashboard email is set up.</p>',
    }, {
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })

    res.json({ success: true, message: 'Test email sent successfully!' })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Email test failed: ${error.response?.data?.message || error.message}`,
    })
  }
})

module.exports = router
