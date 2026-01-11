const express = require("express");
const router = express.Router();
const {
  createProductionRecord,
  getAllProductionRecords,
  getProductionRecord,
  updateProductionRecord,
  deleteProductionRecord,
  approveProductionRecord,
  getProductionStatistics,
} = require("../controllers/productionController");
const { authenticate, authorize } = require("../middleware/auth");

// @route   POST /api/production
// @desc    Create production record
// @access  FieldOperator, Supervisor
router.post("/", createProductionRecord);

// @route   GET /api/production
// @desc    Get all production records
// @access  All authenticated users
router.get("/", getAllProductionRecords);

// @route   GET /api/production/statistics
// @desc    Get production statistics
// @access  Supervisor, Admin, Auditor
router.get("/statistics", getProductionStatistics);

// @route   GET /api/production/:id
// @desc    Get single production record
// @access  All authenticated users
router.get("/:id", getProductionRecord);

// @route   PUT /api/production/:id
// @desc    Update production record
// @access  FieldOperator, Supervisor
router.put("/:id", updateProductionRecord);

// @route   DELETE /api/production/:id
// @desc    Delete production record
// @access  Supervisor, Admin
router.delete("/:id", deleteProductionRecord);

// @route   PUT /api/production/:id/approve
// @desc    Approve production record
// @access  Supervisor
router.put("/:id/approve", approveProductionRecord);

module.exports = router;
