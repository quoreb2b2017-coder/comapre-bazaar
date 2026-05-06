const express = require("express");
const rateLimit = require("express-rate-limit");
const axios = require("axios");
const SiteAnalyticsEvent = require("../models/siteAnalyticsEvent.model");

const router = express.Router();

const ingestLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 90,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many analytics requests. Try again shortly." },
});

const SESSION_ID_RE = /^[a-zA-Z0-9_-]{12,64}$/;
const EMAIL_SHAPED_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizePath(p) {
  const s = String(p ?? "").trim();
  if (!s.startsWith("/")) return "";
  if (s.length > 1024) return s.slice(0, 512);
  return s.slice(0, 512);
}

function sanitizeReferrer(r) {
  return String(r ?? "").trim().slice(0, 512);
}

function sanitizeStr(s, max) {
  return String(s ?? "")
    .trim()
    .slice(0, max)
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "");
}

function sanitizeDevice(d) {
  const x = String(d ?? "").toLowerCase();
  if (["mobile", "tablet", "desktop", "unknown"].includes(x)) return x;
  return "unknown";
}

function clampInt(n, lo, hi) {
  const x = Number(n);
  if (!Number.isFinite(x)) return 0;
  return Math.min(hi, Math.max(lo, Math.round(x)));
}

function clampFloat(n, lo, hi) {
  const x = Number(n);
  if (!Number.isFinite(x)) return 0;
  return Math.min(hi, Math.max(lo, x));
}

function sanitizeViewportBucket(v) {
  const s = String(v ?? "").toLowerCase();
  return ["xs", "sm", "md", "lg", "xl", "2xl"].includes(s) ? s : "";
}

function sanitizeEventName(v) {
  const s = sanitizeStr(v, 80).toLowerCase();
  return s.replace(/[^a-z0-9:_-]/g, "");
}

function sanitizeMetaCategory(v) {
  const s = sanitizeStr(v, 64).toLowerCase();
  return s.replace(/[^a-z0-9:_-]/g, "");
}

function sanitizeCustomMeta(rawMeta = {}) {
  const valueNum = Number(rawMeta.value);
  return {
    eventName: sanitizeEventName(rawMeta.eventName),
    metricCategory: sanitizeMetaCategory(rawMeta.metricCategory),
    label: sanitizeStr(rawMeta.label, 140),
    value: Number.isFinite(valueNum) ? valueNum : 0,
    vendor: sanitizeStr(rawMeta.vendor, 120),
    placement: sanitizeStr(rawMeta.placement, 120),
    pageType: sanitizeStr(rawMeta.pageType, 80),
    elementId: sanitizeStr(rawMeta.elementId, 120),
    extra: rawMeta.extra && typeof rawMeta.extra === "object" ? rawMeta.extra : null,
  };
}

function extractEmailDomain(value) {
  let s = String(value ?? "").trim();
  if (!s) return "";
  try {
    s = decodeURIComponent(s);
  } catch {
    /* keep raw */
  }
  s = s.replace(/^mailto:/i, "").trim();
  if (!(s.length > 2 && s.length <= 320 && EMAIL_SHAPED_RE.test(s))) return "";
  const at = s.lastIndexOf("@");
  if (at < 0) return "";
  const domain = s.slice(at + 1).trim().toLowerCase();
  if (!domain || domain.length > 120) return "";
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) return "";
  return domain;
}

function extractDomainLike(value) {
  let s = String(value ?? "").trim().toLowerCase();
  if (!s) return "";
  try {
    s = decodeURIComponent(s);
  } catch {
    /* keep raw */
  }
  s = s.replace(/^mailto:/i, "").trim();
  if (!s || s.length > 120) return "";
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(s)) return "";
  return s;
}

function emailDomainFromPath(pathRaw) {
  const path = String(pathRaw ?? "").trim();
  if (!path) return "";
  try {
    const u = new URL(path.startsWith("/") ? `http://local${path}` : path);
    const preferred = ["email", "e", "mail", "user", "email_domain", "domain", "edomain", "mail_domain"];
    for (const key of preferred) {
      const raw = u.searchParams.get(key);
      const d = extractEmailDomain(raw) || extractDomainLike(raw);
      if (d) return d;
    }
    for (const [, value] of u.searchParams.entries()) {
      const d = extractEmailDomain(value) || extractDomainLike(value);
      if (d) return d;
    }
  } catch {
    return "";
  }
  return "";
}

function sanitizeIp(ip) {
  const raw = String(ip ?? "").trim();
  if (!raw) return "";
  if (raw === "::1" || raw === "127.0.0.1") return "";
  const v4Mapped = raw.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  const out = v4Mapped ? v4Mapped[1] : raw;
  return out.slice(0, 64);
}

