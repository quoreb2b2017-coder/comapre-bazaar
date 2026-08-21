const cron = require('node-cron')
const { runDailyExcelQueueBatch } = require('../services/blogAdmin.excelQueue.service')

/**
 * Daily Excel → blog pipeline.
 * Default: 09:00 Asia/Kolkata — 1 blog per distinct category still queued in Excel.
 * Set BLOG_EXCEL_CRON_ENABLED=false to disable.
 * Optional BLOG_EXCEL_DAILY_LIMIT = max posts/day (0 = all categories).
 */
function startBlogExcelQueueCron() {
  const enabled = String(process.env.BLOG_EXCEL_CRON_ENABLED || 'true').trim().toLowerCase()
  if (enabled === 'false' || enabled === '0' || enabled === 'no') {
    console.log('[excel-queue] cron disabled (BLOG_EXCEL_CRON_ENABLED=false)')
    return null
  }

  const expression = String(process.env.BLOG_EXCEL_CRON || '0 9 * * *').trim()
  const timezone = String(process.env.BLOG_EXCEL_CRON_TZ || 'Asia/Kolkata').trim()

  if (!cron.validate(expression)) {
    console.error(`[excel-queue] invalid BLOG_EXCEL_CRON="${expression}" — cron not started`)
    return null
  }

  const job = cron.schedule(
    expression,
    async () => {
      console.log('[excel-queue] daily cron started (5 categories / day alternate)')
      try {
        const result = await runDailyExcelQueueBatch({ force: false })
        console.log('[excel-queue] daily cron finished:', result.message || result)
      } catch (error) {
        console.error('[excel-queue] daily cron failed:', error.message || error)
      }
    },
    { timezone }
  )

  console.log(
    `[excel-queue] cron scheduled "${expression}" tz=${timezone} — alternate category groups (default 5/day)`
  )
  return job
}

module.exports = { startBlogExcelQueueCron }
