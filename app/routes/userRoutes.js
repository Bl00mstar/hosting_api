const router = require("express").Router();
const { body } = require("express-validator");
const userController = require("../controllers/userController");
const auth = require("../middleware/authCheck");

const User = require("../models/user");

/**
 * User Access
 */
router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please Enter a valid email ID")
      .custom((value, req) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email already Exist");
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Your password whould have to atlest 6 Character long"),
  ],
  userController.onSignup
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please Enter a valid email ID")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Please Enter a Valid Password!"),
  ],
  userController.onLogin
);

router.get("/auth", auth, userController.isAuthenticated);

router.post(
  "/mock-login",
  [
    body("email")
      .isEmail()
      .withMessage("Please Enter a valid email ID")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Please Enter a Valid Password!"),
  ],
  userController.onMockLogin
);
router.delete("/:id", auth, userController.onDeleteAccount);
/**
 * Handle Error
 */
router.use("/", (req, res, next) => {
  const newErr = Error("Not Found");
  newErr.statusCode = 403;
  next(newErr);
});

module.exports = router;
