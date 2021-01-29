const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../middleware/authCheck");
const fileController = require("../controllers/fileController");

//file/create
//file/upload
router.post("/", auth, fileController.getFiles);
router.get("/trash", auth, fileController.getTrash);
router.post("/folder/createNew", auth, fileController.createNewFolder);
router.post("/folder/createPattern", auth, fileController.createFolderPattern);
router.post("/folder/createRandom", auth, fileController.createRandomFolder);
router.post("/folder/deleteFolder", auth, fileController.deleteFolder);
router.post("/folder/rename", auth, fileController.renameFolder);
// router.post("/upload", auth, fileController.createFolder);
// router.post("/create", auth, fileController.createFolder);
// router.post("/create", auth, fileController.createFolder);
// router.post("/create", auth, fileController.createFolder);
module.exports = router;
