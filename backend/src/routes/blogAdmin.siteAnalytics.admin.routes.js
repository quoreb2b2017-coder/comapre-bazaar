const express = require("express");
const { protect } = require("../middlewares/blogAdminAuth.middleware");
const SiteAnalyticsEvent = require("../models/siteAnalyticsEvent.model");

const router = express.Router();

function since(days) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d;
}

async function windowStats(fromDate) {
  const matchPV = { kind: "page_view", createdAt: { $gte: fromDate } };
  const matchConsent = { kind: "consent", createdAt: { $gte: fromDate } };

  const [pageViews, consentEvents, distinctAgg] = await Promise.all([
    SiteAnalyticsEvent.countDocuments(matchPV),
    SiteAnalyticsEvent.countDocuments(matchConsent),
    SiteAnalyticsEvent.aggregate([
      { $match: matchPV },
      { $group: { _id: "$sessionId" } },
      { $count: "uniqueSessions" },
    ]),
  ]);

  const uniqueSessions = distinctAgg[0]?.uniqueSessions ?? 0;

  const consentBreakdown = await SiteAnalyticsEvent.aggregate([
    { $match: matchConsent },
    {
      $group: {
        _id: {
          analytics: "$consentSnapshot.analytics",
          marketing: "$consentSnapshot.marketing",
        },
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    pageViews,
    uniqueSessions,
    consentEvents,
    consentBreakdown: consentBreakdown.map((r) => ({
      analytics: r._id.analytics === true,
      marketing: r._id.marketing === true,
      count: r.count,
    })),
  };
}

async function customEventSummary(fromDate) {
  const customMatch = { kind: "custom", createdAt: { $gte: fromDate } };
  const [byEvent, byCategory] = await Promise.all([
    SiteAnalyticsEvent.aggregate([
      { $match: customMatch },
      { $group: { _id: "$customMeta.eventName", count: { $sum: 1 }, valueSum: { $sum: "$customMeta.value" } } },
      { $sort: { count: -1 } },
      { $limit: 50 },
    ]),
    SiteAnalyticsEvent.aggregate([
      { $match: customMatch },
      { $group: { _id: "$customMeta.metricCategory", count: { $sum: 1 }, valueSum: { $sum: "$customMeta.value" } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]),
  ]);

  const byEventMap = new Map(byEvent.map((r) => [String(r._id || ""), r]));
  const pickCount = (name) => Number(byEventMap.get(name)?.count || 0);
  const pickValue = (name) => Number(byEventMap.get(name)?.valueSum || 0);

  return {
    eventBreakdown: byEvent.map((r) => ({
      eventName: r._id || "unknown",
      count: Number(r.count || 0),
      valueSum: Number(r.valueSum || 0),
    })),
    categoryBreakdown: byCategory.map((r) => ({
      category: r._id || "uncategorized",
      count: Number(r.count || 0),
      valueSum: Number(r.valueSum || 0),
    })),
    keyMetrics: {
      scrollDepthEvents: pickCount("scroll_depth"),
      internalLinkClicks: pickCount("internal_link_click"),
      affiliateClicks: pickCount("affiliate_click"),
      sponsoredCtaClicks: pickCount("sponsored_cta_click"),
      sponsorLogoImpressions: pickCount("sponsor_logo_impression"),
      emailSignups: pickCount("email_signup"),
      leadMagnetDownloads: pickCount("lead_magnet_download"),
      formStarts: pickCount("form_start"),
      formSubmits: pickCount("form_submit"),
      formAbandonments: pickCount("form_abandon"),
      ctaClicks: pickCount("cta_click"),
      notFoundPageViews: pickCount("page_not_found"),
      webVitalsLcpTotal: pickValue("web_vitals_lcp"),
      webVitalsClsTotal: pickValue("web_vitals_cls"),
      webVitalsInpTotal: pickValue("web_vitals_inp"),
    },
  };
}

router.get("/site-analytics/report", protect, async (_req, res) => {
  try {
    const now = new Date();
    const d24 = since(1);
    const d7 = since(7);
    const d30 = since(30);

    const pv7 = { kind: "page_view", createdAt: { $gte: d7 } };

    const [
      last24h,
      last7d,
      last30d,
      custom7d,
      custom30d,
      topPaths,
      dailyPageViews,
      taggedPageViews7d,
      utmSources,
      utmCampaigns,
      ftCampaigns,
      deviceMix,
      countryMix,
      timeZoneMix,
      languagesMix,
      cityMix,
      regionMix,
      primaryLanguageMix,
      platformMix,
      ispMix,
      referrerHostMix,
      viewportBucketMix,
      connectionTypeMix,
      emailPrefillHits7d,
      emailDomainMix,
      recent,
    ] = await Promise.all([
      windowStats(d24),
      windowStats(d7),
      windowStats(d30),
      customEventSummary(d7),
      customEventSummary(d30),
      SiteAnalyticsEvent.aggregate([
        { $match: pv7 },
        { $group: { _id: "$path", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 30 },
      ]),
      SiteAnalyticsEvent.aggregate([
        {
          $match: {
            kind: "page_view",
            createdAt: { $gte: d30 },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "UTC" },
            },
            views: { $sum: 1 },
            sessions: { $addToSet: "$sessionId" },
          },
        },
        {
          $project: {
            date: "$_id",
            views: 1,
            uniqueSessions: { $size: "$sessions" },
            _id: 0,
          },
        },
        { $sort: { date: 1 } },
      ]),
      SiteAnalyticsEvent.countDocuments({
        ...pv7,
        "marketingMeta.utmSource": { $nin: [null, ""] },
      }),
      SiteAnalyticsEvent.aggregate([
        {
          $match: {
            ...pv7,
            "marketingMeta.utmSource": { $nin: [null, ""] },
          },
        },
        { $group: { _id: "$marketingMeta.utmSource", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 20 },
      ]),
      SiteAnalyticsEvent.aggregate([
        {
          $match: {
            ...pv7,
            "marketingMeta.utmCampaign": { $nin: [null, ""] },
          },
        },
        { $group: { _id: "$marketingMeta.utmCampaign", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 20 },
      ]),
      SiteAnalyticsEvent.aggregate([
        {
          $match: {
            ...pv7,
            "marketingMeta.ftCampaign": { $nin: [null, ""] },
          },
        },
        { $group: { _id: "$marketingMeta.ftCampaign", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 15 },
      ]),
      SiteAnalyticsEvent.aggregate([
        { $match: pv7 },
        { $group: { _id: "$marketingMeta.deviceCategory", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
      ]),
      SiteAnalyticsEvent.aggregate([
        {
          $match: {
            ...pv7,
            "marketingMeta.country": { $nin: [null, ""] },
          },
        },
        { $group: { _id: "$marketingMeta.country", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 25 },
      ]),
      SiteAnalyticsEvent.aggregate([
        {
          $match: {
            ...pv7,
            "marketingMeta.timeZone": { $nin: [null, ""] },
          },
        },
        { $group: { _id: "$marketingMeta.timeZone", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 20 },
      ]),
      SiteAnalyticsEvent.aggregate([
        {
          $match: {
            ...pv7,
            "marketingMeta.languagesLabel": { $nin: [null, ""] },
          },
        },
        { $group: { _id: "$marketingMeta.languagesLabel", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 15 },
      ]),
      SiteAnalyticsEvent.aggregate([
        {
          $match: {
            ...pv7,
            "marketingMeta.city": { $nin: [null, ""] },
          },
        },
        { $group: { _id: "$marketingMeta.city", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 20 },
      ]),
      SiteAnalyticsEvent.aggregate([
        {
          $match: {
            ...pv7,
            "marketingMeta.region": { $nin: [null, ""] },
          },
        },
        { $group: { _id: "$marketingMeta.region", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 25 },
      ]),
      SiteAnalyticsEvent.aggregate([
        {
          $match: {
            ...pv7,
            "marketingMeta.primaryLanguage": { $nin: [null, ""] },
          },
        },
        { $group: { _id: "$marketingMeta.primaryLanguage", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 20 },
      ]),
      SiteAnalyticsEvent.aggregate([
        {
          $match: {
            ...pv7,
            "marketingMeta.platform": { $nin: [null, ""] },
          },
        },
        { $group: { _id: "$marketingMeta.platform", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 20 },
      ]),
      SiteAnalyticsEvent.aggregate([
        {
          $match: {
            ...pv7,
            "marketingMeta.isp": { $nin: [null, ""] },
          },
        },
        { $group: { _id: "$marketingMeta.isp", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 20 },
      ]),
      SiteAnalyticsEvent.aggregate([
        {
          $match: {
            ...pv7,
            "marketingMeta.referrerHost": { $nin: [null, ""] },
          },
        },
        { $group: { _id: "$marketingMeta.referrerHost", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 25 },
      ]),
      SiteAnalyticsEvent.aggregate([
        {
          $match: {
            ...pv7,
            "marketingMeta.viewportBucket": { $nin: [null, ""] },
          },
        },
        { $group: { _id: "$marketingMeta.viewportBucket", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
      ]),
      SiteAnalyticsEvent.aggregate([
        {
          $match: {
            ...pv7,
            "marketingMeta.connectionEffectiveType": { $nin: [null, ""] },
          },
        },
        { $group: { _id: "$marketingMeta.connectionEffectiveType", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 12 },
      ]),
      SiteAnalyticsEvent.countDocuments({
        ...pv7,
        "marketingMeta.emailPrefillHint": true,
      }),
      SiteAnalyticsEvent.aggregate([
        {
          $match: {
            ...pv7,
            "marketingMeta.emailPrefillDomain": { $nin: [null, ""] },
          },
        },
        { $group: { _id: "$marketingMeta.emailPrefillDomain", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 20 },
      ]),
      SiteAnalyticsEvent.find({})
        .sort({ createdAt: -1 })
        .limit(80)
        .select("kind sessionId path referrer consentSnapshot userAgent marketingMeta customMeta createdAt")
        .lean(),
    ]);

    res.json({
      success: true,
      data: {
        generatedAt: now.toISOString(),
        windows: { last24h, last7d, last30d },
        topPaths: topPaths.map((r) => ({ path: r._id, views: r.views })),
        dailyPageViews,
        marketing: {
          taggedPageViews7d,
          utmSources: utmSources.map((r) => ({ source: r._id, views: r.views })),
          utmCampaigns: utmCampaigns.map((r) => ({ campaign: r._id, views: r.views })),
          firstTouchCampaigns: ftCampaigns.map((r) => ({ campaign: r._id, views: r.views })),
          devices: deviceMix.map((r) => ({ device: r._id || "unknown", views: r.views })),
          countries: countryMix.map((r) => ({ country: r._id, views: r.views })),
          timeZones: timeZoneMix.map((r) => ({ zone: r._id, views: r.views })),
          languagesLabels: languagesMix.map((r) => ({ label: r._id, views: r.views })),
          cities: cityMix.map((r) => ({ city: r._id, views: r.views })),
          regions: regionMix.map((r) => ({ region: r._id, views: r.views })),
          primaryLanguages: primaryLanguageMix.map((r) => ({ lang: r._id, views: r.views })),
          platforms: platformMix.map((r) => ({ platform: r._id, views: r.views })),
          isps: ispMix.map((r) => ({ isp: r._id, views: r.views })),
          referrerHosts: referrerHostMix.map((r) => ({ host: r._id, views: r.views })),
          viewportBuckets: viewportBucketMix.map((r) => ({ bucket: r._id, views: r.views })),
          connectionTypes: connectionTypeMix.map((r) => ({ type: r._id, views: r.views })),
          emailPrefillHits7d,
          emailDomains: emailDomainMix.map((r) => ({ domain: r._id, views: r.views })),
        },
        setupMetrics: {
          customEvents7d: custom7d,
          customEvents30d: custom30d,
        },
        recent: recent.map((e) => ({
          kind: e.kind,
          sessionId: e.sessionId,
          path: e.path,
          referrer: e.referrer,
          consentSnapshot: e.consentSnapshot,
          userAgent: e.userAgent,
          marketingMeta: e.marketingMeta || null,
          customMeta: e.customMeta || null,
          createdAt: e.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("site-analytics report:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
