const { BetaAnalyticsDataClient } = require("@google-analytics/data");

let cachedClient = null;

function parseServiceAccountCredentials() {
  const rawJson = String(process.env.GA4_SERVICE_ACCOUNT_JSON || "").trim();
  if (rawJson) {
    try {
      return JSON.parse(rawJson);
    } catch {
      throw new Error("GA4_SERVICE_ACCOUNT_JSON is not valid JSON");
    }
  }

  const credPath = String(process.env.GOOGLE_APPLICATION_CREDENTIALS || "").trim();
  if (credPath) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(credPath);
  }

  return null;
}

function getPropertyId() {
  const raw = String(process.env.GA4_PROPERTY_ID || "").trim();
  const digits = raw.replace(/^properties\//i, "");
  return digits || "";
}

function getMeasurementId() {
  return String(process.env.GA4_MEASUREMENT_ID || "G-H0RLG3LV41").trim();
}

function isGoogleAnalyticsConfigured() {
  return Boolean(getPropertyId() && parseServiceAccountCredentials());
}

function getClient() {
  if (cachedClient) return cachedClient;
  const credentials = parseServiceAccountCredentials();
  if (!credentials) {
    throw new Error("Google Analytics API credentials are not configured");
  }
  cachedClient = new BetaAnalyticsDataClient({ credentials });
  return cachedClient;
}

function dateRangeFor(rangeRaw) {
  const range = String(rangeRaw || "7d").toLowerCase();
  if (range === "today") {
    return { key: "today", startDate: "today", endDate: "today" };
  }
  if (range === "30d" || range === "month") {
    return { key: "30d", startDate: "30daysAgo", endDate: "today" };
  }
  return { key: "7d", startDate: "7daysAgo", endDate: "today" };
}

function rowsToObjects(response) {
  const dimensionHeaders = (response.dimensionHeaders || []).map((d) => d.name);
  const metricHeaders = (response.metricHeaders || []).map((m) => m.name);

  return (response.rows || []).map((row) => {
    const item = {};
    dimensionHeaders.forEach((name, index) => {
      item[name] = row.dimensionValues?.[index]?.value ?? "";
    });
    metricHeaders.forEach((name, index) => {
      const raw = row.metricValues?.[index]?.value ?? "0";
      const num = Number(raw);
      item[name] = Number.isFinite(num) ? num : raw;
    });
    return item;
  });
}

function firstMetricValue(response, metricName, fallback = 0) {
  const row = response.rows?.[0];
  if (!row) return fallback;
  const headers = response.metricHeaders || [];
  const index = headers.findIndex((h) => h.name === metricName);
  if (index < 0) return fallback;
  const raw = row.metricValues?.[index]?.value ?? fallback;
  const num = Number(raw);
  return Number.isFinite(num) ? num : fallback;
}

function formatDuration(seconds) {
  const total = Math.max(0, Math.round(Number(seconds || 0)));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  if (!mins) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

function formatDateLabel(yyyymmdd) {
  const raw = String(yyyymmdd || "");
  if (raw.length !== 8) return raw;
  return `${raw.slice(4, 6)}/${raw.slice(6, 8)}`;
}

async function runReport({ startDate, endDate, dimensions = [], metrics, limit = 100, orderBys = [] }) {
  const client = getClient();
  const propertyId = getPropertyId();
  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: dimensions.map((name) => ({ name })),
    metrics: metrics.map((name) => ({ name })),
    limit,
    orderBys,
  });
  return response;
}

