const User = require("../models/user");
const File = require("../models/file");
const glob = require("glob");
const fs = require("fs");
const config = require("config");

exports.getFiles = async (req, res, next) => {
  const { values } = req.body;
  const userId = req.userId;
  User.findOne({ _id: userId })
    .then((data) => {
      let userPath = "files/upload/" + data.rootFolder;
      let directoriesList = [];
      let storage = userPath + "/storage" + values + "*";
      File.find({ userId: userId, filePath: values }).then((data) => {
        let fileInfo = data.map((el) => {
          console.log(el);
          return {
            fileId: el.fileId,
            fileName: el.fileName,
            fileDate: el.createdAt,
          };
        });
        glob(storage, { mark: true }, function (err, files) {
          if (err) {
            console.log(err);
          } else {
            files.map((el) => {
              let fileType = el.split("storage" + values)[1];
              if (fileType.includes("/")) {
                directoriesList.push(fileType);
              }
            });
            res.status(200).json({
              files: fileInfo,
              directories: directoriesList,
            });
          }
        });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createNewFolder = (req, res, next) => {
  const userId = req.userId;
  const { file_text, file_path } = req.body.values;
  let file_pattern = /^(\w+\.?)*\w+$/;
  //checkfilepath
  if (file_pattern.test(file_text)) {
    User.findOne({ _id: userId })
      .then((data) => {
        let path = config.get("storagePath") + data.rootFolder + "/storage";
        fs.mkdirSync(path + file_path + file_text);
        res.status(201).json({ msg: "Folder " + file_text + " created!" });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  } else {
    const err = new Error({ msg: "Invalid folder name." });
    err.statusCode = 422;
    next(err);
  }
};
exports.createFolderPattern = (req, res, next) => {};
exports.createRandomFolder = (req, res, next) => {};
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
