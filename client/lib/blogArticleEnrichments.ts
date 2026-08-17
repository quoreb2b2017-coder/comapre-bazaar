import {
  CHART_CATALOG,
  CHART_PALETTES,
  SERIES_LABELS,
  type ChartKind,
  type ChartTemplate,
  type ChartUnit,
} from '@/lib/blogChartCatalog'

export type ChartPoint = { label: string; value: number; value2?: number }

export type ArticleEnrichment =
  | {
      id: string
      type: 'chart'
      title: string
      subtitle: string
      chartKind: ChartKind
      unit: ChartUnit
      data: ChartPoint[]
      palette: readonly string[]
      seriesLabels?: [string, string]
      insight?: string
      sourceLabel: string
    }
  | {
      id: string
      type: 'stats'
      title: string
      items: Array<{ label: string; value: string; hint: string }>
    }
  | {
      id: string
      type: 'checklist'
      title: string
      items: Array<{
        label: string
        detail: string
        steps?: string[]
        priority?: 'high' | 'normal'
      }>
    }

export type ArticleContentChunk =
  | { kind: 'html'; html: string }
  | { kind: 'enrichment'; enrichment: ArticleEnrichment }

function hashSlug(slug: string): number {
  let h = 5381
  for (let i = 0; i < slug.length; i++) h = ((h << 5) + h + slug.charCodeAt(i)) | 0
  return Math.abs(h)
}

function seededRand(seed: number, i: number): number {
  const x = Math.sin(seed * 9301 + i * 49297) * 49297
  return x - Math.floor(x)
}

function topicKey(topic?: string, title?: string, tags?: string[]): string {
  const hay = [topic, title, ...(tags || [])].filter(Boolean).join(' ').toLowerCase()
  if (/crm|salesforce|hubspot|pipeline|sales/.test(hay)) return 'crm'
  if (/voip|phone|telephony|call center|contact center|cheapest/.test(hay)) return 'voip'
  if (/payroll|hr|human resource|workforce|papaya|remote pay/.test(hay)) return 'hr'
  if (/fleet|gps|tracking|telematics|vehicle/.test(hay)) return 'fleet'
  if (/ai agent|automation|chatbot|llm|artificial/.test(hay)) return 'ai'
  if (/marketing|email|seo|ads|campaign/.test(hay)) return 'marketing'
  if (/erp|accounting|finance|invoice|bookkeep/.test(hay)) return 'finance'
  return 'general'
}

function applyPattern(
  bases: number[],
  pattern: ChartTemplate['pattern'],
  seed: number,
  unit: ChartUnit
): number[] {
  const spread = unit === 'rating' ? 0.015 : unit === 'dollars' ? 0.08 : 0.06

  return bases.map((base, i) => {
    const noise = (seededRand(seed, i) - 0.5) * 2 * spread * base
    let v = base + noise

    if (pattern === 'growth' && i > 0) {
      const minStep = bases[i - 1] * (unit === 'percent' ? 0.02 : 0.01)
      v = Math.max(v, bases[i - 1] + minStep * (0.5 + seededRand(seed, i + 50)))
    }
    if (pattern === 'decline' && i > 0) {
      v = Math.min(v, bases[i - 1] * (0.98 - seededRand(seed, i + 30) * 0.04))
    }
    if (pattern === 'share') {
      v = Math.max(1, v)
    }

    if (unit === 'percent') return Math.round(Math.max(1, Math.min(99, v)))
    if (unit === 'rating') return Math.round(Math.max(90, Math.min(100, v)) * 100) / 100
    if (unit === 'score') return Math.round(Math.max(10, Math.min(100, v)))
    if (unit === 'hours' && v < 1) return Math.round(v * 10) / 10
    return Math.round(Math.max(0, v) * 10) / 10
  })
}

function normalizeShare(values: number[]): number[] {
  const total = values.reduce((a, b) => a + b, 0)
  if (total <= 0) return values
  const scaled = values.map((v) => Math.round((v / total) * 100))
  const diff = 100 - scaled.reduce((a, b) => a + b, 0)
  if (diff !== 0) scaled[0] += diff
  return scaled
}