async function fetchGoogleAnalyticsReport(rangeRaw) {
  const { key, startDate, endDate } = dateRangeFor(rangeRaw);
  const propertyId = getPropertyId();
  const measurementId = getMeasurementId();

  const [
    overviewRes,
    trendRes,
    pagesRes,
    countriesRes,
    devicesRes,
    channelsRes,
    sourcesRes,
    landingRes,
    realtimeRes,
  ] = await Promise.all([
    runReport({
      startDate,
      endDate,
      metrics: [
        "activeUsers",
        "newUsers",
        "sessions",
        "screenPageViews",
        "bounceRate",
        "averageSessionDuration",
        "engagementRate",
        "eventCount",
      ],
    }),
    runReport({
      startDate,
      endDate,
      dimensions: ["date"],
      metrics: ["activeUsers", "sessions", "screenPageViews"],
      limit: 60,
      orderBys: [{ dimension: { dimensionName: "date" } }],
    }),
    runReport({
      startDate,
      endDate,
      dimensions: ["pagePath"],
      metrics: ["screenPageViews", "activeUsers", "averageSessionDuration"],
      limit: 15,
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    }),
    runReport({
      startDate,
      endDate,
      dimensions: ["country"],
      metrics: ["activeUsers", "sessions"],
      limit: 12,
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    }),
    runReport({
      startDate,
      endDate,
      dimensions: ["deviceCategory"],
      metrics: ["sessions", "activeUsers"],
      limit: 6,
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    }),
    runReport({
      startDate,
      endDate,
      dimensions: ["sessionDefaultChannelGroup"],
      metrics: ["sessions", "activeUsers"],
      limit: 12,
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    }),
    runReport({
      startDate,
      endDate,
      dimensions: ["sessionSource", "sessionMedium"],
      metrics: ["sessions", "activeUsers"],
      limit: 12,
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    }),
    runReport({
      startDate,
      endDate,
      dimensions: ["landingPage"],
      metrics: ["sessions", "activeUsers"],
      limit: 12,
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    }),
    getClient()
      .runRealtimeReport({
        property: `properties/${propertyId}`,
        metrics: [{ name: "activeUsers" }],
      })
      .then(([res]) => res)
      .catch(() => null),
  ]);

  const overview = {
    activeUsers: firstMetricValue(overviewRes, "activeUsers"),
    newUsers: firstMetricValue(overviewRes, "newUsers"),
    sessions: firstMetricValue(overviewRes, "sessions"),
    pageViews: firstMetricValue(overviewRes, "screenPageViews"),
    bounceRate: Number((firstMetricValue(overviewRes, "bounceRate", 0) * 100).toFixed(1)),
    avgSessionDuration: firstMetricValue(overviewRes, "averageSessionDuration"),
    avgSessionDurationLabel: formatDuration(firstMetricValue(overviewRes, "averageSessionDuration")),
    engagementRate: Number((firstMetricValue(overviewRes, "engagementRate", 0) * 100).toFixed(1)),
    eventCount: firstMetricValue(overviewRes, "eventCount"),
  };

  const trend = rowsToObjects(trendRes).map((row) => ({
    date: row.date,
    label: formatDateLabel(row.date),
    activeUsers: Number(row.activeUsers || 0),
    sessions: Number(row.sessions || 0),
    pageViews: Number(row.screenPageViews || 0),
  }));

  const topPages = rowsToObjects(pagesRes).map((row) => ({
    path: row.pagePath || "/",
    pageViews: Number(row.screenPageViews || 0),
    activeUsers: Number(row.activeUsers || 0),
    avgSessionDuration: formatDuration(row.averageSessionDuration),
  }));

  const countries = rowsToObjects(countriesRes).map((row) => ({
    country: row.country || "Unknown",
    activeUsers: Number(row.activeUsers || 0),
    sessions: Number(row.sessions || 0),
  }));

  const devices = rowsToObjects(devicesRes).map((row) => ({
    device: row.deviceCategory || "unknown",
    sessions: Number(row.sessions || 0),
    activeUsers: Number(row.activeUsers || 0),
  }));

  const channels = rowsToObjects(channelsRes).map((row) => ({
    channel: row.sessionDefaultChannelGroup || "Unknown",
    sessions: Number(row.sessions || 0),
    activeUsers: Number(row.activeUsers || 0),
  }));

  const sources = rowsToObjects(sourcesRes).map((row) => ({
    source: row.sessionSource || "(direct)",
    medium: row.sessionMedium || "(none)",
    sessions: Number(row.sessions || 0),
    activeUsers: Number(row.activeUsers || 0),
  }));

  const landingPages = rowsToObjects(landingRes).map((row) => ({
    path: row.landingPage || "/",
    sessions: Number(row.sessions || 0),
    activeUsers: Number(row.activeUsers || 0),
  }));

  const realtimeUsers = realtimeRes ? firstMetricValue(realtimeRes, "activeUsers", 0) : null;

  return {
    configured: true,
    syncedAt: new Date().toISOString(),
    range: key,
    propertyId,
    measurementId,
    overview,
    realtimeUsers,
    trend,
    topPages,
    countries,
    devices,
    channels,
    sources,
    landingPages,
  };
}

function getGoogleAnalyticsSetupStatus() {
  const propertyId = getPropertyId();
  const hasCredentials = Boolean(parseServiceAccountCredentials());
  return {
    configured: Boolean(propertyId && hasCredentials),
    propertyId: propertyId || null,
    measurementId: getMeasurementId(),
    hasCredentials,
    missing: [
      !propertyId ? "GA4_PROPERTY_ID" : null,
      !hasCredentials ? "GA4_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS" : null,
    ].filter(Boolean),
  };
}

module.exports = {
  isGoogleAnalyticsConfigured,
  getGoogleAnalyticsSetupStatus,
  fetchGoogleAnalyticsReport,
};
