const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reportId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Production", "Equipment", "Environmental", "Safety", "General"],
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dateFrom: {
      type: Date,
      required: true,
    },
    dateTo: {
      type: Date,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
    },
    status: {
      type: String,
      enum: ["Draft", "Generated", "Approved"],
      default: "Draft",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", reportSchema);
