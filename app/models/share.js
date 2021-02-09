const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ShareSchema = new Schema({
  addressIp: {
    type: String,
    required: true,
  },
  linkId: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  expireAt: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Share", ShareSchema);
