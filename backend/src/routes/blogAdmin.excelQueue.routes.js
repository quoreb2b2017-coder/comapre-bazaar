const express = require('express')
const multer = require('multer')
const router = express.Router()
const { protect } = require('../middlewares/blogAdminAuth.middleware')
const BlogExcelQueue = require('../models/blogExcelQueue.model')
const {
  enqueueFromExcel,
  runDailyExcelQueueBatch,
  getQueueStats,
} = require('../services/blogAdmin.excelQueue.service')

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const name = String(file.originalname || '').toLowerCase()
    const mime = String(file.mimetype || '').toLowerCase()
    const okExt =
      name.endsWith('.xlsx') ||
      name.endsWith('.xls') ||
      name.endsWith('.csv') ||
      name.endsWith('.ods') ||
      name.endsWith('.tsv')
    const okMime =
      !mime ||
      mime.includes('sheet') ||
      mime.includes('excel') ||
      mime.includes('csv') ||
      mime.includes('octet-stream') ||
      mime.includes('text/')
    if (!okExt && !okMime) {
      return cb(new Error('Upload a spreadsheet file (.xlsx, .xls, .csv, …)'))
    }
    cb(null, true)
  },
})

// GET /excel-queue/stats
router.get('/stats', protect, async (_req, res) => {
  try {
    const stats = await getQueueStats()
    res.json({ success: true, data: stats })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /excel-queue?status=&page=&limit=
router.get('/', protect, async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 25))
    const status = String(req.query.status || '').trim()
    const category = String(req.query.category || '').trim().toLowerCase()

    const filter = {}
    if (status) filter.status = status
    if (category) filter.category = category

    const [items, total] = await Promise.all([
      BlogExcelQueue.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      BlogExcelQueue.countDocuments(filter),
    ])

    res.json({
      success: true,
      data: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// POST /excel-queue/upload — multipart field "file"
router.post('/upload', protect, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message || 'Upload failed' })
    }
    try {
      if (!req.file?.buffer) {
        return res.status(400).json({ success: false, message: 'Excel file is required (field name: file)' })
      }

      const result = await enqueueFromExcel({
        buffer: req.file.buffer,
        fileName: req.file.originalname || '',
        uploadedBy: req.admin?.email || req.admin?.id || '',
      })

      res.status(201).json({
        success: true,
        message:
          result.message ||
          `Queued ${result.queued} new title(s) across ${result.categoryTypeCount || 0} categor(y/ies). Removed ${result.removedExisting || 0} duplicate(s). Cron publishes 1 per category / day.`,
        data: result,
      })
    } catch (error) {
      res.status(400).json({ success: false, message: error.message || 'Could not parse Excel' })
    }
  })
})

// POST /excel-queue/run-now — manual batch (force ignores daily cap)
router.post('/run-now', protect, async (req, res) => {
  try {
    const force = Boolean(req.body?.force)
    const limit = req.body?.limit != null ? Number(req.body.limit) : undefined
    const result = await runDailyExcelQueueBatch({
      ...(Number.isFinite(limit) && limit > 0 ? { limit } : {}),
      force,
    })
    const status = result.success === false && !result.running ? 400 : 200
    res.status(status).json(result)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// POST /excel-queue/:id/retry — re-queue a failed row
router.post('/:id/retry', protect, async (req, res) => {
  try {
    const item = await BlogExcelQueue.findById(req.params.id)
    if (!item) return res.status(404).json({ success: false, message: 'Queue item not found' })
    if (!['failed', 'skipped'].includes(item.status)) {
      return res.status(400).json({ success: false, message: 'Only failed/skipped items can be retried' })
    }
    item.status = 'queued'
    item.error = ''
    item.processedAt = null
    item.blogId = null
    item.blogSlug = ''
    await item.save()
    res.json({ success: true, data: item, message: 'Item re-queued' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// DELETE /excel-queue/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await BlogExcelQueue.findById(req.params.id)
    if (!item) return res.status(404).json({ success: false, message: 'Queue item not found' })
    if (item.status === 'processing') {
      return res.status(400).json({ success: false, message: 'Cannot delete an item that is processing' })
    }
    await item.deleteOne()
    res.json({ success: true, message: 'Queue item deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
