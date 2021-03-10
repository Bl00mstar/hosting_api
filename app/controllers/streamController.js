const express = require("express");
const router = express.Router();
const fs = require("fs");
const { promisify } = require("util");
const Busboy = require("busboy");
const User = require("../models/user");
const File = require("../models/file");
const { getPath } = require("../utils/userPath");
const uuid = require("uuid");

module.exports = () => {
  //handle -xhr - upload - by - chunks
  //Upload files
  router.route("/upload").post(async (req, res) => {
    const userId = req.userId;
    console.log(userId);
    const userPath = await User.findOne({ _id: userId }).then((data) => {
      console.log(data);
      return data.rootFolder;
    });
    const userStorage = getPath(userPath, "/storage");
    const userTemp = getPath(userPath, "/temp/");
    const fileId = uuid.v4();
    let fileName = "";
    try {
      const busboy = new Busboy({ headers: req.headers });
      busboy.on("file", (fieldname, file, filename) => {
        fileName = filename;
        let saveTo = userTemp + fileId + "+" + fileName;

        file.pipe(fs.createWriteStream(saveTo));
      });
      busboy.on("finish", () => {
        const file = new File({
          name: fileName,
          id: fileId,
          path: "/",
          createdAt: Date.now(),
          userId: userId,
          trash: false,
          type: "file",
        });
        fs.renameSync(
          userTemp + fileId + "+" + fileName,
          userStorage + "/" + fileName
        );
        file.save().then(() => {
          res.status(200).json("uploaded!");
        });
      });
      res.on("close", () => {
        req.unpipe(busboy);
      });
      req.pipe(busboy);
    } catch (error) {
      console.log(error);
    }
  });

  return router;
};
