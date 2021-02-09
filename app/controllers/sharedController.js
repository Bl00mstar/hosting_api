const express = require("express");
const router = express.Router();
const Share = require("../models/share");
const { getIp } = require("../utils/userPath");

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

  return router;
};
