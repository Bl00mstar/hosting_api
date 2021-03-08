const express = require("express");
const router = express.Router();
const playlistController = require("../controllers/playlistController");
const auth = require("../middleware/authCheck");

router.use("/", auth, playlistController());
module.exports = router;