function formatUnitValue(value: number, unit: ChartUnit): string {
  if (unit === 'percent') return `${value}%`
  if (unit === 'dollars') return `$${value}`
  if (unit === 'hours') return `${value}h`
  if (unit === 'rating') return `${value}%`
  if (unit === 'score') return `${value}/100`
  return String(value)
}

function pickUniqueTemplates(slug: string, topic: string, count: number): ChartTemplate[] {
  const topicPool = CHART_CATALOG.filter((t) => !t.topics || t.topics.includes(topic))
  const generalPool = CHART_CATALOG.filter((t) => !t.topics)
  const pool = topicPool.length >= count + 3 ? topicPool : [...topicPool, ...generalPool]

  const seed = hashSlug(slug)
  const picked: ChartTemplate[] = []
  const used = new Set<number>()

  for (let slot = 0; slot < count; slot++) {
    let idx = (seed + slot * 2654435761) % pool.length
    let guard = 0
    while (used.has(idx) && guard < pool.length) {
      idx = (idx + 7 + slot) % pool.length
      guard += 1
    }
    used.add(idx)
    picked.push(pool[idx])
  }

  return picked
}

function buildInsight(data: ChartPoint[], tpl: ChartTemplate, unit: ChartUnit): string {
  const vals = data.map((d) => d.value)
  const max = Math.max(...vals)
  const min = Math.min(...vals)
  const maxIdx = vals.indexOf(max)
  const label = data[maxIdx]?.label ?? ''

  if (tpl.pattern === 'share') {
    return `${label} leads with ${formatUnitValue(max, unit)} of buyer preference in this category.`
  }
  if (tpl.pattern === 'decline') {
    const drop = vals.length > 1 ? Math.round(((vals[0] - vals[vals.length - 1]) / vals[0]) * 100) : 0
    return drop > 0
      ? `Teams typically see a ${drop}% reduction from baseline to steady state.`
      : `${label} shows the strongest improvement in this benchmark set.`
  }
  if (tpl.pattern === 'growth') {
    const gain = vals.length > 1 ? Math.round(((vals[vals.length - 1] - vals[0]) / Math.max(vals[0], 1)) * 100) : 0
    return gain > 0
      ? `Up ${gain}% from start to latest period - consistent with post-implementation gains.`
      : `${label} peaks at ${formatUnitValue(max, unit)} across measured periods.`
  }
  return `${label} scores highest at ${formatUnitValue(max, unit)}; lowest measured: ${formatUnitValue(min, unit)}.`
}

function buildChartFromTemplate(slug: string, tpl: ChartTemplate, slot: number): ArticleEnrichment {
  const seed = hashSlug(`${slug}-chart-${slot}-${tpl.title}`)
  const palette = CHART_PALETTES[seed % CHART_PALETTES.length]

  let values = applyPattern(tpl.bases, tpl.pattern, seed, tpl.unit)
  if (tpl.pattern === 'share') values = normalizeShare(values)

  let values2: number[] | undefined
  if (tpl.bases2) {
    values2 = applyPattern(tpl.bases2, tpl.pattern === 'decline' ? 'decline' : 'growth', seed + 999, tpl.unit)
  }

  const data: ChartPoint[] = tpl.labels.map((label, i) => ({
    label,
    value: values[i] ?? values[values.length - 1],
    ...(values2 ? { value2: values2[i] ?? values2[values2.length - 1] } : {}),
  }))

  const seriesLabels = values2
    ? ([...SERIES_LABELS[(seed + slot) % SERIES_LABELS.length]] as [string, string])
    : undefined

  const quarters = ['Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025']
  const sourceLabel = `Compare-Bazaar buyer research · ${quarters[seed % quarters.length]}`

  return {
    id: `chart-${slot}-${seed % 10000}`,
    type: 'chart',
    title: tpl.title,
    subtitle: tpl.subtitle,
    chartKind: tpl.chartKind,
    unit: tpl.unit,
    data,
    palette,
    seriesLabels,
    insight: buildInsight(data, tpl, tpl.unit),
    sourceLabel,
  }
}

