const axios = require("axios");

/** Plain text from HTML — safe length cap for Claude prompt */
function htmlToPlainSnippet(html, maxLen) {
  const t = String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return t.slice(0, maxLen);
}

async function fetchUrlPlain(url, maxLen = 5500) {
  try {
    const res = await axios.get(url, {
      timeout: 18000,
      maxRedirects: 5,
      headers: {
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "User-Agent": "CompareBazaarBlogGenerator/1.0 (editorial; +https://compare-bazaar.com)",
      },
      validateStatus: (s) => s >= 200 && s < 400,
    });
    return htmlToPlainSnippet(res.data, maxLen);
  } catch (e) {
    console.warn(`[blogAdmin.siteReader] ${url}:`, e.message);
    return "";
  }
}

/**
 * Pull plain-text excerpts from the live Compare Bazaar site so Claude can match voice/topics.
 * Override base with WEBSITE_URL or BLOG_VOICE_SITE_URL (https only recommended).
 */
async function getCompareBazaarEditorialContext() {
  const raw = String(
    process.env.BLOG_VOICE_SITE_URL || process.env.WEBSITE_URL || "https://compare-bazaar.com"
  ).trim();
  const base = raw.replace(/\/+$/, "");
  if (!base.startsWith("http")) {
    console.warn("[blogAdmin.siteReader] Invalid site URL, skipping context fetch");
    return "";
  }

  const urls = [`${base}/`, `${base}/blog`];
  const parts = [];
  for (const url of urls) {
    const snippet = await fetchUrlPlain(url, 5200);
    if (snippet) parts.push(`[${url}]\n${snippet}`);
  }

  const combined = parts.join("\n\n").trim();
  if (!combined) {
    console.warn("[blogAdmin.siteReader] No site context fetched — generation continues without live excerpts");
  }
  return combined.slice(0, 14000);
}

module.exports = { getCompareBazaarEditorialContext, fetchUrlPlain };
