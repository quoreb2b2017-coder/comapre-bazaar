const axios = require("axios");

const RESEND_API_URL = "https://api.resend.com/emails";

const escapeHtml = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Strip scripts/event handlers; blog HTML is trusted enough for admin email but clients should not execute JS */
const sanitizeEmailBodyHtml = (html) =>
  String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");

const prepareBlogHtmlForEmail = (html) => {
  let out = sanitizeEmailBodyHtml(html || "");
  // Drop large in-page hero banner sections that are not email friendly.
  out = out.replace(/<section[^>]*data-blog-banner="true"[^>]*>[\s\S]*?<\/section>/gi, "");
  // Remove heavy inline styles/classes from CMS HTML so mobile email clients render cleaner.
  out = out
    .replace(/\sclass="[^"]*"/gi, "")
    .replace(/\sstyle="[^"]*"/gi, "")
    .replace(/\sid="[^"]*"/gi, "")
    .replace(/\sdata-[a-z0-9_-]+="[^"]*"/gi, "");
  // Avoid duplicate large heading if article starts with H1.
  out = out.replace(/<h1\b[^>]*>/i, "<h2>").replace(/<\/h1>/i, "</h2>");
  return out.trim();
};

const dashboardBlogUrl = (blogId, query = "") => {
  const origin = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
  const base = (process.env.BLOG_ADMIN_BASE_PATH || "/blog-admin").replace(/\/$/, "") || "/blog-admin";
  const q = query ? `?${query}` : "";
  return `${origin}${base}/blogs/${blogId}${q}`;
};

const sendWithResend = async ({ to, subject, html, from, apiKey: apiKeyOverride }) => {
  const apiKey = apiKeyOverride || process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  await axios.post(
    RESEND_API_URL,
    {
      from: from || process.env.RESEND_FROM_EMAIL || "Blog Admin <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 60000,
    }
  );
};

