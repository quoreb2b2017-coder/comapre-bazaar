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

const sendWithResend = async ({ to, subject, html, from, apiKey: apiKeyOverride, headers }) => {
  const apiKey = apiKeyOverride || process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const payload = {
    from: from || process.env.RESEND_FROM_EMAIL || "Blog Admin <onboarding@resend.dev>",
    to: [to],
    subject,
    html,
  };
  // Resend expects a plain object of header name → value (not an array).
  if (headers && typeof headers === "object" && !Array.isArray(headers)) {
    payload.headers = headers;
  }

  await axios.post(RESEND_API_URL, payload, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    timeout: 60000,
  });
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

const publicSiteOrigin = () =>
  (
    process.env.WEBSITE_URL ||
    process.env.FRONTEND_URL ||
    "https://www.compare-bazaar.com"
  ).replace(/\/$/, "");

const publicBlogUrl = (slug) => {
  const origin = publicSiteOrigin();
  return `${origin}/blog/${encodeURIComponent(String(slug || "").trim())}`;
};

const publicLogoUrl = () => `${publicSiteOrigin()}/favicon-96.png`;

const unsubscribePageUrl = (email) => {
  const origin = publicSiteOrigin();
  const q = email ? `?email=${encodeURIComponent(String(email).trim().toLowerCase())}` : "";
  return `${origin}/unsubscribe${q}`;
};

const blogHubUrl = () => `${publicSiteOrigin()}/blog`;

/** Shared Compare Bazaar branded email chrome (navy + orange + logo). */
const brandedEmailShell = ({ preheader, title, eyebrow, bodyHtml, footerHtml }) => {
  const logo = escapeHtml(publicLogoUrl());
  const site = escapeHtml(publicSiteOrigin());
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title || "Compare Bazaar")}</title>
</head>
<body style="margin:0;padding:0;background:#EEF2F8;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    ${escapeHtml(preheader || "")}
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#EEF2F8;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 12px 40px rgba(11,42,111,0.12);">
          <tr>
            <td style="background:#0B2A6F;padding:22px 28px;text-align:center;">
              <img src="${logo}" width="48" height="48" alt="Compare Bazaar" style="display:block;margin:0 auto 10px;border:0;border-radius:10px;" />
              <p style="margin:0;font-size:18px;font-weight:700;letter-spacing:0.02em;color:#ffffff;">
                Compare<span style="color:#F58220;">Bazaar</span>
              </p>
              ${
                eyebrow
                  ? `<p style="margin:6px 0 0;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.72);">${escapeHtml(eyebrow)}</p>`
                  : ""
              }
            </td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px;color:#1e293b;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 28px;color:#64748b;font-size:13px;line-height:1.6;">
              ${footerHtml || ""}
              <p style="margin:18px 0 0;font-size:12px;color:#94a3b8;line-height:1.5;">
                © ${new Date().getFullYear()} Compare Bazaar ·
                <a href="${site}" style="color:#0B2A6F;text-decoration:none;">compare-bazaar.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const primaryButton = (href, label) => `
  <a href="${escapeHtml(href)}"
     style="display:inline-block;background:#F58220;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;padding:12px 22px;border-radius:8px;">
    ${escapeHtml(label)}
  </a>`;

const sendSubscribeConfirmationEmail = async (to, opts = {}) => {
  try {
    const from = opts.from || process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM;
    const manageUrl = unsubscribePageUrl(to);
    const blogUrl = blogHubUrl();
    await sendWithResend({
      to,
      apiKey: opts.apiKey,
      from,
      subject: "You're subscribed to Compare Bazaar updates",
      headers: {
        "List-Unsubscribe": `<${manageUrl}>`,
      },
      html: brandedEmailShell({
        preheader: "Thanks for joining Compare Bazaar email updates.",
        title: "Subscription confirmed",
        eyebrow: "Subscription confirmed",
        bodyHtml: `
          <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#0B2A6F;">You're on the list</h1>
          <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#334155;">
            Thanks for subscribing. We'll send independent software comparisons, pricing notes, and new blogs from Compare Bazaar — no vendor spam.
          </p>
          <p style="margin:0 0 22px;font-size:14px;line-height:1.6;color:#64748b;">
            Confirmed for <strong style="color:#0B2A6F;">${escapeHtml(to)}</strong>
          </p>
          <p style="margin:0 0 22px;">${primaryButton(blogUrl, "Browse latest blogs")}</p>
        `,
        footerHtml: `
          <p style="margin:0;">
            Changed your mind?
            <a href="${escapeHtml(manageUrl)}" style="color:#F58220;font-weight:600;text-decoration:none;">Unsubscribe anytime</a>.
          </p>
        `,
      }),
    });
    return { success: true };
  } catch (error) {
    const detail = error.response?.data || error.message;
    console.error("[email] subscribe confirmation failed:", detail);
    return { success: false, error: typeof detail === "object" ? JSON.stringify(detail) : String(detail) };
  }
};

