const axios = require("axios");
const mongoose = require("mongoose");

const TELEGRAM_API = (token) => `https://api.telegram.org/bot${token}`;

const dashboardBlogUrl = (blogId) => {
  const origin = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
  const base = (process.env.BLOG_ADMIN_BASE_PATH || "/blog-admin").replace(/\/$/, "") || "/blog-admin";
  return `${origin}${base}/blogs/${blogId}`;
};

const tgApiError = (error) => {
  const d = error.response?.data;
  if (d && typeof d === "object") return d.description || JSON.stringify(d);
  return error.message || String(error);
};

/** Telegram accepts string chat_id; numeric IDs as number avoid rare parsing issues */
const normalizeChatId = (chatId) => {
  const s = String(chatId ?? "").trim();
  if (/^-?\d+$/.test(s)) {
    const n = Number(s);
    if (Number.isFinite(n)) return n;
  }
  return s;
};

/** Telegram often rejects localhost / loopback on inline url buttons */
const isBlockedTelegramUrl = (url) => {
  const u = String(url || "").trim().toLowerCase();
  return !u || /localhost|127\.0\.0\.1|\[::1\]|^file:/.test(u);
};

/**
 * Approval ping — plain text only (no parse_mode). HTML/Markdown breaks easily on real titles/previews.
 * Buttons: Approve / Reject (callbacks). Optional "Open dashboard" url row only for public HTTPS URLs.
 */
const sendBlogApprovalNotification = async (blog, botToken, chatId) => {
  const token = String(botToken || "").trim();
  if (!token || chatId == null || String(chatId).trim() === "") {
    return { success: false, error: "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID" };
  }

  const truncated = blog.content.replace(/<[^>]*>/g, "").substring(0, 400);
  const keywords = Array.isArray(blog.keywords) ? blog.keywords.join(", ") : "";
  const dashboardUrl = dashboardBlogUrl(blog._id);
  const idStr = String(blog._id);
  const chat = normalizeChatId(chatId);

  const lines = [
    "New blog — pending approval",
    "",
    `Title: ${blog.title}`,
    `Words: ${blog.wordCount ?? 0} · Read ~${blog.readingTime ?? 1} min`,
    "",
    "Preview:",
    (truncated.trim() || "(empty)") + "…",
  ];
  if (keywords) lines.push("", `Keywords: ${keywords}`);
  lines.push("");
  if (isBlockedTelegramUrl(dashboardUrl)) {
    lines.push("Tip: Dashboard URL is localhost — use Approve/Reject below.");
    lines.push("For buttons to work: set HTTPS webhook (POST …/telegram/configure-webhook) OR run: npm run telegram-poll");
    lines.push(`Browser: ${dashboardUrl}`);
  } else {
    lines.push(`Dashboard: ${dashboardUrl}`);
  }

  const keyboardRows = [
    [
      { text: "Approve", callback_data: `approve_${idStr}` },
      { text: "Reject", callback_data: `reject_${idStr}` },
    ],
  ];
  if (!isBlockedTelegramUrl(dashboardUrl)) {
    keyboardRows.push([{ text: "Open dashboard", url: dashboardUrl }]);
  }

  const reply_markup = { inline_keyboard: keyboardRows };
  const text = lines.join("\n").slice(0, 3900);

  try {
    const response = await axios.post(
      `${TELEGRAM_API(token)}/sendMessage`,
      {
        chat_id: chat,
        text,
        reply_markup,
        disable_web_page_preview: true,
      },
      { timeout: 20000 }
    );
    return { success: true, messageId: response.data.result.message_id };
  } catch (error) {
    const detail = tgApiError(error);
    console.error("[Telegram] sendMessage (approval):", detail, error.response?.data || "");
    return { success: false, error: detail };
  }
};