const sendOTPEmail = async (email, otp) => {
  try {
    await sendWithResend({
      to: email,
      from: process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM,
      subject: "🔐 Your Login OTP — Blog Admin Dashboard",
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;font-family:'Segoe UI',sans-serif;background:#f8fafc">
          <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
            <div style="background:linear-gradient(135deg,#0f1f3d 0%,#1d4ed8 100%);padding:32px;text-align:center">
              <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700">Blog Admin</h1>
              <p style="color:rgba(255,255,255,.7);margin:6px 0 0;font-size:14px">Login Verification</p>
            </div>
            <div style="padding:32px">
              <p style="color:#1e293b;font-size:16px;margin:0 0 8px">Your one-time password:</p>
              <div style="background:#f1f5f9;border-radius:12px;padding:20px;text-align:center;margin:20px 0">
                <span style="font-size:40px;font-weight:800;letter-spacing:12px;color:#0f1f3d;font-family:monospace">${otp}</span>
              </div>
              <p style="color:#64748b;font-size:14px;margin:0">This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
              <div style="margin-top:24px;padding-top:20px;border-top:1px solid #e2e8f0">
                <p style="color:#94a3b8;font-size:12px;margin:0">If you did not request this OTP, please ignore this email.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: error.message };
  }
};

/** @param {{ apiKey?: string, from?: string }} [resendOpts] — optional overrides when key lives in Settings only */
const sendApprovalEmail = async (blog, recipientEmail, resendOpts = {}) => {
  try {
    const from = resendOpts.from || process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM;
    const safeTitle = escapeHtml(blog.title);
    const subjectTitle = String(blog.title || "Blog").replace(/\s+/g, " ").trim().slice(0, 120);
    const fullBodyHtml = sanitizeEmailBodyHtml(blog.content);
    const dashUrl = dashboardBlogUrl(blog._id);

    await sendWithResend({
      to: recipientEmail,
      apiKey: resendOpts.apiKey,
      from,
      subject: `Blog awaiting approval: ${subjectTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;font-family:'Segoe UI',sans-serif;background:#f8fafc">
          <div style="max-width:720px;margin:24px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
            <div style="background:linear-gradient(135deg,#0f1f3d 0%,#1d4ed8 100%);padding:28px 32px">
              <h1 style="color:#fff;margin:0;font-size:20px">Blog awaiting your approval</h1>
            </div>
            <div style="padding:28px 32px 40px">
              <h2 style="color:#0f1f3d;margin:0 0 8px;font-size:22px">${safeTitle}</h2>
              <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
                <span style="background:#dbeafe;color:#1d4ed8;padding:4px 12px;border-radius:99px;font-size:12px;font-weight:600">Pending</span>
                <span style="background:#f1f5f9;color:#475569;padding:4px 12px;border-radius:99px;font-size:12px">${blog.wordCount || 0} words</span>
                <span style="background:#f1f5f9;color:#475569;padding:4px 12px;border-radius:99px;font-size:12px">${blog.readingTime || 1} min read</span>
              </div>
              ${blog.metaDescription ? `<p style="color:#64748b;font-size:13px;margin:0 0 20px"><strong>Meta:</strong> ${escapeHtml(blog.metaDescription)}</p>` : ""}
              <p style="color:#64748b;font-size:13px;margin:0 0 12px;font-weight:600">Full article (HTML)</p>
              <div style="border:1px solid #e2e8f0;border-radius:12px;padding:20px;background:#fafafa;color:#334155;font-size:15px;line-height:1.65;overflow-x:auto">
                ${fullBodyHtml || "<p><em>(No content)</em></p>"}
              </div>
              <p style="color:#64748b;font-size:13px;margin:24px 0 12px;line-height:1.6">
                Use Blog Admin to approve or reject after review.
              </p>
              <a href="${escapeHtml(dashUrl)}"
                 style="background:#1d4ed8;color:#fff;padding:14px 24px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;display:inline-block">
                Open in Blog Admin →
              </a>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    const detail = error.response?.data || error.message;
    console.error("Approval email error:", detail);
    return { success: false, error: typeof detail === "object" ? JSON.stringify(detail) : String(detail) };
  }
};

const publicBlogUrl = (slug) => {
  const origin = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
  return `${origin}/blog/${encodeURIComponent(String(slug || "").trim())}`;
};

const sendNewBlogPublishedEmail = async (to, blog, resendOpts = {}) => {
  try {
    const from = resendOpts.from || process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM;
    const safeTitle = escapeHtml(blog?.title || "New Blog");
    const fullBodyHtml = prepareBlogHtmlForEmail(blog?.content || "");
    const url = publicBlogUrl(blog?.slug);
    await sendWithResend({
      to,
      apiKey: resendOpts.apiKey,
      from,
      subject: `New blog published: ${String(blog?.title || "Compare Bazaar").slice(0, 120)}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body { margin:0; padding:0; background:#f8fafc; font-family:Segoe UI,Arial,sans-serif; }
            .shell { max-width:700px; margin:14px auto; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,.08); }
            .head { background:linear-gradient(135deg,#0f1f3d 0%,#1d4ed8 100%); padding:22px 20px; }
            .head h1 { color:#fff; margin:0; font-size:20px; line-height:1.3; }
            .head p { color:rgba(255,255,255,.8); margin:7px 0 0; font-size:13px; }
            .body { padding:20px; color:#334155; }
            .body h2,.body h3 { color:#0f1f3d; line-height:1.35; margin:18px 0 10px; }
            .body p,.body li { font-size:15px; line-height:1.7; color:#334155; }
            .body ul,.body ol { margin:10px 0 14px 18px; padding:0; }
            .body a { color:#1d4ed8; }
            .meta { margin:0 0 14px; font-size:13px; color:#64748b; }
            .cta { margin-top:14px; font-size:13px; color:#64748b; line-height:1.6; }
            .footer { margin-top:16px; color:#94a3b8; font-size:12px; line-height:1.5; }
            img, table, pre { max-width:100% !important; height:auto !important; }
            @media only screen and (max-width: 640px) {
              .shell { margin:0; border-radius:0; }
              .head { padding:18px 14px; }
              .head h1 { font-size:18px; }
              .body { padding:14px; }
              .body p,.body li { font-size:14px; }
            }
          </style>
        </head>
        <body>
          <div class="shell">
            <div class="head">
              <h1>New post is live</h1>
              <p>Compare Bazaar updates</p>
            </div>
            <div class="body">
              <h2 style="margin:0 0 8px">${safeTitle}</h2>
              <p class="meta">Full blog content</p>
              <div>
                ${fullBodyHtml || "<p><em>(No content)</em></p>"}
              </div>
              <p class="cta">
                Prefer reading on site?
                <a href="${escapeHtml(url)}" style="margin-left:4px">Open web version</a>
              </p>
              <p class="footer">
                You are receiving this because you subscribed to blog updates.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    const detail = error.response?.data || error.message;
    return { success: false, error: typeof detail === "object" ? JSON.stringify(detail) : String(detail) };
  }
};

module.exports = { sendOTPEmail, sendApprovalEmail, sendNewBlogPublishedEmail };
