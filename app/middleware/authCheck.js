const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  const authorization = req.get("Authorization");
  if (!authorization) {
    const err = new Error("Authorization error");
    err.statusCode = 401;
    throw err;
  }

  const token = authorization.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, config.get("APP_KEY"));
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    const err = new Error("unable  to authenticated");
    err.statusCode = 401;
    throw err;
  }

  req.userId = decodedToken.userId;
  console.log(`User Id ${req.userId}`);
  next();
};
