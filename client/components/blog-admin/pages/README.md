# Analytics Status Logic (How "Live / Partial / Setup" is decided)

This document explains exactly how the dashboard in `Analytics.jsx` decides metric statuses.

## Data Source

The page requests:

- `GET /site-analytics/report`

Then it builds derived signals from:

- `windows.last30d`, `windows.last7d`
- `marketing` (utm sources, campaigns, countries, devices, referrers, etc.)
- `recent` events
- `setupMetrics.customEvents30d.keyMetrics`

These derived booleans are used as decision switches, for example:

- `hasTraffic`
- `hasTopPages`
- `hasSources`
- `hasGeo`
- `hasDevice`
- `hasDailyTrend`
- `hasCampaign`
- `hasCustomPipeline`
- `hasScrollDepth`
- `hasInternalLinkClicks`
- `hasAffiliateClicks`
- `hasWebVitals`

## Status Meanings

- **Live**: clear signal/data exists and metric is already measurable.
- **Partial**: some supporting data exists, but complete tracking/integration is not fully wired.
- **Setup**: required data/integration is missing.

---

## Basis for the metrics you listed

## 1) Traffic & Visitor Analytics

- **Monthly unique visitors** -> `live` if `last30.uniqueSessions > 0`, else `setup`
- **New vs returning visitors** -> `partial` if traffic exists, else `setup`
- **Traffic source breakdown** -> `live` if source/channel data exists, else `setup`
- **Top landing pages** -> `live` if top pages list has rows, else `setup`
- **Bounce rate by page** -> `partial` if traffic exists, else `setup`
- **Session duration** -> `partial` only when custom pipeline exists, else `setup`
- **Pages per session** -> `live` if traffic exists, else `setup`
- **Geographic breakdown** -> `live` if country data exists; otherwise `partial` if custom pipeline exists; else `setup`
- **Device split** -> `live` if device data exists, else `setup`
- **Hour/day heatmap** -> `partial` if daily trend exists, else `setup`

## 2) Content Performance Analytics

- **Top pages by traffic** -> `live` if top pages exist, else `setup`
- **Avg time on comparison pages** -> `partial` if custom event pipeline exists, else `setup`
- **Scroll depth %** -> `live` when `scrollDepthEvents > 0`; else `partial/setup` based on pipeline readiness
- **Blog post performance** -> `partial` if top pages exist, else `setup`
- **Internal link clicks** -> `live` when `internalLinkClicks > 0`; else `partial/setup` based on pipeline readiness
- **Content freshness score** -> `partial` if trend data exists, else `setup`
- **Exit pages** -> `partial` if top pages exist, else `setup`
 
## 3) Affiliate & Revenue Analytics

- **Affiliate clicks by page** -> `live` when `affiliateClicks > 0`; else `partial/setup` based on pipeline readiness
- **Click-through rate (CTR)** -> `partial` when affiliate clicks exist; else `partial/setup` based on pipeline readiness
- **Conversion rate by vendor** -> `partial/setup` based on custom pipeline readiness

## 4) SEO & Keyword Analytics

- **Core Web Vitals** -> `live` if any web-vitals totals exist (`LCP/CLS/INP`), else `partial/setup` based on pipeline readiness

---

## Why many rows show "Partial"

Many metrics are intentionally marked **Partial** when:

1. There is enough data to show directional reporting, but
2. The full instrumentation stack is not complete (for example: event schema depth, attribution joins, external connectors, or full funnel mapping).

This is why the UI also shows the connector note:

- GA4
- Search Console
- Ahrefs/Semrush
- Hotjar/Clarity
- Affiliate platform API
- Mailchimp/ConvertKit
- Ad/Sponsor CRM
- Looker Studio blending

---

## File references

- Metric rules: `client/components/blog-admin/pages/Analytics.jsx`
- This documentation: `client/components/blog-admin/pages/README.md`