function resolveClientIp(req) {
  const trustProxy = !!req.app?.get("trust proxy");
  if (trustProxy) {
    const xff = String(req.headers["x-forwarded-for"] || "").trim();
    if (xff) {
      const first = xff
        .split(",")
        .map((x) => x.trim())
        .find(Boolean);
      const s = sanitizeIp(first);
      if (s) return s;
    }
    const reqIp = sanitizeIp(req.ip);
    if (reqIp) return reqIp;
    const fromIps = Array.isArray(req.ips) ? req.ips.find(Boolean) : "";
    const ipsIp = sanitizeIp(fromIps);
    if (ipsIp) return ipsIp;
  }
  return sanitizeIp(req.socket?.remoteAddress || req.connection?.remoteAddress);
}

function isLocalOrPrivateIp(ip) {
  const v = String(ip || "").toLowerCase();
  if (!v) return true;
  if (v === "::1" || v === "localhost") return true;
  if (/^127\./.test(v)) return true;
  if (/^10\./.test(v)) return true;
  if (/^192\.168\./.test(v)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(v)) return true;
  if (v === "::" || /^fc/i.test(v) || /^fd/i.test(v) || /^fe80:/i.test(v)) return true;
  return false;
}

async function lookupIpGeo(ip) {
  const cleanIp = sanitizeIp(ip);
  if (!cleanIp || isLocalOrPrivateIp(cleanIp)) {
    return { ip: cleanIp, city: "", country: "", isp: "" };
  }
  try {
    const { data } = await axios.get(`https://ipwho.is/${encodeURIComponent(cleanIp)}`, {
      timeout: 2500,
    });
    if (!data || data.success === false) {
      return { ip: cleanIp, city: "", country: "", isp: "" };
    }
    return {
      ip: cleanIp,
      city: sanitizeStr(data.city, 80),
      country: sanitizeStr(data.country_code || data.country, 80),
      isp: sanitizeStr(data.connection?.isp || data.connection?.org, 120),
    };
  } catch {
    return { ip: cleanIp, city: "", country: "", isp: "" };
  }
}

/** Node lowercases incoming header keys — try known CDN / edge geo headers in order. */
function headerFirst(req, names) {
  const h = req.headers || {};
  for (const name of names) {
    const key = String(name).toLowerCase();
    const raw = h[key];
    if (raw != null && String(raw).trim() !== "") return String(raw).trim();
  }
  return "";
}

function pickCountry(req) {
  const raw = headerFirst(req, [
    "cf-ipcountry",
    "x-vercel-ip-country",
    "cloudfront-viewer-country",
    "x-country-code",
    "fastly-client-country",
    "true-client-country",
    "x-appengine-country",
    "cf-ip-country",
  ]);
  const code = raw.slice(0, 2).toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : "";
}

function pickCity(req) {
  const v = headerFirst(req, [
    "x-vercel-ip-city",
    "cf-ip-city",
    "cf-ipcity",
    "cloudfront-viewer-city",
    "fastly-client-city",
    "x-city",
  ]);
  return sanitizeStr(v, 80);
}

function pickRegion(req) {
  const v = headerFirst(req, [
    "x-vercel-ip-country-region",
    "cloudfront-viewer-country-region",
    "cf-region",
    "fastly-client-region",
    "x-region",
  ]);
  return sanitizeStr(v, 48);
}

/**
 * Prefer client-derived hostname (marketing.referrerHost); else parse document.referrer-style URL from body.
 */
function resolveReferrerHost(body) {
  const m = body.marketing || {};
  const fromClient = sanitizeStr(m.referrerHost, 120).toLowerCase();
  if (fromClient) return fromClient;
  const ref = String(body.referrer ?? "")
    .trim()
    .slice(0, 512);
  if (!ref) return "";
  try {
    const u = new URL(ref);
    const host = u.hostname.toLowerCase();
    return host.slice(0, 120);
  } catch {
    return sanitizeStr(body.host || body.hostname || "", 120).toLowerCase();
  }
}

/**
 * With analytics only: locale, device, viewport, country (no UTMs).
 * With marketing: session UTMs + first-touch snapshot from cookie pipeline.
 */
