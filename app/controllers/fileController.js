const User = require("../models/user");
const glob = require("glob");

exports.getFiles = async (req, res, next) => {
  const userId = req.userId;
  User.findOne({ _id: userId })
    .then((data) => {
      let userPath = "files/upload/" + data.rootFolder;
      let filesList = [];
      let directoriesList = [];
      glob(userPath + "/storage/*", { mark: true }, function (err, files) {
        if (err) {
          console.log(err);
        } else {
          files.map((el) => {
            let fileType = el.split("storage/")[1];
            if (fileType.includes("/")) {
              directoriesList.push(fileType);
            } else {
              filesList.push(fileType);
            }
          });
          res.status(200).json({
            files: filesList,
            directories: directoriesList,
          });
        }
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createFolder = (req, res, next) => {
  const userId = req.userId;
  console.log(userId);
  User.findOne({ _id: userId })
    .then((data) => console.log(data))
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteFolder = (req, res, next) => {
  console.log(req);
  const userId = req.userId;
  User.findOne({ _id: userId })
    .then((data) => console.log(data))
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.renameFolder = (req, res, next) => {
  console.log(req);
  const userId = req.userId;
  User.findOne({ _id: userId })
    .then((data) => console.log(data))
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getTrash = async (req, res, next) => {
  const userId = req.userId;
  User.findOne({ _id: userId })
    .then((data) => {
      let userPath = "files/upload/" + data.rootFolder;
      let filesList = [];
      glob(userPath + "/trash/*", function (err, files) {
        if (err) {
          console.log(err);
        } else {
          files.map((el) => {
            let fileType = el.split("trash/")[1];
            filesList.push(fileType);
          });
          res.status(200).json({
            files: filesList,
          });
        }
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
