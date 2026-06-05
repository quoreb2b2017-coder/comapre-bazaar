const multer = require('multer')

const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
})

const whitePaperUpload = upload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
])

module.exports = { whitePaperUpload }