async function buildMarketingMeta(body, req, marketingAllowed) {
  const m = body.marketing || {};
  const ip = resolveClientIp(req);
  const ipGeo = await lookupIpGeo(ip);
  const country = pickCountry(req) || ipGeo.country;
  const cityEdge = pickCity(req) || ipGeo.city;
  const regionEdge = pickRegion(req);

  const locale = sanitizeStr(m.locale, 48);
  const deviceCategory = sanitizeDevice(m.deviceCategory);
  const viewportWidth = clampInt(m.viewportWidth, 0, 8192);
  const timeZone = sanitizeStr(m.timeZone, 64);
  const languagesLabel = sanitizeStr(m.languagesLabel, 120);
  const connectionEffectiveType = sanitizeStr(m.connectionEffectiveType, 24);
  const emailPrefillDomainClient = sanitizeStr(m.emailPrefillDomain, 120).toLowerCase();
  const emailPrefillDomainFallback = emailDomainFromPath(body.path);
  const emailPrefillDomain = emailPrefillDomainClient || emailPrefillDomainFallback;
  const emailPrefillHint =
    m.emailPrefillHint === true ||
    m.emailPrefillHint === "true" ||
    m.emailPrefillHint === 1 ||
    m.emailPrefillHint === "1" ||
    !!emailPrefillDomain;

  const referrerHostResolved = resolveReferrerHost(body);

  const common = {
    locale,
    deviceCategory,
    viewportWidth,
    viewportBucket: sanitizeViewportBucket(m.viewportBucket),
    screenWidth: clampInt(m.screenWidth, 0, 16384),
    screenHeight: clampInt(m.screenHeight, 0, 16384),
    pixelRatio: clampFloat(m.pixelRatio, 0, 16),
    platform: sanitizeStr(m.platform, 64),
    primaryLanguage: sanitizeStr(m.primaryLanguage, 24),
    referrerHost: referrerHostResolved,
    connectionDownlink: clampFloat(m.connectionDownlink, 0, 1000),
    country,
    city: cityEdge,
    region: regionEdge,
    ip,
    isp: ipGeo.isp,
    timeZone,
    languagesLabel,
    connectionEffectiveType,
    emailPrefillHint,
    emailPrefillDomain,
  };

  if (!marketingAllowed) {
    return common;
  }

  return {
    utmSource: sanitizeStr(m.utmSource, 160),
    utmMedium: sanitizeStr(m.utmMedium, 160),
    utmCampaign: sanitizeStr(m.utmCampaign, 160),
    utmContent: sanitizeStr(m.utmContent, 160),
    utmTerm: sanitizeStr(m.utmTerm, 160),
    ftSource: sanitizeStr(m.ftSource, 160),
    ftMedium: sanitizeStr(m.ftMedium, 160),
    ftCampaign: sanitizeStr(m.ftCampaign, 160),
    ftContent: sanitizeStr(m.ftContent, 160),
    ftTerm: sanitizeStr(m.ftTerm, 160),
    ftLandingPath: sanitizeStr(m.ftLandingPath, 512),
    ftAt: sanitizeStr(m.ftAt, 40),
    ...common,
  };
}

/**
 * POST /api/v1/blog-admin/public/site-analytics/event
 */
router.post("/event", ingestLimiter, async (req, res) => {
  try {
    const body = req.body || {};
    const sessionId = String(body.sessionId || "").trim();
    if (!SESSION_ID_RE.test(sessionId)) {
      return res.status(400).json({
        success: false,
        message: "sessionId must be 12–64 alphanumeric characters",
      });
    }

    const ua = String(req.headers["user-agent"] || "").slice(0, 280);
    const kind = String(body.kind || "").trim();
    const marketingAllowed = !!body.consent?.marketing;

    if (kind === "page_view") {
      if (!body.consent?.analytics) {
        return res.status(400).json({
          success: false,
          message: "page_view requires analytics consent",
        });
      }
      const path = sanitizePath(body.path);
      if (!path) {
        return res.status(400).json({ success: false, message: "path required" });
      }

      const marketingMeta = await buildMarketingMeta(body, req, marketingAllowed);

      await SiteAnalyticsEvent.create({
        kind: "page_view",
        sessionId,
        path,
        referrer: sanitizeReferrer(body.referrer),
        consentSnapshot: {
          necessary: true,
          analytics: true,
          marketing: marketingAllowed,
        },
        userAgent: ua,
        marketingMeta,
      });
      return res.json({ success: true });
    }

    if (kind === "consent") {
      const path = sanitizePath(body.path) || "/";
      await SiteAnalyticsEvent.create({
        kind: "consent",
        sessionId,
        path,
        referrer: sanitizeReferrer(body.referrer),
        consentSnapshot: {
          necessary: true,
          analytics: !!body.consent?.analytics,
          marketing: !!body.consent?.marketing,
        },
        userAgent: ua,
      });
      return res.json({ success: true });
    }

    if (kind === "custom") {
      if (!body.consent?.analytics) {
        return res.status(400).json({
          success: false,
          message: "custom event requires analytics consent",
        });
      }
      const path = sanitizePath(body.path) || "/";
      const customMeta = sanitizeCustomMeta(body.customMeta || {});
      if (!customMeta.eventName) {
        return res.status(400).json({
          success: false,
          message: "customMeta.eventName required",
        });
      }
      const marketingMeta = await buildMarketingMeta(body, req, marketingAllowed);
      await SiteAnalyticsEvent.create({
        kind: "custom",
        sessionId,
        path,
        referrer: sanitizeReferrer(body.referrer),
        consentSnapshot: {
          necessary: true,
          analytics: true,
          marketing: marketingAllowed,
        },
        userAgent: ua,
        marketingMeta,
        customMeta,
      });
      return res.json({ success: true });
    }

    return res.status(400).json({ success: false, message: "invalid kind" });
  } catch (error) {
    console.error("site-analytics event:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
