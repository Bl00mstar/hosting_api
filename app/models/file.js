const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FileSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
  },
  fileName: {
    type: String,
  },
  categorised: {
    type: String,
  },
});

module.exports = mongoose.model("File", FileSchema);
