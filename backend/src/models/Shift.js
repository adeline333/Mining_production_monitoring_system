const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema(
  {
    shiftId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      enum: ["Morning", "Afternoon", "Night"],
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Shift", shiftSchema);
