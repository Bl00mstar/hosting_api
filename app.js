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
const videoRoutes = require("./app/routes/videoRoutes");

const app = express();
app.use(bodyParser.json({ extended: false }));
app.use(cors());
app.use(cookieParser());

app.use(
  "/videos",
  express.static(path.join(__dirname + "/files/", "s3_videos"))
);
app.use(
  "/images",
  express.static(path.join(__dirname + "/files/", "s3_images"))
);

// app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/watch", videoRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(config.get("mongoURI"), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`LOG: Mongodb connected.`);
    const PORT = process.env.PORT || 9000;
    app.listen(PORT);
    console.log(`LOG: Server started on port: ${PORT}`);
  })
  .catch((err) => console.log(err));
