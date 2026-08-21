const crypto = require('crypto')
const XLSX = require('xlsx')
const BlogExcelQueue = require('../models/blogExcelQueue.model')
const Blog = require('../models/automationBlog.model')
const Settings = require('../models/blogAdminSettings.model')
const { generateBlog } = require('./blogAdmin.claude.service')
const { resolveBlogCoverImageUrl } = require('./blogAdmin.unsplash.service')

/**
 * Optional safety cap (0 = unlimited).
 * Default 0 so daily count = how many distinct categories still have queued titles.
 */
const DAILY_MAX = Math.max(0, Number(process.env.BLOG_EXCEL_DAILY_LIMIT || 0))
/** How many categories run per day (e.g. 10 cats → 5 today, 5 tomorrow, repeat). */
const CATEGORIES_PER_DAY = Math.max(1, Number(process.env.BLOG_EXCEL_CATEGORIES_PER_DAY || 5))
const SETTINGS_LAST_RUN_KEY = 'excel_queue_last_daily_run'
const SETTINGS_DAY_GROUP_KEY = 'excel_queue_day_group'

let batchRunning = false

function normalizeHeader(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}

function normalizeTitleKey(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[“”"']/g, '')
    .trim()
}

function cellText(value) {
  if (value == null) return ''
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value).replace(/\s+/g, ' ').trim()
}

/** Any Excel category → slug key + display label (not limited to 4 types). */
function categoryFromRaw(raw) {
  const label = cellText(raw)
  if (!label) return null
  const key = label
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
  if (!key) return null
  return { category: key, categoryLabel: label.slice(0, 80) }
}

function headerLooksLikeTitle(header) {
  const h = normalizeHeader(header)
  if (!h) return false
  return (
    h === 'title' ||
    h === 'topic' ||
    h === 'blogtitle' ||
    h === 'headline' ||
    h === 'name' ||
    h === 'posttitle' ||
    h === 'articletitle' ||
    h === 'blogtopic' ||
    h.includes('title') ||
    h.includes('headline') ||
    (h.includes('topic') && !h.includes('categor'))
  )
}

function headerLooksLikeCategory(header) {
  const h = normalizeHeader(header)
  if (!h) return false
  if (h.includes('title') || h.includes('headline')) return false
  return (
    h === 'category' ||
    h === 'cat' ||
    h === 'vertical' ||
    h === 'type' ||
    h === 'niche' ||
    h === 'segment' ||
    h === 'topic' ||
    h.includes('categor') ||
    h.includes('vertical') ||
    h.includes('type')
  )
}

function pickByHeaderMatch(row, matcher) {
  const entries = Object.entries(row || {})
  for (const [header, value] of entries) {
    if (!matcher(header)) continue
    const text = cellText(value)
    if (text) return text
  }
  return ''
}

function pickByPosition(row, index) {
  const values = Object.values(row || {}).map(cellText)
  return values[index] || ''
}

function rowToTitleCategory(row) {
  let title = pickByHeaderMatch(row, headerLooksLikeTitle)
  let categoryRaw = pickByHeaderMatch(row, headerLooksLikeCategory)

  if (!title) title = pickByPosition(row, 0)
  if (!categoryRaw) {
    const second = pickByPosition(row, 1)
    if (second && second !== title) categoryRaw = second
  }

  const cat = categoryFromRaw(categoryRaw)
  return {
    title: title ? title.slice(0, 200) : '',
    categoryRaw,
    category: cat?.category || '',
    categoryLabel: cat?.categoryLabel || '',
  }
}

function sheetHasData(sheet) {
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', header: 1 })
  return Array.isArray(rows) && rows.some((r) => Array.isArray(r) && r.some((c) => cellText(c)))
}

