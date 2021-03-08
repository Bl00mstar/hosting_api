const express = require("express");
const router = express.Router();
const Playlist = require("../models/playlist");

module.exports = () => {
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
        .then(() => {})
        .catch((err) => reject(err));
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  });

  router.route("/playlist").put((req, res, next) => {
    try {
      const userId = req.userId;
      console.log("put playlsits");
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  });

  return router;
};