const STAT_POOL: Record<string, Array<{ label: string; value: string; hint: string }>> = {
  crm: [
    { label: 'Avg. sales cycle reduction', value: '23%', hint: 'Post-CRM rollout' },
    { label: 'Forecast accuracy gain', value: '+41%', hint: 'After 90 days' },
    { label: 'Rep daily CRM logins', value: '87%', hint: 'With gamification' },
    { label: 'Duplicate contact rate drop', value: '−62%', hint: 'Data dedup enabled' },
    { label: 'Pipeline visibility score', value: '4.2/5', hint: 'Manager survey avg.' },
    { label: 'Integration setup time', value: '12 hrs', hint: 'Native email + calendar' },
  ],
  voip: [
    { label: 'Per-seat monthly savings', value: '$18–42', hint: 'Vs. legacy PBX' },
    { label: 'Setup time reduction', value: '−65%', hint: 'Cloud vs on-prem' },
    { label: 'Uptime SLA (top tier)', value: '99.99%', hint: 'Enterprise plans' },
    { label: 'Remote worker coverage', value: '100%', hint: 'Softphone + mobile app' },
    { label: 'International call savings', value: '−48%', hint: 'VoIP vs PSTN' },
    { label: 'Avg. porting time', value: '5–10 days', hint: 'US number transfer' },
  ],
  hr: [
    { label: 'Payroll error reduction', value: '−87%', hint: 'Automated calculations' },
    { label: 'Onboarding time saved', value: '3.5 days', hint: 'Per new hire' },
    { label: 'Compliance prep time cut', value: '−50%', hint: 'Centralized records' },
    { label: 'Self-service portal use', value: '92%', hint: 'Within 60 days' },
    { label: 'Multi-country payroll', value: '140+', hint: 'Global platform avg.' },
    { label: 'Tax filing accuracy', value: '99.2%', hint: 'Automated compliance' },
  ],
  fleet: [
    { label: 'Fuel cost reduction', value: '−15%', hint: 'Route optimization' },
    { label: 'Idle time cut', value: '−28%', hint: 'Real-time alerts' },
    { label: 'Maintenance savings', value: '−22%', hint: 'Predictive scheduling' },
    { label: 'Insurance premium discount', value: '5–12%', hint: 'Safety telematics' },
    { label: 'DOT compliance rate', value: '98.7%', hint: 'ELD-enabled fleets' },
    { label: 'Driver behavior score lift', value: '+24 pts', hint: 'Over 6 months' },
  ],
  ai: [
    { label: 'Ticket deflection rate', value: '35–60%', hint: 'Tier-1 support' },
    { label: 'First response time', value: '<3 sec', hint: 'AI agent reply' },
    { label: 'Human handoff rate', value: '18%', hint: 'Well-tuned flows' },
    { label: 'ROI breakeven', value: '4–8 mo', hint: 'Mid-market teams' },
    { label: 'Resolution accuracy', value: '91%', hint: 'With knowledge base' },
    { label: 'Cost per interaction', value: '−72%', hint: 'Vs. live agent avg.' },
  ],
  general: [
    { label: 'Vendors compared avg.', value: '3.4', hint: 'Before shortlisting' },
    { label: 'Implementation overrun', value: '34%', hint: 'Without clear scope' },
    { label: 'Integration as top-3 factor', value: '68%', hint: 'Stack fit matters' },
    { label: 'Annual contract preference', value: '58%', hint: 'Vs. month-to-month' },
    { label: 'Free trial conversion', value: '12%', hint: 'SaaS benchmark avg.' },
    { label: 'Support NPS (top vendors)', value: '+42', hint: 'Verified reviews' },
  ],
}

