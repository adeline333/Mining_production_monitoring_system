const ProductionRecord = require("../models/ProductionRecord");
const Mineral = require("../models/Mineral");
const Shift = require("../models/Shift");

// Create new production record
const createProductionRecord = async (req, res) => {
  try {
    const {
      recordId,
      date,
      quantity,
      mineral,
      location,
      shift,
      supervisor,
      fieldOperator,
      workingHours,
      remarks,
    } = req.body;

    // Check if recordId already exists
    const existingRecord = await ProductionRecord.findOne({ recordId });
    if (existingRecord) {
      return res.status(400).json({
        success: false,
        message: "Production record with this ID already exists",
      });
    }

    const productionRecord = new ProductionRecord({
      recordId,
      date,
      quantity,
      mineral,
      location,
      shift,
      supervisor,
      fieldOperator,
      workingHours,
      remarks,
    });

    await productionRecord.save();

    // Populate references
    await productionRecord.populate("mineral shift supervisor fieldOperator");

    res.status(201).json({
      success: true,
      message: "Production record created successfully",
      data: productionRecord,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating production record",
      error: error.message,
    });
  }
};

// Get all production records
const getAllProductionRecords = async (req, res) => {
  try {
    const { startDate, endDate, mineral, shift, status } = req.query;

    let filter = {};

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (mineral) filter.mineral = mineral;
    if (shift) filter.shift = shift;
    if (status) filter.status = status;

    const productionRecords = await ProductionRecord.find(filter)
      .populate("mineral shift supervisor fieldOperator")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: productionRecords.length,
      data: productionRecords,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching production records",
      error: error.message,
    });
  }
};

// Get single production record
const getProductionRecord = async (req, res) => {
  try {
    const productionRecord = await ProductionRecord.findById(
      req.params.id
    ).populate("mineral shift supervisor fieldOperator");

    if (!productionRecord) {
      return res.status(404).json({
        success: false,
        message: "Production record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: productionRecord,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching production record",
      error: error.message,
    });
  }
};

// Update production record
const updateProductionRecord = async (req, res) => {
  try {
    const productionRecord = await ProductionRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("mineral shift supervisor fieldOperator");

    if (!productionRecord) {
      return res.status(404).json({
        success: false,
        message: "Production record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Production record updated successfully",
      data: productionRecord,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating production record",
      error: error.message,
    });
  }
};

// Delete production record
const deleteProductionRecord = async (req, res) => {
  try {
    const productionRecord = await ProductionRecord.findByIdAndDelete(
      req.params.id
    );

    if (!productionRecord) {
      return res.status(404).json({
        success: false,
        message: "Production record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Production record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting production record",
      error: error.message,
    });
  }
};

// Approve production record
const approveProductionRecord = async (req, res) => {
  try {
    const productionRecord = await ProductionRecord.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    ).populate("mineral shift supervisor fieldOperator");

    if (!productionRecord) {
      return res.status(404).json({
        success: false,
        message: "Production record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Production record approved",
      data: productionRecord,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error approving production record",
      error: error.message,
    });
  }
};

// Get production statistics
const getProductionStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let matchFilter = {};
    if (startDate && endDate) {
      matchFilter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const statistics = await ProductionRecord.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalProduction: { $sum: "$quantity" },
          averageProduction: { $avg: "$quantity" },
          recordCount: { $sum: 1 },
        },
      },
    ]);

    const byMineral = await ProductionRecord.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: "$mineral",
          totalQuantity: { $sum: "$quantity" },
          recordCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "minerals",
          localField: "_id",
          foreignField: "_id",
          as: "mineralInfo",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overall: statistics[0] || {
          totalProduction: 0,
          averageProduction: 0,
          recordCount: 0,
        },
        byMineral,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching production statistics",
      error: error.message,
    });
  }
};

module.exports = {
  createProductionRecord,
  getAllProductionRecords,
  getProductionRecord,
  updateProductionRecord,
  deleteProductionRecord,
  approveProductionRecord,
  getProductionStatistics,
};
