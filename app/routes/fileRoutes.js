const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../middleware/authCheck");
const fileController = require("../controllers/fileController");

//file/create
//file/upload
router.get("/", auth, fileController.getFiles);
router.get("/trash", auth, fileController.getTrash);
// router.post("/folder/create", auth, fileController.createFolder);
// router.post("/folder/delete", auth, fileController.createFolder);
// router.post("/folder/rename", auth, fileController.createFolder);
// router.post("/upload", auth, fileController.createFolder);
// router.post("/create", auth, fileController.createFolder);
// router.post("/create", auth, fileController.createFolder);
// router.post("/create", auth, fileController.createFolder);
module.exports = router;
