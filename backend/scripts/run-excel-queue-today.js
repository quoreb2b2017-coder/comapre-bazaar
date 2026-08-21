/**
 * One-shot: generate + publish today's Excel queue group.
 * Usage: node scripts/run-excel-queue-today.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const connectDB = require('../src/config/db')
const { runDailyExcelQueueBatch, getQueueStats } = require('../src/services/blogAdmin.excelQueue.service')

async function main() {
  await connectDB()
  const before = await getQueueStats()
  console.log('[excel-queue] today group:', (before.todayGroupLabels || []).join(', ') || '(empty)')
  console.log(
    '[excel-queue] preview:',
    (before.todaysPreview || []).map((t) => `${t.categoryLabel || t.category}: ${t.title}`).join(' | ') || '(none)'
  )
  console.log('[excel-queue] queued titles:', before.queued)

  const result = await runDailyExcelQueueBatch({ force: true })
  console.log('[excel-queue] result:', result.message)
  if (result.results?.length) {
    result.results.forEach((r, i) => {
      if (r.success) console.log(`  ${i + 1}. OK ${r.category} → /blog/${r.slug}`)
      else console.log(`  ${i + 1}. FAIL ${r.error || r.reason}`)
    })
  }
  process.exit(result.success === false ? 1 : 0)
}

main().catch((err) => {
  console.error('[excel-queue] failed:', err.message || err)
  process.exit(1)
})
