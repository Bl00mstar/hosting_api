const express = require("express");
const router = express.Router();
const Playlist = require("../models/playlist");
const File = require("../models/file");

module.exports = () => {
  router.route("/:playlist").get(async (req, res, next) => {
    try {
      const { playlist } = req.params;
      let playlistData = await Playlist.findOne({ _id: playlist }).then(
        (data) => {
          return data;
        }
      );
      const filesData = await Promise.all(
        playlistData.files.map((file) => {
          return new Promise((resolve, reject) => {
            File.findOne({ id: file })
              .then((data) => {
                resolve({ id: data._id, name: data.name, selector: data.id });
              })
              .catch((err) => reject(err));
          });
        })
      );
      Promise.all(filesData)
        .then(() => {
          res.json({ msg: { playlist: playlistData, filesData: filesData } });
        })
        .catch((err) => next(err));
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  });

  router.route("/:playlist/:file").put((req, res, next) => {
    try {
      const { playlist, file } = req.params;
      Playlist.findOneAndUpdate({ _id: playlist }, { $push: { files: file } })
        .then((data) => {
          res.json({ msg: data });
        })
        .catch((err) => next(err));
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  });

  router.route("/:playlist/:file").delete((req, res, next) => {
    try {
      const { playlist, file } = req.params;
      Playlist.findOneAndUpdate({ _id: playlist }, { $pull: { files: file } })
        .then((data) => {
          res.json({ msg: data });
        })
        .catch((err) => next(err));
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  });

  router.route("/").get((req, res, next) => {
    try {
      const userId = req.userId;
      Playlist.find({ user: userId })
        .then((data) => {
          res.json({ msg: data });
        })
        .catch((err) => next(err));
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  });

  router.route("/").post((req, res, next) => {
    try {
      const { playlistName } = req.body;
      const userId = req.userId;
      Playlist.findOne({ name: playlistName, user: userId })
        .then((data) => {
          if (data != null) {
            const err = new Error({ msg: "Playlist already exist!" });
            err.statusCode = 422;
            next(err);
          } else {
            let playlist = new Playlist({
              name: playlistName,
              user: userId,
            });
            playlist.save().then(
              res.status(201).json({
                msg: "Playlist " + playlistName + " have been created!",
              })
            );
          }
        })
        .catch((err) => reject(err));
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  });

  router.route("/:id").delete((req, res, next) => {
    const { id } = req.params;
    const userId = req.userId;
    try {
      Playlist.findOneAndDelete({ user: userId, _id: id })
        .then((data) => {
          res.json({ msg: data.msg });
        })
        .catch((err) => next(err));
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  });

  router.route("/:id").put((req, res, next) => {
    const { id } = req.params;
    const { newName } = req.body;
    const userId = req.userId;
    try {
      Playlist.findOneAndUpdate(
        { user: userId, _id: id },
        { $set: { name: newName } }
      )
        .then((data) => {
          console.log(data);
          res.json({ msg: "Updated" });
        })
        .catch((err) => next(err));
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  });

  router.route("/file/:id").get((req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.userId;
      console.log(req.params);
      File.findOne({ userId: userId, trash: false, id: id, type: "file" })
        .then((data) => {
          console.log(data);
          res.json({
            msg: { _id: data._id, storage: data.userId, name: data.name },
          });
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
