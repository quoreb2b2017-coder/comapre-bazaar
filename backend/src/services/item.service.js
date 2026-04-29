const cloudinary = require("../config/cloudinary");
const Item = require("../models/item.model");
const ApiError = require("../utils/api-error");

const getItems = () => Item.find().sort({ createdAt: -1 });

const getItemById = async (id) => {
  const item = await Item.findById(id);
  if (!item) {
    throw new ApiError(404, "Item not found");
  }
  return item;
};

const createItem = (payload) => Item.create(payload);

const updateItem = async (id, payload) => {
  const item = await getItemById(id);
  Object.assign(item, payload);
  await item.save();
  return item;
};

const deleteItem = async (id) => {
  const item = await getItemById(id);

  if (item.imagePublicId) {
    await cloudinary.uploader.destroy(item.imagePublicId);
  }

  await item.deleteOne();
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