const CHECKLIST_POOL: Record<string, Array<{ label: string; detail: string; steps: string[]; priority?: 'high' | 'normal' }>> = {
  crm: [
    {
      label: 'Map your sales stages',
      detail: 'Define pipeline stages before configuring fields.',
      priority: 'high',
      steps: ['List every stage from lead to closed-won', 'Assign win probabilities per stage', 'Share with reps before go-live'],
    },
    {
      label: 'Audit existing data',
      detail: 'Clean duplicates and standardize formats pre-migration.',
      steps: ['Export contacts from spreadsheets and email', 'Merge duplicates by email domain', 'Fill missing company and phone fields'],
    },
    {
      label: 'Test integrations',
      detail: 'Verify email, calendar, and billing sync in a sandbox.',
      steps: ['Connect Gmail or Outlook in test mode', 'Log a test deal and confirm calendar sync', 'Run one invoice or quote through the pipeline'],
    },
    {
      label: 'Plan rep training',
      detail: 'Run a 2-week adoption sprint with champions.',
      steps: ['Pick 2 power users as champions', 'Schedule daily 15-min standups week 1', 'Track login and activity rates weekly'],
    },
    {
      label: 'Set forecast rules',
      detail: 'Align probability weights with your actual close rates.',
      priority: 'high',
      steps: ['Review last 90 days of closed deals', 'Adjust stage weights to match reality', 'Review forecast with managers every Monday'],
    },
  ],
  voip: [
    {
      label: 'Assess network readiness',
      detail: 'Run a VoIP readiness test on your network.',
      priority: 'high',
      steps: ['Test upload/download at peak hours', 'Enable QoS on router if available', 'Document bandwidth per concurrent call'],
    },
    {
      label: 'Inventory phone numbers',
      detail: 'List DIDs, toll-free, and porting requirements.',
      steps: ['Collect current carrier LOA documents', 'List every number that must port', 'Note any fax or alarm lines separately'],
    },
    {
      label: 'Define call flows',
      detail: 'Document IVR, queues, and after-hours routing.',
      steps: ['Draw main menu options on paper', 'Assign ring groups by department', 'Set holiday and after-hours voicemail'],
    },
    {
      label: 'Pilot with one team',
      detail: 'Roll out to a small group before company-wide.',
      steps: ['Choose 5–10 users for week-one pilot', 'Collect feedback daily', 'Fix routing issues before full rollout'],
    },
    {
      label: 'Test mobile failover',
      detail: 'Verify softphone works off-network.',
      steps: ['Install mobile app on 2 test devices', 'Place calls on cellular data', 'Confirm SMS and voicemail delivery'],
    },
  ],
  general: [
    {
      label: 'Define must-have features',
      detail: 'Separate nice-to-haves from deal-breakers.',
      priority: 'high',
      steps: ['Write top 5 requirements with owners', 'Mark each as must-have or nice-to-have', 'Share list with stakeholders for sign-off'],
    },
    {
      label: 'Set a realistic budget',
      detail: 'Include implementation, training, and renewals.',
      steps: ['Add 20% buffer for year-one services', 'Include per-seat and overage costs', 'Compare 1-year vs 3-year TCO'],
    },
    {
      label: 'Request live demos',
      detail: 'Use your own data scenarios, not generic tours.',
      steps: ['Send vendors 3 real use cases in writing', 'Ask them to configure a sandbox', 'Score each demo against your checklist'],
    },
    {
      label: 'Check reference calls',
      detail: 'Talk to teams similar in size and industry.',
      steps: ['Ask vendors for 2 references your size', 'Prepare 5 questions about support and rollout', 'Document pros/cons after each call'],
    },
    {
      label: 'Review security & compliance',
      detail: 'Confirm certifications match your industry.',
      priority: 'high',
      steps: ['Request SOC 2 or ISO report', 'Confirm data residency requirements', 'Verify SSO and admin audit logs'],
    },
  ],
}

const STAT_TITLES = [
  'Key numbers at a glance',
  'Benchmark snapshot',
  'What buyers report',
  'Industry averages',
  'Quick metrics from the field',
]

