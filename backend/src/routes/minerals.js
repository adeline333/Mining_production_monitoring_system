const express = require("express");
const router = express.Router();
const {
  createMineral,
  getAllMinerals,
  getMineral,
  updateMineral,
  deleteMineral,
} = require("../controllers/mineralController");
const { authenticate, authorize } = require("../middleware/auth");

// @route   POST /api/minerals
// @desc    Create new mineral
// @access  Admin, Supervisor
router.post("/", createMineral);

// @route   GET /api/minerals
// @desc    Get all minerals
// @access  All authenticated users
router.get("/", getAllMinerals);

// @route   GET /api/minerals/:id
// @desc    Get single mineral
// @access  All authenticated users
router.get("/:id", getMineral);

// @route   PUT /api/minerals/:id
// @desc    Update mineral
// @access  Admin, Supervisor
router.put("/:id", updateMineral);

// @route   DELETE /api/minerals/:id
// @desc    Delete mineral
// @access  Admin only
router.delete("/:id", deleteMineral);

module.exports = router;
