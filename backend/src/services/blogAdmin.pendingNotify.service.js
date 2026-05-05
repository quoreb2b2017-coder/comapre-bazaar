const Settings = require("../models/blogAdminSettings.model");
const Blog = require("../models/automationBlog.model");
const { sendBlogApprovalNotification } = require("./blogAdmin.telegram.service");

async function getSetting(key) {
  const row = await Settings.findOne({ key });
  return row?.value;
}

/** Prefer `.env` (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID), then MongoDB settings. */
async function resolveTelegramCredentials() {
  const botToken =
    String(process.env.TELEGRAM_BOT_TOKEN || "").trim() ||
    String((await getSetting("telegram_bot_token")) || "").trim() ||
    null;
  const chatId =
    String(process.env.TELEGRAM_CHAT_ID || "").trim() ||
    String((await getSetting("telegram_chat_id")) || "").trim() ||
    null;
  return { botToken, chatId };
}

/**
 * When a blog is saved as pending (e.g. after AI generate), notify via Telegram only.
 * Approval emails are intentionally disabled.
 */
async function notifyPendingBlogForApproval(blogDoc) {
  const id = blogDoc._id;
  const results = {
    email: { skipped: true, reason: "Approval notification emails are disabled" },
  };

  const { botToken, chatId } = await resolveTelegramCredentials();
  if (botToken && chatId) {
    const result = await sendBlogApprovalNotification(blogDoc, botToken, chatId);
    if (result.success && result.messageId != null) {
      await Blog.findByIdAndUpdate(id, { telegramMessageId: result.messageId });
    } else if (!result.success) {
      console.warn("[blog-admin] Telegram approval notify failed:", result.error || result);
    }
    results.telegram = result;
  } else {
    results.telegram = {
      skipped: true,
      reason: `Telegram not configured (token: ${botToken ? "yes" : "no"}, chatId: ${chatId ? "yes" : "no"})`,
    };
  }

  return results;
}

module.exports = {
  resolveTelegramCredentials,
  notifyPendingBlogForApproval,
};
