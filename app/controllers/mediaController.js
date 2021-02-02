const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const config = require("config");
const User = require("../models/user");
const File = require("../models/file");
const fs = require("fs");
const uuid = require("uuid");
const path = require("path");
const uploadPath = path.resolve(__dirname, "../../files/upload");
const { getPath } = require("../utils/userPath");

module.exports = (media) => {
  //
  //  download file
  //
  router.route("/file/:fileId").get(async (req, res, next) => {
    try {
      const userId = req.userId;
      const userPath = await User.findOne({ _id: userId }).then((data) => {
        return data.rootFolder;
      });
      const { fileId } = req.params;
      const userStorage = getPath(data.rootFolder, "/storage");
      const filePath = userStorage + userPath + req.file.originalname;
      File.findOne({ fileId: fileId })
        .then((data) => {
          res.download(filePath + data.path + data.name);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  });
  //
  // upload file
  //

  router.route("/").post(media.single("file"), (req, res, next) => {
    try {
      const { userPath } = req.body;
      const userId = req.userId;
      User.findOne({ _id: userId }).then((data) => {
        let userStorage = getPath(data.rootFolder, "/storage");
        let filePath = userStorage + userPath + req.file.originalname;
        fs.writeFileSync(
          filePath,
          Buffer.from(new Uint8Array(req.file.buffer))
        );
        const file = new File({
          name: req.file.originalname,
          id: uuid.v4(),
          path: userPath,
          userId: userId,
          trash: false,
          type: "file",
        });
        file.save().then(() => {
          res.status(200).json({ file: file });
        });
      });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  });

  return router;
};
