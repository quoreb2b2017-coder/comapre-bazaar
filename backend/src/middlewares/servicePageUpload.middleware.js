const multer = require('multer')

const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const name = String(file.originalname || '').toLowerCase()
    const ok =
      name.endsWith('.json') ||
      name.endsWith('.md') ||
      name.endsWith('.txt') ||
      name.endsWith('.docx') ||
      name.endsWith('.pdf')
    if (!ok) {
      return cb(new Error('Only .json, .md, .txt, .docx, and .pdf files are allowed'))
    }
    cb(null, true)
  },
})

const servicePageUpload = upload.single('file')

module.exports = { servicePageUpload }
