const mongoose = require("mongoose");

const mineralSchema = new mongoose.Schema(
  {
    mineralId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Mineral", mineralSchema);
