# Looker Studio Dashboard Plan (Real Data, 60+ Metrics)

This project now has an in-app analytics framework in the admin `Analytics` page with 8 categories and priority tags.
Use this document to wire real sources into Looker Studio and fill the remaining metrics.

## Data Sources to Connect

1. Google Analytics 4 (traffic behavior, engagement, landing pages)
2. Google Search Console (impressions, organic CTR, keyword pages)
3. Ahrefs or Semrush export (rankings, backlinks, domain authority, keyword gap)
4. Backend site analytics API/DB events (UTM, referrer host, device, geo, consent mix)
5. Affiliate platform exports/API (clicks, conversions, commission, vendor performance)
6. Email platform (Mailchimp/ConvertKit: signup, open, click)
7. Heatmap tool (Hotjar/Clarity: scroll depth, click maps)
8. Sponsor/ad source (slot impressions, CTA clicks, renewals, sponsor revenue)

Use Supermetrics or scheduled sheets/BigQuery pipelines for source blending.

## Dashboard Page Structure

Create one page per category:

1. Traffic & Visitor
2. Content Performance
3. Affiliate & Revenue
4. SEO & Keywords
5. Audience & Buyer Intent
6. Sponsor & Advertiser
7. Technical & UX
8. Business Growth
9. Executive Summary (top KPIs + forecast)

## Priority Rollout

### High Priority (start now)

- Monthly unique visitors
- New vs returning
- Source breakdown
- Top landing pages
- Bounce rate by page
- Session duration
- Top content pages
- Affiliate clicks by page
- CTR
- Conversion by vendor
- Monthly affiliate revenue
- Revenue by category
- Keyword ranking tracker
- Organic impressions / CTR
- Backlink growth
- Domain authority trend
- Page 1 vs page 2 keyword opportunities
- Sponsor logo impressions
- Sponsored CTA clicks
- Sponsor CTR by placement
- Revenue per sponsor slot
- Page load speed
- Mobile usability score
- MoM revenue growth

### Medium (1-2 months)

- Pages/session
- Geo + device deep splits
- Internal link clicks
- Content freshness
- Exit pages
- Avg commission per deal
- Trial to paid conversion
- Sponsor vs affiliate split
- Featured snippets
- Core Web Vitals
- Repeat visits
- Email signups
- Lead magnet downloads
- Sponsor renewal rate
- Newsletter open/click
- 404 error tracking
- CTA heatmaps
- Form abandonment
- CAC / LTV / content ROI

### Advanced (scale phase)

- Hour/day heatmap
- Social shares and comments
- 30/60/90 forecast model
- Competitor keyword gap
- Buyer stage mapping (TOFU/MOFU/BOFU)
- Sponsored article organic impact
- A/B result warehouse
- Competitor traffic benchmark
- Brand search volume

## Suggested Dimensions and Calculated Fields

- `channel_group`: CASE from source/medium/referrer
- `is_comparison_page`: regex match on path
- `is_bofu`: path contains "get-free-quote", "pricing", "vs", "best-"
- `rpv`: `revenue / users`
- `ctr`: `affiliate_clicks / page_views`
- `vendor_cr`: `vendor_conversions / vendor_clicks`
- `mom_growth`: `(current_month_revenue - prev_month_revenue) / prev_month_revenue`
- `content_roi`: `(content_revenue - content_cost) / content_cost`

## Charts to Add in Looker Studio

- Time series: users, sessions, page views, revenue
- Stacked bar: source/channel mix
- Table + heat scale: top pages with bounce/session duration/affiliate clicks
- Funnel: visitor -> affiliate click -> trial -> paid
- Geo map: country/city
- Device donut: mobile vs desktop vs tablet
- Keyword table: rank, delta, impressions, CTR
- Sponsor placement matrix: impressions, clicks, CTR, revenue per slot

## Operational Notes

- Use date control + category filter on every page
- Standardize URL path (lowercase, remove query noise except UTM when needed)
- Keep one source-of-truth IDs:
  - `page_path`
  - `campaign`
  - `vendor`
  - `category`
- Refresh schedule:
  - High-priority data: every 4-6 hours
  - Revenue and forecast: daily

## In-App Status

The admin analytics page now includes:

- 8-category metric catalog
- Priority labels (`High`, `Medium`, `Advanced`)
- Status labels (`Live`, `Partial`, `Setup needed`)
- Coverage counters (total/live/partial/pending)

Use this in-app catalog as your implementation checklist while wiring Looker Studio connectors.
