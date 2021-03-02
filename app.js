const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require("config");

/**
 * Routes
 */
const userRoutes = require("./app/routes/userRoutes");
const adminRoutes = require("./app/routes/adminRoutes");
const fileRoutes = require("./app/routes/fileRoutes");
const trashRoutes = require("./app/routes/trashRoutes");
const sharedRoutes = require("./app/routes/sharedRoutes");
const streamRoutes = require("./app/routes/streamRoutes");

const app = express();
app.use(bodyParser.json({ extended: false }));
app.use(cors());
app.options("*", cors());
app.use(cookieParser());

// app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/file", fileRoutes);
app.use("/trash", trashRoutes);
app.use("/share", sharedRoutes);
app.use("/stream", streamRoutes);
app.use("/media", require("./app/routes/mediaRoutes"));

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(config.get("mongoURI"), {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`LOG: Mongodb connected.`);
  })
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 9000;

module.exports = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`)
);
