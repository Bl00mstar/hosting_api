const express = require("express");
const router = express.Router();
const streamController = require("../controllers/streamController");
const auth = require("../middleware/authCheck");

// router.use("/", auth, streamController());
router.use("/", auth, streamController());
module.exports = router;
