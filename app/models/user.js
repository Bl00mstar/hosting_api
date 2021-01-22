const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  membership: {
    type: Schema.Types.ObjectId,
    ref: "Plan",
  },
  membershipStartDate: {
    type: Date,
  },
  membershipEndDate: {
    type: Date,
  },
  profiles: [
    {
      title: {
        type: String,
      },
      category: {
        type: String,
      },
      choice: [String],
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
