const mongoose = require("mongoose");

const productionRecordSchema = new mongoose.Schema(
  {
    recordId: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    mineral: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mineral",
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    shift: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shift",
      required: true,
    },
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fieldOperator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workingHours: {
      type: Number,
      required: true,
    },
    remarks: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProductionRecord", productionRecordSchema);
