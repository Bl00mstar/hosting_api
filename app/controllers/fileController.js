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
const { getPath, getExtension } = require("../utils/userPath");

module.exports = () => {
  //
  // trash folder list
  //
  router.route("/trash").get(async (req, res, next) => {
    try {
      const userId = req.userId;
      File.find({ userId: userId, trash: true }).then(async (data) => {
        const searchedItems = await Promise.all(
          data.map((el) => {
            return new Promise((resolve, reject) => {
              resolve({
                type: el.type,
                id: el.id,
                name: el.name,
                date: el.createdAt,
              });
            });
          })
        );
        Promise.all(searchedItems)
          .then(() => {
            res.json({ searchedItems });
          })
          .catch((err) => next(err));
      });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  });

  //
  // trash restore file/s
  //
  router.route("/trash/restore").post(async (req, res, next) => {
    try {
      const userId = req.userId;
      let userPath = await User.findOne({ _id: userId }).then((data) => {
        return data.rootFolder;
      });
      let userStorage = getPath(userPath, "/storage");
      let trashStorage = getPath(userPath, "/trash");
      let items = req.body.values.items;
      const itemsToRestore = items.map((el) => {
        return new Promise((resolve, reject) => {
          File.updateOne({ id: el.id }, { $set: { trash: false, path: "/" } })
            .then(() => {
              fs.renameSync(
                trashStorage + "/" + item.name,
                userStorage + path + item.name
              );
              resolve();
            })
            .catch((err) => reject(err));
        });
      });
      Promise.all(itemsToRestore)
        .then(() => res.json({ msg: "Items restored." }))
        .catch((err) => next(err));
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  });

  //
  // trash files perm delete
  //
  router.route("/trash/delete").post(async (req, res, next) => {
    try {
      console.log("trashdelete");
      console.log(req.body);
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  });
  //
  // file list
  //
  router.route("/").post(async (req, res, next) => {
    try {
      const userId = req.userId;
      const { values } = req.body;
      File.find({ userId: userId, path: values, trash: false }).then(
        async (data) => {
          const searchedItems = await Promise.all(
            data.map((el) => {
              return new Promise((resolve, reject) => {
                resolve({
                  type: el.type,
                  id: el.id,
                  name: el.name,
                  date: el.createdAt,
                });
              });
            })
          );
          Promise.all(searchedItems)
            .then(() => {
              res.json({ searchedItems });
            })
            .catch((err) => next(err));
        }
      );
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  });
  //
  // create new folder
  //
  router.route("/createNewFolder").post(async (req, res, next) => {
    const userId = req.userId;
    const { file_text, file_path } = req.body.values;
    let file_pattern = /^(\w+\.?)*\w+$/;
    if (file_pattern.test(file_text)) {
      User.findOne({ _id: userId })
        .then((data) => {
          let userStorage = getPath(data.rootFolder, "/storage");
          fs.mkdirSync(userStorage + file_path + file_text);
          let folder = new File({
            name: file_text,
            id: uuid.v4(),
            path: file_path,
            userId: userId,
            type: "folder",
          });
          folder
            .save()
            .then(
              res.status(201).json({ msg: "Folder " + file_text + " created!" })
            );
        })
        .catch((err) => {
          console.log(err);
          if (err.code === "EEXIST") {
            const err = new Error("Folder already exist.");
            err.statusCode = 422;
            next(err);
          }
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
  });
  //
  // create random named folders
  //
  router.route("/createRandomFolder").post(async (req, res, next) => {
    try {
      console.log("create folder");
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  });
  //
  // create folders by patter
  //
  router.route("/createPatternFolder").post(async (req, res, next) => {
    try {
      console.log("create folder");
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  });

  //
  // files move to trash, folders delete
  //
  router.route("/delete").post(async (req, res, next) => {
    try {
      const userId = req.userId;
      let userPath = await User.findOne({ _id: userId }).then((data) => {
        return data.rootFolder;
      });
      let userStorage = getPath(userPath, "/storage");
      let trashStorage = getPath(userPath, "/trash");
      let items = req.body.values.items;
      const itemsToDelete = items.map((el) => {
        return new Promise((resolve, reject) => {
          if (el.type === "folder") {
            console.log("folder");
          } else if (el.type === "file") {
            console.log("s");
            File.updateOne({ id: el.id }, { $set: { trash: true, path: "/" } })
              .then(() => {
                fs.renameSync(
                  userStorage + path + item.name,
                  trashStorage + "/" + newName
                );
                resolve();
              })
              .catch((err) => reject(err));
          }
        });
      });
      Promise.all(itemsToDelete)
        .then(() => res.json({ msg: "Items deleted." }))
        .catch((err) => next(err));
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  });

  //
  // rename file/folder
  //
  router.route("/rename").post(async (req, res, next) => {
    try {
      const { newName, item, path } = req.body.values;
      const userId = req.userId;
      let userPath = await User.findOne({ _id: userId }).then((data) => {
        return data.rootFolder;
      });
      let userStorage = getPath(userPath, "/storage");
      if (item.type === "folder") {
        File.updateOne({ id: item.id }, { $set: { name: newName } })
          .then(() => {
            fs.renameSync(
              userStorage + path + item.name,
              userStorage + path + newName
            );
            res.status(200).json({ msg: "Folder renamed." });
          })
          .catch((err) => next(err));
      } else if (item.type === "file") {
        File.updateOne(
          { id: item.id },
          { $set: { name: newName + "." + getExtension(item) } }
        )
          .then(() => {
            fs.renameSync(
              userStorage + path + item.name,
              userStorage + path + newName
            );
            res.status(200).json({ msg: "File renamed." });
          })
          .catch((err) => next(err));
      }
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  });
  return router;
};
