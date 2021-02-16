const express = require("express");
const router = express.Router();
const auth = require("../middleware/authCheck");
const trashController = require("../controllers/trashController");

router.use("/", auth, trashController());

module.exports = router;
