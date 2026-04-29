const express = require("express");
const itemRoutes = require("./item.routes");
const uploadRoutes = require("./upload.routes");

const router = express.Router();

router.use("/items", itemRoutes);
router.use("/upload", uploadRoutes);

module.exports = router;