function tallyByCategory(docs) {
  return docs.reduce((acc, d) => {
    const key = d.category || 'unknown'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
}

/**
 * Accept any spreadsheet: Title + Category columns (any category values from Excel).
 */
function parseExcelBuffer(buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true, raw: false })
  if (!workbook.SheetNames?.length) throw new Error('Excel file has no sheets')

  let sheet = null
  for (const name of workbook.SheetNames) {
    const candidate = workbook.Sheets[name]
    if (candidate && sheetHasData(candidate)) {
      sheet = candidate
      break
    }
  }
  if (!sheet) throw new Error('Excel sheet is empty')

  // Try header-based JSON first; also keep a matrix fallback.
  let rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })
  if (!Array.isArray(rows) || rows.length === 0) {
    const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })
    rows = (matrix || [])
      .filter((r) => Array.isArray(r) && r.some((c) => cellText(c)))
      .map((r) => ({ Title: cellText(r[0]), Category: cellText(r[1]) }))
  }

  // Drop accidental header-as-data rows.
  rows = rows.filter((row) => {
    const { title, categoryRaw } = rowToTitleCategory(row)
    const t = normalizeTitleKey(title)
    const c = normalizeTitleKey(categoryRaw)
    if (!t) return false
    if ((t === 'title' || t === 'topic' || t === 'headline') && (c === 'category' || c === 'cat' || !c)) {
      return false
    }
    return true
  })

  if (rows.length === 0) {
    throw new Error('No data rows found in Excel')
  }

  const parsed = []
  const skipped = []
  const seenInFile = new Set()

  rows.forEach((row, index) => {
    const { title, categoryRaw, category, categoryLabel } = rowToTitleCategory(row)
    const excelRow = index + 2

    if (!title) {
      skipped.push({ row: excelRow, reason: 'Missing title', title: '' })
      return
    }

    const titleKey = normalizeTitleKey(title)
    if (seenInFile.has(titleKey)) {
      skipped.push({ row: excelRow, reason: 'Duplicate title in Excel (removed)', title })
      return
    }
    seenInFile.add(titleKey)

    if (!category) {
      skipped.push({
        row: excelRow,
        reason: `Missing category${categoryRaw ? ` ("${categoryRaw}")` : ''} — add a Category column with any value from your Excel`,
        title,
      })
      return
    }

    parsed.push({
      title,
      category,
      categoryLabel: categoryLabel || categoryRaw || category,
      titleKey,
    })
  })

  if (parsed.length === 0) {
    throw new Error(
      `No valid rows to queue. Skipped ${skipped.length}. Tip: Excel needs Title + Category (any categories you use).`
    )
  }

  return { rows: parsed, skipped }
}

async function findExistingTitleKeys(titleKeys) {
  const existing = new Set()
  if (!titleKeys.length) return existing

  const [queueItems, blogs] = await Promise.all([
    BlogExcelQueue.find({
      status: { $in: ['queued', 'processing', 'done'] },
    })
      .select('title')
      .lean(),
    Blog.find({})
      .select('title')
      .lean(),
  ])

  const wanted = new Set(titleKeys)
  for (const item of queueItems) {
    const key = normalizeTitleKey(item.title)
    if (wanted.has(key)) existing.add(key)
  }
  for (const blog of blogs) {
    const key = normalizeTitleKey(blog.title)
    if (wanted.has(key)) existing.add(key)
  }
  return existing
}

async function enqueueFromExcel({ buffer, fileName = '', uploadedBy = '' }) {
  const { rows, skipped } = parseExcelBuffer(buffer)
  const batchId = crypto.randomBytes(8).toString('hex')

  const existingKeys = await findExistingTitleKeys(rows.map((r) => r.titleKey))
  const fresh = []
  const removedExisting = []

  for (const row of rows) {
    if (existingKeys.has(row.titleKey)) {
      removedExisting.push({
        title: row.title,
        reason: 'Title already exists in queue or blogs (removed from upload)',
      })
      continue
    }
    fresh.push(row)
  }

  if (fresh.length === 0) {
    return {
      batchId,
      queued: 0,
      skipped: [...skipped, ...removedExisting],
      removedExisting: removedExisting.length,
      categories: {},
      categoryTypeCount: 0,
      message: 'All titles already existed — nothing new queued.',
    }
  }

  const docs = fresh.map(({ titleKey: _omit, ...row }) => ({
    ...row,
    batchId,
    sourceFileName: fileName,
    uploadedBy: String(uploadedBy || ''),
    status: 'queued',
  }))

  const inserted = await BlogExcelQueue.insertMany(docs, { ordered: false })
  const categories = tallyByCategory(inserted)

  return {
    batchId,
    queued: inserted.length,
    skipped: [...skipped, ...removedExisting],
    removedExisting: removedExisting.length,
    categories,
    categoryTypeCount: Object.keys(categories).length,
  }
}

