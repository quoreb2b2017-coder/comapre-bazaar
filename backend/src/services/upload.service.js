const ApiError = require("../utils/api-error");
const { uploadBufferToCloudinary } = require("../utils/cloudinary-upload");

const uploadImage = async (file) => {
  if (!file) {
    throw new ApiError(400, "Image file is required");
  }

  const result = await uploadBufferToCloudinary(file.buffer);
  return {
    imageUrl: result.secure_url,
    publicId: result.public_id,
  };
};

module.exports = { uploadImage };
