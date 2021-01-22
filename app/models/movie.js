const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  plot: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Movie", MovieSchema);