async function getSetting(key) {
  const row = await Settings.findOne({ key }).lean()
  return row?.value
}

async function setSetting(key, value, category = 'general') {
  await Settings.findOneAndUpdate(
    { key },
    { $set: { value, category } },
    { upsert: true, returnDocument: 'after' }
  )
}

async function resolveAnthropicApiKey() {
  const envKey = (process.env.ANTHROPIC_API_KEY || '').trim()
  if (envKey) return envKey
  const row = await Settings.findOne({ key: 'claude_api_key' }).lean()
  if (row?.value == null || row?.value === '') return null
  return String(row.value).trim()
}

function startOfUtcDay(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

async function countProcessedToday() {
  const start = startOfUtcDay()
  return BlogExcelQueue.countDocuments({
    status: 'done',
    processedAt: { $gte: start },
  })
}

/**
 * All distinct categories from Excel (stable order by first upload time).
 * Example: 10 categories → Day A first 5, Day B next 5, then repeat.
 */
async function listAllCategoriesOrdered() {
  const rows = await BlogExcelQueue.aggregate([
    {
      $group: {
        _id: '$category',
        label: { $first: '$categoryLabel' },
        queued: { $sum: { $cond: [{ $eq: ['$status', 'queued'] }, 1, 0] } },
        done: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } },
        oldest: { $min: '$createdAt' },
      },
    },
    { $sort: { oldest: 1, _id: 1 } },
  ])
  return rows.map((r) => ({
    category: r._id,
    categoryLabel: r.label || r._id,
    queued: r.queued,
    done: r.done,
  }))
}

async function listQueuedCategories() {
  const all = await listAllCategoriesOrdered()
  return all.filter((c) => c.queued > 0)
}

function chunkCategories(categories, size = CATEGORIES_PER_DAY) {
  const chunks = []
  for (let i = 0; i < categories.length; i += size) {
    chunks.push(categories.slice(i, i + size))
  }
  return chunks.length ? chunks : [[]]
}

async function getDayGroupState() {
  const all = await listAllCategoriesOrdered()
  const groups = chunkCategories(all, CATEGORIES_PER_DAY)
  const raw = await getSetting(SETTINGS_DAY_GROUP_KEY)
  let groupIndex = Number(raw)
  if (!Number.isFinite(groupIndex) || groupIndex < 0) groupIndex = 0
  groupIndex = groupIndex % Math.max(groups.length, 1)
  return {
    all,
    groups,
    groupIndex,
    todayGroup: groups[groupIndex] || [],
    tomorrowGroup: groups[(groupIndex + 1) % Math.max(groups.length, 1)] || [],
    categoriesPerDay: CATEGORIES_PER_DAY,
  }
}

/**
 * Aaj: next chunk of categories (default 5). Kal: baaki chunk. Phir repeat.
 * Har selected category se 1 oldest queued title.
 */
async function pickDailyQueueItems({ advanceCursor = true } = {}) {
  const state = await getDayGroupState()
  const todayCats = state.todayGroup
  const selected = []
  const usedIds = new Set()

  for (const cat of todayCats) {
    const item = await BlogExcelQueue.findOne({
      status: 'queued',
      category: cat.category,
      _id: { $nin: [...usedIds] },
    })
      .sort({ createdAt: 1 })
      .exec()

    if (item) {
      selected.push(item)
      usedIds.add(String(item._id))
    }
  }

  // Optional hard cap on blogs/day
  let out = selected
  if (DAILY_MAX > 0) out = selected.slice(0, DAILY_MAX)

  if (advanceCursor && state.groups.length > 0) {
    await setSetting(SETTINGS_DAY_GROUP_KEY, (state.groupIndex + 1) % state.groups.length)
  }

  return { items: out, state }
}

