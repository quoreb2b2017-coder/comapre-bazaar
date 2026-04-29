const asyncHandler = require("../utils/async-handler");
const uploadService = require("../services/upload.service");
const { sendSuccess } = require("../utils/api-response");

const uploadImage = asyncHandler(async (req, res) => {
  const uploadResult = await uploadService.uploadImage(req.file);
  return sendSuccess(res, { statusCode: 201, data: uploadResult });
});

module.exports = { uploadImage };
