const mongoose = require("mongoose");
const ConverstationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Converstation", ConverstationSchema);
