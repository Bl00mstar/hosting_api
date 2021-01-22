const router = require("express").Router();
const { body } = require("express-validator");

/**
 * Handle Error
 */
router.use("/", (req, res, next) => {
  const newErr = Error("Please Login to access User Resources");
  newErr.statusCode = 403;
  next(newErr);
});

module.exports = router;