const sendUnsubscribeConfirmationEmail = async (to, opts = {}) => {
  try {
    const from = opts.from || process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM;
    const blogUrl = blogHubUrl();
    const site = publicSiteOrigin();
    await sendWithResend({
      to,
      apiKey: opts.apiKey,
      from,
      subject: "You've been unsubscribed from Compare Bazaar",
      html: brandedEmailShell({
        preheader: "You will no longer receive Compare Bazaar email updates.",
        title: "Unsubscribed",
        eyebrow: "Email preferences updated",
        bodyHtml: `
          <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#0B2A6F;">You're unsubscribed</h1>
          <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#334155;">
            We removed <strong style="color:#0B2A6F;">${escapeHtml(to)}</strong> from Compare Bazaar email updates.
            You won't get new blog alerts from us unless you subscribe again.
          </p>
          <p style="margin:0 0 22px;">${primaryButton(blogUrl, "Keep browsing blogs")}</p>
        `,
        footerHtml: `
          <p style="margin:0;">
            Unsubscribed by mistake?
            <a href="${escapeHtml(site)}/#newsletter" style="color:#F58220;font-weight:600;text-decoration:none;">Subscribe again from our site</a>.
          </p>
        `,
      }),
    });
    return { success: true };
  } catch (error) {
    const detail = error.response?.data || error.message;
    console.error("[email] unsubscribe confirmation failed:", detail);
    return { success: false, error: typeof detail === "object" ? JSON.stringify(detail) : String(detail) };
  }
};

const sendNewBlogPublishedEmail = async (to, blog, resendOpts = {}) => {
  try {
    const from = resendOpts.from || process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM;
    const safeTitle = escapeHtml(blog?.title || "New Blog");
    const fullBodyHtml = prepareBlogHtmlForEmail(blog?.content || "");
    const url = publicBlogUrl(blog?.slug);
    const manageUrl = unsubscribePageUrl(to);
    await sendWithResend({
      to,
      apiKey: resendOpts.apiKey,
      from,
      subject: `New blog published: ${String(blog?.title || "Compare Bazaar").slice(0, 120)}`,
      headers: {
        "List-Unsubscribe": `<${manageUrl}>`,
      },
      html: brandedEmailShell({
        preheader: `New on Compare Bazaar: ${String(blog?.title || "Fresh blog").slice(0, 90)}`,
        title: String(blog?.title || "New blog"),
        eyebrow: "New blog published",
        bodyHtml: `
          <h1 style="margin:0 0 10px;font-size:20px;line-height:1.35;color:#0B2A6F;">${safeTitle}</h1>
          <p style="margin:0 0 16px;">${primaryButton(url, "Read on Compare Bazaar")}</p>
          <div style="font-size:15px;line-height:1.7;color:#334155;">
            ${fullBodyHtml || "<p><em>(No content)</em></p>"}
          </div>
          <p style="margin:18px 0 0;font-size:13px;color:#64748b;">
            Prefer the web version?
            <a href="${escapeHtml(url)}" style="color:#F58220;font-weight:600;text-decoration:none;">Open article</a>
          </p>
        `,
        footerHtml: `
          <p style="margin:0;">
            You received this because you subscribed to Compare Bazaar updates.
            <a href="${escapeHtml(manageUrl)}" style="color:#F58220;font-weight:600;text-decoration:none;">Unsubscribe</a>
          </p>
        `,
      }),
    });
    return { success: true };
  } catch (error) {
    const detail = error.response?.data || error.message;
    return { success: false, error: typeof detail === "object" ? JSON.stringify(detail) : String(detail) };
  }
};

module.exports = {
  sendOTPEmail,
  sendApprovalEmail,
  sendNewBlogPublishedEmail,
  sendSubscribeConfirmationEmail,
  sendUnsubscribeConfirmationEmail,
  unsubscribePageUrl,
};
