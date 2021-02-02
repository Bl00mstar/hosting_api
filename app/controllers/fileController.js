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
const { getPath } = require("../utils/userPath");

module.exports = (files) => {
  //
  //  TRASH MANAGEMENT
  //
  router.route("/trash").get(async (req, res, next) => {
    try {
      const userId = req.userId;
      File.find({ userId: userId, trash: true }).then(async (data) => {
        const searchedItems = await Promise.all(
          data.map((el) => {
            return new Promise((resolve, reject) => {
              console.log(el);
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
  router.route("/trash/restore").post(async (req, res, next) => {
    try {
      console.log("trashrestore");
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  });
  router.route("/trash/delete").post(async (req, res, next) => {
    try {
      console.log("trashdelete");
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  });
  //
  //  FILES MANAGEMENT
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
  //  FOLDER MANAGEMENT
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
  //  ITEM MANAGEMENT
  //
  router.route("/delete").post(async (req, res, next) => {
    try {
      const { files, folders, path } = req.body.values;
      const userId = req.userId;
      let userPath = await User.findOne({ _id: userId }).then((data) => {
        return data.rootFolder;
      });
      let itemPath = uploadPath + "/" + userPath + "/storage" + path;
      let trashPath = uploadPath + "/" + userPath + "/trash/";
      console.log(files);
      console.log(folders);
      if (typeof folders !== "undefined" && folders.length > 0) {
        console.log("fodlders");
      }
      if (typeof files !== "undefined" && files.length > 0) {
        console.log("files");
        console.log(files.length);
        //delete from mongo file
        //move to trash
        const deletedFiles = files.map((el) => {
          return new Promise((resolve, reject) => {
            console.log(el.name);
            console.log(el.id);
            File.updateOne({ fileId: el.id }, { $set: { trash: true } })
              .then(() => resolve())
              .catch((err) => reject(err));
          });
        });
        Promise.all(deletedFiles)
          .then(() => res.json({ msg: "Files moved." }))
          .catch((err) => console.log(err));
      }
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  });
  router.route("/renameItem").post(async (req, res, next) => {
    try {
      const userId = req.userId;
      let userPath = await User.findOne({ _id: userId }).then((data) => {
        return data.rootFolder;
      });
      const { newName, item, path } = req.body.values;
      const oldItem = req.body.values.item.item;
      let changePath = uploadPath + "/" + userPath + "/storage" + path;
      if (item.type === "folder") {
        fs.renameSync(changePath + oldItem, changePath + newName);
        res.status(200).json({ msg: "Folder renamed." });
      } else if (item.type === "file") {
        let splitExtension = oldItem.name.split(".");
        let getExtension = splitExtension.pop();
        File.updateOne(
          { fileId: oldItem.id },
          { $set: { fileName: newName + "." + getExtension } }
        ).then(() => {
          fs.renameSync(
            changePath + oldItem.name,
            changePath + newName + "." + getExtension
          );
          res.status(200).json({ msg: "File renamed." });
        });
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
