const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const config = require("config");
const User = require("../models/user");
const fs = require("fs");

module.exports = (media) => {
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
        res.sendStatus(200);
      });
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

  router.route("/file").post((req, res, next) => {
    const userId = req.userId;
    const { file, path } = req.body;
    try {
      console.log("s");
      User.findOne({ _id: userId })
        .then((data) => {
          let filePath =
            config.get("storagePath") +
            data.rootFolder +
            "/storage" +
            path +
            file;
          console.log(filePath);
          res.download(filePath);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
      //path
      //name
    }
  });

  return router;
};
