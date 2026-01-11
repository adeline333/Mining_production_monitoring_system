const express = require("express");
const router = express.Router();
const {
  createIncident,
  getAllIncidents,
  getIncident,
  updateIncident,
  deleteIncident,
  updateIncidentStatus,
  getIncidentStatistics,
} = require("../controllers/IncidentController");

const { authenticate, authorize } = require("../middleware/auth");

// @route   POST /api/incidents
// @desc    Create new incident
// @access  Technician, FieldOperator, Auditor
router.post("/", createIncident);

// @route   GET /api/incidents
// @desc    Get all incidents (with optional filters)
// @access  All authenticated users
router.get("/", getAllIncidents);

// @route   GET /api/incidents/statistics
// @desc    Get incident statistics
// @access  Admin, Supervisor, Auditor
router.get("/statistics", getIncidentStatistics);

// @route   GET /api/incidents/:id
// @desc    Get single incident
// @access  All authenticated users
router.get("/:id", getIncident);

// @route   PUT /api/incidents/:id
// @desc    Update incident
// @access  Admin, Supervisor
router.put("/:id", updateIncident);

// @route   DELETE /api/incidents/:id
// @desc    Delete incident
// @access  Admin only
router.delete("/:id", deleteIncident);

// @route   PUT /api/incidents/:id/status
// @desc    Update incident status
// @access  Admin, Supervisor, Technician
router.put("/:id/status", updateIncidentStatus);

module.exports = router;
