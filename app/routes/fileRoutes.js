const express = require("express");
const router = express.Router();
const auth = require("../middleware/authCheck");
const fileController = require("../controllers/fileController");

router.use("/", auth, fileController());

module.exports = router;
