const mongoose = require("mongoose");

const consentSnapshotSchema = new mongoose.Schema(
  {
    necessary: { type: Boolean, default: true },
    analytics: { type: Boolean, default: false },
    marketing: { type: Boolean, default: false },
  },
  { _id: false }
);

/** Hit-level + first-touch campaign context (only fully populated when visitor allows marketing cookies). */
const marketingMetaSchema = new mongoose.Schema(
  {
    utmSource: { type: String, default: "" },
    utmMedium: { type: String, default: "" },
    utmCampaign: { type: String, default: "" },
    utmContent: { type: String, default: "" },
    utmTerm: { type: String, default: "" },
    ftSource: { type: String, default: "" },
    ftMedium: { type: String, default: "" },
    ftCampaign: { type: String, default: "" },
    ftContent: { type: String, default: "" },
    ftTerm: { type: String, default: "" },
    ftLandingPath: { type: String, default: "" },
    ftAt: { type: String, default: "" },
    locale: { type: String, default: "" },
    deviceCategory: { type: String, default: "" },
    viewportWidth: { type: Number, default: 0 },
    /** Tailwind-like bucket for reporting (xs–2xl). */
    viewportBucket: { type: String, default: "" },
    screenWidth: { type: Number, default: 0 },
    screenHeight: { type: Number, default: 0 },
    pixelRatio: { type: Number, default: 0 },
    /** navigator.platform / userAgentData.platform when available */
    platform: { type: String, default: "" },
    /** First BCP-47 tag only — cleaner charts than full languagesLabel */
    primaryLanguage: { type: String, default: "" },
    /** document.referrer hostname only (not full URL) */
    referrerHost: { type: String, default: "" },
    /** Network Information API downlink (Mbps) when available */
    connectionDownlink: { type: Number, default: 0 },
    /** From CDN edge header when available (e.g. Cloudflare / Vercel). */
    country: { type: String, default: "" },
    /** City / region when the edge forwards them (e.g. Vercel geo headers). */
    city: { type: String, default: "" },
    region: { type: String, default: "" },
    /** Visitor IP captured from x-forwarded-for or socket remoteAddress. */
    ip: { type: String, default: "" },
    /** ISP / network provider from IP enrichment lookup. */
    isp: { type: String, default: "" },
    /** IANA timezone from the browser (Intl), not IP-derived. */
    timeZone: { type: String, default: "" },
    /** Comma-separated BCP-47 tags from navigator.languages */
    languagesLabel: { type: String, default: "" },
    /** Network Information API effectiveType when available (4g, 3g, …). */
    connectionEffectiveType: { type: String, default: "" },
    /**
     * True if the page URL contained an email-shaped query value (newsletter/CRM prefills).
     * The email itself is never stored.
     */
    emailPrefillHint: { type: Boolean, default: false },
    /** Email domain only from query prefill, e.g. gmail.com. Never stores full address. */
    emailPrefillDomain: { type: String, default: "" },
  },
  { _id: false }
);

const siteAnalyticsEventSchema = new mongoose.Schema(
  {
    kind: {
      type: String,
      enum: ["page_view", "consent"],
      required: true,
      index: true,
    },
    sessionId: { type: String, required: true, index: true },
    path: { type: String, default: "" },
    referrer: { type: String, default: "" },
    consentSnapshot: { type: consentSnapshotSchema, default: () => ({}) },
    userAgent: { type: String, default: "" },
    marketingMeta: { type: marketingMetaSchema },
  },
  { timestamps: true }
);

siteAnalyticsEventSchema.index({ createdAt: -1 });
siteAnalyticsEventSchema.index({ kind: 1, createdAt: -1 });
siteAnalyticsEventSchema.index({ "marketingMeta.utmCampaign": 1, createdAt: -1 });
siteAnalyticsEventSchema.index({ "marketingMeta.timeZone": 1, createdAt: -1 });
siteAnalyticsEventSchema.index({ "marketingMeta.city": 1, createdAt: -1 });
siteAnalyticsEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 15552000 });

module.exports = mongoose.model("SiteAnalyticsEvent", siteAnalyticsEventSchema);
