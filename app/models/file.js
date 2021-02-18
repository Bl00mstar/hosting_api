const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FileSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  trash: {
    default: false,
    type: Boolean,
  },
  type: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("File", FileSchema);