async function publishBlogDocument(blog) {
  blog.status = 'published'
  blog.publishedAt = new Date()
  if (!blog.approvedAt) blog.approvedAt = new Date()
  await blog.save()
  return blog
}

async function processQueueItem(item, apiKey) {
  const locked = await BlogExcelQueue.findOneAndUpdate(
    { _id: item._id, status: 'queued' },
    { $set: { status: 'processing', error: '' } },
    { returnDocument: 'after' }
  )
  if (!locked) return { skipped: true, reason: 'Already claimed' }

  try {
    const categoryLabel = locked.categoryLabel || locked.category
    const result = await generateBlog(
      {
        topic: locked.title,
        keywords: [categoryLabel, locked.category],
        tone: 'professional',
        customInstructions: `Write this Compare Bazaar buying guide for the ${categoryLabel} software category. Keep the existing editorial HTML format. Primary focus keyword context: ${locked.title}.`,
      },
      apiKey
    )

    if (!result.success || !result.data?.verified) {
      throw new Error(
        result.data?.qualityCheck?.summary ||
          result.data?.formatCheck?.summary ||
          'Generated content failed verification'
      )
    }

    const data = result.data
    const coverResult = await resolveBlogCoverImageUrl({
      topic: data.topic || categoryLabel,
      title: data.title || locked.title,
      tags: [...(data.tags || []), categoryLabel],
      keywords: [...(data.keywords || []), categoryLabel],
    })

    const blog = await Blog.create({
      title: data.title || locked.title,
      content: data.content,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      keywords: data.keywords || [],
      tags: Array.from(new Set([...(data.tags || []), categoryLabel])),
      excerpt: data.excerpt,
      topic: data.topic || categoryLabel,
      tone: data.tone || 'professional',
      status: 'approved',
      approvedAt: new Date(),
      ...(coverResult?.coverImageUrl ? { coverImageUrl: coverResult.coverImageUrl } : {}),
      ...(coverResult?.searchQuery ? { coverSearchQuery: coverResult.searchQuery } : {}),
    })

    await publishBlogDocument(blog)

    locked.status = 'done'
    locked.blogId = blog._id
    locked.blogSlug = blog.slug || ''
    locked.processedAt = new Date()
    locked.error = ''
    await locked.save()

    return { success: true, blogId: blog._id, slug: blog.slug, title: blog.title, category: locked.category }
  } catch (error) {
    locked.status = 'failed'
    locked.error = error?.message || String(error)
    locked.processedAt = new Date()
    await locked.save()
    return { success: false, error: locked.error, queueId: locked._id }
  }
}

/**
 * Process today's category group (e.g. 5 of 10): Claude → Unsplash → publish.
 * Next run uses the other half, then repeats.
 */
