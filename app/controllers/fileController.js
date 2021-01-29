const User = require("../models/user");
const glob = require("glob");
const fs = require("fs");

exports.getFiles = async (req, res, next) => {
  const { path } = req.body;
  const userId = req.userId;
  User.findOne({ _id: userId })
    .then((data) => {
      let userPath = "files/upload/" + data.rootFolder;
      let filesList = [];
      let directoriesList = [];
      let storage = userPath + "/storage" + path + "*";
      glob(storage, { mark: true }, function (err, files) {
        if (err) {
          console.log(err);
        } else {
          files.map((el) => {
            let fileType = el.split("storage" + path)[1];
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

exports.createNewFolder = (req, res, next) => {
  const userId = req.userId;
  User.findOne({ _id: userId })
    .then((data) => {
      let folderPath = data.rootFolder + "/storage";
      fs.mkdirSync(folderPath + "asd");
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.createFolderPattern = (req, res, next) => {};
exports.createRandomFolder = (req, res, next) => {};
//     if (!errors.isEmpty()) {
//       const err = new Error("Email is already taken.");
//       err.statusCode = 422;
//       err.data = errors.array();
//       throw err;
//           rootFolder: uuid.v4(),
//         let path = "./files/upload/";
//         if (!fs.existsSync(path + result.rootFolder)) {
//           fs.mkdirSync(path + result.rootFolder);
//           fs.mkdirSync(path + result.rootFolder + "/storage");
//         res.status(201).json({ msg: "Signup Successfully!", userId: result._id });
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