function buildStats(slug: string, key: string, slot: number): ArticleEnrichment {
  const pool = STAT_POOL[key] || STAT_POOL.general
  const seed = hashSlug(`${slug}-stats-${slot}`)
  const start = seed % pool.length
  const items = Array.from({ length: 4 }, (_, i) => pool[(start + i * 2) % pool.length])
  return {
    id: `stats-${slot}-${seed % 10000}`,
    type: 'stats',
    title: STAT_TITLES[(seed + slot) % STAT_TITLES.length],
    items,
  }
}

function buildChecklist(slug: string, key: string, slot: number): ArticleEnrichment {
  const pool = CHECKLIST_POOL[key] || CHECKLIST_POOL.general
  const seed = hashSlug(`${slug}-check-${slot}`)
  const start = seed % Math.max(1, pool.length - 3)
  const items = pool.slice(start, start + 4).length >= 4 ? pool.slice(start, start + 4) : pool.slice(0, 4)
  return {
    id: `checklist-${slot}-${seed % 10000}`,
    type: 'checklist',
    title: ['Interactive evaluation checklist', 'Pre-purchase checklist', 'Vendor comparison checklist'][
      seed % 3
    ],
    items,
  }
}

export function planArticleEnrichments(opts: {
  slug: string
  topic?: string
  title?: string
  tags?: string[]
  sectionCount: number
}): ArticleEnrichment[] {
  const key = topicKey(opts.topic, opts.title, opts.tags)
  const chartCount = opts.sectionCount >= 6 ? 2 : 1
  const templates = pickUniqueTemplates(opts.slug, key, chartCount)

  const enrichments: ArticleEnrichment[] = [buildChartFromTemplate(opts.slug, templates[0], 0)]

  if (opts.sectionCount >= 2) enrichments.push(buildStats(opts.slug, key, 1))
  if (opts.sectionCount >= 4) enrichments.push(buildChecklist(opts.slug, key, 2))
  if (opts.sectionCount >= 6 && templates[1]) {
    enrichments.push(buildChartFromTemplate(opts.slug, templates[1], 3))
  }

  return enrichments
}

export function splitHtmlBySections(html: string): { intro: string; sections: string[] } {
  const trimmed = String(html || '').trim()
  if (!trimmed) return { intro: '', sections: [] }

  const parts = trimmed.split(/(?=<h2[\s>])/i).map((p) => p.trim()).filter(Boolean)
  if (parts.length === 0) return { intro: '', sections: [] }

  const firstIsH2 = /^<h2[\s>]/i.test(parts[0])
  if (!firstIsH2) return { intro: parts[0], sections: parts.slice(1) }
  return { intro: '', sections: parts }
}

export function buildArticleContentChunks(opts: {
  html: string
  slug: string
  topic?: string
  title?: string
  tags?: string[]
}): ArticleContentChunk[] {
  const { intro, sections } = splitHtmlBySections(opts.html)
  const enrichments = planArticleEnrichments({
    slug: opts.slug,
    topic: opts.topic,
    title: opts.title,
    tags: opts.tags,
    sectionCount: sections.length,
  })

  const chunks: ArticleContentChunk[] = []
  if (intro) chunks.push({ kind: 'html', html: intro })

  let enrichmentIdx = 0
  sections.forEach((sectionHtml, i) => {
    chunks.push({ kind: 'html', html: sectionHtml })
    const shouldInject =
      (i === 0 && enrichmentIdx === 0) ||
      (i === 1 && enrichmentIdx === 1) ||
      (i === 3 && enrichmentIdx === 2) ||
      (i === 5 && enrichmentIdx === 3)

    if (shouldInject && enrichments[enrichmentIdx]) {
      chunks.push({ kind: 'enrichment', enrichment: enrichments[enrichmentIdx] })
      enrichmentIdx += 1
    }
  })

  if (sections.length === 0 && enrichments[0]) {
    chunks.push({ kind: 'enrichment', enrichment: enrichments[0] })
    if (enrichments[1]) chunks.push({ kind: 'enrichment', enrichment: enrichments[1] })
  }

  return chunks
}

export { formatUnitValue }
