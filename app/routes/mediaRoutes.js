const express = require("express");
const router = express.Router();
const mediaController = require("../controllers/mediaController");
const path = require("path");
const multer = require("multer");
const config = require("config");
const auth = require("../middleware/authCheck");
// PATH /api/hosting

//init storaged
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer(storage);

router.use("/", auth, mediaController(upload));

module.exports = router;
