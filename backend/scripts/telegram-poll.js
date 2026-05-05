/**
 * Long polling for Telegram updates — use when you develop on localhost and cannot use HTTPS webhooks.
 *
 * 1) Stop any active webhook (Blog Admin API, logged in):
 *    POST /api/v1/blog-admin/telegram/delete-webhook
 * 2) From backend folder:
 *    npm run telegram-poll
 *
 * Leave this running; press Approve/Reject in Telegram and MongoDB will update.
 */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const axios = require("axios");
const connectDB = require("../src/config/db");
const { handleTelegramCallback } = require("../src/services/blogAdmin.telegram.service");

async function main() {
  const token = String(process.env.TELEGRAM_BOT_TOKEN || "").trim();
  if (!token) {
    console.error("Set TELEGRAM_BOT_TOKEN in backend/.env");
    process.exit(1);
  }

  await connectDB();

  const clear = process.argv.includes("--clear-webhook");
  if (clear) {
    await axios.post(`https://api.telegram.org/bot${token}/deleteWebhook`);
    console.log("Webhook cleared.");
  }

  let offset = 0;
  console.log("Telegram poll running — waiting for button taps…");

  while (true) {
    try {
      const { data } = await axios.get(`https://api.telegram.org/bot${token}/getUpdates`, {
        params: { offset, timeout: 45 },
        timeout: 60000,
      });

      for (const u of data.result || []) {
        offset = u.update_id + 1;
        if (u.callback_query) {
          await handleTelegramCallback(u.callback_query, token);
        }
      }
    } catch (e) {
      console.error("Poll error:", e.response?.data || e.message);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