const sendPublishedNotification = async (blog, botToken, chatId) => {
  const token = String(botToken || "").trim();
  if (!token) return { success: false, error: "Missing TELEGRAM_BOT_TOKEN" };
  const siteBase = String(process.env.WEBSITE_URL || "").replace(/\/$/, "");
  const slug = blog.slug || "";
  const articleUrl = siteBase ? `${siteBase}/blog/${slug}` : "";

  const text = [
    "Blog published",
    "",
    `Title: ${blog.title}`,
    `Slug: ${slug}`,
    `Published: ${new Date().toLocaleString()}`,
    "",
    articleUrl || "(Set WEBSITE_URL in backend/.env for link)",
  ].join("\n");

  try {
    await axios.post(
      `${TELEGRAM_API(token)}/sendMessage`,
      { chat_id: normalizeChatId(chatId), text: text.slice(0, 4000), disable_web_page_preview: false },
      { timeout: 15000 }
    );
    return { success: true };
  } catch (error) {
    console.error("[Telegram] publish notify:", tgApiError(error));
    return { success: false, error: tgApiError(error) };
  }
};

/** Parse approve_<mongoId> / reject_<mongoId> (IDs never contain _). */
const parseCallbackData = (callbackData) => {
  const raw = String(callbackData || "");
  const i = raw.indexOf("_");
  if (i === -1) return { action: null, blogId: null };
  return { action: raw.slice(0, i), blogId: raw.slice(i + 1) };
};

const answerCallbackQuery = async (callbackQueryId, text, botToken) => {
  const token = String(botToken || "").trim();
  try {
    await axios.post(`${TELEGRAM_API(token)}/answerCallbackQuery`, {
      callback_query_id: callbackQueryId,
      text: String(text || "").slice(0, 200),
      show_alert: false,
    });
  } catch (error) {
    console.error("Answer callback error:", tgApiError(error));
  }
};

/** Plain text only — avoids Telegram Markdown/HTML entity errors */
const editMessage = async (chatId, messageId, text, botToken) => {
  const token = String(botToken || "").trim();
  try {
    await axios.post(`${TELEGRAM_API(token)}/editMessageText`, {
      chat_id: chatId,
      message_id: messageId,
      text: String(text || "").slice(0, 4096),
      reply_markup: { inline_keyboard: [] },
    });
  } catch (error) {
    console.error("Edit message error:", tgApiError(error));
  }
};

async function handleTelegramCallback(callback_query, botToken) {
  const Blog = require("../models/automationBlog.model");
  const token = String(botToken || "").trim();
  if (!token || !callback_query) return;

  const { id: queryId, data: callbackData, message } = callback_query;
  const { action, blogId } = parseCallbackData(callbackData);

  if (!action || !blogId || !mongoose.Types.ObjectId.isValid(blogId)) {
    await answerCallbackQuery(queryId, "Invalid request", token);
    return;
  }

  if (action === "approve") {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { status: "approved", approvedAt: new Date(), rejectionReason: null },
      { new: true }
    );
    await answerCallbackQuery(queryId, blog ? "Approved." : "Blog not found", token);
    if (message && blog) {
      await editMessage(
        message.chat.id,
        message.message_id,
        `Approved\n\n${blog.title}\n\nOpen Blog Admin to publish when ready.`,
        token
      );
    }
    return;
  }

  if (action === "reject") {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { status: "rejected", rejectedAt: new Date(), rejectionReason: "Rejected from Telegram" },
      { new: true }
    );
    await answerCallbackQuery(queryId, blog ? "Rejected." : "Blog not found", token);
    if (message && blog) {
      await editMessage(message.chat.id, message.message_id, `Rejected\n\n${blog.title}`, token);
    }
  }
}

async function setTelegramWebhook(botToken, webhookUrl) {
  const token = String(botToken || "").trim();
  await axios.post(`${TELEGRAM_API(token)}/setWebhook`, {
    url: webhookUrl,
    allowed_updates: ["callback_query", "message"],
  });
}

async function getTelegramWebhookInfo(botToken) {
  const token = String(botToken || "").trim();
  const r = await axios.get(`${TELEGRAM_API(token)}/getWebhookInfo`);
  return r.data;
}

async function deleteTelegramWebhook(botToken) {
  const token = String(botToken || "").trim();
  await axios.post(`${TELEGRAM_API(token)}/deleteWebhook`);
}

module.exports = {
  sendBlogApprovalNotification,
  sendPublishedNotification,
  parseCallbackData,
  answerCallbackQuery,
  editMessage,
  handleTelegramCallback,
  setTelegramWebhook,
  getTelegramWebhookInfo,
  deleteTelegramWebhook,
  tgApiError,
};
