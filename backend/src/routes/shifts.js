const express = require("express");
const router = express.Router();
const {
  createShift,
  getAllShifts,
  getShift,
  updateShift,
  deleteShift,
} = require("../controllers/shiftController");

// @route   POST /api/shifts
// @desc    Create shift
// @access  Admin
router.post("/", createShift);

// @route   GET /api/shifts
// @desc    Get all shifts
// @access  All authenticated users
router.get("/", getAllShifts);

// @route   GET /api/shifts/:id
// @desc    Get single shift
// @access  All authenticated users
router.get("/:id", getShift);

// @route   PUT /api/shifts/:id
// @desc    Update shift
// @access  Admin
router.put("/:id", updateShift);

// @route   DELETE /api/shifts/:id
// @desc    Delete shift
// @access  Admin
router.delete("/:id", deleteShift);

module.exports = router;
