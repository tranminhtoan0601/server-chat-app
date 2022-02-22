const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    converstationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
    user: {
      type: Object,
    },
    isRead: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
