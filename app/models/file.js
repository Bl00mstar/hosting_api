const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FileSchema = new Schema({
  fileName: {
    type: String,
    required: true,
  },
  fileId: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  createdAt: {
    default: Date.now(),
    type: Date,
  },
  userId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("File", FileSchema);
