const express = require("express");
const router = express.Router();
const {
  createEquipment,
  getAllEquipment,
  getEquipment,
  updateEquipment,
  deleteEquipment,
  updateEquipmentStatus,
  logEquipmentUsage,
  getEquipmentStatistics,
} = require("../controllers/equipmentController");
const { authenticate, authorize } = require("../middleware/auth");

// @route   POST /api/equipment
// @desc    Create new equipment
// @access  Admin, Supervisor
router.post("/", createEquipment);

// @route   GET /api/equipment
// @desc    Get all equipment (with optional filters)
// @access  All authenticated users
router.get("/", getAllEquipment);

// @route   GET /api/equipment/statistics
// @desc    Get equipment statistics
// @access  Admin, Supervisor, Auditor
router.get("/statistics", getEquipmentStatistics);

// @route   GET /api/equipment/:id
// @desc    Get single equipment
// @access  All authenticated users
router.get("/:id", getEquipment);

// @route   PUT /api/equipment/:id
// @desc    Update equipment
// @access  Admin, Supervisor, Technician
router.put("/:id", updateEquipment);

// @route   DELETE /api/equipment/:id
// @desc    Delete equipment
// @access  Admin only
router.delete("/:id", deleteEquipment);

// @route   PUT /api/equipment/:id/status
// @desc    Update equipment status
// @access  Admin, Supervisor, Technician
router.put("/:id/status", updateEquipmentStatus);

// @route   PUT /api/equipment/:id/usage
// @desc    Log equipment usage/maintenance
// @access  Technician, Supervisor
router.put("/:id/usage", logEquipmentUsage);

module.exports = router;
