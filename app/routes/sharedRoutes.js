const express = require("express");
const router = express.Router();
const sharedController = require("../controllers/sharedController");

router.use("/", sharedController());

module.exports = router;
