const Report = require("../models/Report");
const ProductionRecord = require("../models/ProductionRecord");
const Equipment = require("../models/Equipment");

// Create new report
const createReport = async (req, res) => {
  try {
    const { reportId, title, type, generatedBy, dateFrom, dateTo, data } =
      req.body;

    // Check if reportId already exists
    const existingReport = await Report.findOne({ reportId });
    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: "Report with this ID already exists",
      });
    }

    const report = new Report({
      reportId,
      title,
      type,
      generatedBy,
      dateFrom,
      dateTo,
      data,
    });

    await report.save();
    await report.populate("generatedBy", "userName role");

    res.status(201).json({
      success: true,
      message: "Report created successfully",
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating report",
      error: error.message,
    });
  }
};

// Get all reports
const getAllReports = async (req, res) => {
  try {
    const { type, status, startDate, endDate } = req.query;

    let filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const reports = await Report.find(filter)
      .populate("generatedBy", "userName role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching reports",
      error: error.message,
    });
  }
};

// Get single report
const getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate(
      "generatedBy",
      "userName role email"
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching report",
      error: error.message,
    });
  }
};

// Update report
const updateReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("generatedBy", "userName role");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Report updated successfully",
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating report",
      error: error.message,
    });
  }
};

// Delete report
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting report",
      error: error.message,
    });
  }
};

// Generate production summary report
const generateProductionSummary = async (req, res) => {
  try {
    const { dateFrom, dateTo, generatedBy } = req.body;

    // Fetch production data
    const productionData = await ProductionRecord.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(dateFrom),
            $lte: new Date(dateTo),
          },
        },
      },
      {
        $group: {
          _id: "$mineral",
          totalQuantity: { $sum: "$quantity" },
          recordCount: { $sum: 1 },
          avgQuantity: { $avg: "$quantity" },
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

    // Create report
    const reportId = `RPT-${Date.now()}`;
    const report = new Report({
      reportId,
      title: `Production Summary Report (${dateFrom} to ${dateTo})`,
      type: "Production",
      generatedBy,
      dateFrom,
      dateTo,
      data: {
        summary: productionData,
        totalRecords: productionData.reduce(
          (sum, item) => sum + item.recordCount,
          0
        ),
        totalProduction: productionData.reduce(
          (sum, item) => sum + item.totalQuantity,
          0
        ),
      },
      status: "Generated",
    });

    await report.save();
    await report.populate("generatedBy", "userName role");

    res.status(201).json({
      success: true,
      message: "Production summary report generated successfully",
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error generating production summary",
      error: error.message,
    });
  }
};

// Generate equipment status report
const generateEquipmentReport = async (req, res) => {
  try {
    const { generatedBy } = req.body;

    // Fetch equipment data
    const equipmentData = await Equipment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          equipment: {
            $push: {
              name: "$name",
              type: "$type",
              equipmentId: "$equipmentId",
            },
          },
        },
      },
    ]);

    const byType = await Equipment.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    // Create report
    const reportId = `RPT-${Date.now()}`;
    const report = new Report({
      reportId,
      title: "Equipment Status Report",
      type: "Equipment",
      generatedBy,
      dateFrom: new Date(),
      dateTo: new Date(),
      data: {
        byStatus: equipmentData,
        byType,
        totalEquipment: await Equipment.countDocuments(),
      },
      status: "Generated",
    });

    await report.save();
    await report.populate("generatedBy", "userName role");

    res.status(201).json({
      success: true,
      message: "Equipment report generated successfully",
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error generating equipment report",
      error: error.message,
    });
  }
};

// Approve report
const approveReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    ).populate("generatedBy", "userName role");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Report approved successfully",
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error approving report",
      error: error.message,
    });
  }
};

module.exports = {
  createReport,
  getAllReports,
  getReport,
  updateReport,
  deleteReport,
  generateProductionSummary,
  generateEquipmentReport,
  approveReport,
};
