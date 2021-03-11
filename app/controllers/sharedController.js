const express = require("express");
const router = express.Router();
const Share = require("../models/share");
const File = require("../models/file");
const User = require("../models/user");
const { getIp, getPath } = require("../utils/userPath");
const fs = require("fs");

module.exports = () => {
  //
  // download file, timeout, ip
  //
  router.route("/:linkId").get(async (req, res, next) => {
    try {
      const addressIp = getIp(req);
      const { linkId } = req.params;
      Share.findOne({ linkId: linkId })
        .then((data) => {
          const currentTime = Date.now();
          if (Number(currentTime) > Number(data.expireAt)) {
            const err = new Error({ msg: "Link expired!" });
            err.statusCode = 422;
            next(err);
          }
          if (data.addressIp !== addressIp) {
            const err = new Error({ msg: "Invalid ip address." });
            err.statusCode = 422;
            next(err);
          }
          res.download(data.filePath);
        })
        .catch((err) => next(err));
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  });

  router.route("/movie/:storage/:id").get(async (req, res, next) => {
    const { storage, id } = req.params;
    try {
      const folder = await User.findOne({ _id: storage }).then((data) => {
        return data.rootFolder;
      });
      const file = await File.findOne({ _id: id }).then((data) => {
        return { path: data.path, name: data.name };
      });
      const fileStorage = getPath(folder, "/storage");
      const path = fileStorage + file.path + file.name;
      const stat = fs.statSync(path);
      const fileSize = stat.size;
      const range = req.headers.range;
      if (!req.headers.range) {
        const err = new Error("( ͡° ‸ ͡°)");
        err.statusCode = 500;
        next(err);
      }
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = end - start + 1;
        const file = fs.createReadStream(path, { start, end });
        const head = {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Range": "bytes",
          "Content-Length": chunkSize,
          "Content-Type": "video/matroska",
        };
        res.writeHead(206, head);
        file.pipe(res);
      }
    } catch (error) {
      console.log(error);
    }
  });

  return router;
};
