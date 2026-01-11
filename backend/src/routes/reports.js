const express = require("express");
const router = express.Router();
const {
  createReport,
  getAllReports,
  getReport,
  updateReport,
  deleteReport,
  generateProductionSummary,
  generateEquipmentReport,
  approveReport,
} = require("../controllers/reportController");
const { authenticate, authorize } = require("../middleware/auth");

// @route   POST /api/reports
// @desc    Create new report
// @access  Supervisor, Admin, Auditor
router.post("/", createReport);

// @route   GET /api/reports
// @desc    Get all reports (with optional filters)
// @access  All authenticated users
router.get("/", getAllReports);

// @route   GET /api/reports/:id
// @desc    Get single report
// @access  All authenticated users
router.get("/:id", getReport);

// @route   PUT /api/reports/:id
// @desc    Update report
// @access  Supervisor, Admin, Auditor
router.put("/:id", updateReport);

// @route   DELETE /api/reports/:id
// @desc    Delete report
// @access  Admin only
router.delete("/:id", deleteReport);

// @route   POST /api/reports/generate/production
// @desc    Generate production summary report
// @access  Supervisor, Admin, Auditor
router.post("/generate/production", generateProductionSummary);

// @route   POST /api/reports/generate/equipment
// @desc    Generate equipment status report
// @access  Supervisor, Admin, Auditor
router.post("/generate/equipment", generateEquipmentReport);

// @route   PUT /api/reports/:id/approve
// @desc    Approve report
// @access  Admin, Supervisor
router.put("/:id/approve", approveReport);

module.exports = router;
