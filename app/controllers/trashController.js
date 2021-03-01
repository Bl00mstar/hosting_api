const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const config = require("config");
const User = require("../models/user");
const File = require("../models/file");
const fs = require("fs");
const uuid = require("uuid");
const path = require("path");
const rimraf = require("rimraf");
const uploadPath = path.resolve(__dirname, "../../files/upload");
const { getPath, getExtension, getFolders } = require("../utils/userPath");

module.exports = () => {
  // Trash files list
  router.route("/").get(async (req, res, next) => {
    try {
      console.log("asd");
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
            console.log(searchedItems);
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
  // Trash restore files
  router.route("/restore").post(async (req, res, next) => {
    try {
      const userId = req.userId;
      const userPath = await User.findOne({ _id: userId }).then((data) => {
        return data.rootFolder;
      });
      const userStorage = getPath(userPath, "/storage");
      const trashStorage = getPath(userPath, "/trash");
      const items = req.body.values;
      const validateItems = items.map((item) => {
        return new Promise((resolve, reject) => {
          File.find({ userId: userId, path: "/", trash: false, type: "file" })
            .then((data) => {
              data.map((el) => {
                if (item.name === el.name) {
                  const err = new Error(
                    "A file with this name is already in the root folder."
                  );
                  err.statusCode = 401;
                  reject(err);
                }
              });
              resolve();
            })
            .catch((err) => reject(err));
        });
      });
      Promise.all(validateItems)
        .then(() => {
          const itemsToRestore = items.map((el) => {
            return new Promise((resolve, reject) => {
              File.updateOne(
                { id: el.id },
                { $set: { trash: false, path: "/" } }
              )
                .then(() => {
                  fs.renameSync(
                    trashStorage + "/" + el.name,
                    userStorage + "/" + el.name
                  );
                  resolve();
                })
                .catch((err) => reject(err));
            });
          });
          Promise.all(itemsToRestore)
            .then(() => res.status(200).json({ msg: "Restored." }))
            .catch((err) => next(err));
        })
        .catch((err) => next(err));
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  });
  //trash perm delete
  router.route("/delete").post(async (req, res, next) => {
    try {
      const userId = req.userId;
      const userPath = await User.findOne({ _id: userId }).then((data) => {
        return data.rootFolder;
      });
      const trashStorage = getPath(userPath, "/trash");
      const items = req.body.values;
      const deleteItems = items.map((item) => {
        return new Promise((resolve, reject) => {
          File.deleteOne({
            userId: userId,
            trash: true,
            id: item.id,
          })
            .then(() => {
              console.log(trashStorage + "/" + item.name);
              fs.unlinkSync(trashStorage + "/" + item.name);
              resolve();
            })
            .catch((err) => reject(err));
        });
      });
      Promise.all(deleteItems)
        .then(() => {
          res.status(200).json({ msg: "Files Deleted." });
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
