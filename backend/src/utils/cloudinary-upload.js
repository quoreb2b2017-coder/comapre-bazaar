const { Readable } = require("stream");
const cloudinary = require("../config/cloudinary");

const uploadBufferToCloudinary = (buffer, folder = "cc-final") =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });

module.exports = { uploadBufferToCloudinary };