async function runDailyExcelQueueBatch({ force = false } = {}) {
  if (batchRunning) {
    return { success: false, message: 'A batch is already running', running: true }
  }

  batchRunning = true
  try {
    const previewState = await getDayGroupState()
    const expectedToday = previewState.todayGroup.length

    if (!force) {
      const doneToday = await countProcessedToday()
      if (doneToday >= Math.max(expectedToday, 1) && expectedToday > 0) {
        // Allow re-run only if nothing from today's group was processed — if already hit today's count, skip
        if (doneToday >= CATEGORIES_PER_DAY || doneToday >= expectedToday) {
          return {
            success: true,
            message: `Daily batch already done (${doneToday} published today). Next group runs tomorrow.`,
            processed: 0,
            doneToday,
            groupIndex: previewState.groupIndex,
            results: [],
          }
        }
      }
    }

    const apiKey = await resolveAnthropicApiKey()
    if (!apiKey) {
      return {
        success: false,
        message:
          'Claude API key not configured. Set ANTHROPIC_API_KEY in backend/.env or save claude_api_key in Settings.',
      }
    }

    const { items, state } = await pickDailyQueueItems({ advanceCursor: true })
    if (items.length === 0) {
      return {
        success: true,
        message: 'No queued titles in today\'s category group — upload Excel or wait for remaining titles',
        processed: 0,
        groupIndex: state.groupIndex,
        todayCategories: state.todayGroup.map((c) => c.categoryLabel || c.category),
        results: [],
      }
    }

    const results = []
    for (const item of items) {
      // eslint-disable-next-line no-await-in-loop
      const result = await processQueueItem(item, apiKey)
      results.push(result)
    }

    await setSetting(SETTINGS_LAST_RUN_KEY, new Date().toISOString())

    const ok = results.filter((r) => r.success).length
    const failed = results.filter((r) => r.success === false).length
    const todayLabels = state.todayGroup.map((c) => c.categoryLabel || c.category)

    return {
      success: true,
      message: `Group ${state.groupIndex + 1}/${state.groups.length}: ${ok} published, ${failed} failed (${todayLabels.join(', ')})`,
      processed: results.length,
      published: ok,
      failed,
      groupIndex: state.groupIndex,
      todayCategories: todayLabels,
      results,
    }
  } finally {
    batchRunning = false
  }
}

async function getQueueStats() {
  const [queued, processing, done, failed, doneToday, state] = await Promise.all([
    BlogExcelQueue.countDocuments({ status: 'queued' }),
    BlogExcelQueue.countDocuments({ status: 'processing' }),
    BlogExcelQueue.countDocuments({ status: 'done' }),
    BlogExcelQueue.countDocuments({ status: 'failed' }),
    countProcessedToday(),
    getDayGroupState(),
  ])

  const categoryTypes = state.all.map((c) => ({
    key: c.category,
    label: c.categoryLabel || c.category,
    queued: c.queued,
    done: c.done,
  }))

  const byCategory = {}
  categoryTypes.forEach((c) => {
    byCategory[c.key] = c.queued
  })

  const lastRun = await getSetting(SETTINGS_LAST_RUN_KEY)
  const todayKeys = new Set(state.todayGroup.map((c) => c.category))

  const todaysPreview = []
  for (const cat of state.todayGroup) {
    // eslint-disable-next-line no-await-in-loop
    const item = await BlogExcelQueue.findOne({
      status: 'queued',
      category: cat.category,
    })
      .sort({ createdAt: 1 })
      .select('title category categoryLabel')
      .lean()
    if (item) todaysPreview.push(item)
  }

  return {
    queued,
    processing,
    done,
    failed,
    doneToday,
    dailyLimit: state.todayGroup.length,
    categoriesPerDay: CATEGORIES_PER_DAY,
    dailyMax: DAILY_MAX || null,
    byCategory,
    categoryTypes,
    categoryTypeCount: categoryTypes.length,
    groupIndex: state.groupIndex,
    groupCount: state.groups.length,
    todayGroupLabels: state.todayGroup.map((c) => c.categoryLabel || c.category),
    tomorrowGroupLabels: state.tomorrowGroup.map((c) => c.categoryLabel || c.category),
    dailyPickOrder: state.todayGroup.map((c) => c.categoryLabel || c.category),
    todaysPreview,
    todayCategoryKeys: [...todayKeys],
    lastRun: lastRun || null,
    categories: categoryTypes.map((c) => c.key),
  }
}

module.exports = {
  DAILY_MAX,
  DAILY_LIMIT: CATEGORIES_PER_DAY,
  CATEGORIES_PER_DAY,
  parseExcelBuffer,
  enqueueFromExcel,
  runDailyExcelQueueBatch,
  getQueueStats,
  listQueuedCategories,
  listAllCategoriesOrdered,
  categoryFromRaw,
}
