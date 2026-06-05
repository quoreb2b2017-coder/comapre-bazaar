const { Readable } = require('stream')
const cloudinary = require('../config/cloudinary')
const { configureCloudinary } = require('../config/cloudinary')

configureCloudinary()

/**
 * @param {Buffer} buffer
 * @param {{ folder?: string, resource_type?: 'image' | 'raw' | 'auto', format?: string }} opts
 */
const uploadBufferToCloudinary = (buffer, opts = {}) => {
  const folder = opts.folder || 'cc-final/whitepapers'
  const resource_type = opts.resource_type || 'image'
  const uploadOptions = { folder, resource_type }
  if (opts.format) uploadOptions.format = opts.format

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) return reject(error)
      resolve(result)
    })
    Readable.from(buffer).pipe(uploadStream)
  })
}

/**
 * Remove an asset from Cloudinary by public_id.
 * @param {string} publicId
 * @param {'image' | 'raw' | 'video'} resourceType
 */
async function deleteCloudinaryAsset(publicId, resourceType = 'image') {
  const id = String(publicId || '').trim()
  if (!id) return { skipped: true }

  configureCloudinary()
  try {
    const result = await cloudinary.uploader.destroy(id, { resource_type: resourceType })
    return result
  } catch (err) {
    console.warn(`Cloudinary delete failed (${resourceType}):`, id, err?.message || err)
    throw err
  }
}

module.exports = { uploadBufferToCloudinary, deleteCloudinaryAsset }
