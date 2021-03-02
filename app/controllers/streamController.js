const express = require("express");
const router = express.Router();
const fs = require("fs");
const { promisify } = require("util");
const Busboy = require("busboy");

module.exports = () => {
  router.route("/upload").post((req, res) => {
    const busboy = new Busboy({ headers: req.headers });
    busboy.on("file", function (fieldname, file, filename) {
      let saveTo = __dirname + fieldname + "-" + filename;
      file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on("finish", function () {
      res.end("done");
    });
    res.on("close", function () {
      req.unpipe(busboy);
    });
    req.pipe(busboy);
  });

  router.route("/movie/3").get((req, res, next) => {
    try {
      const path = "asd.mkv";
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
          "Content-Type": "video/matroska",
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
      const path = "aas.mkv";
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
  //   router.route("/movie/1").get((req, res, next) => {
  //     try {
  //       const path = "movie2.mp4";
  //       const stat = fs.statSync(path);
  //       console.log(stat);
  //       const fileSize = stat.size;
  //       console.log(fileSize);
  //       const range = req.headers.range;
  //       console.log(range);
  //       if (range) {
  //         const parts = range.replace(/bytes=/, "").split("-");
  //         const start = parseInt(parts[0], 10);
  //         const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
  //         const chunkSize = end - start + 1;
  //         const file = fs.createReadStream(path, { start, end });
  //         const head = {
  //           "Content-Range": `bytes ${start}-${end}/${fileSize}`,
  //           "Accept-Range": "bytes",
  //           "Content-Length": chunkSize,
  //           "Content-Type": "video/mp4",
  //         };

  //         res.writeHead(206, head);
  //         file.pipe(res);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   });
  return router;
};

// const express = require("express");
// const router = express.Router();
// const fs = require("fs");

// module.exports = () => {
//   router.route("/movie").post(async (req, res, next) => {
//     console.log("halo?");
//     let size = 0;
//     const ws = fs.createWriteStream("file.mkv");
//     req.on(
//       "data",
//       (data) => {
//         ws.write(data);
//         console.log("got chunk:" + data.length
//       }

//       //   (data) => ws.write(data);
//       //   size += data.length;
//       //   console.log("got chunk:" + data.length + "total: " + size);
//     );
//     req.on("end", () => {
//       console.log("total size " + size);
//       res.send("response");
//     });
//     req.on("error", (e) => {
//       console.log("error " + e.message);
//     });
//   });

//   router.route("/movie/3").get((req, res, next) => {
//     try {
//       const path = "movie2.mkv";
//       const stat = fs.statSync(path);
//       console.log(stat);
//       const fileSize = stat.size;
//       console.log(fileSize);
//       const range = req.headers.range;
//       console.log(range);
//       if (range) {
//         const parts = range.replace(/bytes=/, "").split("-");
//         const start = parseInt(parts[0], 10);
//         const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
//         const chunkSize = end - start + 1;
//         const file = fs.createReadStream(path, { start, end });
//         const head = {
//           "Content-Range": `bytes ${start}-${end}/${fileSize}`,
//           "Accept-Range": "bytes",
//           "Content-Length": chunkSize,
//           //   "Content-Type": "video/mp4",
//         };

//         res.writeHead(206, head);
//         file.pipe(res);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   });
//   router.route("/movie/1").get((req, res, next) => {
//     try {
//       const path = "rmf.mp4";
//       const stat = fs.statSync(path);
//       console.log(stat);
//       const fileSize = stat.size;
//       console.log(fileSize);
//       const range = req.headers.range;
//       console.log(range);
//       if (range) {
//         const parts = range.replace(/bytes=/, "").split("-");
//         const start = parseInt(parts[0], 10);
//         const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
//         const chunkSize = end - start + 1;
//         const file = fs.createReadStream(path, { start, end });
//         const head = {
//           "Content-Range": `bytes ${start}-${end}/${fileSize}`,
//           "Accept-Range": "bytes",
//           "Content-Length": chunkSize,
//           "Content-Type": "video/mp4",
//         };

//         res.writeHead(206, head);
//         file.pipe(res);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   });
//   router.route("/movie/2").get((req, res, next) => {
//     try {
//       const path = "film.mkv";
//       const stat = fs.statSync(path);
//       console.log(stat);
//       const fileSize = stat.size;
//       console.log(fileSize);
//       const range = req.headers.range;
//       console.log(range);
//       if (range) {
//         const parts = range.replace(/bytes=/, "").split("-");
//         const start = parseInt(parts[0], 10);
//         const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
//         const chunkSize = end - start + 1;
//         const file = fs.createReadStream(path, { start, end });
//         const head = {
//           "Content-Range": `bytes ${start}-${end}/${fileSize}`,
//           "Accept-Range": "bytes",
//           "Content-Length": chunkSize,
//           "Content-Type": "video/mp4",
//         };

//         res.writeHead(206, head);
//         file.pipe(res);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   });
//   return router;
// };
