const cron = require('node-cron')
const { runDailyExcelQueueBatch } = require('../services/blogAdmin.excelQueue.service')

/**
 * Excel → blog pipeline.
 * Default: Mon & Wed 23:00 Asia/Kolkata — 2 blogs (1 per category in today's group).
 * Set BLOG_EXCEL_CRON_ENABLED=false to disable.
 * Optional BLOG_EXCEL_DAILY_LIMIT = max posts/run (0 = all categories in group).
 */
function startBlogExcelQueueCron() {
  const enabled = String(process.env.BLOG_EXCEL_CRON_ENABLED || 'true').trim().toLowerCase()
  if (enabled === 'false' || enabled === '0' || enabled === 'no') {
    console.log('[excel-queue] cron disabled (BLOG_EXCEL_CRON_ENABLED=false)')
    return null
  }

  // node-cron: 0 23 * * 1,3 = 23:00 on Monday (1) and Wednesday (3)
  const expression = String(process.env.BLOG_EXCEL_CRON || '0 23 * * 1,3').trim()
  const timezone = String(process.env.BLOG_EXCEL_CRON_TZ || 'Asia/Kolkata').trim()

  if (!cron.validate(expression)) {
    console.error(`[excel-queue] invalid BLOG_EXCEL_CRON="${expression}" — cron not started`)
    return null
  }

  const job = cron.schedule(
    expression,
    async () => {
      console.log('[excel-queue] Mon/Wed cron started (2 blogs / run)')
      try {
        const result = await runDailyExcelQueueBatch({ force: false })
        console.log('[excel-queue] cron finished:', result.message || result)
      } catch (error) {
        console.error('[excel-queue] cron failed:', error.message || error)
      }
    },
    { timezone }
  )

  console.log(
    `[excel-queue] cron scheduled "${expression}" tz=${timezone} — Mon & Wed 11pm IST (default 2 blogs/run)`
  )
  return job
}

module.exports = { startBlogExcelQueueCron }
