const express = require("express");
const router = express.Router();
const Settings = require("../models/blogAdminSettings.model");
const { replyTrendsChat } = require("../services/blogAdmin.trendsChat.service");
const { protect } = require("../middlewares/blogAdminAuth.middleware");

async function resolveAnthropicApiKey() {
  const envKey = String(process.env.ANTHROPIC_API_KEY || "").trim();
  if (envKey) return envKey;
  const row = await Settings.findOne({ key: "claude_api_key" });
  if (row?.value == null || row?.value === "") return null;
  return String(row.value).trim();
}

/**
 * POST /trends-chat — sidebar “what’s trending?” assistant (auth required)
 * Body: { messages: [{ role: 'user'|'assistant', content: string }] }
 */
router.post("/", protect, async (req, res) => {
  try {
    const raw = req.body?.messages;
    if (!Array.isArray(raw) || raw.length === 0) {
      return res.status(400).json({
        success: false,
        message: "messages[] required with at least one user turn",
      });
    }

    const apiKey = await resolveAnthropicApiKey();
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: "Claude API key not configured (ANTHROPIC_API_KEY or Settings)",
      });
    }

    const result = await replyTrendsChat(raw, apiKey);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("trends-chat:", error?.message || error);
    res.status(500).json({
      success: false,
      message: error?.message || "Trends chat failed",
    });
  }
});

module.exports = router;
