const asyncHandler = require("../utils/async-handler");
const itemService = require("../services/item.service");
const { sendSuccess } = require("../utils/api-response");

const getItems = asyncHandler(async (_req, res) => {
  const items = await itemService.getItems();
  return sendSuccess(res, { data: items });
});

const getItemById = asyncHandler(async (req, res) => {
  const item = await itemService.getItemById(req.params.id);
  return sendSuccess(res, { data: item });
});

const createItem = asyncHandler(async (req, res) => {
  const item = await itemService.createItem(req.body);
  return sendSuccess(res, { statusCode: 201, data: item });
});

const updateItem = asyncHandler(async (req, res) => {
  const item = await itemService.updateItem(req.params.id, req.body);
  return sendSuccess(res, { data: item });
});

const deleteItem = asyncHandler(async (req, res) => {
  await itemService.deleteItem(req.params.id);
  return sendSuccess(res, { message: "Item deleted" });
});

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
