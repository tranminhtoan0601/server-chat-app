const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    lastName: {
      type: String,
    },
    firstName: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    name: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
