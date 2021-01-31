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

module.exports = (media) => {
  //
  // Delete file
  //
  router.route("/delete/:fileId").get(async (req, res, next) => {
    const userId = req.userId;
    let userPath = await User.findOne({ _id: userId }).then((data) => {
      return data.rootFolder;
    });
    let filePath = uploadPath + "/" + userPath + "/storage";
    const { fileId } = req.params;
    try {
      const fileInfo = await File.findOne({ fileId: fileId })
        .then((data) => {
          return { path: data.filePath, name: data.fileName };
        })
        .catch((err) => console.log(err));

      File.deleteOne({ fileId: fileId })
        .then((data) => {
          if (data.ok) {
            fs.unlinkSync(filePath + fileInfo.path + fileInfo.name);
            res.status(200).json({ msg: "File deleted" });
          }
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
  //  Download file
  //

  router.route("/file/:fileId").get(async (req, res, next) => {
    const userId = req.userId;
    let userPath = await User.findOne({ _id: userId }).then((data) => {
      return data.rootFolder;
    });
    let filePath = uploadPath + "/" + userPath + "/storage";
    const { fileId } = req.params;
    try {
      File.findOne({ fileId: fileId })
        .then((data) => {
          res.download(filePath + data.filePath + data.fileName);
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
  // Upload file
  //
  router.route("/").post(media.single("file"), (req, res, next) => {
    const { userPath } = req.body;
    const userId = req.userId;
    try {
      User.findOne({ _id: userId }).then((data) => {
        let filePath =
          config.get("storagePath") +
          data.rootFolder +
          "/storage" +
          userPath +
          req.file.originalname;

        fs.writeFileSync(
          filePath,
          Buffer.from(new Uint8Array(req.file.buffer))
        );

        const file = new File({
          fileName: req.file.originalname,
          fileId: uuid.v4(),
          filePath: userPath,
          userId: userId,
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
