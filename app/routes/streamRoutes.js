const express = require("express");
const router = express.Router();
const streamController = require("../controllers/streamController");

router.use("/", streamController());

module.exports = router;
