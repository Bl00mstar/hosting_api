const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const config = require("config");

const User = require("../models/user");
const Movie = require("../models/movie");

/** Public access*/
exports.onSignup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Validation Error");
    err.message = "Email Id already Exist. Please login using your password!";
    err.data = errors.array();
    next(err);
    return;
  }

  let email = req.body.email;
  let password = req.body.password;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;

  bcrypt
    .hash(password, 12)
    .then((hashPassword) => {
      const user = new User({
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: hashPassword,
        membership: null,
        membershipStartDate: null,
        membershipEndDate: null,
        profiles: [
          {
            title: firstName,
            category: "Adult",
            choice: null,
          },
        ],
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ msg: "Signup Successfully!", userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.onForgotPassword = (req, res, next) => {};

exports.onLogin = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Validation Error");
    err.statusCode = 422;
    err.data = errors.array();
    throw err;
  }

  let email = req.body.email;
  let password = req.body.password;
  let loginUser = null;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const err = new Error("User Does not exist with the provided email");
        err.statusCode = 401;
        throw err;
      }
      loginUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((result) => {
      if (!result) {
        const err = new Error("Passwod does not match!");
        err.statusCode = 401;
        throw err;
      }

      const token = jwt.sign(
        { userId: loginUser._id.toString(), email: loginUser.email },
        config.get("APP_KEY"),
        { expiresIn: "90d" }
      );

      res.status(200).json({ token: token, email: loginUser.email });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.onMockLogin = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Validation Error");
    err.statusCode = 422;
    err.data = errors.array();
    throw err;
  }

  let email = req.body.email;
  let password = req.body.password;
  let loginUser = null;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const err = new Error("User Does not exist with the provided email ID");
        err.statusCode = 401;
        throw err;
      }
      loginUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((result) => {
      if (!result) {
        const err = new Error("Passwod does not match!");
        err.statusCode = 401;
        throw err;
      }

      const token = jwt.sign(
        { userId: loginUser._id.toString(), email: loginUser.email },
        config.get("APP_KEY"),
        { expiresIn: "90d" }
      );

      res.status(200).json({
        userId: loginUser._id.toString(),
        email: loginUser.email,
        token: token,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
/** Private access*/

//mock
exports.onDeleteAccount = (req, res, next) => {
  const userId = req.userId;
  console.log(userId);

  User.deleteOne({ _id: userId })
    .then((result) => {
      res.status(200).json({ msg: "Account Deleted" });
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.onViewProfile = (req, res, next) => {};
exports.onAddProfile = (req, res, next) => {};
exports.onAddChoice = (req, res, next) => {};
exports.onDeleteProfile = (req, res, next) => {
  const userId = req.userId;
  const profileId = req.params.id;

  User.findById(userId)
    .then((result) => {
      let skippedProfiles = result.profiles.filter((profile) => {
        return profile._id.toString() !== profileId;
      });

      result.profiles = skippedProfiles;
      return result.save();
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.viewWatchlist = (req, res, next) => {};
exports.addToWatchlist = (req, res, next) => {};
exports.removeWatchlist = (req, res, next) => {};
