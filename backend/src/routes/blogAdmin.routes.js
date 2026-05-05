const express = require("express");
const rateLimit = require("express-rate-limit");
const { protect } = require("../middlewares/blogAdminAuth.middleware");
const Settings = require("../models/blogAdminSettings.model");
const {
  handleTelegramCallback,
  setTelegramWebhook,
  getTelegramWebhookInfo,
  deleteTelegramWebhook,
  tgApiError,
} = require("../services/blogAdmin.telegram.service");

const router = express.Router();

async function resolveTelegramBotToken() {
  const env = String(process.env.TELEGRAM_BOT_TOKEN || "").trim();
  if (env) return env;
  const row = await Settings.findOne({ key: "telegram_bot_token" });
  return row?.value ? String(row.value).trim() : "";
}

/** Before rate limit — Telegram sends bursts of webhook calls */
router.post("/telegram/webhook", async (req, res) => {
  try {
    const botToken = await resolveTelegramBotToken();
    if (req.body?.callback_query && botToken) {
      await handleTelegramCallback(req.body.callback_query, botToken);
    }
    res.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    res.json({ ok: true });
  }
});

router.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: { success: false, message: "Too many requests. Please slow down." },
  })
);

router.use("/public/blogs", require("./blogAdmin.public.routes"));
router.use("/public/site-analytics", require("./blogAdmin.siteAnalytics.public.routes"));
router.use(require("./blogAdmin.siteAnalytics.admin.routes"));
router.use("/auth", require("./blogAdmin.auth.routes"));
router.use("/blogs", require("./blogAdmin.blogs.routes"));
router.use("/generate-blog", require("./blogAdmin.generate.routes"));
router.use("/trends-chat", require("./blogAdmin.trends.routes"));
router.use("/settings", require("./blogAdmin.settings.routes"));
router.use("/subscribers", require("./blogAdmin.subscribers.routes"));

router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Blog Admin API is running",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Register webhook so Approve/Reject buttons work (Telegram must reach your server over HTTPS).
 * Body (optional): { "baseUrl": "https://api.yourdomain.com" }
 * Or set PUBLIC_API_URL / BACKEND_PUBLIC_URL in .env to that origin (no trailing slash).
 */
router.post("/telegram/configure-webhook", protect, async (req, res) => {
  try {
    const botToken = await resolveTelegramBotToken();
    if (!botToken) {
      return res.status(400).json({
        success: false,
        message: "TELEGRAM_BOT_TOKEN missing (backend/.env or Settings)",
      });
    }

    const fromBody = String(req.body?.baseUrl || "").trim().replace(/\/$/, "");
    const fromEnv = String(
      process.env.PUBLIC_API_URL || process.env.BACKEND_PUBLIC_URL || ""
    )
      .trim()
      .replace(/\/$/, "");
    const base = fromBody || fromEnv;

    if (!base || !/^https:\/\//i.test(base)) {
      return res.status(400).json({
        success: false,
        message:
          "Provide HTTPS baseUrl (JSON body) or set PUBLIC_API_URL / BACKEND_PUBLIC_URL in backend/.env. Telegram cannot use http://localhost unless you use a tunnel (ngrok) + that HTTPS URL here.",
      });
    }

    const webhookPath = "/api/v1/blog-admin/telegram/webhook";
    const webhookUrl = `${base}${webhookPath}`;

    await setTelegramWebhook(botToken, webhookUrl);
    const info = await getTelegramWebhookInfo(botToken);

    res.json({
      success: true,
      webhookUrl,
      telegram: info,
      hint: "After saving, tap Approve/Reject on a new notification to verify.",
    });
  } catch (error) {
    const msg = error.response?.data?.description || tgApiError(error);
    console.error("configure-webhook:", msg);
    res.status(500).json({ success: false, message: msg });
  }
});

router.get("/telegram/webhook-status", protect, async (req, res) => {
  try {
    const botToken = await resolveTelegramBotToken();
    if (!botToken) {
      return res.status(400).json({ success: false, message: "TELEGRAM_BOT_TOKEN not configured" });
    }
    const info = await getTelegramWebhookInfo(botToken);
    res.json({ success: true, telegram: info });
  } catch (error) {
    res.status(500).json({ success: false, message: tgApiError(error) });
  }
});

/** Stop webhook (e.g. before using npm run telegram-poll locally) */
router.post("/telegram/delete-webhook", protect, async (req, res) => {
  try {
    const botToken = await resolveTelegramBotToken();
    if (!botToken) {
      return res.status(400).json({ success: false, message: "TELEGRAM_BOT_TOKEN not configured" });
    }
    await deleteTelegramWebhook(botToken);
    const info = await getTelegramWebhookInfo(botToken);
    res.json({ success: true, telegram: info });
  } catch (error) {
    res.status(500).json({ success: false, message: tgApiError(error) });
  }
});

module.exports = router;
