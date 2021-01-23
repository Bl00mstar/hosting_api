const express = require("express");
const router = express.Router();
const auth = require("../middleware/authCheck");
const sourceAuth = require("../middleware/sourceCheck");

const videoController = require("../controllers/videoController");

module.exports = router;
