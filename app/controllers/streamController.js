const express = require("express");
const router = express.Router();
const fs = require("fs");

module.exports = () => {
  router.route("/movie/3").get((req, res, next) => {
    try {
      const path = "movie2.mkv";
      const stat = fs.statSync(path);
      console.log(stat);
      const fileSize = stat.size;
      console.log(fileSize);
      const range = req.headers.range;
      console.log(range);
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
          "Content-Type": "video/mp4",
        };

        res.writeHead(206, head);
        file.pipe(res);
      }
    } catch (error) {
      console.log(error);
    }
  });
  router.route("/movie/1").get((req, res, next) => {
    try {
      const path = "rmf.mp4";
      const stat = fs.statSync(path);
      console.log(stat);
      const fileSize = stat.size;
      console.log(fileSize);
      const range = req.headers.range;
      console.log(range);
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
          "Content-Type": "video/mp4",
        };

        res.writeHead(206, head);
        file.pipe(res);
      }
    } catch (error) {
      console.log(error);
    }
  });
  router.route("/movie/2").get((req, res, next) => {
    try {
      const path = "film.mkv";
      const stat = fs.statSync(path);
      console.log(stat);
      const fileSize = stat.size;
      console.log(fileSize);
      const range = req.headers.range;
      console.log(range);
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
          "Content-Type": "video/mp4",
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
